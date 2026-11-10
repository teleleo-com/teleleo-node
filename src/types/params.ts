// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type {
  CallStatus,
  CallType,
  DurationPreset,
  MailingEntityType,
  MailingStatus,
  MailingType,
  RedirectionType,
  SmsType,
} from './enums.js';
export interface ImportContactRowParam {
  /** Contact name */
  A?: string | null;
  /** Contact phone */
  B?: string;
  /** Contact email */
  C?: string | null;
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
export interface RedirectionConditionParam {}

/**
 * What the redirection does. Required keys depend on redirection_type_id (400 PARAMS_NOT_VALID_EXCEPTION otherwise):
 * - 1 (SMS) and 2 (call): at least one delivery target - a non-empty `email`, or at least one item in `emails` or `telegram_chat_ids`;
 * - 3 (auto reply): `auto_reply_message`;
 * - 4 (silent) and 5 (HTTP): `url`, an absolute URL.
 *
 * Other keys are stored as sent and returned as is.
 */
export interface RedirectionParamsParam {
  /** One e-mail address to deliver to (types 1 and 2). */
  email?: string;
  /** E-mail addresses to deliver to (types 1 and 2); each must be a valid address. */
  emails?: ReadonlyArray<string>;
  /**
   * Telegram chat ids to deliver to (types 1 and 2); digits with an optional leading minus, as a string or a number.
   */
  telegram_chat_ids?: ReadonlyArray<string>;
  /** Text of the reply SMS (type 3, required). */
  auto_reply_message?: string;
  /** Optional text stored with the redirection. */
  forwarding_message?: string;
  /** URL that receives the event (types 4 and 5, required). */
  url?: string;
}

/** Parameters of `client.calls.list()`. */
export interface CallsListParams {
  /** Array of integers representing call type IDs */
  call_type_ids?: ReadonlyArray<CallType>;
  /**
   * Duration preset filters: 1 - less than 1 minute, 2 - 1-3 minutes, 3 - 3-5 minutes, 4 - more than 5 minutes
   */
  duration_presets?: ReadonlyArray<DurationPreset>;
  /** Filter by call status */
  call_status_ids?: ReadonlyArray<CallStatus>;
  /** Only calls made by these mailing runs */
  mailing_history_ids?: ReadonlyArray<number>;
  /** Array of integers representing dongle IDs */
  dongle_ids?: ReadonlyArray<number>;
  /** Name of the field to use for filtering by phone number */
  number?: string;
  /** Filter by caller phone number */
  caller?: string;
  /** Filter by receiver phone number */
  receiver?: string;
  /**
   * Calls created strictly after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * Calls created strictly before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /** true - only calls without a recording, false - only calls with one. */
  is_empty_file_id?: boolean;
  /** true - only calls without a call scenario audio file, false - only calls with one. */
  is_empty_call_scenario_file_id?: boolean;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /**
   * Attribute to sort by, sent together with order. One of: callId, callType, callStatus, duration, createdAt, updatedAt, scheduledAt, sentAt.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.contacts.list()`. */
export interface ContactsListParams {
  /** Array of integers representing contact groups IDs */
  contact_group_ids?: ReadonlyArray<number>;
  /** Array of integers representing contact IDs */
  contact_ids?: ReadonlyArray<number>;
  /** Filter by name */
  name?: string;
  /** Filter by query */
  query?: string;
  /** Filter by phone */
  phone?: string;
  /** Filter by a fragment of the email, case-insensitive. */
  email?: string;
  /** Exact phone numbers. */
  phones?: ReadonlyArray<string>;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Attribute to sort by, sent together with order. One of: contactId, name, phone, email. */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.contacts.create()`. */
export interface ContactsCreateParams {
  phone: string;
  /** Name of the contact; the key is required, the value may be null. */
  name: string | null;
  email?: string | null;
  /** Groups of the contact; send an empty array for none. Replaces the current set on update. */
  contact_group_ids: ReadonlyArray<number>;
}

/** Parameters of `client.contacts.update()`. */
export interface ContactsUpdateParams {
  phone: string;
  /** Name of the contact; the key is required, the value may be null. */
  name: string | null;
  email?: string | null;
  /** Groups of the contact; send an empty array for none. Replaces the current set on update. */
  contact_group_ids: ReadonlyArray<number>;
}

/** Parameters of `client.contactGroups.list()`. */
export interface ContactGroupsListParams {
  /** Array of integers representing contact groups IDs */
  contact_group_ids?: ReadonlyArray<number>;
  /** Array of integers representing contact IDs */
  contact_ids?: ReadonlyArray<number>;
  /** Filter by a fragment of the name, case-insensitive. */
  name?: string;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Attribute to sort by, sent together with order. One of: contactGroupId, name. */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.contactGroups.create()`. */
export interface ContactGroupsCreateParams {
  name: string;
  /** Contacts of the group; send an empty array for none. Replaces the current set on update. */
  contact_ids: ReadonlyArray<number>;
}

/** Parameters of `client.contactGroups.update()`. */
export interface ContactGroupsUpdateParams {
  name: string;
  /** Contacts of the group; send an empty array for none. Replaces the current set on update. */
  contact_ids: ReadonlyArray<number>;
}

/** Parameters of `client.dongles.list()`. */
export interface DonglesListParams {
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Array of integers representing dongle IDs */
  dongle_ids?: ReadonlyArray<number>;
  /**
   * Attribute to sort by, sent together with order. One of: dongleId, name, number, createdAt, updatedAt, activatedAt, lastOnlineAt, isActive, isTariffPackageActive, tariffPackageEnd, recentOutgoingSmsCount, recentOutgoingCallCount.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
  /** Filter by dongle active flag */
  is_active?: boolean;
  /**
   * Short mode: only dongle_id, name, number, is_trial, is_tariff_package_active, dongle_online_status, dongle_online_error_code_id, dongle_call_type_id and is_wifi_extender_processing per modem; the cheapest call, also fit to check that the key works.
   */
  is_short?: boolean;
  /** Filter by an active subscription. */
  is_tariff_package_active?: boolean;
  /** Filter by an enabled subscription. */
  is_tariff_package_enabled?: boolean;
  /** Filter by how incoming calls are handled: 1 - SIP, 2 - call scenario */
  dongle_call_type_ids?: ReadonlyArray<number>;
  /** Filter by a fragment of the name, case-insensitive. */
  name?: string;
  /** Filter by a fragment of the phone number. */
  number?: string;
}

/** Parameters of `client.mailings.list()`. */
export interface MailingsListParams {
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /**
   * Attribute to sort by, sent together with order. One of: mailingId, name, scheduledAt, createdAt, updatedAt.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
  /**
   * Alias of created_at_from. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * Alias of created_at_to. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /**
   * Filter by deletion state. Omitted -> all (legacy default); true -> only deleted; false -> only alive.
   */
  is_deleted?: boolean;
  /**
   * Mailings created at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  created_at_from?: string | Date;
  /**
   * Mailings created at or before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  created_at_to?: string | Date;
  /**
   * Mailings scheduled at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  scheduled_at_from?: string | Date;
  /**
   * Mailings scheduled at or before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  scheduled_at_to?: string | Date;
  /** Filter by dongle ids. */
  dongle_ids?: ReadonlyArray<number>;
  /** Filter by dongle name (substring). */
  dongle_name?: string;
  /** Filter by mailing status ids. */
  mailing_status_ids?: ReadonlyArray<MailingStatus>;
  /** Filter by mailing type id. */
  mailing_type_id?: MailingType;
  /** Filter by mailing entity type id. */
  mailing_entity_type_id?: MailingEntityType;
  /** Filter by mailing entity type ids. */
  mailing_entity_type_ids?: ReadonlyArray<MailingEntityType>;
  /** Filter by mailing history id. */
  mailing_history_id?: number;
  /** Filter by mailing history ids. */
  mailing_history_ids?: ReadonlyArray<number>;
  /** Filter by mailing name (substring). */
  name?: string;
  /** Filter by mailing text (substring). */
  text?: string;
}

/** Parameters of `client.mailings.create()`. */
export interface MailingsCreateParams {
  name: string;
  text?: string;
  mailing_type_id: MailingType;
  mailing_entity_type_id: number;
  dongle_id: number;
  scheduled_at?: string | Date | null;
  mailing_status_id?: number | null;
  is_call_record?: boolean;
  /**
   * Temporary audio file: tmp_file_id returned by POST /file/upload-tmp or POST /file/generate-speech, `<2 hex>/<32 hex>/<file name>`. Used by a call mailing.
   */
  tmp_file_id?: string | null;
  mailing_phones?: ReadonlyArray<string>;
  mailing_contact_ids?: ReadonlyArray<number>;
  mailing_contact_group_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.mailings.createSms()`. */
export interface MailingsCreateSmsParams {
  name: string;
  text: string;
  mailing_type_id: MailingType;
  dongle_id: number;
  scheduled_at?: string | Date | null;
  mailing_status_id?: number | null;
  mailing_phones?: ReadonlyArray<string>;
  mailing_contact_ids?: ReadonlyArray<number>;
  mailing_contact_group_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.mailings.createCall()`. */
export interface MailingsCreateCallParams {
  name: string;
  text?: string | null;
  mailing_type_id: MailingType;
  dongle_id: number;
  is_call_record?: boolean;
  /**
   * Temporary audio file: tmp_file_id returned by POST /file/upload-tmp or POST /file/generate-speech, `<2 hex>/<32 hex>/<file name>`. Used by a call mailing.
   */
  tmp_file_id?: string | null;
  scheduled_at?: string | Date | null;
  mailing_status_id?: number | null;
  mailing_phones?: ReadonlyArray<string>;
  mailing_contact_ids?: ReadonlyArray<number>;
  mailing_contact_group_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.mailings.update()`. */
export interface MailingsUpdateParams {
  name?: string | null;
  text?: string | null;
  /** 1: Simple (sent at once), 2: Delayed (sent at scheduled_at). */
  mailing_type_id?: number | null;
  /** 1: Draft, 2: Planned, 3: In process, 4: Ended, 5: Canceled. */
  mailing_status_id?: number | null;
  scheduled_at?: string | Date | null;
  is_deleted?: boolean | null;
  /**
   * Temporary audio file: tmp_file_id returned by POST /file/upload-tmp or POST /file/generate-speech, `<2 hex>/<32 hex>/<file name>`. Used by a call mailing.
   */
  tmp_file_id?: string | null;
  mailing_phones?: ReadonlyArray<string>;
  mailing_contact_ids?: ReadonlyArray<number>;
  mailing_contact_group_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.redirections.list()`. */
export interface RedirectionsListParams {
  /** Filter by a fragment of the name, case-insensitive. */
  name?: string;
  /** Filter by a fragment of the auto reply message, case-insensitive. */
  auto_reply_message?: string;
  /** Only redirections that apply to this dongle, including those without a dongle condition. */
  dongle_id?: number;
  /** Only redirections that apply to any of these dongles, including those without a dongle condition. */
  dongle_ids?: ReadonlyArray<number>;
  /**
   * Redirections created at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * Redirections created before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /**
   * Attribute to sort by, sent together with order. One of: redirectionId, name, redirectionType, createdAt, updatedAt.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
  /** Array of integers representing Redirection type IDs */
  redirection_type_ids?: ReadonlyArray<RedirectionType>;
}

/** Parameters of `client.redirections.create()`. */
export interface RedirectionsCreateParams {
  condition: RedirectionConditionParam;
  name: string;
  params: RedirectionParamsParam;
  redirection_type_id: RedirectionType;
}

/** Parameters of `client.redirections.update()`. */
export interface RedirectionsUpdateParams {
  condition: RedirectionConditionParam;
  name: string;
  params: RedirectionParamsParam;
  redirection_type_id: RedirectionType;
}

/** Parameters of `client.ussd.list()`. */
export interface UssdListParams {
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /**
   * Attribute to sort by, sent together with order. One of: ussdId, ussdStatus, ussdType, command, response, createdAt, updatedAt.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.ussd.send()`. */
export interface UssdSendParams {
  command: string;
}

/** Parameters of `client.sms.send()`. */
export interface SmsSendParams {
  /** Recipient phone number */
  number: string;
  /** Text message content */
  message: string;
  /**
   * When to send the SMS, in UTC: `YYYY-MM-DD hh:mm:ss` (for example 2023-01-01 11:11:11), without a T, an offset or fractional seconds. Omitted, null or an empty string sends now. A value in another format is refused with error_message PARSING_DATE_TIME_EXCEPTION.
   */
  scheduled_at?: string | Date | null;
  /** Optional callback URL for status updates */
  callback_url?: string;
}

/** Parameters of `client.sms.sendToContact()`. */
export interface SmsSendToContactParams {
  /** Recipient Contact ID */
  contact_id: number;
  /** Text message content */
  message: string;
  /**
   * When to send the SMS, in UTC: `YYYY-MM-DD hh:mm:ss` (for example 2023-01-01 11:11:11), without a T, an offset or fractional seconds. Omitted, null or an empty string sends now. A value in another format is refused with error_message PARSING_DATE_TIME_EXCEPTION.
   */
  scheduled_at?: string | Date | null;
}

/** Parameters of `client.sms.reply()`. */
export interface SmsReplyParams {
  /** ID of the SMS message being replied to */
  replied_to_sms_id: number;
  /** Text message content */
  message: string;
  /**
   * When to send the SMS, in UTC: `YYYY-MM-DD hh:mm:ss` (for example 2023-01-01 11:11:11), without a T, an offset or fractional seconds. Omitted, null or an empty string sends now. A value in another format is refused with error_message PARSING_DATE_TIME_EXCEPTION.
   */
  scheduled_at?: string | Date | null;
}

/** Parameters of `client.sms.listThreads()`. */
export interface SmsListThreadsParams {
  /** Filter by dongle ID */
  dongle_id?: number;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
}

/** Parameters of `client.contacts.importContacts()`. */
export interface ContactsImportContactsParams {
  /** List of contact rows; keys A/B/C are legacy Excel-column ids (A=name, B=phone, C=email) */
  data: ReadonlyArray<ImportContactRowParam>;
  /** Attach all imported contacts to this existing group */
  contact_group_id?: number | null;
  /**
   * Create a new group with this name and attach imported contacts to it (ignored when contact_group_id is set)
   */
  contact_group_name?: string | null;
}

/** Parameters of `client.callScenarios.list()`. */
export interface CallScenariosListParams {
  /** Array of integers representing dongle IDs */
  dongle_ids?: ReadonlyArray<number>;
  /** Filter by a fragment of the name, case-insensitive. */
  name?: string;
  /** Filter by a fragment of the dongle name, case-insensitive. */
  dongle_name?: string;
  /** Filter by a fragment of the dongle phone number, case-insensitive. */
  dongle_phone?: string;
  /**
   * Scenarios created at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * Scenarios created before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /** true - only scenarios without an audio file, false - only scenarios with one. */
  is_empty_file_id?: boolean;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /**
   * Attribute to sort by, sent together with order. One of: callScenarioId, name, callScenarioType, createdAt, updatedAt.
   */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.callScenarios.create()`. */
export interface CallScenariosCreateParams {
  name: string;
  is_call_record: boolean;
  dongle_id: number;
  call_scenario_type_id: number;
  /**
   * Temporary audio file: tmp_file_id returned by POST /file/upload-tmp or POST /file/generate-speech, `<2 hex>/<32 hex>/<file name>`.
   */
  tmp_file_id: string;
  call_scenario_contact_ids?: ReadonlyArray<number>;
  call_scenario_phones?: ReadonlyArray<string>;
  call_scenario_contact_group_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.callScenarios.update()`. */
export interface CallScenariosUpdateParams {
  name?: string;
  is_call_record?: boolean;
  call_scenario_type_id?: number;
  /**
   * Temporary audio file: tmp_file_id returned by POST /file/upload-tmp or POST /file/generate-speech, `<2 hex>/<32 hex>/<file name>`.
   */
  tmp_file_id?: string;
  call_scenario_contact_ids?: ReadonlyArray<number>;
  call_scenario_phones?: ReadonlyArray<string>;
  call_scenario_contact_group_ids?: ReadonlyArray<number>;
  /** Version of the scenario the client edited; a different current version answers 409 */
  version_uuid?: string;
}

/** Parameters of `client.followUpSmsSettings.list()`. */
export interface FollowUpSmsSettingsListParams {
  /** Array of dongle IDs */
  dongle_ids?: ReadonlyArray<number>;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Attribute to sort by, sent together with order. One of: followUpSmsSettingId, dongleId, name. */
  order_by?: string;
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.followUpSmsSettings.create()`. */
export interface FollowUpSmsSettingsCreateParams {
  dongle_id: number;
  name: string;
  text: string;
  ringing_duration_timeout?: number | null;
  call_duration_timeout?: number | null;
  daily_sms_limit?: number | null;
}

/** Parameters of `client.followUpSmsSettings.update()`. */
export interface FollowUpSmsSettingsUpdateParams {
  dongle_id: number;
  name: string;
  text: string;
  ringing_duration_timeout?: number | null;
  call_duration_timeout?: number | null;
  daily_sms_limit?: number | null;
}

/** Parameters of `client.dongles.setWifiCredentials()`. */
export interface DonglesSetWifiCredentialsParams {
  hotspot_name: string;
  hotspot_password: string;
}

/** Parameters of `client.dongles.enableWifiExtender()`. */
export interface DonglesEnableWifiExtenderParams {
  ssid: string;
  password: string;
  /** 2=ENABLED, 3=ENABLED_COMBINED */
  wifi_extender_mode: number;
}

/** Parameters of `client.dongles.updateOfflineNotification()`. */
export interface DonglesUpdateOfflineNotificationParams {
  /** Enable (true) or disable (false) email when the modem goes offline */
  is_enabled: boolean;
}

/** Parameters of `client.dongles.setNumber()`. */
export interface DonglesSetNumberParams {
  /** Phone number in international format. */
  number: string;
}

/** Parameters of `client.socksProxies.list()`. */
export interface SocksProxiesListParams {
  /** Filter by dongle ID */
  dongle_id?: number;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
}

/** Parameters of `client.socksProxies.create()`. */
export interface SocksProxiesCreateParams {
  dongle_id: number;
  password: string;
  /** Client IP addresses allowed to connect; an empty list allows any address. */
  allowed_ips: ReadonlyArray<string>;
}

/** Parameters of `client.socksProxies.update()`. */
export interface SocksProxiesUpdateParams {
  password: string;
  /**
   * Client IP addresses allowed to connect; an empty list allows any address. Replaces the list as a whole.
   */
  allowed_ips: ReadonlyArray<string>;
}

/** Parameters of `client.sms.list()`. */
export interface SmsListParams {
  /** Array of integers representing SMS type IDs */
  sms_type_ids?: ReadonlyArray<SmsType>;
  /** Array of integers representing mailing history IDs */
  mailing_history_ids?: ReadonlyArray<number>;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Array of integers representing dongle IDs */
  dongle_ids?: ReadonlyArray<number>;
  /** Name of the field to use for filtering by phone number */
  number?: string;
  /**
   * SMS created at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * SMS created before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /** Attribute to sort by, sent together with order. One of: createdAt, smsId, scheduledAt, updatedAt. */
  order_by?: 'createdAt' | 'smsId' | 'scheduledAt' | 'updatedAt';
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.dongles.update()`. */
export interface DonglesUpdateParams {
  /** Display name of the modem. */
  name?: string;
  /**
   * Phone number of the SIM in international format. Omit the field to keep the current number: null does not clear it.
   */
  number?: string;
  /** Reject incoming calls on the modem. */
  is_mute_incoming_call?: boolean;
  /** How incoming calls are handled: 1 - SIP (softphone), 2 - call scenario. */
  dongle_call_type_id?: number;
}

/** Parameters of `client.sms.listForDongle()`. */
export interface SmsListForDongleParams {
  /** Array of integers representing SMS type IDs */
  sms_type_ids?: ReadonlyArray<SmsType>;
  /** Name of the field to use for filtering by phone number */
  number?: string;
  /**
   * SMS created at or after this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * SMS created before this moment. `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
  /** Page number, 0-based. */
  page?: number;
  /** Number of items per page, 1 to 1000. */
  limit?: number;
  /** Attribute to sort by, sent together with order. One of: createdAt, smsId, scheduledAt, updatedAt. */
  order_by?: 'createdAt' | 'smsId' | 'scheduledAt' | 'updatedAt';
  /**
   * Sort direction, sent together with order_by. Without order_by and order the list is newest first: created_at descending, then the id descending.
   */
  order?: 'asc' | 'desc';
}

/** Parameters of `client.sms.update()`. */
export interface SmsUpdateParams {
  number?: string;
  message?: string;
  contact_id?: number;
  dongle_id?: number;
  scheduled_at?: string | Date | null;
}

/** Parameters of `client.calls.create()`. */
export interface CallsCreateParams {
  /** Phone number to call, in international format. */
  number?: string;
  /** Contact whose phone is called; an alternative to number. */
  contact_id?: number;
}

/** Parameters of `client.sipUsers.list()`. */
export interface SipUsersListParams {
  /** Array of integers representing dongle call type IDs */
  dongle_call_type_ids?: ReadonlyArray<number>;
}

/** Parameters of `client.dongles.listStatistics()`. */
export interface DonglesListStatisticsParams {
  /**
   * Samples taken after this moment (exclusive). `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  from?: string | Date;
  /**
   * Samples taken before this moment (exclusive). `YYYY-MM-DD HH:MM:SS` in UTC or an RFC 3339 date-time with an offset (`2020-01-01T00:00:00Z`, `2020-01-01T03:00:00+03:00`, fractional seconds allowed); any other value answers 400 PARSING_DATE_TIME_EXCEPTION.
   */
  to?: string | Date;
}

/** Parameters of `client.files.uploadTmp()`. */
export interface FilesUploadTmpParams {
  /** Content of the audio file, base64-encoded. */
  file_base64: string;
  /** Name of the file; it becomes the last segment of tmp_file_id. */
  file_name: string;
  /**
   * The only upload scenario: the audio is converted to the modem format (wav) and stored as a temporary file.
   */
  scenario?: 'SCENARIO_CONVERT_TO_DONGLE_AUDIO_AND_UPLOAD_TMP';
}

/** Parameters of `client.files.generateSpeech()`. */
export interface FilesGenerateSpeechParams {
  /** Text to synthesise. */
  text: string;
  voice: 'onyx' | 'echo' | 'shimmer' | 'nova';
  language: 'en-GB' | 'it-IT' | 'tr-TR' | 'de-DE' | 'es-ES' | 'pt-PT' | 'fr-FR';
}
