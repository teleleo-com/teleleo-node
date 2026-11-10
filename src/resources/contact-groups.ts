// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { ContactGroup } from '../types/models.js';
import type {
  ContactGroupsCreateParams,
  ContactGroupsListParams,
  ContactGroupsUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** Groups of contacts, used by mailings, call scenarios and redirections. */
export class ContactGroupsResource extends APIResource {
  /**
   * List contact groups.
   *
   * Contact groups of the account. Newest first by default (the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  list(params: ContactGroupsListParams = {}, options?: RequestOptions): PagePromise<ContactGroup> {
    return this._client.getPage<ContactGroup>('/contact-group', {
      query: {
        'contact_group_ids[]': params.contact_group_ids,
        'contact_ids[]': params.contact_ids,
        name: params.name,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
      },
      itemKey: 'contact_groups',
      options,
    });
  }

  /**
   * Create contact group.
   *
   * Creates a contact group with the given contacts.
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_GROUP_ERROR_WITH_SAME_NAME_ALREADY_EXIST, CONTACT_GROUP_ERROR_INVALID_CONTACT.
   */
  create(params: ContactGroupsCreateParams, options?: RequestOptions): Promise<ContactGroup> {
    return this._client
      .request('POST', '/contact-group', {
        body: { name: params.name, contact_ids: params.contact_ids },
        options,
      })
      .then((data) => data as ContactGroup);
  }

  /**
   * Get contact group.
   *
   * One contact group of the account.
   *
   * @param contactGroupId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_GROUP_NOT_FOUND_EXCEPTION.
   */
  get(contactGroupId: number, options?: RequestOptions): Promise<ContactGroup> {
    return this._client
      .request('GET', `/contact-group/${pathParam(contactGroupId)}`, { options })
      .then((data) => data as ContactGroup);
  }

  /**
   * Update contact group.
   *
   * Replaces the group: name and the set of contacts are written as sent.
   *
   * @param contactGroupId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_GROUP_NOT_FOUND_EXCEPTION, CONTACT_GROUP_ERROR_WITH_SAME_NAME_ALREADY_EXIST, CONTACT_GROUP_ERROR_INVALID_CONTACT.
   */
  update(
    contactGroupId: number,
    params: ContactGroupsUpdateParams,
    options?: RequestOptions,
  ): Promise<ContactGroup> {
    return this._client
      .request('PUT', `/contact-group/${pathParam(contactGroupId)}`, {
        body: { name: params.name, contact_ids: params.contact_ids },
        options,
      })
      .then((data) => data as ContactGroup);
  }

  /**
   * Delete contact group.
   *
   * Deletes the contact group.
   *
   * @param contactGroupId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, CONTACT_GROUP_NOT_FOUND_EXCEPTION, CONTACT_GROUP_ERROR_REDIRECTS_ARE_PRESENT_WHILE_DELETING_CONTACT_GROUP, CONTACT_GROUP_ERROR_MAILINGS_ARE_PRESENT_WHILE_DELETING_CONTACT_GROUP.
   */
  delete(contactGroupId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('DELETE', `/contact-group/${pathParam(contactGroupId)}`, { options })
      .then(asStatus);
  }
}
