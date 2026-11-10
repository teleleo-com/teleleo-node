// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { FollowUpSmsSetting } from '../types/models.js';
import type {
  FollowUpSmsSettingsCreateParams,
  FollowUpSmsSettingsListParams,
  FollowUpSmsSettingsUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** SMS a modem sends to a caller after a call. */
export class FollowUpSmsSettingsResource extends APIResource {
  /**
   * List follow-up SMS settings.
   *
   * Follow-up SMS settings of the account: the SMS a modem sends to a caller after a call. Newest first by default (the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  list(
    params: FollowUpSmsSettingsListParams = {},
    options?: RequestOptions,
  ): PagePromise<FollowUpSmsSetting> {
    return this._client.getPage<FollowUpSmsSetting>('/follow-up-sms-setting', {
      query: {
        'dongle_ids[]': params.dongle_ids,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'follow_up_sms_settings',
      options,
    });
  }

  /**
   * Create follow-up SMS setting.
   *
   * Creates a follow-up SMS setting for a modem.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, INVALID_DONGLE_TYPE, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, INVALID_RINGING_DURATION_TIMEOUT, INVALID_CALL_DURATION_TIMEOUT, INVALID_DAILY_SMS_LIMIT, DUPLICATE_DONGLE_FOLLOW_UP_SMS_SETTING.
   */
  create(params: FollowUpSmsSettingsCreateParams, options?: RequestOptions): Promise<FollowUpSmsSetting> {
    return this._client
      .request('POST', '/follow-up-sms-setting', {
        body: {
          dongle_id: params.dongle_id,
          name: params.name,
          text: params.text,
          ringing_duration_timeout: params.ringing_duration_timeout,
          call_duration_timeout: params.call_duration_timeout,
          daily_sms_limit: params.daily_sms_limit,
        },
        options,
      })
      .then((data) => data as FollowUpSmsSetting);
  }

  /**
   * Get follow-up SMS setting.
   *
   * One follow-up SMS setting of the account.
   *
   * @param followUpSmsSettingId - Follow Up Sms Setting ID
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, FOLLOW_UP_SMS_SETTING_NOT_FOUND_EXCEPTION.
   */
  get(followUpSmsSettingId: number, options?: RequestOptions): Promise<FollowUpSmsSetting> {
    return this._client
      .request('GET', `/follow-up-sms-setting/${pathParam(followUpSmsSettingId)}`, { options })
      .then((data) => data as FollowUpSmsSetting);
  }

  /**
   * Update follow-up SMS setting.
   *
   * Replaces the follow-up SMS setting.
   *
   * @param followUpSmsSettingId - Follow-up SMS setting ID
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, FOLLOW_UP_SMS_SETTING_NOT_FOUND_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, INVALID_DONGLE_TYPE, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, INVALID_RINGING_DURATION_TIMEOUT, INVALID_CALL_DURATION_TIMEOUT, INVALID_DAILY_SMS_LIMIT, DUPLICATE_DONGLE_FOLLOW_UP_SMS_SETTING.
   */
  update(
    followUpSmsSettingId: number,
    params: FollowUpSmsSettingsUpdateParams,
    options?: RequestOptions,
  ): Promise<FollowUpSmsSetting> {
    return this._client
      .request('PUT', `/follow-up-sms-setting/${pathParam(followUpSmsSettingId)}`, {
        body: {
          dongle_id: params.dongle_id,
          name: params.name,
          text: params.text,
          ringing_duration_timeout: params.ringing_duration_timeout,
          call_duration_timeout: params.call_duration_timeout,
          daily_sms_limit: params.daily_sms_limit,
        },
        options,
      })
      .then((data) => data as FollowUpSmsSetting);
  }

  /**
   * Delete follow-up SMS setting.
   *
   * Deletes the follow-up SMS setting.
   *
   * @param followUpSmsSettingId - Follow-up SMS setting ID
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, FOLLOW_UP_SMS_SETTING_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE.
   */
  delete(followUpSmsSettingId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('DELETE', `/follow-up-sms-setting/${pathParam(followUpSmsSettingId)}`, { options })
      .then(asStatus);
  }
}
