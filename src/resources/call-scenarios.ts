// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { CallScenario } from '../types/models.js';
import type {
  CallScenariosCreateParams,
  CallScenariosListParams,
  CallScenariosUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** What a modem plays to incoming callers. */
export class CallScenariosResource extends APIResource {
  /**
   * List call scenarios.
   *
   * Call scenarios of the account: what a modem plays to incoming callers. Newest first by default (created_at descending, then the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION.
   */
  list(params: CallScenariosListParams = {}, options?: RequestOptions): PagePromise<CallScenario> {
    return this._client.getPage<CallScenario>('/call-scenario', {
      query: {
        'dongle_ids[]': params.dongle_ids,
        name: params.name,
        dongle_name: params.dongle_name,
        dongle_phone: params.dongle_phone,
        from: params.from,
        to: params.to,
        is_empty_file_id: params.is_empty_file_id,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'call_scenarios',
      options,
    });
  }

  /**
   * Create call scenario.
   *
   * Creates the call scenario of a modem (one per modem) and pushes it to the modem; follow the delivery in call_scenario_apply_status_id.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_HAS_SIP_TYPE_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, CALL_SCENARIO_MANAGEMENT_DONGLE_NOT_SUPPORTED_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_ALREADY_HAS_ACTIVE_SCENARIO_EXCEPTION, TMP_FILE_NOT_FOUND, CALL_SCENARIO_MANAGEMENT_CONTACT_NOT_FOUND_EXCEPTION.
   */
  create(params: CallScenariosCreateParams, options?: RequestOptions): Promise<CallScenario> {
    return this._client
      .request('POST', '/call-scenario', {
        body: {
          name: params.name,
          is_call_record: params.is_call_record,
          dongle_id: params.dongle_id,
          call_scenario_type_id: params.call_scenario_type_id,
          tmp_file_id: params.tmp_file_id,
          call_scenario_contact_ids: params.call_scenario_contact_ids,
          call_scenario_phones: params.call_scenario_phones,
          call_scenario_contact_group_ids: params.call_scenario_contact_group_ids,
        },
        options,
      })
      .then((data) => data as CallScenario);
  }

  /**
   * Get call scenario.
   *
   * One call scenario of the account with its delivery state.
   *
   * @param callScenarioId - Call scenario id
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CALL_SCENARIO_NOT_FOUND_EXCEPTION.
   */
  get(callScenarioId: number, options?: RequestOptions): Promise<CallScenario> {
    return this._client
      .request('GET', `/call-scenario/${pathParam(callScenarioId)}`, { options })
      .then((data) => data as CallScenario);
  }

  /**
   * Update call scenario.
   *
   * Changes the call scenario and pushes the new version to the modem. Send version_uuid of the version you read to avoid overwriting a newer one (409).
   *
   * @param callScenarioId - Call scenario id
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CALL_SCENARIO_NOT_FOUND_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_HAS_SIP_TYPE_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, CALL_SCENARIO_MANAGEMENT_DONGLE_NOT_SUPPORTED_EXCEPTION, CALL_SCENARIO_MANAGEMENT_VERSION_CONFLICT_EXCEPTION, TMP_FILE_NOT_FOUND, CALL_SCENARIO_MANAGEMENT_CONTACT_NOT_FOUND_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_ALREADY_HAS_ACTIVE_SCENARIO_EXCEPTION.
   */
  update(
    callScenarioId: number,
    params: CallScenariosUpdateParams = {},
    options?: RequestOptions,
  ): Promise<CallScenario> {
    return this._client
      .request('PUT', `/call-scenario/${pathParam(callScenarioId)}`, {
        body: {
          name: params.name,
          is_call_record: params.is_call_record,
          call_scenario_type_id: params.call_scenario_type_id,
          tmp_file_id: params.tmp_file_id,
          call_scenario_contact_ids: params.call_scenario_contact_ids,
          call_scenario_phones: params.call_scenario_phones,
          call_scenario_contact_group_ids: params.call_scenario_contact_group_ids,
          version_uuid: params.version_uuid,
        },
        options,
      })
      .then((data) => data as CallScenario);
  }

  /**
   * Delete call scenario.
   *
   * Deletes the call scenario and removes it from the modem.
   *
   * @param callScenarioId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CALL_SCENARIO_NOT_FOUND_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_UNAVAILABLE_EXCEPTION, CALL_SCENARIO_MANAGEMENT_VERSION_CONFLICT_EXCEPTION.
   */
  delete(callScenarioId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('DELETE', `/call-scenario/${pathParam(callScenarioId)}`, { options })
      .then(asStatus);
  }

  /**
   * Retry call scenario delivery.
   *
   * Re-sends the scenario to the modem after a delivery error (call_scenario_apply_status_id / call_scenario_delivery_error_id).
   *
   * @param callScenarioId - Call scenario id
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CALL_SCENARIO_NOT_FOUND_EXCEPTION, CALL_SCENARIO_MANAGEMENT_DONGLE_HAS_SIP_TYPE_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, CALL_SCENARIO_MANAGEMENT_DONGLE_NOT_SUPPORTED_EXCEPTION.
   */
  retry(callScenarioId: number, options?: RequestOptions): Promise<CallScenario> {
    return this._client
      .request('POST', `/call-scenario/${pathParam(callScenarioId)}/retry`, { options })
      .then((data) => data as CallScenario);
  }
}
