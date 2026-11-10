// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Contact, ContactImportResult } from '../types/models.js';
import type {
  ContactsCreateParams,
  ContactsImportContactsParams,
  ContactsListParams,
  ContactsUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** Address book of the account. */
export class ContactsResource extends APIResource {
  /**
   * List contacts.
   *
   * Contacts of the account. Filters combine with AND. Newest first by default (the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  list(params: ContactsListParams = {}, options?: RequestOptions): PagePromise<Contact> {
    return this._client.getPage<Contact>('/contact', {
      query: {
        'contact_group_ids[]': params.contact_group_ids,
        'contact_ids[]': params.contact_ids,
        name: params.name,
        query: params.query,
        phone: params.phone,
        email: params.email,
        'phones[]': params.phones,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'contacts',
      options,
    });
  }

  /**
   * Create contact.
   *
   * Creates a contact. The phone number is normalised to E.164; a number that already belongs to a contact of the account is refused.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_ERROR_IDENTIFIER_INVALID_EMAIL_FORMAT, CONTACT_ERROR_IDENTIFIER_BIG_NAME, CONTACT_ERROR_IDENTIFIER_BIG_PHONE, CONTACT_ERROR_IDENTIFIER_INVALID_PHONE, CONTACT_ERROR_IDENTIFIER_ALREADY_EXISTS_SAME_NAME, CONTACT_ERROR_IDENTIFIER_ALREADY_EXISTS_SAME_NUMBER, CONTACT_MANAGEMENT_INVALID_CONTACT_GROUP_EXCEPTION.
   */
  create(params: ContactsCreateParams, options?: RequestOptions): Promise<Contact> {
    return this._client
      .request('POST', '/contact', {
        body: {
          phone: params.phone,
          name: params.name,
          email: params.email,
          contact_group_ids: params.contact_group_ids,
        },
        options,
      })
      .then((data) => data as Contact);
  }

  /**
   * Get contact.
   *
   * One contact of the account.
   *
   * @param contactId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_NOT_FOUND_EXCEPTION.
   */
  get(contactId: number, options?: RequestOptions): Promise<Contact> {
    return this._client
      .request('GET', `/contact/${pathParam(contactId)}`, { options })
      .then((data) => data as Contact);
  }

  /**
   * Update contact.
   *
   * Replaces the contact: phone, name and the set of groups are written as sent.
   *
   * @param contactId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_NOT_FOUND_EXCEPTION, CONTACT_ERROR_IDENTIFIER_INVALID_EMAIL_FORMAT, CONTACT_ERROR_IDENTIFIER_BIG_NAME, CONTACT_ERROR_IDENTIFIER_BIG_PHONE, CONTACT_ERROR_IDENTIFIER_INVALID_PHONE, CONTACT_ERROR_IDENTIFIER_ALREADY_EXISTS_SAME_NAME, CONTACT_ERROR_IDENTIFIER_ALREADY_EXISTS_SAME_NUMBER, CONTACT_MANAGEMENT_INVALID_CONTACT_GROUP_EXCEPTION.
   */
  update(contactId: number, params: ContactsUpdateParams, options?: RequestOptions): Promise<Contact> {
    return this._client
      .request('PUT', `/contact/${pathParam(contactId)}`, {
        body: {
          phone: params.phone,
          name: params.name,
          email: params.email,
          contact_group_ids: params.contact_group_ids,
        },
        options,
      })
      .then((data) => data as Contact);
  }

  /**
   * Delete contact.
   *
   * Deletes the contact.
   *
   * @param contactId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_NOT_FOUND_EXCEPTION, CONTACT_ERROR_REDIRECTS_ARE_PRESENT_WHILE_DELETING_CONTACT, CONTACT_ERROR_MAILINGS_ARE_PRESENT_WHILE_DELETING_CONTACT.
   */
  delete(contactId: number, options?: RequestOptions): Promise<boolean> {
    return this._client.request('DELETE', `/contact/${pathParam(contactId)}`, { options }).then(asStatus);
  }

  /**
   * Import contacts.
   *
   * Bulk creation of contacts from the body; duplicates by phone number are skipped.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_IMPORT_ERROR_IDENTIFIER_EMPTY_DATA, CONTACT_GROUP_ERROR_WITH_SAME_NAME_ALREADY_EXIST.
   */
  importContacts(
    params: ContactsImportContactsParams,
    options?: RequestOptions,
  ): Promise<ContactImportResult> {
    return this._client
      .request('POST', '/contact/import', {
        body: {
          data: params.data,
          contact_group_id: params.contact_group_id,
          contact_group_name: params.contact_group_name,
        },
        options,
      })
      .then((data) => data as ContactImportResult);
  }
}
