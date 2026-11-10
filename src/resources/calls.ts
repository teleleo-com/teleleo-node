// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Call } from '../types/models.js';
import type { CallsCreateParams, CallsListParams } from '../types/params.js';
import { pathParam } from '../utils.js';
/** Calls of the modems: history, outgoing calls. */
export class CallsResource extends APIResource {
  /**
   * List calls.
   *
   * Calls of the account, newest first by default. Both the caller and the receiver filters match a fragment of the number.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION.
   */
  list(params: CallsListParams = {}, options?: RequestOptions): PagePromise<Call> {
    return this._client.getPage<Call>('/call', {
      query: {
        'call_type_ids[]': params.call_type_ids,
        'duration_presets[]': params.duration_presets,
        'call_status_ids[]': params.call_status_ids,
        'mailing_history_ids[]': params.mailing_history_ids,
        'dongle_ids[]': params.dongle_ids,
        number: params.number,
        caller: params.caller,
        receiver: params.receiver,
        from: params.from,
        to: params.to,
        is_empty_file_id: params.is_empty_file_id,
        is_empty_call_scenario_file_id: params.is_empty_call_scenario_file_id,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'calls',
      options,
    });
  }

  /**
   * Make call.
   *
   * Starts an outgoing call from the modem to number, or to the phone of the contact contact_id. Works where the operator has 3G coverage.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): DONGLE_ERROR_DONGLE_NOT_FOUND, CALL_ERROR_IDENTIFIER_EMPTY_FIELDS, CALL_ERROR_INVALID_RECEIVER_NUMBER, CONTACT_ERROR_IDENTIFIER_CONTACT_NOT_FOUND.
   */
  create(dongleId: number, params: CallsCreateParams = {}, options?: RequestOptions): Promise<Call> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/call`, {
        body: { number: params.number, contact_id: params.contact_id },
        options,
      })
      .then((data) => data as Call);
  }

  /**
   * Get call.
   *
   * One call of the modem.
   *
   * @param dongleId - Identifier in the path
   * @param callId - Identifier in the path
   *
   * Error codes (`errorMessage`): CALL_ERROR_ERROR_CALL_NOT_FOUND.
   */
  get(dongleId: number, callId: number, options?: RequestOptions): Promise<Call> {
    return this._client
      .request('GET', `/dongle/${pathParam(dongleId)}/call/${pathParam(callId)}`, { options })
      .then((data) => data as Call);
  }

  /**
   * Delete call.
   *
   * Deletes the call from the history.
   *
   * @param dongleId - Identifier in the path
   * @param callId - Identifier in the path
   *
   * Error codes (`errorMessage`): CALL_ERROR_ERROR_CALL_NOT_FOUND.
   */
  delete(dongleId: number, callId: number, options?: RequestOptions): Promise<void> {
    return this._client
      .request('DELETE', `/dongle/${pathParam(dongleId)}/call/${pathParam(callId)}`, { options })
      .then(() => undefined);
  }
}
