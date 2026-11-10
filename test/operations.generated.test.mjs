// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.
// One request per operation of the spec: method, path, auth header, required body fields and the result shape.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import Teleleo, { Page } from '../dist/index.js';

const BASE_URL = 'https://api.example.test/react_api';

const CASES = [
  {
    resource: 'calls',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/call',
    response: {
      data: {
        calls: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'contacts',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/contact',
    response: {
      data: {
        contacts: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'contacts',
    method: 'create',
    args: [
      {
        phone: 'x',
        name: 'x',
        contact_group_ids: [1],
      },
    ],
    http: 'POST',
    path: '/contact',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['phone', 'name', 'contact_group_ids'],
  },
  {
    resource: 'contacts',
    method: 'get',
    args: [1003],
    http: 'GET',
    path: '/contact/1003',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'contacts',
    method: 'update',
    args: [
      1004,
      {
        phone: 'x',
        name: 'x',
        contact_group_ids: [1],
      },
    ],
    http: 'PUT',
    path: '/contact/1004',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['phone', 'name', 'contact_group_ids'],
  },
  {
    resource: 'contacts',
    method: 'delete',
    args: [1005],
    http: 'DELETE',
    path: '/contact/1005',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'contactGroups',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/contact-group',
    response: {
      data: {
        contact_groups: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'contactGroups',
    method: 'create',
    args: [
      {
        name: 'x',
        contact_ids: [1],
      },
    ],
    http: 'POST',
    path: '/contact-group',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'contact_ids'],
  },
  {
    resource: 'contactGroups',
    method: 'get',
    args: [1008],
    http: 'GET',
    path: '/contact-group/1008',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'contactGroups',
    method: 'update',
    args: [
      1009,
      {
        name: 'x',
        contact_ids: [1],
      },
    ],
    http: 'PUT',
    path: '/contact-group/1009',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'contact_ids'],
  },
  {
    resource: 'contactGroups',
    method: 'delete',
    args: [1010],
    http: 'DELETE',
    path: '/contact-group/1010',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/dongle',
    response: {
      data: {
        dongles: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'reboot',
    args: [1012],
    http: 'POST',
    path: '/dongle/1012/reboot',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'mailings',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/mailing',
    response: {
      data: {
        mailings: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'mailings',
    method: 'create',
    args: [
      {
        name: 'x',
        mailing_type_id: 1,
        mailing_entity_type_id: 1,
        dongle_id: 1,
      },
    ],
    http: 'POST',
    path: '/mailing',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'mailing_type_id', 'mailing_entity_type_id', 'dongle_id'],
  },
  {
    resource: 'mailings',
    method: 'createSms',
    args: [
      {
        name: 'x',
        text: 'x',
        mailing_type_id: 1,
        dongle_id: 1,
      },
    ],
    http: 'POST',
    path: '/mailing/sms',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'text', 'mailing_type_id', 'dongle_id'],
  },
  {
    resource: 'mailings',
    method: 'createCall',
    args: [
      {
        name: 'x',
        mailing_type_id: 1,
        dongle_id: 1,
      },
    ],
    http: 'POST',
    path: '/mailing/call',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'mailing_type_id', 'dongle_id'],
  },
  {
    resource: 'mailings',
    method: 'get',
    args: [1017],
    http: 'GET',
    path: '/mailing/1017',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'mailings',
    method: 'update',
    args: [1018],
    http: 'PUT',
    path: '/mailing/1018',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'mailings',
    method: 'delete',
    args: [1019],
    http: 'DELETE',
    path: '/mailing/1019',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'redirections',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/redirection',
    response: {
      data: {
        redirections: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'redirections',
    method: 'create',
    args: [
      {
        condition: {},
        name: 'x',
        params: {},
        redirection_type_id: 1,
      },
    ],
    http: 'POST',
    path: '/redirection',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['condition', 'name', 'params', 'redirection_type_id'],
  },
  {
    resource: 'redirections',
    method: 'get',
    args: [1022],
    http: 'GET',
    path: '/redirection/1022',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'redirections',
    method: 'update',
    args: [
      1023,
      {
        condition: {},
        name: 'x',
        params: {},
        redirection_type_id: 1,
      },
    ],
    http: 'PUT',
    path: '/redirection/1023',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['condition', 'name', 'params', 'redirection_type_id'],
  },
  {
    resource: 'redirections',
    method: 'delete',
    args: [1024],
    http: 'DELETE',
    path: '/redirection/1024',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'ussd',
    method: 'list',
    args: [1025],
    http: 'GET',
    path: '/dongle/1025/ussd',
    response: {
      data: {
        ussds: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'ussd',
    method: 'send',
    args: [
      1026,
      {
        command: 'x',
      },
    ],
    http: 'POST',
    path: '/dongle/1026/ussd',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['command'],
  },
  {
    resource: 'ussd',
    method: 'get',
    args: [1027, 1027],
    http: 'GET',
    path: '/dongle/1027/ussd/1027',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'ussd',
    method: 'delete',
    args: [1028, 1028],
    http: 'DELETE',
    path: '/dongle/1028/ussd/1028',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'send',
    args: [
      1029,
      {
        number: 'x',
        message: 'x',
      },
    ],
    http: 'POST',
    path: '/dongle/1029/outgoing-sms',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['number', 'message'],
  },
  {
    resource: 'sms',
    method: 'sendToContact',
    args: [
      1030,
      {
        contact_id: 1,
        message: 'x',
      },
    ],
    http: 'POST',
    path: '/dongle/1030/outgoing-contact-sms',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['contact_id', 'message'],
  },
  {
    resource: 'sms',
    method: 'reply',
    args: [
      1031,
      {
        replied_to_sms_id: 1,
        message: 'x',
      },
    ],
    http: 'POST',
    path: '/dongle/1031/reply-sms',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['replied_to_sms_id', 'message'],
  },
  {
    resource: 'ussd',
    method: 'deleteAll',
    args: [1032],
    http: 'DELETE',
    path: '/dongle/1032/ussds',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'listThreads',
    args: [],
    http: 'GET',
    path: '/sms/thread',
    response: {
      data: {
        sms_threads: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'contacts',
    method: 'importContacts',
    args: [
      {
        data: [{}],
      },
    ],
    http: 'POST',
    path: '/contact/import',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['data'],
  },
  {
    resource: 'callScenarios',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/call-scenario',
    response: {
      data: {
        call_scenarios: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'callScenarios',
    method: 'create',
    args: [
      {
        name: 'x',
        is_call_record: true,
        dongle_id: 1,
        call_scenario_type_id: 1,
        tmp_file_id: 'x',
      },
    ],
    http: 'POST',
    path: '/call-scenario',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['name', 'is_call_record', 'dongle_id', 'call_scenario_type_id', 'tmp_file_id'],
  },
  {
    resource: 'callScenarios',
    method: 'get',
    args: [1037],
    http: 'GET',
    path: '/call-scenario/1037',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'callScenarios',
    method: 'update',
    args: [1038],
    http: 'PUT',
    path: '/call-scenario/1038',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'callScenarios',
    method: 'delete',
    args: [1039],
    http: 'DELETE',
    path: '/call-scenario/1039',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'callScenarios',
    method: 'retry',
    args: [1040],
    http: 'POST',
    path: '/call-scenario/1040/retry',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'followUpSmsSettings',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/follow-up-sms-setting',
    response: {
      data: {
        follow_up_sms_settings: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'followUpSmsSettings',
    method: 'create',
    args: [
      {
        dongle_id: 1,
        name: 'x',
        text: 'x',
      },
    ],
    http: 'POST',
    path: '/follow-up-sms-setting',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['dongle_id', 'name', 'text'],
  },
  {
    resource: 'followUpSmsSettings',
    method: 'get',
    args: [1043],
    http: 'GET',
    path: '/follow-up-sms-setting/1043',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'followUpSmsSettings',
    method: 'update',
    args: [
      1044,
      {
        dongle_id: 1,
        name: 'x',
        text: 'x',
      },
    ],
    http: 'PUT',
    path: '/follow-up-sms-setting/1044',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['dongle_id', 'name', 'text'],
  },
  {
    resource: 'followUpSmsSettings',
    method: 'delete',
    args: [1045],
    http: 'DELETE',
    path: '/follow-up-sms-setting/1045',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'enableWifi',
    args: [1046],
    http: 'POST',
    path: '/dongle/1046/wifi/enable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'disableWifi',
    args: [1047],
    http: 'POST',
    path: '/dongle/1047/wifi/disable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'setWifiCredentials',
    args: [
      1048,
      {
        hotspot_name: 'x',
        hotspot_password: 'x',
      },
    ],
    http: 'POST',
    path: '/dongle/1048/wifi/credentials',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: ['hotspot_name', 'hotspot_password'],
  },
  {
    resource: 'dongles',
    method: 'enableWifiExtender',
    args: [
      1049,
      {
        ssid: 'x',
        password: 'x',
        wifi_extender_mode: 1,
      },
    ],
    http: 'POST',
    path: '/dongle/1049/wifi-extender/enable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: ['ssid', 'password', 'wifi_extender_mode'],
  },
  {
    resource: 'dongles',
    method: 'disableWifiExtender',
    args: [1050],
    http: 'POST',
    path: '/dongle/1050/wifi-extender/disable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'scanWifiNetworks',
    args: [1051],
    http: 'POST',
    path: '/dongle/1051/wifi-extender/networks',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'updateOfflineNotification',
    args: [
      1052,
      {
        is_enabled: true,
      },
    ],
    http: 'PUT',
    path: '/dongle/1052/setting/offline-notification',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: ['is_enabled'],
  },
  {
    resource: 'dongles',
    method: 'setNumber',
    args: [
      1053,
      {
        number: 'x',
      },
    ],
    http: 'PUT',
    path: '/dongle/1053/number',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: ['number'],
  },
  {
    resource: 'publicVpn',
    method: 'enable',
    args: [1054],
    http: 'POST',
    path: '/dongle/1054/public-vpn/enable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'publicVpn',
    method: 'disable',
    args: [1055],
    http: 'POST',
    path: '/dongle/1055/public-vpn/disable',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'publicVpn',
    method: 'refreshPassword',
    args: [1056],
    http: 'POST',
    path: '/dongle/1056/public-vpn/refresh-password',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'publicVpn',
    method: 'listSessions',
    args: [],
    http: 'GET',
    path: '/public-vpn/connect-session-list',
    response: {
      data: {
        connect_sessions: [{}],
      },
    },
    kind: 'listKey',
    bodyKeys: [],
  },
  {
    resource: 'socksProxies',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/dongle-socks-proxy',
    response: {
      data: {
        dongle_socks_proxies: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'socksProxies',
    method: 'create',
    args: [
      {
        dongle_id: 1,
        password: 'x',
        allowed_ips: ['x'],
      },
    ],
    http: 'POST',
    path: '/dongle-socks-proxy',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['dongle_id', 'password', 'allowed_ips'],
  },
  {
    resource: 'socksProxies',
    method: 'get',
    args: [1060],
    http: 'GET',
    path: '/dongle-socks-proxy/1060',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'socksProxies',
    method: 'update',
    args: [
      1061,
      {
        password: 'x',
        allowed_ips: ['x'],
      },
    ],
    http: 'PUT',
    path: '/dongle-socks-proxy/1061',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['password', 'allowed_ips'],
  },
  {
    resource: 'socksProxies',
    method: 'delete',
    args: [1062],
    http: 'DELETE',
    path: '/dongle-socks-proxy/1062',
    response: {
      data: {
        status: true,
      },
    },
    kind: 'status',
    bodyKeys: [],
  },
  {
    resource: 'files',
    method: 'download',
    args: [1063],
    http: 'GET',
    path: '/file/1063',
    response: null,
    kind: 'bytes',
    bodyKeys: [],
  },
  {
    resource: 'files',
    method: 'downloadTmp',
    args: ['ab/0123456789abcdef0123456789abcdef/greeting.wav'],
    http: 'GET',
    path: '/file/tmp/ab/0123456789abcdef0123456789abcdef/greeting.wav',
    response: null,
    kind: 'bytes',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/sms',
    response: {
      data: {
        smses: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'get',
    args: [1066],
    http: 'GET',
    path: '/dongle/1066',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'update',
    args: [1067],
    http: 'PUT',
    path: '/dongle/1067',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'listForDongle',
    args: [1068],
    http: 'GET',
    path: '/dongle/1068/sms',
    response: {
      data: {
        smses: [{}],
        total_count: 1,
      },
    },
    kind: 'page',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'get',
    args: [1069, 1069],
    http: 'GET',
    path: '/dongle/1069/sms/1069',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'update',
    args: [1070, 1070],
    http: 'PUT',
    path: '/dongle/1070/sms/1070',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'sms',
    method: 'delete',
    args: [1071, 1071],
    http: 'DELETE',
    path: '/dongle/1071/sms/1071',
    response: {
      data: null,
    },
    kind: 'none',
    bodyKeys: [],
  },
  {
    resource: 'calls',
    method: 'create',
    args: [1072],
    http: 'POST',
    path: '/dongle/1072/call',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'calls',
    method: 'get',
    args: [1073, 1073],
    http: 'GET',
    path: '/dongle/1073/call/1073',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'calls',
    method: 'delete',
    args: [1074, 1074],
    http: 'DELETE',
    path: '/dongle/1074/call/1074',
    response: {
      data: null,
    },
    kind: 'none',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'getNetworkInfo',
    args: [1075],
    http: 'POST',
    path: '/dongle/1075/mobile-network-info',
    response: {
      data: {
        result: {
          ok: 1,
        },
      },
    },
    kind: 'result',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'getSimIdentifiers',
    args: [1076],
    http: 'POST',
    path: '/dongle/1076/mobile-network-ids',
    response: {
      data: {
        result: {
          ok: 1,
        },
      },
    },
    kind: 'result',
    bodyKeys: [],
  },
  {
    resource: 'sipUsers',
    method: 'list',
    args: [],
    http: 'GET',
    path: '/sip-user',
    response: {
      data: {
        pbx_sip_users: [{}],
      },
    },
    kind: 'listKey',
    bodyKeys: [],
  },
  {
    resource: 'sipUsers',
    method: 'get',
    args: [1078],
    http: 'GET',
    path: '/sip-user/1078',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: [],
  },
  {
    resource: 'dongles',
    method: 'listStatistics',
    args: [1079],
    http: 'GET',
    path: '/dongle/1079/statistic',
    response: {
      data: [{}],
    },
    kind: 'list',
    bodyKeys: [],
  },
  {
    resource: 'files',
    method: 'uploadTmp',
    args: [
      {
        file_base64: 'x',
        file_name: 'x',
      },
    ],
    http: 'POST',
    path: '/file/upload-tmp',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['file_base64', 'file_name', 'scenario'],
  },
  {
    resource: 'files',
    method: 'generateSpeech',
    args: [
      {
        text: 'x',
        voice: 'onyx',
        language: 'en-GB',
      },
    ],
    http: 'POST',
    path: '/file/generate-speech',
    response: {
      data: {
        ok: 1,
      },
    },
    kind: 'model',
    bodyKeys: ['text', 'voice', 'language'],
  },
];

function fakeFetch(response, calls) {
  return async (url, init) => {
    calls.push({ url: new URL(url), init });
    if (response === null) return new Response(new Uint8Array([0, 1]), { status: 200 });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
}

for (const c of CASES) {
  test(`${c.resource}.${c.method}`, async () => {
    const calls = [];
    const client = new Teleleo({
      apiKey: 'test-key',
      baseURL: BASE_URL,
      maxRetries: 0,
      fetch: fakeFetch(c.response, calls),
    });
    const result = await client[c.resource][c.method](...c.args);
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    assert.equal(init.method, c.http);
    assert.equal(decodeURIComponent(url.pathname), '/react_api' + c.path);
    assert.equal(init.headers['auth-key'], 'test-key');
    if (c.bodyKeys.length) {
      const sent = JSON.parse(init.body);
      for (const key of c.bodyKeys) assert.ok(key in sent, `body has ${key}`);
    }
    switch (c.kind) {
      case 'page':
        assert.ok(result instanceof Page);
        assert.equal(result.items.length, 1);
        assert.equal(result.totalCount, 1);
        break;
      case 'list':
      case 'listKey':
        assert.ok(Array.isArray(result) && result.length === 1);
        break;
      case 'status':
        assert.equal(result, true);
        break;
      case 'none':
        assert.equal(result, undefined);
        break;
      case 'bytes':
        assert.deepEqual([...result], [0, 1]);
        break;
      default:
        assert.deepEqual(result, { ok: 1 });
    }
  });
}

test('every operation is covered', () => {
  assert.equal(CASES.length, 82);
});
