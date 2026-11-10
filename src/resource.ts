import type { BaseClient } from './core.js';

/** Base class of the resource groups of the client (`client.dongles`, `client.sms`, ...). */
export class APIResource {
  protected readonly _client: BaseClient;

  constructor(client: BaseClient) {
    this._client = client;
  }
}
