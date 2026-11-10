// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type { Redirection } from '../types/models.js';
import type {
  RedirectionsCreateParams,
  RedirectionsListParams,
  RedirectionsUpdateParams,
} from '../types/params.js';
import { asStatus, pathParam } from '../utils.js';
/** Rules for incoming SMS and calls: forwarding, auto reply, HTTP callback. */
export class RedirectionsResource extends APIResource {
  /**
   * List redirections.
   *
   * Redirection rules of the account: forwarding of incoming SMS and calls, auto replies and HTTP callbacks. Newest first by default (created_at descending, then the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARSING_DATE_TIME_EXCEPTION.
   */
  list(params: RedirectionsListParams = {}, options?: RequestOptions): PagePromise<Redirection> {
    return this._client.getPage<Redirection>('/redirection', {
      query: {
        name: params.name,
        auto_reply_message: params.auto_reply_message,
        dongle_id: params.dongle_id,
        'dongle_ids[]': params.dongle_ids,
        from: params.from,
        to: params.to,
        page: params.page,
        limit: params.limit,
        order_by: params.order_by,
        order: params.order,
        'redirection_type_ids[]': params.redirection_type_ids,
      },
      itemKey: 'redirections',
      options,
    });
  }

  /**
   * Create redirection.
   *
   * Creates a redirection rule; condition and params are checked on save (see RedirectionCondition and RedirectionParams).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, PARAMS_NOT_VALID_EXCEPTION, CONDITION_NOT_VALID_EXCEPTION, DONGLE_NOT_FOUND, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE.
   */
  create(params: RedirectionsCreateParams, options?: RequestOptions): Promise<Redirection> {
    return this._client
      .request('POST', '/redirection', {
        body: {
          condition: params.condition,
          name: params.name,
          params: params.params,
          redirection_type_id: params.redirection_type_id,
        },
        options,
      })
      .then((data) => data as Redirection);
  }

  /**
   * Get redirection.
   *
   * One redirection rule of the account.
   *
   * @param redirectionId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, REDIRECTION_NOT_FOUND_EXCEPTION.
   */
  get(redirectionId: number, options?: RequestOptions): Promise<Redirection> {
    return this._client
      .request('GET', `/redirection/${pathParam(redirectionId)}`, { options })
      .then((data) => data as Redirection);
  }

  /**
   * Update redirection.
   *
   * Replaces the redirection rule; the body is checked as on create.
   *
   * @param redirectionId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, REDIRECTION_NOT_FOUND_EXCEPTION, PARAMS_NOT_VALID_EXCEPTION, CONDITION_NOT_VALID_EXCEPTION, DONGLE_NOT_FOUND, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE.
   */
  update(
    redirectionId: number,
    params: RedirectionsUpdateParams,
    options?: RequestOptions,
  ): Promise<Redirection> {
    return this._client
      .request('PUT', `/redirection/${pathParam(redirectionId)}`, {
        body: {
          condition: params.condition,
          name: params.name,
          params: params.params,
          redirection_type_id: params.redirection_type_id,
        },
        options,
      })
      .then((data) => data as Redirection);
  }

  /**
   * Delete redirection.
   *
   * Deletes the redirection rule.
   *
   * @param redirectionId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, REDIRECTION_NOT_FOUND_EXCEPTION.
   */
  delete(redirectionId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('DELETE', `/redirection/${pathParam(redirectionId)}`, { options })
      .then(asStatus);
  }
}
