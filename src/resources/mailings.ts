// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Mailing } from '../types/models.js';
import type {
  MailingsCreateCallParams,
  MailingsCreateParams,
  MailingsCreateSmsParams,
  MailingsListParams,
  MailingsUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** Bulk SMS and call campaigns. */
export class MailingsResource extends APIResource {
  /**
   * List mailings.
   *
   * Mailings (bulk SMS or call campaigns) of the account. Newest first by default (created_at descending, then the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION.
   */
  list(params: MailingsListParams = {}, options?: RequestOptions): PagePromise<Mailing> {
    return this._client.getPage<Mailing>('/mailing', {
      query: {
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
        from: params.from,
        to: params.to,
        is_deleted: params.is_deleted,
        created_at_from: params.created_at_from,
        created_at_to: params.created_at_to,
        scheduled_at_from: params.scheduled_at_from,
        scheduled_at_to: params.scheduled_at_to,
        'dongle_ids[]': params.dongle_ids,
        dongle_name: params.dongle_name,
        'mailing_status_ids[]': params.mailing_status_ids,
        mailing_type_id: params.mailing_type_id,
        mailing_entity_type_id: params.mailing_entity_type_id,
        'mailing_entity_type_ids[]': params.mailing_entity_type_ids,
        mailing_history_id: params.mailing_history_id,
        'mailing_history_ids[]': params.mailing_history_ids,
        name: params.name,
        text: params.text,
      },
      itemKey: 'mailings',
      options,
    });
  }

  /**
   * Create mailing.
   *
   * Creates an SMS or call mailing. Use POST /mailing/sms or POST /mailing/call instead.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, MAILING_MANAGEMENT_INVALID_STATUS_FOR_CREATE, MAILING_MANAGEMENT_INVALID_SCHEDULED_AT, MAILING_MANAGEMENT_DONGLE_TARIFF_INVALID, MAILING_MANAGEMENT_INVALID_PHONE, MAILING_MANAGEMENT_NO_RECIPIENTS, MAILING_MANAGEMENT_CONTACT_NOT_FOUND, MAILING_MANAGEMENT_CONTACT_GROUP_NOT_FOUND, MAILING_MANAGEMENT_DONGLE_SMS_LIMIT_EXCEEDED, TMP_FILE_NOT_FOUND.
   */
  create(params: MailingsCreateParams, options?: RequestOptions): Promise<Mailing> {
    return this._client
      .request('POST', '/mailing', {
        body: {
          name: params.name,
          text: params.text,
          mailing_type_id: params.mailing_type_id,
          mailing_entity_type_id: params.mailing_entity_type_id,
          dongle_id: params.dongle_id,
          scheduled_at: params.scheduled_at,
          mailing_status_id: params.mailing_status_id,
          is_call_record: params.is_call_record,
          tmp_file_id: params.tmp_file_id,
          mailing_phones: params.mailing_phones,
          mailing_contact_ids: params.mailing_contact_ids,
          mailing_contact_group_ids: params.mailing_contact_group_ids,
        },
        options,
      })
      .then((data) => data as Mailing);
  }

  /**
   * Create SMS mailing.
   *
   * Creates an SMS mailing to the listed phones, contacts and contact groups, sent now or at scheduled_at.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, MAILING_MANAGEMENT_INVALID_STATUS_FOR_CREATE, MAILING_MANAGEMENT_INVALID_SCHEDULED_AT, MAILING_MANAGEMENT_DONGLE_TARIFF_INVALID, MAILING_MANAGEMENT_INVALID_PHONE, MAILING_MANAGEMENT_NO_RECIPIENTS, MAILING_MANAGEMENT_CONTACT_NOT_FOUND, MAILING_MANAGEMENT_CONTACT_GROUP_NOT_FOUND, MAILING_MANAGEMENT_DONGLE_SMS_LIMIT_EXCEEDED.
   */
  createSms(params: MailingsCreateSmsParams, options?: RequestOptions): Promise<Mailing> {
    return this._client
      .request('POST', '/mailing/sms', {
        body: {
          name: params.name,
          text: params.text,
          mailing_type_id: params.mailing_type_id,
          dongle_id: params.dongle_id,
          scheduled_at: params.scheduled_at,
          mailing_status_id: params.mailing_status_id,
          mailing_phones: params.mailing_phones,
          mailing_contact_ids: params.mailing_contact_ids,
          mailing_contact_group_ids: params.mailing_contact_group_ids,
        },
        options,
      })
      .then((data) => data as Mailing);
  }

  /**
   * Create call mailing.
   *
   * Creates a call mailing that plays an audio file (tmp_file_id) to the listed phones, contacts and contact groups.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, PARSING_DATE_TIME_EXCEPTION, MAILING_MANAGEMENT_INVALID_STATUS_FOR_CREATE, MAILING_MANAGEMENT_INVALID_SCHEDULED_AT, MAILING_MANAGEMENT_DONGLE_TARIFF_INVALID, MAILING_MANAGEMENT_INVALID_PHONE, MAILING_MANAGEMENT_NO_RECIPIENTS, MAILING_MANAGEMENT_CONTACT_NOT_FOUND, MAILING_MANAGEMENT_CONTACT_GROUP_NOT_FOUND, TMP_FILE_NOT_FOUND.
   */
  createCall(params: MailingsCreateCallParams, options?: RequestOptions): Promise<Mailing> {
    return this._client
      .request('POST', '/mailing/call', {
        body: {
          name: params.name,
          text: params.text,
          mailing_type_id: params.mailing_type_id,
          dongle_id: params.dongle_id,
          is_call_record: params.is_call_record,
          tmp_file_id: params.tmp_file_id,
          scheduled_at: params.scheduled_at,
          mailing_status_id: params.mailing_status_id,
          mailing_phones: params.mailing_phones,
          mailing_contact_ids: params.mailing_contact_ids,
          mailing_contact_group_ids: params.mailing_contact_group_ids,
        },
        options,
      })
      .then((data) => data as Mailing);
  }

  /**
   * Get mailing.
   *
   * One mailing of the account with its recipients and its last run.
   *
   * @param mailingId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, MAILING_NOT_FOUND.
   */
  get(mailingId: number, options?: RequestOptions): Promise<Mailing> {
    return this._client
      .request('GET', `/mailing/${pathParam(mailingId)}`, { options })
      .then((data) => data as Mailing);
  }

  /**
   * Update mailing.
   *
   * Changes the mailing; omitted fields keep their values.
   *
   * @param mailingId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, MAILING_NOT_FOUND, PARSING_DATE_TIME_EXCEPTION, MAILING_MANAGEMENT_INVALID_STATUS_FOR_UPDATE, MAILING_MANAGEMENT_INVALID_STATUS_FOR_CANCEL, MAILING_MANAGEMENT_INVALID_STATUS_FOR_SOFT_DELETE, MAILING_MANAGEMENT_DONGLE_TARIFF_INVALID, MAILING_MANAGEMENT_INVALID_PHONE, MAILING_MANAGEMENT_NO_RECIPIENTS, MAILING_MANAGEMENT_CONTACT_NOT_FOUND, MAILING_MANAGEMENT_CONTACT_GROUP_NOT_FOUND, MAILING_MANAGEMENT_DONGLE_SMS_LIMIT_EXCEEDED, TMP_FILE_NOT_FOUND.
   */
  update(mailingId: number, params: MailingsUpdateParams = {}, options?: RequestOptions): Promise<Mailing> {
    return this._client
      .request('PUT', `/mailing/${pathParam(mailingId)}`, {
        body: {
          name: params.name,
          text: params.text,
          mailing_type_id: params.mailing_type_id,
          mailing_status_id: params.mailing_status_id,
          scheduled_at: params.scheduled_at,
          is_deleted: params.is_deleted,
          tmp_file_id: params.tmp_file_id,
          mailing_phones: params.mailing_phones,
          mailing_contact_ids: params.mailing_contact_ids,
          mailing_contact_group_ids: params.mailing_contact_group_ids,
        },
        options,
      })
      .then((data) => data as Mailing);
  }

  /**
   * Delete mailing.
   *
   * Deletes the mailing.
   *
   * @param mailingId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, MAILING_NOT_FOUND, MAILING_MANAGEMENT_INVALID_STATUS_FOR_HARD_DELETE, DONGLE_NOT_FOUND_EXCEPTION, MAILING_MANAGEMENT_DONGLE_TARIFF_INVALID.
   */
  delete(mailingId: number, options?: RequestOptions): Promise<boolean> {
    return this._client.request('DELETE', `/mailing/${pathParam(mailingId)}`, { options }).then(asStatus);
  }
}
