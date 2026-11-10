// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.

import type { BaseClient } from '../core.js';
import { DonglesResource } from './dongles.js';
import { SmsResource } from './sms.js';
import { CallsResource } from './calls.js';
import { UssdResource } from './ussd.js';
import { ContactsResource } from './contacts.js';
import { ContactGroupsResource } from './contact-groups.js';
import { MailingsResource } from './mailings.js';
import { RedirectionsResource } from './redirections.js';
import { CallScenariosResource } from './call-scenarios.js';
import { FollowUpSmsSettingsResource } from './follow-up-sms-settings.js';
import { PublicVpnResource } from './public-vpn.js';
import { SocksProxiesResource } from './socks-proxies.js';
import { SipUsersResource } from './sip-users.js';
import { FilesResource } from './files.js';

export {
  DonglesResource,
  SmsResource,
  CallsResource,
  UssdResource,
  ContactsResource,
  ContactGroupsResource,
  MailingsResource,
  RedirectionsResource,
  CallScenariosResource,
  FollowUpSmsSettingsResource,
  PublicVpnResource,
  SocksProxiesResource,
  SipUsersResource,
  FilesResource,
};

/** Resource groups of the client. */
export interface Resources {
  /** Modems of the account and their commands: reboot, Wi-Fi, Wi-Fi extender, number, network info. */
  readonly dongles: DonglesResource;
  /** SMS of the modems: history, sending, replies, threads. */
  readonly sms: SmsResource;
  /** Calls of the modems: history, outgoing calls. */
  readonly calls: CallsResource;
  /** USSD requests through a modem. */
  readonly ussd: UssdResource;
  /** Address book of the account. */
  readonly contacts: ContactsResource;
  /** Groups of contacts, used by mailings, call scenarios and redirections. */
  readonly contactGroups: ContactGroupsResource;
  /** Bulk SMS and call campaigns. */
  readonly mailings: MailingsResource;
  /** Rules for incoming SMS and calls: forwarding, auto reply, HTTP callback. */
  readonly redirections: RedirectionsResource;
  /** What a modem plays to incoming callers. */
  readonly callScenarios: CallScenariosResource;
  /** SMS a modem sends to a caller after a call. */
  readonly followUpSmsSettings: FollowUpSmsSettingsResource;
  /** VPN access through a modem. */
  readonly publicVpn: PublicVpnResource;
  /** SOCKS5 proxy through the mobile network of a modem. */
  readonly socksProxies: SocksProxiesResource;
  /** SIP accounts of the modems. */
  readonly sipUsers: SipUsersResource;
  /** Downloads, temporary audio uploads and text-to-speech. */
  readonly files: FilesResource;
}

/** @internal */
export function createResources(client: BaseClient): Resources {
  return {
    dongles: new DonglesResource(client),
    sms: new SmsResource(client),
    calls: new CallsResource(client),
    ussd: new UssdResource(client),
    contacts: new ContactsResource(client),
    contactGroups: new ContactGroupsResource(client),
    mailings: new MailingsResource(client),
    redirections: new RedirectionsResource(client),
    callScenarios: new CallScenariosResource(client),
    followUpSmsSettings: new FollowUpSmsSettingsResource(client),
    publicVpn: new PublicVpnResource(client),
    socksProxies: new SocksProxiesResource(client),
    sipUsers: new SipUsersResource(client),
    files: new FilesResource(client),
  };
}
