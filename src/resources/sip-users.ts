// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import { APIResource } from '../resource.js';
import type { PbxSipUser } from '../types/models.js';
import type { SipUsersListParams } from '../types/params.js';
import { asArray, pathParam } from '../utils.js';
/** SIP accounts of the modems. */
export class SipUsersResource extends APIResource {
  /**
   * List SIP users.
   *
   * SIP accounts of the modems of the account, one per modem (dongle_id is always set; the softphone login of the cabinet and the mobile app is not listed). Modems deleted from the account are not listed. pbx_sip_connections lists the SIP servers to register at (TLS and UDP/TCP).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  list(params: SipUsersListParams = {}, options?: RequestOptions): Promise<Array<PbxSipUser>> {
    return this._client
      .request('GET', '/sip-user', {
        query: { 'dongle_call_type_ids[]': params.dongle_call_type_ids },
        options,
      })
      .then((data) => asArray(data, 'pbx_sip_users') as Array<PbxSipUser>);
  }

  /**
   * Get SIP user.
   *
   * One SIP account of a modem of the account. An unknown id, the SIP account of a deleted modem and the softphone login of the cabinet and the mobile app answer 404 PBX_SIP_ERROR_IDENTIFIER_CANT_FIND_PBX_USER.
   *
   * @param sipUserId - Identifier in the path
   *
   * Error codes (`errorMessage`): PBX_SIP_ERROR_IDENTIFIER_CANT_FIND_PBX_USER.
   */
  get(sipUserId: number, options?: RequestOptions): Promise<PbxSipUser> {
    return this._client
      .request('GET', `/sip-user/${pathParam(sipUserId)}`, { options })
      .then((data) => data as PbxSipUser);
  }
}
