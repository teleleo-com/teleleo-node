// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Ussd } from '../types/models.js';
import type { UssdListParams, UssdSendParams } from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** USSD requests through a modem. */
export class UssdResource extends APIResource {
  /**
   * List USSD requests.
   *
   * USSD requests and answers of the modem. Newest first by default (created_at descending, then the id descending).
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION.
   */
  list(dongleId: number, params: UssdListParams = {}, options?: RequestOptions): PagePromise<Ussd> {
    return this._client.getPage<Ussd>(`/dongle/${pathParam(dongleId)}/ussd`, {
      query: { page: params.page, limit: params.limit, order_by: params.order_by, order: params.order },
      itemKey: 'ussds',
      options,
    });
  }

  /**
   * Send USSD.
   *
   * Sends a USSD command through the modem; the answer arrives later in response of the USSD object. Works where the operator has 3G coverage; interactive (menu) USSD is not supported.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, USSD_INVALID_COMMAND_FORMAT_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, USSD_LAST_USSD_NOT_PROCESSED_EXCEPTION.
   */
  send(dongleId: number, params: UssdSendParams, options?: RequestOptions): Promise<Ussd> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/ussd`, { body: { command: params.command }, options })
      .then((data) => data as Ussd);
  }

  /**
   * Get USSD request.
   *
   * One USSD request of the modem with its answer.
   *
   * @param dongleId - Identifier in the path
   * @param ussdId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, USSD_NOT_FOUND_EXCEPTION.
   */
  get(dongleId: number, ussdId: number, options?: RequestOptions): Promise<Ussd> {
    return this._client
      .request('GET', `/dongle/${pathParam(dongleId)}/ussd/${pathParam(ussdId)}`, { options })
      .then((data) => data as Ussd);
  }

  /**
   * Delete USSD request.
   *
   * Deletes one USSD request from the history of the modem.
   *
   * @param dongleId - Identifier in the path
   * @param ussdId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, USSD_NOT_FOUND_EXCEPTION.
   */
  delete(dongleId: number, ussdId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('DELETE', `/dongle/${pathParam(dongleId)}/ussd/${pathParam(ussdId)}`, { options })
      .then(asStatus);
  }

  /**
   * Delete USSD history.
   *
   * Deletes the whole USSD history of the modem.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION.
   */
  deleteAll(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client.request('DELETE', `/dongle/${pathParam(dongleId)}/ussds`, { options }).then(asStatus);
  }
}
