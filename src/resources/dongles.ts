// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { RequestOptions } from '../core.js';
import type { PagePromise } from '../pagination.js';
import { APIResource } from '../resource.js';
import type {
  Dongle,
  DongleListItem,
  DongleNetworkInfo,
  DongleSimIdentifiers,
  DongleStatistic,
} from '../types/models.js';
import type {
  DonglesEnableWifiExtenderParams,
  DonglesListParams,
  DonglesListStatisticsParams,
  DonglesSetNumberParams,
  DonglesSetWifiCredentialsParams,
  DonglesUpdateOfflineNotificationParams,
  DonglesUpdateParams,
} from '../types/params.js';
import { asArray, asResult, asStatus, pathParam } from '../utils.js';
/** Modems of the account and their commands: reboot, Wi-Fi, Wi-Fi extender, number, network info. */
export class DonglesResource extends APIResource {
  /**
   * List modems.
   *
   * Modems of the account. In full mode every field of the Dongle schema that the list serves is returned; dongle_setting and public_vpn_server are present in full mode only. The cheapest call is GET /dongle?is_short=1&limit=1: use it to check that an API key works. Newest first by default (created_at descending, then the id descending).
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION.
   */
  list(params: DonglesListParams = {}, options?: RequestOptions): PagePromise<DongleListItem> {
    return this._client.getPage<DongleListItem>('/dongle', {
      query: {
        page: params.page,
        limit: params.limit,
        'dongle_ids[]': params.dongle_ids,
        order_by: params.order_by,
        order: params.order,
        is_active: params.is_active,
        is_short: params.is_short,
        is_tariff_package_active: params.is_tariff_package_active,
        is_tariff_package_enabled: params.is_tariff_package_enabled,
        'dongle_call_type_ids[]': params.dongle_call_type_ids,
        name: params.name,
        number: params.number,
      },
      itemKey: 'dongles',
      options,
    });
  }

  /**
   * Reboot modem.
   *
   * 200 means the reboot is accepted, not done: dongle_online_status becomes 7 (REBOOTING) at once and goes back to an online or offline status when the modem returns. A repeated call while a reboot is in progress (about 180 s for the API stage, then the SMS stage) is a no-op that also answers 200. The reboot is accepted regardless of the subscription and of the online state; track progress through dongle_online_status in GET /dongle or GET /dongle/{dongle_id}.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION.
   */
  reboot(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client.request('POST', `/dongle/${pathParam(dongleId)}/reboot`, { options }).then(asStatus);
  }

  /**
   * Enable modem Wi-Fi.
   *
   * Turns the Wi-Fi hotspot of the modem on; the modem must be online. Answers {"status": true} when the command is accepted; is_hotspot_enable in GET /dongle/{dongle_id} follows once the modem applied it.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_WIFI_ALREADY_IN_THE_SAME_STATUS_EXCEPTION, DONGLE_API_CONNECTION_EXCEPTION, DONGLE_API_HTTP_RESPONSE_EXCEPTION.
   */
  enableWifi(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi/enable`, { options })
      .then(asStatus);
  }

  /**
   * Disable modem Wi-Fi.
   *
   * Turns the Wi-Fi hotspot of the modem off; the modem must be online. Answers {"status": true} when the command is accepted.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_WIFI_ALREADY_IN_THE_SAME_STATUS_EXCEPTION, DONGLE_API_CONNECTION_EXCEPTION, DONGLE_API_HTTP_RESPONSE_EXCEPTION.
   */
  disableWifi(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi/disable`, { options })
      .then(asStatus);
  }

  /**
   * Set modem Wi-Fi credentials.
   *
   * Sets the name and the password of the Wi-Fi hotspot of the modem.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_WIFI_INVALID_SSID_EXCEPTION, DONGLE_WIFI_INVALID_PASSWORD_EXCEPTION, DONGLE_WIFI_API_EXCEPTION.
   */
  setWifiCredentials(
    dongleId: number,
    params: DonglesSetWifiCredentialsParams,
    options?: RequestOptions,
  ): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi/credentials`, {
        body: { hotspot_name: params.hotspot_name, hotspot_password: params.hotspot_password },
        options,
      })
      .then(asStatus);
  }

  /**
   * Enable Wi-Fi extender.
   *
   * Connects the modem to an external Wi-Fi network as a client (extender mode); the modem must be online. is_wifi_extender_processing is true in GET /dongle while the modem applies the command.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, DONGLE_WIFI_EXTENDER_LOCKED_EXCEPTION, DONGLE_API_CONNECTION_EXCEPTION, DONGLE_API_HTTP_RESPONSE_EXCEPTION.
   */
  enableWifiExtender(
    dongleId: number,
    params: DonglesEnableWifiExtenderParams,
    options?: RequestOptions,
  ): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi-extender/enable`, {
        body: { ssid: params.ssid, password: params.password, wifi_extender_mode: params.wifi_extender_mode },
        options,
      })
      .then(asStatus);
  }

  /**
   * Disable Wi-Fi extender.
   *
   * Disconnects the modem from the external Wi-Fi network; the modem must be online.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_WIFI_EXTENDER_LOCKED_EXCEPTION, DONGLE_API_CONNECTION_EXCEPTION, DONGLE_API_HTTP_RESPONSE_EXCEPTION.
   */
  disableWifiExtender(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi-extender/disable`, { options })
      .then(asStatus);
  }

  /**
   * Scan Wi-Fi networks.
   *
   * Asks the modem to scan the Wi-Fi networks around it; the modem must be online.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, BILLING_ERROR_IDENTIFIER_DONGLE_SUBSCRIPTION_NOT_ACTIVE, DONGLE_API_CONNECTION_EXCEPTION, DONGLE_API_HTTP_RESPONSE_EXCEPTION.
   */
  scanWifiNetworks(dongleId: number, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/wifi-extender/networks`, { options })
      .then(asStatus);
  }

  /**
   * Set offline notification.
   *
   * Turns the e-mail to the owner about the modem going offline on or off; shown as dongle_setting.is_offline_notification_enabled in GET /dongle.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_SETTING_NOT_FOUND.
   */
  updateOfflineNotification(
    dongleId: number,
    params: DonglesUpdateOfflineNotificationParams,
    options?: RequestOptions,
  ): Promise<boolean> {
    return this._client
      .request('PUT', `/dongle/${pathParam(dongleId)}/setting/offline-notification`, {
        body: { is_enabled: params.is_enabled },
        options,
      })
      .then(asStatus);
  }

  /**
   * Set modem number.
   *
   * Accepted asynchronously: the number is verified through the dongle and stored on success; 200 means queued.
   *
   * @param dongleId - ID of the dongle
   *
   * Error codes (`errorMessage`): REQUEST_VALIDATION_EXCEPTION, DONGLE_NOT_FOUND_EXCEPTION, DONGLE_MANUAL_PHONE_DETERMINATION_NUMBER_EXCEPTION, DONGLE_MANUAL_PHONE_DETERMINATION_ALREADY_IN_PROGRESS_EXCEPTION.
   */
  setNumber(dongleId: number, params: DonglesSetNumberParams, options?: RequestOptions): Promise<boolean> {
    return this._client
      .request('PUT', `/dongle/${pathParam(dongleId)}/number`, { body: { number: params.number }, options })
      .then(asStatus);
  }

  /**
   * Get modem.
   *
   * One modem of the account with its counters and hardware identity.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): DONGLE_ERROR_DONGLE_NOT_FOUND.
   */
  get(dongleId: number, options?: RequestOptions): Promise<Dongle> {
    return this._client
      .request('GET', `/dongle/${pathParam(dongleId)}`, { options })
      .then((data) => data as Dongle);
  }

  /**
   * Update modem.
   *
   * Only the listed body fields are read; unknown fields are ignored. An omitted field keeps its value. The billing fields tariff_package_id, is_tariff_package_enabled, order_dongle_id, is_deleted and is_active and the field imei_fake are outside the public API: a body with any of them is refused as a whole with 403 PUBLIC_API_FIELD_FORBIDDEN.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): DONGLE_ERROR_DONGLE_NOT_FOUND, PUBLIC_API_FIELD_FORBIDDEN.
   */
  update(dongleId: number, params: DonglesUpdateParams = {}, options?: RequestOptions): Promise<Dongle> {
    return this._client
      .request('PUT', `/dongle/${pathParam(dongleId)}`, {
        body: {
          name: params.name,
          number: params.number,
          is_mute_incoming_call: params.is_mute_incoming_call,
          dongle_call_type_id: params.dongle_call_type_id,
        },
        options,
      })
      .then((data) => data as Dongle);
  }

  /**
   * Get modem network info.
   *
   * Asks the online modem for its radio state and returns it in the answer: networks, roaming, network type and signal. DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_HTTP_RESPONSE and DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_INVALID_CONTENT mean the modem did not answer or answered malformed data: a temporary state, the request can be repeated.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): DONGLE_ERROR_DONGLE_NOT_FOUND, DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_HTTP_RESPONSE, DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_INVALID_CONTENT.
   */
  getNetworkInfo(dongleId: number, options?: RequestOptions): Promise<DongleNetworkInfo> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/mobile-network-info`, { options })
      .then((data) => asResult(data) as DongleNetworkInfo);
  }

  /**
   * Get modem SIM identifiers.
   *
   * Asks the online modem for the identifiers of its SIM card and returns them in the answer. DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_HTTP_RESPONSE and DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_INVALID_CONTENT mean the modem did not answer or answered malformed data: a temporary state, the request can be repeated.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): DONGLE_ERROR_DONGLE_NOT_FOUND, DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_HTTP_RESPONSE, DONGLE_MANAGEMENT_API_ERROR_IDENTIFIER_INVALID_CONTENT.
   */
  getSimIdentifiers(dongleId: number, options?: RequestOptions): Promise<DongleSimIdentifiers> {
    return this._client
      .request('POST', `/dongle/${pathParam(dongleId)}/mobile-network-ids`, { options })
      .then((data) => asResult(data) as DongleSimIdentifiers);
  }

  /**
   * List modem traffic statistics.
   *
   * Traffic samples of the modem: read and write are the byte counters reported for the sample taken at time. Oldest first: sorted by time ascending. Without from and to the whole history is returned.
   *
   * @param dongleId - Identifier in the path
   *
   * Error codes (`errorMessage`): PARSING_DATE_TIME_EXCEPTION, DONGLE_ERROR_DONGLE_NOT_FOUND.
   */
  listStatistics(
    dongleId: number,
    params: DonglesListStatisticsParams = {},
    options?: RequestOptions,
  ): Promise<Array<DongleStatistic>> {
    return this._client
      .request('GET', `/dongle/${pathParam(dongleId)}/statistic`, {
        query: { from: params.from, to: params.to },
        options,
      })
      .then((data) => asArray(data) as Array<DongleStatistic>);
  }
}
