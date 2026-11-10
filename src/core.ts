import {
  APIConnectionError,
  APIResponseValidationError,
  APITimeoutError,
  APIUserAbortError,
  TeleleoError,
  makeStatusError,
} from './errors.js';
import { Page, PagePromise } from './pagination.js';
import { buildBody, buildQuery, readEnv, sleep } from './utils.js';
import { VERSION } from './version.js';

export const DEFAULT_BASE_URL = 'https://app.teleleo.com/react_api';
export const DEFAULT_TIMEOUT = 60_000;
export const DEFAULT_MAX_RETRIES = 2;

const INITIAL_RETRY_DELAY = 500;
const MAX_RETRY_DELAY = 8_000;
const MAX_RETRY_AFTER = 60_000;

const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);
// The server refused the request before acting on it: safe to repeat for any method.
const RETRY_ANY_METHOD = new Set([429]);
// The outcome is unknown: repeat only requests that are safe to repeat.
const RETRY_IDEMPOTENT = new Set([408, 502, 503, 504]);
// Nothing reached the server.
const NOT_SENT_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'UND_ERR_CONNECT_TIMEOUT',
]);

export interface ClientOptions {
  /** The API key from the Teleleo cabinet (Settings - API key). Defaults to `process.env.TELELEO_API_KEY`. */
  apiKey?: string | undefined;
  /** Defaults to `process.env.TELELEO_BASE_URL`, then to `https://app.teleleo.com/react_api`. */
  baseURL?: string | undefined;
  /** Milliseconds before a request is aborted; 60 000 by default. */
  timeout?: number | undefined;
  /**
   * How many times to repeat a request that failed for a transient reason; 2 by default. Requests that create
   * something (POST) are repeated only when the server could not have acted on them.
   */
  maxRetries?: number | undefined;
  /** Headers to send with every request. */
  defaultHeaders?: Record<string, string> | undefined;
  /** Your own `fetch`, for proxies, custom agents or tests. Defaults to the global `fetch`. */
  fetch?: typeof fetch | undefined;
}

export interface RequestOptions {
  /** Extra headers for this request. */
  headers?: Record<string, string> | undefined;
  /** Extra query parameters, for parameters the library does not have yet. */
  query?: Record<string, unknown> | undefined;
  /** Extra body fields, for fields the library does not have yet. */
  body?: Record<string, unknown> | undefined;
  /** Milliseconds before this request is aborted. */
  timeout?: number | undefined;
  /** Retries for this request. */
  maxRetries?: number | undefined;
  /** Abort the request. */
  signal?: AbortSignal | undefined;
}

interface SendArgs {
  query?: Record<string, unknown> | undefined;
  body?: Record<string, unknown> | undefined;
  options?: RequestOptions | undefined;
  accept?: string;
}

interface Answer {
  status: number;
  headers: Headers;
  bytes: Uint8Array;
}

function errorCode(error: unknown): string | undefined {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current && typeof current === 'object'; depth++) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string') return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

function cleanQuery(query: Record<string, unknown> | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null) continue;
    out[key] =
      typeof value === 'object' && !(value instanceof Date) && Symbol.iterator in value
        ? Array.from(value as Iterable<unknown>)
        : value;
  }
  return out;
}

export class BaseClient {
  readonly apiKey: string;
  readonly baseURL: string;
  readonly timeout: number;
  readonly maxRetries: number;
  protected readonly _options: ClientOptions;
  readonly #fetch: typeof fetch;

  constructor(options: ClientOptions = {}) {
    const apiKey = options.apiKey ?? readEnv('TELELEO_API_KEY');
    if (!apiKey) {
      throw new TeleleoError(
        'The API key is not set: pass apiKey to the client or set the TELELEO_API_KEY environment variable. ' +
          'The key is in the Teleleo cabinet, Settings - API key.',
      );
    }
    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (!fetchImpl)
      throw new TeleleoError('fetch is not available; pass your own fetch in the client options');
    this.apiKey = apiKey;
    this.baseURL = (options.baseURL ?? readEnv('TELELEO_BASE_URL') ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this._options = options;
    this.#fetch = fetchImpl;
  }

  protected defaultHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
      'User-Agent': `teleleo-node/${VERSION}`,
      'auth-key': this.apiKey,
      ...this._options.defaultHeaders,
    };
  }

  static #shouldRetryStatus(method: string, status: number): boolean {
    return RETRY_ANY_METHOD.has(status) || (RETRY_IDEMPOTENT.has(status) && IDEMPOTENT_METHODS.has(method));
  }

  static #retryDelay(attempt: number, headers?: Headers): number {
    const header = headers?.get('retry-after');
    if (header) {
      let ms = Number(header) * 1000;
      if (Number.isNaN(ms)) ms = Date.parse(header) - Date.now();
      if (ms >= 0 && ms <= MAX_RETRY_AFTER) return ms;
    }
    const delay = Math.min(INITIAL_RETRY_DELAY * 2 ** attempt, MAX_RETRY_DELAY);
    return delay * (1 - 0.25 * Math.random());
  }

  async #send(method: string, path: string, { query, body, options, accept }: SendArgs): Promise<Answer> {
    const qs = buildQuery(query, options?.query);
    const url = `${this.baseURL}${path}${qs ? `?${qs}` : ''}`;
    const payload =
      body !== undefined || options?.body !== undefined ? buildBody(body, options?.body) : undefined;
    const headers: Record<string, string> = { ...this.defaultHeaders() };
    if (accept) headers['Accept'] = accept;
    if (payload !== undefined) headers['Content-Type'] = 'application/json';
    Object.assign(headers, options?.headers);
    const maxRetries = options?.maxRetries ?? this.maxRetries;
    const timeout = options?.timeout ?? this.timeout;
    const userSignal = options?.signal;
    const idempotent = IDEMPOTENT_METHODS.has(method);

    for (let attempt = 0; ; attempt++) {
      if (userSignal?.aborted) throw new APIUserAbortError();
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeout);
      const onAbort = () => controller.abort();
      userSignal?.addEventListener('abort', onAbort, { once: true });

      let answer: Answer;
      try {
        const init: RequestInit = { method, headers, signal: controller.signal };
        if (payload !== undefined) init.body = payload;
        const response = await this.#fetch(url, init);
        const bytes = new Uint8Array(await response.arrayBuffer());
        answer = { status: response.status, headers: response.headers, bytes };
      } catch (error) {
        if (userSignal?.aborted) throw new APIUserAbortError();
        const notSent = NOT_SENT_CODES.has(errorCode(error) ?? '');
        if (attempt < maxRetries && (notSent || idempotent)) {
          await sleep(BaseClient.#retryDelay(attempt));
          continue;
        }
        if (timedOut) throw new APITimeoutError({ cause: error });
        throw new APIConnectionError({ cause: error });
      } finally {
        clearTimeout(timer);
        userSignal?.removeEventListener('abort', onAbort);
      }

      if (answer.status >= 200 && answer.status < 300) return answer;
      if (attempt < maxRetries && BaseClient.#shouldRetryStatus(method, answer.status)) {
        await sleep(BaseClient.#retryDelay(attempt, answer.headers));
        continue;
      }
      throw makeStatusError(answer.status, answer.headers, new TextDecoder().decode(answer.bytes));
    }
  }

  /** @internal Send a request and return the `data` of the answer. */
  async request(
    method: string,
    path: string,
    args: {
      query?: Record<string, unknown>;
      body?: Record<string, unknown>;
      options?: RequestOptions | undefined;
    } = {},
  ): Promise<unknown> {
    const answer = await this.#send(method, path, args);
    const text = new TextDecoder().decode(answer.bytes);
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      const type = answer.headers.get('content-type') ?? 'no content type';
      throw new APIResponseValidationError(
        answer.status,
        text,
        `Expected a JSON answer from ${path}, got ${type}`,
      );
    }
    if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload) {
      return (payload as { data: unknown }).data;
    }
    return payload;
  }

  /** @internal Send a request and return the raw bytes of the answer. */
  async requestBytes(
    method: string,
    path: string,
    args: { options?: RequestOptions | undefined } = {},
  ): Promise<Uint8Array> {
    const answer = await this.#send(method, path, { ...args, accept: '*/*' });
    return answer.bytes;
  }

  /** @internal Request one page of a list. */
  getPage<T>(
    path: string,
    args: { query: Record<string, unknown>; itemKey: string; options?: RequestOptions | undefined },
  ): PagePromise<T> {
    const load = async (query: Record<string, unknown>): Promise<Page<T>> => {
      const data = await this.request('GET', path, { query, options: args.options });
      let items: unknown = [];
      let total: unknown = null;
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        items = (data as Record<string, unknown>)[args.itemKey] ?? [];
        total = (data as Record<string, unknown>)['total_count'] ?? null;
      }
      return new Page<T>(
        Array.isArray(items) ? (items as T[]) : [],
        typeof total === 'number' ? total : null,
        query,
        load,
      );
    };
    const query = cleanQuery(args.query);
    return new PagePromise<T>(() => load(query));
  }
}
