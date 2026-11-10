import { BaseClient, type ClientOptions } from './core.js';
import { createResources, type Resources } from './resources/index.js';

/**
 * Client for the Teleleo API.
 *
 * ```ts
 * import Teleleo from 'teleleo';
 *
 * const client = new Teleleo(); // reads TELELEO_API_KEY
 * for await (const dongle of client.dongles.list()) {
 *   console.log(dongle.dongle_id, dongle.name);
 * }
 * ```
 */
export interface Teleleo extends Resources {}

export class Teleleo extends BaseClient {
  constructor(options: ClientOptions = {}) {
    super(options);
    Object.assign(this, createResources(this));
  }

  /**
   * A copy of the client with some options changed.
   *
   * ```ts
   * await client.withOptions({ timeout: 5_000, maxRetries: 0 }).dongles.list();
   * ```
   */
  withOptions(options: ClientOptions): Teleleo {
    return new Teleleo({
      ...this._options,
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      ...options,
      defaultHeaders: { ...this._options.defaultHeaders, ...options.defaultHeaders },
    });
  }
}
