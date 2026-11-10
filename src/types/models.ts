// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type {
  CallScenarioApplyStatus,
  CallScenarioDeliveryError,
  CallScenarioType,
  CallStatus,
  CallType,
  DongleOnlineErrorCode,
  DongleOnlineStatus,
  DongleSignalQuality,
  MailingEntityType,
  MailingStatus,
  MailingType,
  RedirectionType,
  SmsSourceType,
  SmsStatus,
  SmsType,
  UssdStatus,
  UssdType,
} from './enums.js';
export interface Call {
  call_id: number;
  dongle_id: number;
  call_type_id: CallType;
  number_caller: string;
  number_receiver: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at: string;
  call_status_id: CallStatus;
  /**
   * The contact whose phone is the other party of the call. Returned by GET /call only, and only when there is such a contact (the key is absent otherwise).
   */
  contact?: Contact | null;
  duration: number | null;
  file_id: number | null;
  call_scenario_file_id: number | null;
  external_id: string | null;
  /** SIP Call-ID of the call. */
  sip_call_id: string | null;
  mailing_history_id: number | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  scheduled_at: string | null;
  /** When the call was placed; null until then. UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  sent_at: string | null;
  dongle_name: string;
  /** Contact groups the other party belonged to when the call was made. */
  initial_contact_group_ids: Array<number> | null;
}

export interface CallScenario {
  call_scenario_id?: number;
  dongle_id?: number;
  call_scenario_type_id?: CallScenarioType;
  file_id?: number | null;
  is_call_record?: boolean;
  is_deleted?: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
  call_scenario_phones?: Array<CallScenarioPhone>;
  file?: CallScenarioFile;
  name?: string;
  /** Version of the scenario; changes with every edit */
  version_uuid?: string;
  call_scenario_apply_status_id?: CallScenarioApplyStatus;
  call_scenario_delivery_error_id?: CallScenarioDeliveryError;
  /**
   * Error the dongle reported for the current version: 3001 generic error such as a failed download, 3002 invalid url, 3003 file too large for the dongle, 3011 invalid wav
   */
  apply_error_code?: number | null;
  /**
   * When the dongle last applied the scenario (on firmware without apply reports, accepted the push). UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`.
   */
  applied_at?: string | null;
}

export interface CallScenarioFile {
  cdn_url?: string;
}

export interface CallScenarioPhone {
  call_scenario_phone_id?: number;
  call_scenario_id?: number;
  phone?: string | null;
}

export interface Contact {
  contact_id: number;
  user_id: number;
  /**
   * Number of groups of the contact. Returned by the /contact operations; absent in a contact nested in another object.
   */
  groups_count?: number;
  phone: string;
  name: string | null;
  email: string | null;
  /**
   * Groups of the contact (without their contacts). Returned by the /contact operations; absent in a contact nested in another object.
   */
  contact_groups?: Array<ContactGroup>;
}

export interface ContactGroup {
  contact_group_id: number;
  user_id: number;
  name: string;
  /**
   * Number of contacts of the group. Returned by the /contact-group operations; absent in a group nested in another object.
   */
  contacts_count?: number;
  /**
   * Contacts of the group (without their groups). Returned by the /contact-group operations; absent in a group nested in another object.
   */
  contacts?: Array<Contact>;
}

export interface ContactImportError {
  contact?: ContactImportErrorContact;
  /** Error code from ContactManagementExceptionEnum or PG/validation message */
  error?: string;
}

export interface ContactImportErrorContact {
  name?: string;
  phone?: string;
  email?: string | null;
}

export interface ContactImportResult {
  /** Number of successfully created contacts */
  imported?: number;
  /** Rows that failed to import; main flow continues even if individual rows fail */
  errors?: Array<ContactImportError>;
}

/**
 * A modem. GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} return every attribute plus the counters and bootstrap_dongle; GET /dongle returns the attributes and, in full mode, dongle_setting and public_vpn_server.
 */
export interface Dongle {
  dongle_id: number;
  bootstrap_dongle_id: number;
  user_id: number;
  name: string;
  is_hotspot_enable: boolean | null;
  hotspot_name: string | null;
  /** Password of the Wi-Fi hotspot of the modem. */
  hotspot_password: string | null;
  number: string | null;
  is_deleted: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at: string;
  tariff_package_id: number | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  tariff_package_end: string | null;
  imsi: string | null;
  iccid: string | null;
  is_active: boolean;
  mcc: string | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  activated_at: string | null;
  daily_sms_limit: number | null;
  is_tariff_package_active: boolean;
  is_tariff_package_enabled: boolean;
  /** 1: Bad, 2: Medium, 3: Good. Null when not set. */
  dongle_signal_quality_id: DongleSignalQuality | null;
  is_send_report: boolean;
  dongle_call_type_id: number;
  is_public_vpn_enabled: boolean;
  /** IKEv2 login for public_vpn_server. */
  public_vpn_login: string | null;
  /**
   * IKEv2 password for public_vpn_server; POST /dongle/{dongle_id}/public-vpn/refresh-password replaces it and the new value is read here.
   */
  public_vpn_password: string | null;
  is_mute_incoming_call: boolean;
  is_trial: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  trial_end: string | null;
  /**
   * 1: Phone determination error, 2: Timeout error, 3: Unexpected error, 4: Health check failed error. Null when not set.
   */
  dongle_online_error_code_id: DongleOnlineErrorCode | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  last_online_at: string | null;
  /** Network name of the Wi-Fi extender. */
  wifi_extender_ssid?: string | null;
  /** Password of the Wi-Fi extender network. */
  wifi_extender_password?: string | null;
  /**
   * Wi-Fi extender mode of the modem. Returned by the operations served by backend-api (GET /dongle, the nested dongle of mailings); the operations served by backend return the same value as dongle_wifi_extender_mode_id.
   */
  wifi_extender_mode?: number | null;
  /**
   * Wi-Fi extender mode of the modem as GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} return it (the column name); the operations served by backend-api return it as wifi_extender_mode.
   */
  dongle_wifi_extender_mode_id?: number | null;
  /** FreeSWITCH dialplan of the modem. */
  dialplan_id?: number;
  /** True while a wifi extender enable/disable command is being processed by the modem. */
  is_wifi_extender_processing?: boolean;
  /**
   * Per-modem settings the client may see. Returned by GET /dongle only, and only in full mode: absent - not null - in is_short mode and when the modem has no settings.
   */
  dongle_setting?: DongleDongleSetting;
  /** Use public_vpn_server.address. Returned by GET /dongle only, in full mode. */
  public_vpn_endpoint?: string | null;
  /**
   * VPN gateway the client connects to with public_vpn_login and public_vpn_password, the same for every dongle. Returned by GET /dongle only, and only in full mode: absent - not null - in is_short mode.
   */
  public_vpn_server?: DonglePublicVpnServer;
  dongle_online_status?: DongleOnlineStatus;
  /**
   * Number of outgoing SMS of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
   */
  sms_outgoing?: number;
  /**
   * Number of incoming SMS of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
   */
  sms_incoming?: number;
  /**
   * Number of outgoing calls of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
   */
  call_outgoing?: number;
  /**
   * Number of incoming calls of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
   */
  call_incoming?: number;
  /**
   * Hardware identity of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
   */
  bootstrap_dongle?: DongleBootstrapDongle;
}

/**
 * Hardware identity of the modem. Returned by GET /dongle/{dongle_id} and PUT /dongle/{dongle_id} only.
 */
export interface DongleBootstrapDongle {
  /** IMEI as manufactured. */
  imei_manufacture?: string | null;
  /** SIP login of the modem on the PBX. */
  pbx_sip_user?: string | null;
}

/**
 * Per-modem settings the client may see. Returned by GET /dongle only, and only in full mode: absent - not null - in is_short mode and when the modem has no settings.
 */
export interface DongleDongleSetting {
  /**
   * Email the owner when the modem goes offline. Written via PUT /dongle/{dongle_id}/setting/offline-notification.
   */
  is_offline_notification_enabled?: boolean;
}

/**
 * Dongle item of GET /dongle. In short mode (is_short=true) only the required fields are returned; in full mode all fields (including sms/call counters, bootstrap_dongle and public_vpn_server) are present.
 */
export interface DongleListItem {
  dongle_id: number;
  bootstrap_dongle_id?: number;
  user_id?: number;
  name: string;
  is_hotspot_enable?: boolean | null;
  hotspot_name?: string | null;
  hotspot_password?: string | null;
  number: string | null;
  is_deleted?: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
  tariff_package_id?: number | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  tariff_package_end?: string | null;
  imsi?: string | null;
  iccid?: string | null;
  is_active?: boolean;
  mcc?: string | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  activated_at?: string | null;
  daily_sms_limit?: number | null;
  is_tariff_package_active: boolean;
  is_tariff_package_enabled?: boolean;
  /** 1: Bad, 2: Medium, 3: Good. Null when not set. */
  dongle_signal_quality_id?: DongleSignalQuality | null;
  is_send_report?: boolean;
  dongle_call_type_id: number;
  is_public_vpn_enabled?: boolean;
  public_vpn_login?: string | null;
  public_vpn_password?: string | null;
  is_mute_incoming_call?: boolean;
  is_trial: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  trial_end?: string | null;
  dialplan_id?: number;
  /**
   * 1: Phone determination error, 2: Timeout error, 3: Unexpected error, 4: Health check failed error. Null when not set.
   */
  dongle_online_error_code_id: DongleOnlineErrorCode | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  last_online_at?: string | null;
  wifi_extender_ssid?: string | null;
  wifi_extender_password?: string | null;
  dongle_wifi_extender_mode_id?: number | null;
  /**
   * 1: Offline, 2: Online processing (connecting), 3: Error (see dongle_online_error_code_id), 4: Manual phone determination, 5: Online, 6: Updating, 7: Rebooting (set at once by POST /dongle/{dongle_id}/reboot). Null when not set.
   */
  dongle_online_status: DongleOnlineStatus | null;
  is_wifi_extender_processing: boolean;
  sms_outgoing?: number;
  sms_incoming?: number;
  call_outgoing?: number;
  call_incoming?: number;
  bootstrap_dongle?: DongleListItemBootstrapDongle;
  /** Use public_vpn_server.address. */
  public_vpn_endpoint?: string | null;
  /**
   * VPN gateway the client connects to with public_vpn_login and public_vpn_password. The same for every dongle.
   */
  public_vpn_server?: DongleListItemPublicVpnServer;
  /** Per-modem settings the client may see; absent when the modem has no settings. */
  dongle_setting?: DongleListItemDongleSetting;
}

export interface DongleListItemBootstrapDongle {
  imei_manufacture?: string | null;
  /** SIP login of the modem on the PBX. */
  pbx_sip_user?: string | null;
}

/** Per-modem settings the client may see; absent when the modem has no settings. */
export interface DongleListItemDongleSetting {
  is_offline_notification_enabled?: boolean;
}

/**
 * VPN gateway the client connects to with public_vpn_login and public_vpn_password. The same for every dongle.
 */
export interface DongleListItemPublicVpnServer {
  type: 'IKEv2';
  address: string;
  /** IKEv2 Remote ID: the identity the gateway presents. */
  remote_id: string;
}

/**
 * Radio state reported by the modem. Signal fields that the current network type does not report are null.
 */
export interface DongleNetworkInfo {
  sim_network_plmn: string;
  sim_network_name: string;
  current_network_plmn: string;
  current_network_name: string;
  is_roaming: boolean;
  network_type: string;
  mcc: number;
  mnc: number;
  rsrp?: number | null;
  rsrq?: number | null;
  sinr?: number | null;
  cid?: number | null;
  ci?: number | null;
  pci?: number | null;
  rssi?: number | null;
  tac?: number | null;
  psc?: number | null;
  lac?: number | null;
}

/**
 * VPN gateway the client connects to with public_vpn_login and public_vpn_password, the same for every dongle. Returned by GET /dongle only, and only in full mode: absent - not null - in is_short mode.
 */
export interface DonglePublicVpnServer {
  type: 'IKEv2';
  address: string;
  /** IKEv2 Remote ID: the identity the gateway presents. */
  remote_id: string;
}

/** Identifiers of the SIM card and the modem. */
export interface DongleSimIdentifiers {
  iccid: string;
  imsi: string;
  imei: string;
  /** Phone number as the modem reports it; may be empty. */
  number: string;
}

export interface DongleSocksProxy {
  dongle_socks_proxy_id: number;
  dongle_id: number;
  login: string;
  password: string;
  allowed_ips: Array<string>;
  /** The SOCKS5 gateway the client connects to with login and password; the same for every proxy. */
  server: DongleSocksProxyServer;
  /**
   * The proxy accepts connections: true while the modem has an active subscription or trial. The credentials stay when it becomes false and work again once the subscription is active.
   */
  is_active: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at: string;
}

/** The SOCKS5 gateway the client connects to with login and password; the same for every proxy. */
export interface DongleSocksProxyServer {
  address: string;
  port: number;
}

export interface DongleStatistic {
  dongle_statistic_id?: number;
  dongle_id?: number;
  /** Bytes received by the modem in the sample. */
  read?: number;
  /** Bytes sent by the modem in the sample. */
  write?: number;
  /** Moment of the sample, UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  time?: string;
}

export interface FollowUpSmsSetting {
  follow_up_sms_setting_id: number;
  dongle_id: number;
  name: string;
  text: string;
  ringing_duration_timeout?: number | null;
  call_duration_timeout?: number | null;
  daily_sms_limit?: number | null;
}

export interface Mailing {
  mailing_id?: number;
  dongle_id?: number;
  count_mailing_phones?: number;
  mailing_type_id?: MailingType;
  mailing_status_id?: MailingStatus;
  mailing_entity_type_id?: MailingEntityType;
  /** The last run of the mailing; null while it has not run. */
  mailing_history?: MailingHistory | null;
  name?: string;
  is_deleted?: boolean;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  scheduled_at?: string | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
  text?: string | null;
  file_id?: number | null;
  is_call_record?: boolean;
  user_id?: number;
  contacts?: Array<Contact>;
  contact_groups?: Array<ContactGroup>;
  mailing_phones?: Array<MailingPhone>;
  dongle?: Dongle | null;
}

export interface MailingHistory {
  mailing_history_id?: number;
  mailing_id?: number;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
}

export interface MailingPhone {
  mailing_phone_id?: number;
  mailing_id?: number;
  phone?: string | null;
}

export interface PbxSipConnection {
  pbx_sip_url?: string;
  pbx_sip_port?: number;
  pbx_sip_protocol?: string;
}

export interface PbxSipUser {
  pbx_sip_user_id: number;
  user_id: number;
  sip_login: string;
  sip_password: string;
  dialplan_id?: number;
  /** The modem of the SIP account; always set. */
  dongle_id?: number;
  pbx_sip_connections: Array<PbxSipConnection>;
}

export interface PublicVpnSession {
  /** Client address inside the VPN. */
  ip: string;
  /** Name of the modem. */
  name: string;
  /** VPN login the session was opened with (public_vpn_login of the modem). */
  username: string;
  dongle_id: number;
}

export interface Redirection {
  redirection_id?: number;
  user_id?: number;
  redirection_type_id?: RedirectionType;
  name?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
  condition?: RedirectionCondition;
  params?: RedirectionParams;
}

/**
 * When the redirection fires: one rule, checked against every incoming SMS (redirection types 1, 3, 4, 5) or incoming call (type 2) of the account.
 *
 * A rule is a JSON array. A comparison is `[operator, field, value]`; `["and", rule, rule, ...]` and `["or", rule, rule, ...]` combine rules. The top level is a single rule, usually `and`.
 *
 * Fields are the attributes of the event, prefixed by the object: `sms_<field>` (the SMS schema: `sms_number_caller`, `sms_contact_id`, `sms_initial_contact_group_ids`, `sms_sms_source_type_id`, `sms_message_decoded`, ...), `call_<field>` (the call: `call_number_caller`, `call_contact_id`, `call_initial_contact_group_ids`, ...), `dongle_<field>` (the modem that received it: `dongle_dongle_id`, `dongle_name`, ...) and `contact_<field>` (the contact of the sender, when there is one). A field the event does not have compares as null.
 *
 * Operators: `=`, `!=`, `<`, `>` (one value); `in`, `!in` (a list of values); `regexp`, `!regexp` (a PCRE with delimiters, for example `/^bank$/ui`); `like`, `!like` (case-insensitive substring); `intersect_source`, `!intersect_source` (a list field such as `sms_initial_contact_group_ids` shares a value with the list); `is_empty`, `!is_empty` (`[operator, field]`, no value).
 *
 * Checked on save (400 CONDITION_NOT_VALID_EXCEPTION unless said otherwise):
 * - the rule must parse: not empty, a known operator, the right number and types of arguments;
 * - `["in", "dongle_dongle_id", [ids]]` as a direct child of the top-level `and` limits the redirection to these modems (GET /redirection filters by it too); every id must be a modem of the account with an active tariff (400 DONGLE_NOT_FOUND for an unknown id or an id of another account, a tariff error otherwise). Without it the redirection applies to every modem;
 * - a `regexp` inside an `or` that is a direct child of the top-level rule may only test `sms_number_caller` or `call_number_caller` and must be `/^<letters or digits>$/ui` (an alphanumeric sender name);
 * - for an auto reply (type 3), every number of a `sms_number_caller` list that is a direct child of the top-level rule is a valid phone number in `+<digits>` form.
 */
export interface RedirectionCondition {}

/**
 * What the redirection does. Required keys depend on redirection_type_id (400 PARAMS_NOT_VALID_EXCEPTION otherwise):
 * - 1 (SMS) and 2 (call): at least one delivery target - a non-empty `email`, or at least one item in `emails` or `telegram_chat_ids`;
 * - 3 (auto reply): `auto_reply_message`;
 * - 4 (silent) and 5 (HTTP): `url`, an absolute URL.
 *
 * Other keys are stored as sent and returned as is.
 */
export interface RedirectionParams {
  /** One e-mail address to deliver to (types 1 and 2). */
  email?: string;
  /** E-mail addresses to deliver to (types 1 and 2); each must be a valid address. */
  emails?: Array<string>;
  /**
   * Telegram chat ids to deliver to (types 1 and 2); digits with an optional leading minus, as a string or a number.
   */
  telegram_chat_ids?: Array<string>;
  /** Text of the reply SMS (type 3, required). */
  auto_reply_message?: string;
  /** Optional text stored with the redirection. */
  forwarding_message?: string;
  /** URL that receives the event (types 4 and 5, required). */
  url?: string;
}

export interface Sms {
  sms_id: number;
  dongle_id: number;
  sms_type_id: SmsType;
  sms_status_id: SmsStatus;
  /** Status code the mobile network reported for an outgoing SMS; null when none was reported. */
  network_status_code: number | null;
  /** 1: Local, 2: International, 3: Short (short code or alphanumeric sender). Null when not set. */
  sms_source_type_id: SmsSourceType | null;
  number_caller: string;
  /**
   * Raw PDUs of the message as the modem received them, one item per part of a multipart SMS; null when the SMS was not received as PDUs.
   */
  pdus: Array<SmsPdu> | null;
  /** Contact groups the sender belonged to when the SMS was received. */
  initial_contact_group_ids: Array<number> | null;
  number_receiver: string;
  sms_center: string | null;
  sms_source_country_code: string | null;
  message_decoded: string;
  callback_url: string | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  scheduled_at: string | null;
  external_id: string | null;
  /** Name of the modem. Returned by GET /sms and GET /dongle/{dongle_id}/sms only. */
  dongle_name?: string;
  replied_to_sms_id: number | null;
  /** The mailing run that sent this SMS; null for an SMS outside a mailing. */
  mailing_history_id: number | null;
  /**
   * The contact whose phone is the other party of the SMS. Returned by GET /sms and GET /dongle/{dongle_id}/sms only, and only when there is such a contact (the key is absent otherwise).
   */
  contact?: Contact;
  /**
   * The reply sent to this SMS (the SMS whose replied_to_sms_id is this sms_id), null when there is none; without its own redirections, replied_from_sms, contact and dongle_name. Returned by GET /sms, GET /dongle/{dongle_id}/sms, GET /dongle/{dongle_id}/sms/{sms_id} and PUT /dongle/{dongle_id}/sms/{sms_id}; absent in the answers of the sending operations.
   */
  replied_from_sms?: Sms | null;
  /**
   * Redirection rules that fired on this SMS. Returned by GET /sms, GET /dongle/{dongle_id}/sms, GET /dongle/{dongle_id}/sms/{sms_id} and PUT /dongle/{dongle_id}/sms/{sms_id}; absent in the answers of the sending operations.
   */
  redirections?: Array<Redirection>;
}

export interface SmsPdu {
  /** PDU in hex. */
  pdu: string;
  /** Present on SMS received before 2024-04. */
  length?: number;
  /** Unix time; present on SMS received before 2024-04. */
  time?: number;
}

export interface SmsThread {
  dongle_id: number;
  contact_number: string;
  last_message: SmsThreadLastMessage;
}

export interface SmsThreadLastMessage {
  sms_id: number;
  preview: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at: string;
  is_incoming: boolean;
  sms_status_id: number;
}

export interface TmpFile {
  /**
   * Temporary file id: `<2 hex>/<32 hex>/<file name>` (three segments with slashes). Read it with GET /file/tmp/{file_id}, attach it through tmp_file_id of a call scenario or a call mailing.
   */
  tmp_file_id: string;
}

export interface Ussd {
  ussd_id?: number;
  dongle_id?: number;
  ussd_status_id?: UssdStatus;
  ussd_type_id?: UssdType;
  command?: string | null;
  response?: string | null;
  external_id?: string | null;
  raw_webhook_data?: Record<string, unknown> | null;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  created_at?: string;
  /** UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`. */
  updated_at?: string;
}
