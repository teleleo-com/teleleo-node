/** Base class for every error thrown by this library. */
export class TeleleoError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

/** An error that happened while talking to the API. */
export class APIError extends TeleleoError {}

/** The API could not be reached. */
export class APIConnectionError extends APIError {
  constructor({ message, cause }: { message?: string; cause?: unknown } = {}) {
    super(message ?? 'Connection error.', { cause });
  }
}

/** The request timed out. */
export class APITimeoutError extends APIConnectionError {
  constructor({ cause }: { cause?: unknown } = {}) {
    super({ message: 'Request timed out.', cause });
  }
}

/** The request was aborted through the `signal` you passed. */
export class APIUserAbortError extends APIError {
  constructor() {
    super('Request was aborted.');
  }
}

/** The API answered with a success status, but the body is not the JSON the library expects. */
export class APIResponseValidationError extends APIError {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/** The API answered with a 4xx or 5xx status. */
export class APIStatusError extends APIError {
  /** HTTP status of the answer. */
  readonly status: number;
  /** Machine-readable error code, for example `DONGLE_ERROR_DONGLE_NOT_FOUND`. Act on this. */
  readonly errorMessage: string | null;
  /** Human-readable details; may be empty. */
  readonly errorDetails: string[];
  /** Quote it to Teleleo support. */
  readonly requestId: string | null;
  /** Headers of the answer. */
  readonly headers: Headers;
  /** The decoded body of the answer. */
  readonly body: unknown;

  constructor(
    message: string,
    init: {
      status: number;
      errorMessage: string | null;
      errorDetails: string[];
      requestId: string | null;
      headers: Headers;
      body: unknown;
    },
  ) {
    super(message);
    this.status = init.status;
    this.errorMessage = init.errorMessage;
    this.errorDetails = init.errorDetails;
    this.requestId = init.requestId;
    this.headers = init.headers;
    this.body = init.body;
  }
}

/** 400: the request is invalid. */
export class BadRequestError extends APIStatusError {}

/** 401: the API key is missing or unknown, or the account is not active. */
export class AuthenticationError extends APIStatusError {}

/** 403: the request is outside the public API, or a field is not allowed. */
export class PermissionDeniedError extends APIStatusError {}

/**
 * The object or path does not exist.
 *
 * API v1 answers 400 with an `errorMessage` that contains `NOT_FOUND` for a missing object, and 404 for an
 * unknown path. Both throw this error; `status` keeps the real status.
 */
export class NotFoundError extends APIStatusError {}

/** 409: the request conflicts with the current state. */
export class ConflictError extends APIStatusError {}

/** 429: too many requests. */
export class RateLimitError extends APIStatusError {}

/** 5xx: a failure on the Teleleo side. Retry later and quote `requestId` if it persists. */
export class InternalServerError extends APIStatusError {}

function parseErrorBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** @internal */
export function makeStatusError(status: number, headers: Headers, text: string): APIStatusError {
  const body = parseErrorBody(text);
  let errorMessage: string | null = null;
  let errorDetails: string[] = [];
  let requestId: string | null = null;

  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const record = body as Record<string, unknown>;
    if (typeof record['error_message'] === 'string' && record['error_message']) {
      errorMessage = record['error_message'];
    } else if (typeof record['code'] === 'string') {
      errorMessage = record['code'];
    }
    for (const key of ['error_details', 'error_message_detail']) {
      const raw = record[key];
      if (Array.isArray(raw) && raw.length) {
        errorDetails = raw.map(String);
        break;
      }
      if (typeof raw === 'string' && raw) {
        errorDetails = [raw];
        break;
      }
    }
    if (record['request_id']) requestId = String(record['request_id']);
  } else if (typeof body === 'string' && body.trim() && !body.trimStart().startsWith('<')) {
    errorDetails = [body.trim().slice(0, 500)];
  }
  requestId ??= headers.get('x-request-id');

  let message = `Error code: ${status}`;
  if (errorMessage) message += ` - ${errorMessage}`;
  if (errorDetails.length) message += `: ${errorDetails.join('; ')}`;
  if (requestId) message += ` (request_id: ${requestId})`;

  const init = { status, errorMessage, errorDetails, requestId, headers, body };
  if (status === 404 || (status === 400 && errorMessage?.includes('NOT_FOUND')))
    return new NotFoundError(message, init);
  if (status === 400) return new BadRequestError(message, init);
  if (status === 401) return new AuthenticationError(message, init);
  if (status === 403) return new PermissionDeniedError(message, init);
  if (status === 409) return new ConflictError(message, init);
  if (status === 429) return new RateLimitError(message, init);
  if (status >= 500) return new InternalServerError(message, init);
  return new APIStatusError(message, init);
}
