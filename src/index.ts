/**
 * The official TypeScript and JavaScript library for the Teleleo API.
 *
 * ```ts
 * import Teleleo from 'teleleo';
 *
 * const client = new Teleleo(); // reads TELELEO_API_KEY
 * const sms = await client.sms.send(1234, { number: '+447700900123', message: 'Hello from Teleleo' });
 * ```
 *
 * @packageDocumentation
 */

import { Teleleo } from './client.js';

export { Teleleo };
export default Teleleo;

export {
  type ClientOptions,
  type RequestOptions,
  DEFAULT_BASE_URL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_TIMEOUT,
} from './core.js';
export {
  TeleleoError,
  APIError,
  APIConnectionError,
  APITimeoutError,
  APIUserAbortError,
  APIResponseValidationError,
  APIStatusError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
} from './errors.js';
export { Page, PagePromise } from './pagination.js';
export { formatDate, toDate } from './utils.js';
export { VERSION } from './version.js';
export * from './types/index.js';
export * from './resources/index.js';
