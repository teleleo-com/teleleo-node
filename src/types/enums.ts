// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

/**
 * 1: Pending (the dongle has not confirmed the current version yet), 2: Active (the dongle applied the current version; on firmware without apply reports, accepted it), 3: Not delivered (the current version is not on the dongle, see call_scenario_delivery_error_id), 4: Failed (the dongle could not apply it, see apply_error_code)
 */
export const CallScenarioApplyStatus = {
  /** Pending (the dongle has not confirmed the current version yet) */
  PENDING: 1,
  /** Active (the dongle applied the current version; on firmware without apply reports, accepted it) */
  ACTIVE: 2,
  /** Not delivered (the current version is not on the dongle, see call_scenario_delivery_error_id) */
  NOT_DELIVERED: 3,
  /** Failed (the dongle could not apply it, see apply_error_code) */
  FAILED: 4,
} as const;
/**
 * 1: Pending (the dongle has not confirmed the current version yet), 2: Active (the dongle applied the current version; on firmware without apply reports, accepted it), 3: Not delivered (the current version is not on the dongle, see call_scenario_delivery_error_id), 4: Failed (the dongle could not apply it, see apply_error_code)
 */
export type CallScenarioApplyStatus = (typeof CallScenarioApplyStatus)[keyof typeof CallScenarioApplyStatus];

/**
 * 1: Dongle unreachable (no answer; it may still have received the push), 2: Dongle busy (still applying the previous push), 3: Dongle rejected the scenario, 4: Subscription inactive (taken off the dongle until the subscription is renewed)
 */
export const CallScenarioDeliveryError = {
  /** Dongle unreachable (no answer; it may still have received the push) */
  DONGLE_UNREACHABLE: 1,
  /** Dongle busy (still applying the previous push) */
  DONGLE_BUSY: 2,
  /** Dongle rejected the scenario */
  DONGLE_REJECTED_THE_SCENARIO: 3,
  /** Subscription inactive (taken off the dongle until the subscription is renewed) */
  SUBSCRIPTION_INACTIVE: 4,
} as const;
/**
 * 1: Dongle unreachable (no answer; it may still have received the push), 2: Dongle busy (still applying the previous push), 3: Dongle rejected the scenario, 4: Subscription inactive (taken off the dongle until the subscription is renewed)
 */
export type CallScenarioDeliveryError =
  (typeof CallScenarioDeliveryError)[keyof typeof CallScenarioDeliveryError];

/** 1: Dongle incoming simple */
export const CallScenarioType = {
  /** Dongle incoming simple */
  DONGLE_INCOMING_SIMPLE: 1,
} as const;
/** 1: Dongle incoming simple */
export type CallScenarioType = (typeof CallScenarioType)[keyof typeof CallScenarioType];

/** 1: Created, 2: Enqueued, 3: Sent, 4: Received (answered), 5: Not received, 6: Canceled, 7: Missed */
export const CallStatus = {
  /** Created */
  CREATED: 1,
  /** Enqueued */
  ENQUEUED: 2,
  /** Sent */
  SENT: 3,
  /** Received (answered) */
  RECEIVED: 4,
  /** Not received */
  NOT_RECEIVED: 5,
  /** Canceled */
  CANCELED: 6,
  /** Missed */
  MISSED: 7,
} as const;
/** 1: Created, 2: Enqueued, 3: Sent, 4: Received (answered), 5: Not received, 6: Canceled, 7: Missed */
export type CallStatus = (typeof CallStatus)[keyof typeof CallStatus];

/** 1: Outgoing, 2: Incoming, 3: Robotics incoming, 4: Robotics outgoing */
export const CallType = {
  /** Outgoing */
  OUTGOING: 1,
  /** Incoming */
  INCOMING: 2,
  /** Robotics incoming */
  ROBOTICS_INCOMING: 3,
  /** Robotics outgoing */
  ROBOTICS_OUTGOING: 4,
} as const;
/** 1: Outgoing, 2: Incoming, 3: Robotics incoming, 4: Robotics outgoing */
export type CallType = (typeof CallType)[keyof typeof CallType];

/** 1: Phone determination error, 2: Timeout error, 3: Unexpected error, 4: Health check failed error */
export const DongleOnlineErrorCode = {
  /** Phone determination error */
  PHONE_DETERMINATION_ERROR: 1,
  /** Timeout error */
  TIMEOUT_ERROR: 2,
  /** Unexpected error */
  UNEXPECTED_ERROR: 3,
  /** Health check failed error */
  HEALTH_CHECK_FAILED_ERROR: 4,
} as const;
/** 1: Phone determination error, 2: Timeout error, 3: Unexpected error, 4: Health check failed error */
export type DongleOnlineErrorCode = (typeof DongleOnlineErrorCode)[keyof typeof DongleOnlineErrorCode];

/**
 * 1: Offline, 2: Online processing (connecting), 3: Error (see dongle_online_error_code_id), 4: Manual phone determination, 5: Online, 6: Updating, 7: Rebooting (set at once by POST /dongle/{dongle_id}/reboot)
 */
export const DongleOnlineStatus = {
  /** Offline */
  OFFLINE: 1,
  /** Online processing (connecting) */
  ONLINE_PROCESSING: 2,
  /** Error (see dongle_online_error_code_id) */
  ERROR: 3,
  /** Manual phone determination */
  MANUAL_PHONE_DETERMINATION: 4,
  /** Online */
  ONLINE: 5,
  /** Updating */
  UPDATING: 6,
  /** Rebooting (set at once by POST /dongle/{dongle_id}/reboot) */
  REBOOTING: 7,
} as const;
/**
 * 1: Offline, 2: Online processing (connecting), 3: Error (see dongle_online_error_code_id), 4: Manual phone determination, 5: Online, 6: Updating, 7: Rebooting (set at once by POST /dongle/{dongle_id}/reboot)
 */
export type DongleOnlineStatus = (typeof DongleOnlineStatus)[keyof typeof DongleOnlineStatus];

/** 1: Bad, 2: Medium, 3: Good */
export const DongleSignalQuality = {
  /** Bad */
  BAD: 1,
  /** Medium */
  MEDIUM: 2,
  /** Good */
  GOOD: 3,
} as const;
/** 1: Bad, 2: Medium, 3: Good */
export type DongleSignalQuality = (typeof DongleSignalQuality)[keyof typeof DongleSignalQuality];

/** 1: Less than 1 minute, 2: 1-3 minutes, 3: 3-5 minutes, 4: More than 5 minutes */
export const DurationPreset = {
  /** Less than 1 minute */
  LESS_THAN_1_MINUTE: 1,
  /** 1-3 minutes */
  FROM_1_TO_3_MINUTES: 2,
  /** 3-5 minutes */
  FROM_3_TO_5_MINUTES: 3,
  /** More than 5 minutes */
  MORE_THAN_5_MINUTES: 4,
} as const;
/** 1: Less than 1 minute, 2: 1-3 minutes, 3: 3-5 minutes, 4: More than 5 minutes */
export type DurationPreset = (typeof DurationPreset)[keyof typeof DurationPreset];

/** 1: Sms, 2: Call */
export const MailingEntityType = {
  /** Sms */
  SMS: 1,
  /** Call */
  CALL: 2,
} as const;
/** 1: Sms, 2: Call */
export type MailingEntityType = (typeof MailingEntityType)[keyof typeof MailingEntityType];

/** 1: Draft, 2: Planned, 3: In process, 4: Ended, 5: Canceled */
export const MailingStatus = {
  /** Draft */
  DRAFT: 1,
  /** Planned */
  PLANNED: 2,
  /** In process */
  IN_PROCESS: 3,
  /** Ended */
  ENDED: 4,
  /** Canceled */
  CANCELED: 5,
} as const;
/** 1: Draft, 2: Planned, 3: In process, 4: Ended, 5: Canceled */
export type MailingStatus = (typeof MailingStatus)[keyof typeof MailingStatus];

/** 1: Simple (sent at once), 2: Delayed (sent at scheduled_at) */
export const MailingType = {
  /** Simple (sent at once) */
  SIMPLE: 1,
  /** Delayed (sent at scheduled_at) */
  DELAYED: 2,
} as const;
/** 1: Simple (sent at once), 2: Delayed (sent at scheduled_at) */
export type MailingType = (typeof MailingType)[keyof typeof MailingType];

/** 1: Sms, 2: Call, 3: Auto reply, 4: Silent, 5: Http */
export const RedirectionType = {
  /** Sms */
  SMS: 1,
  /** Call */
  CALL: 2,
  /** Auto reply */
  AUTO_REPLY: 3,
  /** Silent */
  SILENT: 4,
  /** Http */
  HTTP: 5,
} as const;
/** 1: Sms, 2: Call, 3: Auto reply, 4: Silent, 5: Http */
export type RedirectionType = (typeof RedirectionType)[keyof typeof RedirectionType];

/** 1: Local, 2: International, 3: Short (short code or alphanumeric sender) */
export const SmsSourceType = {
  /** Local */
  LOCAL: 1,
  /** International */
  INTERNATIONAL: 2,
  /** Short (short code or alphanumeric sender) */
  SHORT: 3,
} as const;
/** 1: Local, 2: International, 3: Short (short code or alphanumeric sender) */
export type SmsSourceType = (typeof SmsSourceType)[keyof typeof SmsSourceType];

/**
 * 1: Sended - accepted by the mobile network (about a second after creation), not delivered to the handset; 2: Received (incoming); 3: Not received - the network refused it; 4: Created; 5: Enqueued; 6: Canceled; 7: Incoming incomplete - not every part of a multipart SMS arrived
 */
export const SmsStatus = {
  /**
   * Sended - accepted by the mobile network (about a second after creation), not delivered to the handset
   */
  SENT: 1,
  /** Received (incoming) */
  RECEIVED: 2,
  /** Not received - the network refused it */
  NOT_RECEIVED: 3,
  /** Created */
  CREATED: 4,
  /** Enqueued */
  ENQUEUED: 5,
  /** Canceled */
  CANCELED: 6,
  /** Incoming incomplete - not every part of a multipart SMS arrived */
  INCOMING_INCOMPLETE: 7,
} as const;
/**
 * 1: Sended - accepted by the mobile network (about a second after creation), not delivered to the handset; 2: Received (incoming); 3: Not received - the network refused it; 4: Created; 5: Enqueued; 6: Canceled; 7: Incoming incomplete - not every part of a multipart SMS arrived
 */
export type SmsStatus = (typeof SmsStatus)[keyof typeof SmsStatus];

/** 1: Outgoing, 2: Incoming, 3: Auto reply, 4: Reply, 5: Delayed (scheduled), 6: Mailing, 7: Silent */
export const SmsType = {
  /** Outgoing */
  OUTGOING: 1,
  /** Incoming */
  INCOMING: 2,
  /** Auto reply */
  AUTO_REPLY: 3,
  /** Reply */
  REPLY: 4,
  /** Delayed (scheduled) */
  DELAYED: 5,
  /** Mailing */
  MAILING: 6,
  /** Silent */
  SILENT: 7,
} as const;
/** 1: Outgoing, 2: Incoming, 3: Auto reply, 4: Reply, 5: Delayed (scheduled), 6: Mailing, 7: Silent */
export type SmsType = (typeof SmsType)[keyof typeof SmsType];

/** 1: Created, 2: Sending, 3: Success, 4: Error */
export const UssdStatus = {
  /** Created */
  CREATED: 1,
  /** Sending */
  SENDING: 2,
  /** Success */
  SUCCESS: 3,
  /** Error */
  ERROR: 4,
} as const;
/** 1: Created, 2: Sending, 3: Success, 4: Error */
export type UssdStatus = (typeof UssdStatus)[keyof typeof UssdStatus];

/** 1: Incoming, 2: Outgoing */
export const UssdType = {
  /** Incoming */
  INCOMING: 1,
  /** Outgoing */
  OUTGOING: 2,
} as const;
/** 1: Incoming, 2: Outgoing */
export type UssdType = (typeof UssdType)[keyof typeof UssdType];
