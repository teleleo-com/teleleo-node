// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Sms, SmsThread } from '../types/models.js';
import type {
  SmsListForDongleParams,
  SmsListParams,
  SmsListThreadsParams,
  SmsReplyParams,
  SmsSendParams,
  SmsSendToContactParams,
  SmsUpdateParams,
} from '../types/params.js';
import { pathParam } from '../utils.js';
/** SMS of the modems: history, sending, replies, threads. */
export class SmsResource extends APIResource {
  /**
   * Send SMS.
   *
   * Sends an SMS from the modem to a phone number, now or at scheduled_at. sms_status_id 1 (Sended) means the mobile network accepted it, not that the handset received it.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, SMS_ERROR_INVALID_RECEIVER_NUMBER, SMS_ERROR_IDENTIFIER_INVALID_CALLBACK_URL, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, SMS_ERROR_IDENTIFIER_LONG_MESSAGE, SMS_ERROR_IDENTIFIER_INVALID_SCHEDULED_AT, SMS_ERROR_IDENTIFIER_EMPTY_FIELDS.
   */
  send(dongleId: number, params: SmsSendParams, options?: RequestOptions): Promise<Sms> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/outgoing-sms`, {
        body: {
          number: params.number,
          message: params.message,
          scheduled_at: params.scheduled_at,
          callback_url: params.callback_url,
        },
        options,
      })
      .then((data) => data as Sms);
  }

  /**
   * Send SMS to contact.
   *
   * Sends an SMS from the modem to the phone number of a contact, now or at scheduled_at.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, CONTACT_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, SMS_ERROR_IDENTIFIER_LONG_MESSAGE, SMS_ERROR_IDENTIFIER_INVALID_SCHEDULED_AT, SMS_ERROR_IDENTIFIER_EMPTY_FIELDS.
   */
  sendToContact(dongleId: number, params: SmsSendToContactParams, options?: RequestOptions): Promise<Sms> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/outgoing-contact-sms`, {
        body: { contact_id: params.contact_id, message: params.message, scheduled_at: params.scheduled_at },
        options,
      })
      .then((data) => data as Sms);
  }

  /**
   * Reply to SMS.
   *
   * Sends an SMS in reply to an SMS of the modem, to its sender; the new SMS carries replied_to_sms_id.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, SMS_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, SMS_ERROR_IDENTIFIER_LONG_MESSAGE, SMS_ERROR_IDENTIFIER_INVALID_SCHEDULED_AT, SMS_ERROR_IDENTIFIER_EMPTY_FIELDS.
   */
  reply(dongleId: number, params: SmsReplyParams, options?: RequestOptions): Promise<Sms> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/reply-sms`, {
        body: {
          replied_to_sms_id: params.replied_to_sms_id,
          message: params.message,
          scheduled_at: params.scheduled_at,
        },
        options,
      })
      .then((data) => data as Sms);
  }

  /**
   * List SMS threads.
   *
   * Conversation view: the last SMS per phone number of the modem, newest first.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  listThreads(params: SmsListThreadsParams = {}, options?: RequestOptions): PagePromise<SmsThread> {
    return this._client.getPage<SmsThread>('/sms/thread', {
      query: { dongle_id: params.dongle_id, page: params.page, limit: params.limit },
      itemKey: 'sms_threads',
      options,
    });
  }

  /**
   * List SMS.
   *
   * SMS of all modems of the account, incoming and outgoing. Newest first by default (created_at descending, then the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, SMS_ERROR_IDENTIFIER_INVALID_SMS_TYPE.
   */
  list(params: SmsListParams = {}, options?: RequestOptions): PagePromise<Sms> {
    return this._client.getPage<Sms>('/sms', {
      query: {
        'sms_type_ids[]': params.sms_type_ids,
        'mailing_history_ids[]': params.mailing_history_ids,
        page: params.page,
        limit: params.limit,
        'dongle_ids[]': params.dongle_ids,
        number: params.number,
        from: params.from,
        to: params.to,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'smses',
      options,
    });
  }

  /**
   * List modem SMS.
   *
   * SMS of one modem, incoming and outgoing. Newest first by default (created_at descending, then the id descending).
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, SMS_ERROR_IDENTIFIER_INVALID_SMS_TYPE.
   */
  listForDongle(
    dongleId: number,
    params: SmsListForDongleParams = {},
    options?: RequestOptions,
  ): PagePromise<Sms> {
    return this._client.getPage<Sms>(`/dongle/${pathParam(dongleId)}/sms`, {
      query: {
        'sms_type_ids[]': params.sms_type_ids,
        number: params.number,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'smses',
      options,
    });
  }

  /**
   * Get SMS.
   *
   * One SMS of the modem.
   *
   * @param dongleId - Identifier in the path
   * @param smsId - Identifier in the path
   *
   * Error codes (`errorMessage`): SMS_ERROR_ERROR_SMS_NOT_FOUND.
   */
  get(dongleId: number, smsId: number, options?: RequestOptions): Promise<Sms> {
    return this._client
      .request('GET', `/dongle/${pathParam(dongleId)}/sms/${pathParam(smsId)}`, { options })
      .then((data) => data as Sms);
  }

  /**
   * Update SMS.
   *
   * Changes a scheduled SMS (sms_type_id 5) that is not sent yet: number, text, contact, scheduled_at; omitted fields keep their values. Any other SMS answers SMS_ERROR_ERROR_SMS_NOT_FOUND.
   *
   * @param dongleId - Identifier in the path
   * @param smsId - Identifier in the path
   *
   * Error codes (`errorMessage`): SMS_ERROR_ERROR_SMS_NOT_FOUND, DONGLE_ERROR_DONGLE_NOT_FOUND, CONTACT_ERROR_IDENTIFIER_CONTACT_NOT_FOUND, SMS_ERROR_IDENTIFIER_INVALID_SMS_TYPE, SMS_ERROR_IDENTIFIER_LONG_MESSAGE, SMS_ERROR_IDENTIFIER_INVALID_SCHEDULED_AT, PARSING_DATE_TIME_EXCEPTION.
   */
  update(
    dongleId: number,
    smsId: number,
    params: SmsUpdateParams = {},
    options?: RequestOptions,
  ): Promise<Sms> {
    return this._client
      .request('PUT', `/dongle/${pathParam(dongleId)}/sms/${pathParam(smsId)}`, {
        body: {
          number: params.number,
          message: params.message,
          contact_id: params.contact_id,
          dongle_id: params.dongle_id,
          scheduled_at: params.scheduled_at,
        },
        options,
      })
      .then((data) => data as Sms);
  }

  /**
   * Delete SMS.
   *
   * Deletes the SMS from the history of the modem. An SMS in status 1 (Sended) or 5 (Enqueued) cannot be deleted and answers SMS_ERROR_ERROR_SMS_NOT_FOUND.
   *
   * @param dongleId - Identifier in the path
   * @param smsId - Identifier in the path
   *
   * Error codes (`errorMessage`): SMS_ERROR_ERROR_SMS_NOT_FOUND.
   */
  delete(dongleId: number, smsId: number, options?: RequestOptions): Promise<void> {
    return this._client
      .request('DELETE', `/dongle/${pathParam(dongleId)}/sms/${pathParam(smsId)}`, { options })
      .then(() => undefined);
  }
}
