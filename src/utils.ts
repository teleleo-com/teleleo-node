/**
 * Format a `Date` the way the API takes it: `YYYY-MM-DD HH:MM:SS` in UTC.
 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|z|[+-]\d{2}:?\d{2})?$/;

/**
 * Parse a date-time of the API into a `Date`.
 *
 * Answers carry `YYYY-MM-DD HH:MM:SS[.ffffff]` in UTC without an offset; RFC 3339 with an offset is accepted too.
 * Returns `null` for `null`, `undefined` or a value that is not a date-time.
 *
 * ```ts
 * const sent = toDate(sms.created_at);
 * ```
 */
export function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const [, y, mo, d, h, mi, s, fraction, offset] = match;
  const ms = fraction ? Math.floor(Number(`0${fraction}`) * 1000) : 0;
  const base = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), ms);
  const check = new Date(base);
  if (
    check.getUTCFullYear() !== Number(y) ||
    check.getUTCMonth() !== Number(mo) - 1 ||
    check.getUTCDate() !== Number(d) ||
    Number(h) > 23 ||
    Number(mi) > 59 ||
    Number(s) > 59
  ) {
    return null;
  }
  let time = base;
  if (offset && offset !== 'Z' && offset !== 'z') {
    const digits = offset.slice(1).replace(':', '');
    const minutes = Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2));
    time -= (offset.startsWith('+') ? 1 : -1) * minutes * 60_000;
  }
  return new Date(time);
}

function scalar(value: unknown): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (value instanceof Date) return formatDate(value);
  return String(value);
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function'
  );
}

/** @internal Encode query parameters. Arrays repeat the key; `undefined` and `null` are dropped. */
export function buildQuery(...parts: Array<Record<string, unknown> | undefined>): string {
  const params = new URLSearchParams();
  for (const part of parts) {
    if (!part) continue;
    for (const [key, value] of Object.entries(part)) {
      if (value === undefined || value === null) continue;
      if (typeof value !== 'string' && isIterable(value)) {
        for (const item of value) params.append(key, scalar(item));
      } else {
        params.append(key, scalar(value));
      }
    }
  }
  return params.toString();
}

/** @internal Encode a JSON body: `undefined` fields are dropped, `null` stays, dates become API strings. */
export function buildBody(...parts: Array<Record<string, unknown> | undefined>): string | undefined {
  if (parts.every((part) => part === undefined)) return undefined;
  const body = Object.assign({}, ...parts.filter(Boolean));
  return JSON.stringify(body, function (this: Record<string, unknown>, key: string, value: unknown) {
    const raw = this[key];
    return raw instanceof Date ? formatDate(raw) : value;
  });
}

/** @internal Encode a path parameter. `keepSlashes` leaves `/` as a separator (temporary file ids). */
export function pathParam(value: string | number, keepSlashes = false): string {
  const text = String(value);
  if (!text) throw new TypeError('Expected a non-empty value for a path parameter');
  return keepSlashes ? text.split('/').map(encodeURIComponent).join('/') : encodeURIComponent(text);
}

/** @internal */
export function asStatus(data: unknown): boolean {
  return Boolean(data && typeof data === 'object' && (data as Record<string, unknown>)['status']);
}

/** @internal */
export function asResult(data: unknown): unknown {
  return data && typeof data === 'object' && !Array.isArray(data)
    ? (data as Record<string, unknown>)['result']
    : data;
}

/** @internal */
export function asArray(data: unknown, key?: string): unknown[] {
  const value = key && data && typeof data === 'object' ? (data as Record<string, unknown>)[key] : data;
  return Array.isArray(value) ? value : [];
}

/** @internal */
export function readEnv(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const value = env?.[name]?.trim();
  return value || undefined;
}

/** @internal */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
