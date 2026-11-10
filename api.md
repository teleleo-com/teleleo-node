# API reference

Every method of the `Teleleo` client, generated from [`spec/openapi.yaml`](spec/openapi.yaml). Types are exported from the package root.

## `client.dongles`

Modems of the account and their commands: reboot, Wi-Fi, Wi-Fi extender, number, network info.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /dongle` | `PagePromise<DongleListItem>` | List modems |
| `reboot(dongleId)` | `POST /dongle/{dongle_id}/reboot` | `Promise<boolean>` | Reboot modem |
| `enableWifi(dongleId)` | `POST /dongle/{dongle_id}/wifi/enable` | `Promise<boolean>` | Enable modem Wi-Fi |
| `disableWifi(dongleId)` | `POST /dongle/{dongle_id}/wifi/disable` | `Promise<boolean>` | Disable modem Wi-Fi |
| `setWifiCredentials(dongleId, params)` | `POST /dongle/{dongle_id}/wifi/credentials` | `Promise<boolean>` | Set modem Wi-Fi credentials |
| `enableWifiExtender(dongleId, params)` | `POST /dongle/{dongle_id}/wifi-extender/enable` | `Promise<boolean>` | Enable Wi-Fi extender |
| `disableWifiExtender(dongleId)` | `POST /dongle/{dongle_id}/wifi-extender/disable` | `Promise<boolean>` | Disable Wi-Fi extender |
| `scanWifiNetworks(dongleId)` | `POST /dongle/{dongle_id}/wifi-extender/networks` | `Promise<boolean>` | Scan Wi-Fi networks |
| `updateOfflineNotification(dongleId, params)` | `PUT /dongle/{dongle_id}/setting/offline-notification` | `Promise<boolean>` | Set offline notification |
| `setNumber(dongleId, params)` | `PUT /dongle/{dongle_id}/number` | `Promise<boolean>` | Set modem number |
| `get(dongleId)` | `GET /dongle/{dongle_id}` | `Promise<Dongle>` | Get modem |
| `update(dongleId, params?)` | `PUT /dongle/{dongle_id}` | `Promise<Dongle>` | Update modem |
| `getNetworkInfo(dongleId)` | `POST /dongle/{dongle_id}/mobile-network-info` | `Promise<DongleNetworkInfo>` | Get modem network info |
| `getSimIdentifiers(dongleId)` | `POST /dongle/{dongle_id}/mobile-network-ids` | `Promise<DongleSimIdentifiers>` | Get modem SIM identifiers |
| `listStatistics(dongleId, params?)` | `GET /dongle/{dongle_id}/statistic` | `Promise<Array<DongleStatistic>>` | List modem traffic statistics |

## `client.sms`

SMS of the modems: history, sending, replies, threads.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `send(dongleId, params)` | `POST /dongle/{dongle_id}/outgoing-sms` | `Promise<Sms>` | Send SMS |
| `sendToContact(dongleId, params)` | `POST /dongle/{dongle_id}/outgoing-contact-sms` | `Promise<Sms>` | Send SMS to contact |
| `reply(dongleId, params)` | `POST /dongle/{dongle_id}/reply-sms` | `Promise<Sms>` | Reply to SMS |
| `listThreads(params?)` | `GET /sms/thread` | `PagePromise<SmsThread>` | List SMS threads |
| `list(params?)` | `GET /sms` | `PagePromise<Sms>` | List SMS |
| `listForDongle(dongleId, params?)` | `GET /dongle/{dongle_id}/sms` | `PagePromise<Sms>` | List modem SMS |
| `get(dongleId, smsId)` | `GET /dongle/{dongle_id}/sms/{sms_id}` | `Promise<Sms>` | Get SMS |
| `update(dongleId, smsId, params?)` | `PUT /dongle/{dongle_id}/sms/{sms_id}` | `Promise<Sms>` | Update SMS |
| `delete(dongleId, smsId)` | `DELETE /dongle/{dongle_id}/sms/{sms_id}` | `Promise<void>` | Delete SMS |

## `client.calls`

Calls of the modems: history, outgoing calls.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /call` | `PagePromise<Call>` | List calls |
| `create(dongleId, params?)` | `POST /dongle/{dongle_id}/call` | `Promise<Call>` | Make call |
| `get(dongleId, callId)` | `GET /dongle/{dongle_id}/call/{call_id}` | `Promise<Call>` | Get call |
| `delete(dongleId, callId)` | `DELETE /dongle/{dongle_id}/call/{call_id}` | `Promise<void>` | Delete call |

## `client.ussd`

USSD requests through a modem.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(dongleId, params?)` | `GET /dongle/{dongle_id}/ussd` | `PagePromise<Ussd>` | List USSD requests |
| `send(dongleId, params)` | `POST /dongle/{dongle_id}/ussd` | `Promise<Ussd>` | Send USSD |
| `get(dongleId, ussdId)` | `GET /dongle/{dongle_id}/ussd/{ussd_id}` | `Promise<Ussd>` | Get USSD request |
| `delete(dongleId, ussdId)` | `DELETE /dongle/{dongle_id}/ussd/{ussd_id}` | `Promise<boolean>` | Delete USSD request |
| `deleteAll(dongleId)` | `DELETE /dongle/{dongle_id}/ussds` | `Promise<boolean>` | Delete USSD history |

## `client.contacts`

Address book of the account.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /contact` | `PagePromise<Contact>` | List contacts |
| `create(params)` | `POST /contact` | `Promise<Contact>` | Create contact |
| `get(contactId)` | `GET /contact/{contact_id}` | `Promise<Contact>` | Get contact |
| `update(contactId, params)` | `PUT /contact/{contact_id}` | `Promise<Contact>` | Update contact |
| `delete(contactId)` | `DELETE /contact/{contact_id}` | `Promise<boolean>` | Delete contact |
| `importContacts(params)` | `POST /contact/import` | `Promise<ContactImportResult>` | Import contacts |

## `client.contactGroups`

Groups of contacts, used by mailings, call scenarios and redirections.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /contact-group` | `PagePromise<ContactGroup>` | List contact groups |
| `create(params)` | `POST /contact-group` | `Promise<ContactGroup>` | Create contact group |
| `get(contactGroupId)` | `GET /contact-group/{contact_group_id}` | `Promise<ContactGroup>` | Get contact group |
| `update(contactGroupId, params)` | `PUT /contact-group/{contact_group_id}` | `Promise<ContactGroup>` | Update contact group |
| `delete(contactGroupId)` | `DELETE /contact-group/{contact_group_id}` | `Promise<boolean>` | Delete contact group |

## `client.mailings`

Bulk SMS and call campaigns.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /mailing` | `PagePromise<Mailing>` | List mailings |
| `create(params)` | `POST /mailing` | `Promise<Mailing>` | Create mailing |
| `createSms(params)` | `POST /mailing/sms` | `Promise<Mailing>` | Create SMS mailing |
| `createCall(params)` | `POST /mailing/call` | `Promise<Mailing>` | Create call mailing |
| `get(mailingId)` | `GET /mailing/{mailing_id}` | `Promise<Mailing>` | Get mailing |
| `update(mailingId, params?)` | `PUT /mailing/{mailing_id}` | `Promise<Mailing>` | Update mailing |
| `delete(mailingId)` | `DELETE /mailing/{mailing_id}` | `Promise<boolean>` | Delete mailing |

## `client.redirections`

Rules for incoming SMS and calls: forwarding, auto reply, HTTP callback.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /redirection` | `PagePromise<Redirection>` | List redirections |
| `create(params)` | `POST /redirection` | `Promise<Redirection>` | Create redirection |
| `get(redirectionId)` | `GET /redirection/{redirection_id}` | `Promise<Redirection>` | Get redirection |
| `update(redirectionId, params)` | `PUT /redirection/{redirection_id}` | `Promise<Redirection>` | Update redirection |
| `delete(redirectionId)` | `DELETE /redirection/{redirection_id}` | `Promise<boolean>` | Delete redirection |

## `client.callScenarios`

What a modem plays to incoming callers.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /call-scenario` | `PagePromise<CallScenario>` | List call scenarios |
| `create(params)` | `POST /call-scenario` | `Promise<CallScenario>` | Create call scenario |
| `get(callScenarioId)` | `GET /call-scenario/{call_scenario_id}` | `Promise<CallScenario>` | Get call scenario |
| `update(callScenarioId, params?)` | `PUT /call-scenario/{call_scenario_id}` | `Promise<CallScenario>` | Update call scenario |
| `delete(callScenarioId)` | `DELETE /call-scenario/{call_scenario_id}` | `Promise<boolean>` | Delete call scenario |
| `retry(callScenarioId)` | `POST /call-scenario/{call_scenario_id}/retry` | `Promise<CallScenario>` | Retry call scenario delivery |

## `client.followUpSmsSettings`

SMS a modem sends to a caller after a call.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /follow-up-sms-setting` | `PagePromise<FollowUpSmsSetting>` | List follow-up SMS settings |
| `create(params)` | `POST /follow-up-sms-setting` | `Promise<FollowUpSmsSetting>` | Create follow-up SMS setting |
| `get(followUpSmsSettingId)` | `GET /follow-up-sms-setting/{follow_up_sms_setting_id}` | `Promise<FollowUpSmsSetting>` | Get follow-up SMS setting |
| `update(followUpSmsSettingId, params)` | `PUT /follow-up-sms-setting/{follow_up_sms_setting_id}` | `Promise<FollowUpSmsSetting>` | Update follow-up SMS setting |
| `delete(followUpSmsSettingId)` | `DELETE /follow-up-sms-setting/{follow_up_sms_setting_id}` | `Promise<boolean>` | Delete follow-up SMS setting |

## `client.publicVpn`

VPN access through a modem.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `enable(dongleId)` | `POST /dongle/{dongle_id}/public-vpn/enable` | `Promise<boolean>` | Enable public VPN |
| `disable(dongleId)` | `POST /dongle/{dongle_id}/public-vpn/disable` | `Promise<boolean>` | Disable public VPN |
| `refreshPassword(dongleId)` | `POST /dongle/{dongle_id}/public-vpn/refresh-password` | `Promise<boolean>` | Refresh public VPN password |
| `listSessions()` | `GET /public-vpn/connect-session-list` | `Promise<Array<PublicVpnSession>>` | List public VPN sessions |

## `client.socksProxies`

SOCKS5 proxy through the mobile network of a modem.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /dongle-socks-proxy` | `PagePromise<DongleSocksProxy>` | List SOCKS proxies |
| `create(params)` | `POST /dongle-socks-proxy` | `Promise<DongleSocksProxy>` | Create SOCKS proxy |
| `get(dongleSocksProxyId)` | `GET /dongle-socks-proxy/{dongle_socks_proxy_id}` | `Promise<DongleSocksProxy>` | Get SOCKS proxy |
| `update(dongleSocksProxyId, params)` | `PUT /dongle-socks-proxy/{dongle_socks_proxy_id}` | `Promise<DongleSocksProxy>` | Update SOCKS proxy |
| `delete(dongleSocksProxyId)` | `DELETE /dongle-socks-proxy/{dongle_socks_proxy_id}` | `Promise<boolean>` | Delete SOCKS proxy |

## `client.sipUsers`

SIP accounts of the modems.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `list(params?)` | `GET /sip-user` | `Promise<Array<PbxSipUser>>` | List SIP users |
| `get(sipUserId)` | `GET /sip-user/{sip_user_id}` | `Promise<PbxSipUser>` | Get SIP user |

## `client.files`

Downloads, temporary audio uploads and text-to-speech.

| Method | HTTP | Returns | Description |
|---|---|---|---|
| `download(fileId)` | `GET /file/{file_id}` | `Promise<Uint8Array>` | Get file |
| `downloadTmp(fileId)` | `GET /file/tmp/{file_id}` | `Promise<Uint8Array>` | Get temporary file |
| `uploadTmp(params)` | `POST /file/upload-tmp` | `Promise<TmpFile>` | Upload temporary file |
| `generateSpeech(params)` | `POST /file/generate-speech` | `Promise<TmpFile>` | Generate speech |
