// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import { APIResource } from '../resource.js';
import type { PublicVpnSession } from '../types/models.js';
import { asArray, asStatus, pathParam } from '../utils.js';
/** VPN access through a modem. */
export class PublicVpnResource extends APIResource {
  /**
   * Enable public VPN.
   *
   * Creates the VPN account of the modem on the gateway and answers {"status": true}. The credentials are not in the answer: read public_vpn_login, public_vpn_password and public_vpn_server from GET /dongle (full mode). is_public_vpn_enabled of the modem becomes true.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, DONGLE_PUBLIC_VPN_ALREADY_ENABLED_EXCEPTION.
   */
  enable(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/public-vpn/enable`, { options })
      .then(asStatus);
  }

  /**
   * Disable public VPN.
   *
   * Removes the VPN account of the modem from the gateway and drops its sessions; answers {"status": true}. is_public_vpn_enabled becomes false; the login is kept and reused by a later enable.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_PUBLIC_VPN_ALREADY_DISABLED_EXCEPTION.
   */
  disable(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/public-vpn/disable`, { options })
      .then(asStatus);
  }

  /**
   * Refresh public VPN password.
   *
   * The response carries only status; the new password is returned by GET /dongle (public_vpn_password, full mode). Requires an active tariff.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE.
   */
  refreshPassword(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/public-vpn/refresh-password`, { options })
      .then(asStatus);
  }

  /**
   * List public VPN sessions.
   *
   * Live VPN sessions of the modems of the account, as the VPN gateway reports them. Not paginated.
   */
  listSessions(options?: RequestOptions): Promise<Array<PublicVpnSession>> {
    return this._client
      .request('GET', '/public-vpn/connect-session-list', { options })
      .then((data) => asArray(data, 'connect_sessions') as Array<PublicVpnSession>);
  }
}
