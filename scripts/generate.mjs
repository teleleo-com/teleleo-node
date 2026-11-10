#!/usr/bin/env node
// Generate the types, resources, API reference and operation tests of the SDK from spec/openapi.yaml.
//
//     npm run generate
//
// Hand-written code lives in src/*.ts; everything this script writes starts with a "generated" header.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const spec = YAML.parse(readFileSync(join(ROOT, 'spec', 'openapi.yaml'), 'utf8'));
const SCHEMAS = spec.components.schemas;
const HEADER = '// File generated from spec/openapi.yaml by scripts/generate.mjs. Do not edit by hand.\n';

// Client property -> [class name stem, spec tag for the docs, file name]
const RESOURCES = {
  dongles: ['Dongles', 'Dongle', 'dongles'],
  sms: ['Sms', 'Sms', 'sms'],
  calls: ['Calls', 'Call', 'calls'],
  ussd: ['Ussd', 'Ussd', 'ussd'],
  contacts: ['Contacts', 'Contact', 'contacts'],
  contactGroups: ['ContactGroups', 'ContactGroup', 'contact-groups'],
  mailings: ['Mailings', 'Mailing', 'mailings'],
  redirections: ['Redirections', 'Redirection', 'redirections'],
  callScenarios: ['CallScenarios', 'CallScenario', 'call-scenarios'],
  followUpSmsSettings: ['FollowUpSmsSettings', 'FollowUpSms', 'follow-up-sms-settings'],
  publicVpn: ['PublicVpn', 'PublicVpn', 'public-vpn'],
  socksProxies: ['SocksProxies', 'DongleSocksProxy', 'socks-proxies'],
  sipUsers: ['SipUsers', 'Sip', 'sip-users'],
  files: ['Files', 'File', 'files'],
};

// operationId -> [client property, method name]. Every operation of the spec must be listed.
const OPERATIONS = {
  listDongles: ['dongles', 'list'],
  getDongle: ['dongles', 'get'],
  updateDongle: ['dongles', 'update'],
  rebootDongle: ['dongles', 'reboot'],
  enableDongleWifi: ['dongles', 'enableWifi'],
  disableDongleWifi: ['dongles', 'disableWifi'],
  setDongleWifiCredentials: ['dongles', 'setWifiCredentials'],
  enableDongleWifiExtender: ['dongles', 'enableWifiExtender'],
  disableDongleWifiExtender: ['dongles', 'disableWifiExtender'],
  scanDongleWifiNetworks: ['dongles', 'scanWifiNetworks'],
  updateDongleOfflineNotification: ['dongles', 'updateOfflineNotification'],
  setDongleNumber: ['dongles', 'setNumber'],
  getDongleNetworkInfo: ['dongles', 'getNetworkInfo'],
  getDongleSimIdentifiers: ['dongles', 'getSimIdentifiers'],
  listDongleStatistics: ['dongles', 'listStatistics'],
  listSms: ['sms', 'list'],
  listDongleSms: ['sms', 'listForDongle'],
  getSms: ['sms', 'get'],
  updateSms: ['sms', 'update'],
  deleteSms: ['sms', 'delete'],
  sendSms: ['sms', 'send'],
  sendSmsToContact: ['sms', 'sendToContact'],
  replyToSms: ['sms', 'reply'],
  listSmsThreads: ['sms', 'listThreads'],
  listCalls: ['calls', 'list'],
  createCall: ['calls', 'create'],
  getCall: ['calls', 'get'],
  deleteCall: ['calls', 'delete'],
  listUssd: ['ussd', 'list'],
  sendUssd: ['ussd', 'send'],
  getUssd: ['ussd', 'get'],
  deleteUssd: ['ussd', 'delete'],
  deleteDongleUssds: ['ussd', 'deleteAll'],
  listContacts: ['contacts', 'list'],
  createContact: ['contacts', 'create'],
  getContact: ['contacts', 'get'],
  updateContact: ['contacts', 'update'],
  deleteContact: ['contacts', 'delete'],
  importContacts: ['contacts', 'importContacts'],
  listContactGroups: ['contactGroups', 'list'],
  createContactGroup: ['contactGroups', 'create'],
  getContactGroup: ['contactGroups', 'get'],
  updateContactGroup: ['contactGroups', 'update'],
  deleteContactGroup: ['contactGroups', 'delete'],
  listMailings: ['mailings', 'list'],
  createMailing: ['mailings', 'create'],
  createSmsMailing: ['mailings', 'createSms'],
  createCallMailing: ['mailings', 'createCall'],
  getMailing: ['mailings', 'get'],
  updateMailing: ['mailings', 'update'],
  deleteMailing: ['mailings', 'delete'],
  listRedirections: ['redirections', 'list'],
  createRedirection: ['redirections', 'create'],
  getRedirection: ['redirections', 'get'],
  updateRedirection: ['redirections', 'update'],
  deleteRedirection: ['redirections', 'delete'],
  listCallScenarios: ['callScenarios', 'list'],
  createCallScenario: ['callScenarios', 'create'],
  getCallScenario: ['callScenarios', 'get'],
  updateCallScenario: ['callScenarios', 'update'],
  deleteCallScenario: ['callScenarios', 'delete'],
  retryCallScenario: ['callScenarios', 'retry'],
  listFollowUpSmsSettings: ['followUpSmsSettings', 'list'],
  createFollowUpSmsSetting: ['followUpSmsSettings', 'create'],
  getFollowUpSmsSetting: ['followUpSmsSettings', 'get'],
  updateFollowUpSmsSetting: ['followUpSmsSettings', 'update'],
  deleteFollowUpSmsSetting: ['followUpSmsSettings', 'delete'],
  enableDonglePublicVpn: ['publicVpn', 'enable'],
  disableDonglePublicVpn: ['publicVpn', 'disable'],
  refreshDonglePublicVpnPassword: ['publicVpn', 'refreshPassword'],
  listPublicVpnSessions: ['publicVpn', 'listSessions'],
  listDongleSocksProxies: ['socksProxies', 'list'],
  createDongleSocksProxy: ['socksProxies', 'create'],
  getDongleSocksProxy: ['socksProxies', 'get'],
  updateDongleSocksProxy: ['socksProxies', 'update'],
  deleteDongleSocksProxy: ['socksProxies', 'delete'],
  listSipUsers: ['sipUsers', 'list'],
  getSipUser: ['sipUsers', 'get'],
  getFile: ['files', 'download'],
  getTmpFile: ['files', 'downloadTmp'],
  uploadTmpFile: ['files', 'uploadTmp'],
  generateSpeech: ['files', 'generateSpeech'],
};

const WRAPPER_MODEL_NAMES = { ContactImportResponse: 'ContactImportResult' };

const ENUM_MEMBER_OVERRIDES = {
  SmsStatus: { 1: 'SENT' },
  DurationPreset: {
    1: 'LESS_THAN_1_MINUTE',
    2: 'FROM_1_TO_3_MINUTES',
    3: 'FROM_3_TO_5_MINUTES',
    4: 'MORE_THAN_5_MINUTES',
  },
};

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

// ------------------------------------------------------------------------------------------------ helpers

const refName = (schema) => String(schema.$ref).split('/').pop();

function singleRef(schema) {
  if (schema.$ref) return refName(schema);
  if (Array.isArray(schema.allOf) && schema.allOf.length === 1 && schema.allOf[0].$ref)
    return refName(schema.allOf[0]);
  return null;
}

const pascal = (name) =>
  name
    .split(/[^0-9a-zA-Z]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');

const camel = (name) => {
  const p = pascal(name);
  return p[0].toLowerCase() + p.slice(1);
};

const propKey = (name) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name));

function jsdoc(text, indent) {
  const body = (text ?? '').trim().replace(/\*\//g, '*\\/');
  if (!body) return [];
  const lines = body.split('\n');
  if (lines.length === 1 && lines[0].length + indent.length < 100) return [`${indent}/** ${lines[0]} */`];
  return [
    `${indent}/**`,
    ...lines.map((l) => (l.trim() ? `${indent} * ${l}` : `${indent} *`)),
    `${indent} */`,
  ];
}

function isDatetimeString(schema, field) {
  if (schema.type !== 'string') return false;
  if (schema.format === 'date-time') return true;
  if ((schema.pattern ?? '').includes('\\d{2}:\\d{2}:\\d{2}')) return true;
  return field.endsWith('_at') && !schema.enum;
}

const tagDescription = (tag) => (spec.tags ?? []).find((t) => t.name === tag)?.description ?? '';

// ------------------------------------------------------------------------------------------------ enums

const ENUM_TYPES = {}; // component -> type name
const ENUM_SIGNATURES = new Map(); // "values|description" -> type name
const ENUM_DEFS = [];

const normalizeEnumDescription = (text) =>
  (text ?? '')
    .trim()
    .replace(/\s*Null when not set\.?\s*$/, '')
    .trim()
    .replace(/[ .]+$/, '');

function parseEnumMembers(component, schema) {
  const parts = (schema.description ?? '').split(/(?:^|[,;]\s*)(\d+):\s*/);
  const labels = {};
  for (let i = 1; i < parts.length - 1; i += 2)
    labels[Number(parts[i])] = parts[i + 1].trim().replace(/[.,;]+$/, '');
  const used = new Set();
  const overrides = ENUM_MEMBER_OVERRIDES[component] ?? {};
  return schema.enum.map((value) => {
    const label = labels[value] ?? `VALUE_${value}`;
    let name = overrides[value];
    if (!name) {
      const short = label.split(/ \(| - |, |; /)[0];
      name =
        short
          .replace(/[^0-9A-Za-z]+/g, '_')
          .replace(/^_+|_+$/g, '')
          .toUpperCase() || `VALUE_${value}`;
      if (/^\d/.test(name)) name = `VALUE_${name}`;
    }
    if (used.has(name)) name = `${name}_${value}`;
    used.add(name);
    return { name, value, label };
  });
}

for (const [name, schema] of Object.entries(SCHEMAS)) {
  if (schema.enum && schema.type === 'integer') {
    const typeName = name.endsWith('Enum') ? name.slice(0, -4) : name;
    ENUM_TYPES[name] = typeName;
    ENUM_SIGNATURES.set(`${schema.enum.join(',')}|${normalizeEnumDescription(schema.description)}`, typeName);
    ENUM_DEFS.push({
      typeName,
      description: schema.description ?? '',
      members: parseEnumMembers(name, schema),
    });
  }
}

const inlineEnumType = (schema) =>
  ENUM_SIGNATURES.get(`${(schema.enum ?? []).join(',')}|${normalizeEnumDescription(schema.description)}`) ??
  null;

// ------------------------------------------------------------------------------------------------ models

const MODELS = new Map();

function modelType(schema, owner, field) {
  const ref = singleRef(schema);
  if (ref) {
    if (ENUM_TYPES[ref]) return ENUM_TYPES[ref];
    ensureModel(ref, SCHEMAS[ref]);
    return ref;
  }
  switch (schema.type) {
    case 'integer':
      return (schema.enum && inlineEnumType(schema)) || 'number';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      if (schema.enum) return schema.enum.map((v) => JSON.stringify(v)).join(' | ');
      return 'string';
    case 'array':
      return `Array<${modelType(schema.items ?? {}, owner, field)}>`;
  }
  if (schema.properties) {
    const name = owner + pascal(field);
    ensureModel(name, schema);
    return name;
  }
  if (schema.type === 'object' || schema.additionalProperties) return 'Record<string, unknown>';
  return 'unknown';
}

function ensureModel(name, schema) {
  if (MODELS.has(name)) return;
  const model = { description: schema.description ?? '', fields: [] };
  MODELS.set(name, model);
  const required = new Set(schema.required ?? []);
  for (const [prop, propSchema] of Object.entries(schema.properties ?? {})) {
    let description = propSchema.description ?? '';
    if (isDatetimeString(propSchema, prop) && !/UTC/.test(description)) {
      description = `${description}${description ? ' ' : ''}UTC, \`YYYY-MM-DD HH:MM:SS[.ffffff]\`; \`toDate()\` turns it into a \`Date\`.`;
    }
    model.fields.push({
      name: prop,
      type: modelType(propSchema, name, prop),
      required: required.has(prop),
      nullable: Boolean(propSchema.nullable),
      description,
    });
  }
}

// ------------------------------------------------------------------------------------------------ params

const NESTED_PARAMS = new Map();

function paramType(schema, field) {
  let out;
  const ref = singleRef(schema);
  if (ref) {
    if (ENUM_TYPES[ref]) out = ENUM_TYPES[ref];
    else {
      ensureNestedParam(ref);
      out = `${ref}Param`;
    }
  } else if (schema.type === 'integer' || schema.type === 'number') out = 'number';
  else if (schema.type === 'boolean') out = 'boolean';
  else if (schema.type === 'string') {
    if (schema.enum) out = schema.enum.map((v) => JSON.stringify(v)).join(' | ');
    else if (isDatetimeString(schema, field)) out = 'string | Date';
    else out = 'string';
  } else if (schema.type === 'array') {
    const inner = paramType(schema.items ?? {}, field);
    out = `ReadonlyArray<${inner}>`;
  } else if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
    out = 'Record<string, unknown>';
  } else out = 'unknown';
  if (schema.nullable) out = `${out} | null`;
  return out;
}

function ensureNestedParam(name) {
  if (NESTED_PARAMS.has(name)) return;
  const schema = SCHEMAS[name];
  const entry = { description: schema.description ?? '', fields: [] };
  NESTED_PARAMS.set(name, entry);
  const required = new Set(schema.required ?? []);
  for (const [prop, propSchema] of Object.entries(schema.properties ?? {})) {
    entry.fields.push({
      name: prop,
      type: paramType(propSchema, prop),
      required: required.has(prop),
      description: propSchema.description ?? '',
    });
  }
}

// ------------------------------------------------------------------------------------------------ operations

const resolve = (schema) => {
  const ref = singleRef(schema);
  return ref && !schema.properties ? SCHEMAS[ref] : schema;
};

function analyzeResponse(op, queryNames) {
  const success = Object.keys(op.responses).find((c) => String(c).startsWith('2'));
  const content = op.responses[success].content ?? {};
  if (!content['application/json']) return { kind: 'bytes', type: 'Uint8Array' };
  const wrapperSchema = content['application/json'].schema;
  const wrapperName =
    singleRef(wrapperSchema) ?? `${op.operationId[0].toUpperCase()}${op.operationId.slice(1)}Response`;
  const wrapper = resolve(wrapperSchema);
  const data = wrapper.properties?.data ?? {};
  const base = WRAPPER_MODEL_NAMES[wrapperName] ?? wrapperName.replace(/Response$/, '');

  if (wrapperName === 'StatusResponse') return { kind: 'status', type: 'boolean' };
  if (
    wrapperName === 'NullDataResponse' ||
    (data.type === 'object' && !data.properties && !singleRef(data))
  ) {
    return { kind: 'none', type: 'void' };
  }
  if (data.type === 'array') {
    const item = modelType(data.items ?? {}, base, 'item');
    return { kind: 'list', type: `Array<${item}>`, item };
  }
  if (singleRef(data)) return { kind: 'model', type: modelType(data, base, 'data') };
  const props = data.properties ?? {};
  const arrays = Object.keys(props).filter((k) => props[k].type === 'array');
  if (arrays.length === 1 && Object.keys(props).every((k) => k === arrays[0] || k === 'total_count')) {
    const key = arrays[0];
    const item = modelType(props[key].items ?? {}, base, key);
    if (queryNames.includes('page'))
      return { kind: 'page', type: `PagePromise<${item}>`, item, itemKey: key };
    return { kind: 'listKey', type: `Array<${item}>`, item, itemKey: key };
  }
  if (Object.keys(props).length === 1 && props.result) {
    if (singleRef(props.result)) return { kind: 'result', type: modelType(props.result, base, 'result') };
    ensureModel(base, props.result);
    return { kind: 'result', type: base };
  }
  ensureModel(base, data);
  return { kind: 'model', type: base };
}

const OPS = [];
for (const [path, pathItem] of Object.entries(spec.paths)) {
  for (const [httpMethod, op] of Object.entries(pathItem)) {
    if (!HTTP_METHODS.includes(httpMethod)) continue;
    const mapping = OPERATIONS[op.operationId];
    if (!mapping) throw new Error(`operationId ${op.operationId} is not mapped in OPERATIONS`);
    const [resource, method] = mapping;
    const params = [...(pathItem.parameters ?? []), ...(op.parameters ?? [])];
    const pathArgs = [...path.matchAll(/\{([^}]+)\}/g)].map(([, wire]) => {
      const p = params.find((x) => x.in === 'path' && x.name === wire);
      const schema = p.schema ?? {};
      return {
        wire,
        name: camel(wire),
        type: schema.type === 'integer' ? 'number' : 'string',
        description: p.description ?? '',
        keepSlashes: (schema.pattern ?? '').includes('/'),
      };
    });
    const fields = [];
    const queryNames = [];
    for (const p of params) {
      if (p.in !== 'query') continue;
      queryNames.push(p.name);
      fields.push({
        wire: p.name,
        name: p.name.replace('[]', ''),
        type: paramType(p.schema ?? {}, p.name),
        required: Boolean(p.required),
        description: p.description ?? '',
        location: 'query',
      });
    }
    const bodyRef = op.requestBody?.content?.['application/json']?.schema;
    const hasBody = Boolean(bodyRef);
    if (bodyRef) {
      const bodySchema = resolve(bodyRef);
      const required = new Set(bodySchema.required ?? []);
      for (const [prop, propSchema] of Object.entries(bodySchema.properties ?? {})) {
        const single =
          propSchema.enum?.length === 1 && required.has(prop) ? JSON.stringify(propSchema.enum[0]) : null;
        if (fields.some((f) => f.name === prop))
          throw new Error(`${op.operationId}: body field ${prop} clashes with a query parameter`);
        fields.push({
          wire: prop,
          name: prop,
          type: paramType(propSchema, prop),
          required: required.has(prop) && !single,
          description: propSchema.description ?? '',
          location: 'body',
          defaultValue: single,
        });
      }
    }
    const response = analyzeResponse(op, queryNames);
    OPS.push({
      opId: op.operationId,
      resource,
      method,
      httpMethod: httpMethod.toUpperCase(),
      path,
      summary: op.summary ?? '',
      description: op.description ?? '',
      pathArgs,
      fields,
      hasBody,
      paramsType: fields.length ? `${RESOURCES[resource][0]}${pascal(method)}Params` : null,
      errorCodes: op['x-error-codes'] ?? [],
      ...response,
    });
  }
}
const missing = Object.keys(OPERATIONS).filter((id) => !OPS.some((o) => o.opId === id));
if (missing.length) throw new Error(`OPERATIONS lists unknown operationIds: ${missing.join(', ')}`);

const allNames = [
  ...ENUM_DEFS.map((e) => e.typeName),
  ...MODELS.keys(),
  ...[...NESTED_PARAMS.keys()].map((n) => `${n}Param`),
  ...OPS.filter((o) => o.paramsType).map((o) => o.paramsType),
];
const dup = allNames.filter((n, i) => allNames.indexOf(n) !== i);
if (dup.length) throw new Error(`Duplicate type names: ${dup.join(', ')}`);

// ------------------------------------------------------------------------------------------------ emit: types

function emitEnums() {
  const out = [HEADER];
  for (const { typeName, description, members } of ENUM_DEFS) {
    out.push(...jsdoc(description, ''));
    out.push(`export const ${typeName} = {`);
    for (const m of members) {
      out.push(...jsdoc(m.label, '  '));
      out.push(`  ${m.name}: ${m.value},`);
    }
    out.push('} as const;');
    out.push(...jsdoc(description, ''));
    out.push(`export type ${typeName} = (typeof ${typeName})[keyof typeof ${typeName}];`, '');
  }
  return out.join('\n');
}

function referencedTypes(text, candidates) {
  const code = text.replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/'[^'\n]*'/g, "''");
  return [...candidates].filter((n) => new RegExp(`\\b${n}\\b`).test(code)).sort();
}

function emitModels() {
  const body = [];
  for (const name of [...MODELS.keys()].sort()) {
    const model = MODELS.get(name);
    body.push(...jsdoc(model.description, ''));
    body.push(`export interface ${name} {`);
    for (const f of model.fields) {
      body.push(...jsdoc(f.description, '  '));
      body.push(`  ${propKey(f.name)}${f.required ? '' : '?'}: ${f.type}${f.nullable ? ' | null' : ''};`);
    }
    body.push('}', '');
  }
  const text = body.join('\n');
  const enums = referencedTypes(
    text,
    ENUM_DEFS.map((e) => e.typeName),
  );
  const head = [HEADER];
  if (enums.length) head.push(`import type { ${enums.join(', ')} } from './enums.js';`, '');
  return head.join('\n') + text;
}

function emitParams() {
  const body = [];
  for (const name of [...NESTED_PARAMS.keys()].sort()) {
    const entry = NESTED_PARAMS.get(name);
    body.push(...jsdoc(entry.description, ''));
    body.push(`export interface ${name}Param {`);
    for (const f of entry.fields) {
      body.push(...jsdoc(f.description, '  '));
      body.push(`  ${propKey(f.name)}${f.required ? '' : '?'}: ${f.type};`);
    }
    body.push('}', '');
  }
  for (const op of OPS.filter((o) => o.paramsType)) {
    body.push(...jsdoc(`Parameters of \`client.${op.resource}.${op.method}()\`.`, ''));
    body.push(`export interface ${op.paramsType} {`);
    for (const f of op.fields) {
      body.push(...jsdoc(f.description, '  '));
      body.push(`  ${propKey(f.name)}${f.required ? '' : '?'}: ${f.type};`);
    }
    body.push('}', '');
  }
  const text = body.join('\n');
  const enums = referencedTypes(
    text,
    ENUM_DEFS.map((e) => e.typeName),
  );
  const head = [HEADER];
  if (enums.length) head.push(`import type { ${enums.join(', ')} } from './enums.js';`, '');
  return head.join('\n') + text;
}

const emitTypesIndex = () =>
  [
    HEADER,
    "export * from './enums.js';",
    "export * from './models.js';",
    "export * from './params.js';",
    '',
  ].join('\n');

// ------------------------------------------------------------------------------------------------ emit: resources

function pathExpr(op) {
  let expr = op.path;
  for (const a of op.pathArgs) {
    expr = expr.replace(`{${a.wire}}`, `\${pathParam(${a.name}${a.keepSlashes ? ', true' : ''})}`);
  }
  return op.pathArgs.length ? `\`${expr}\`` : `'${expr}'`;
}

function methodDoc(op) {
  const lines = [];
  lines.push(op.summary ? `${op.summary.replace(/\.$/, '')}.` : '');
  if (op.description && op.description.trim() !== op.summary.trim()) lines.push('', op.description.trim());
  for (const a of op.pathArgs)
    lines.push(...(lines.length ? [] : []), `@param ${a.name} - ${a.description}`.trim());
  if (op.errorCodes.length) lines.push('', `Error codes (\`errorMessage\`): ${op.errorCodes.join(', ')}.`);
  // keep @param tags together after the description
  const text = lines.join('\n').replace(/\n(@param)/, '\n\n$1');
  return jsdoc(text, '  ');
}

function methodLines(op) {
  const args = op.pathArgs.map((a) => `${a.name}: ${a.type}`);
  if (op.paramsType) {
    const anyRequired = op.fields.some((f) => f.required);
    args.push(anyRequired ? `params: ${op.paramsType}` : `params: ${op.paramsType} = {}`);
  }
  args.push('options?: RequestOptions');
  const ret = op.kind === 'page' ? op.type : `Promise<${op.type}>`;
  const out = [...methodDoc(op), `  ${op.method}(${args.join(', ')}): ${ret} {`];

  const query = op.fields.filter((f) => f.location === 'query');
  const body = op.fields.filter((f) => f.location === 'body');
  const queryExpr = query.length
    ? `{ ${query.map((f) => `${propKey(f.wire)}: params.${f.name}`).join(', ')} }`
    : null;
  const bodyEntries = body.map((f) =>
    f.defaultValue
      ? `${propKey(f.wire)}: params.${f.name} ?? ${f.defaultValue}`
      : `${propKey(f.wire)}: params.${f.name}`,
  );
  const bodyExpr = op.hasBody ? `{ ${bodyEntries.join(', ')} }` : null;

  if (op.kind === 'page') {
    out.push(
      `    return this._client.getPage<${op.item}>(${pathExpr(op)}, { query: ${queryExpr ?? '{}'}, itemKey: '${op.itemKey}', options });`,
    );
  } else if (op.kind === 'bytes') {
    out.push(`    return this._client.requestBytes('${op.httpMethod}', ${pathExpr(op)}, { options });`);
  } else {
    const parts = [];
    if (queryExpr) parts.push(`query: ${queryExpr}`);
    if (bodyExpr) parts.push(`body: ${bodyExpr}`);
    parts.push('options');
    const call = `this._client.request('${op.httpMethod}', ${pathExpr(op)}, { ${parts.join(', ')} })`;
    const then = {
      status: '.then(asStatus)',
      none: '.then(() => undefined)',
      list: `.then((data) => asArray(data) as ${op.type})`,
      listKey: `.then((data) => asArray(data, '${op.itemKey}') as ${op.type})`,
      result: `.then((data) => asResult(data) as ${op.type})`,
      model: `.then((data) => data as ${op.type})`,
    }[op.kind];
    out.push(`    return ${call}${then};`);
  }
  out.push('  }');
  return out;
}

function emitResource(prop) {
  const [stem, tag] = RESOURCES[prop];
  const ops = OPS.filter((o) => o.resource === prop);
  const body = [];
  body.push(...jsdoc(tagDescription(tag), ''));
  body.push(`export class ${stem}Resource extends APIResource {`);
  ops.forEach((op, i) => {
    if (i) body.push('');
    body.push(...methodLines(op));
  });
  body.push('}', '');
  const text = body.join('\n');

  const utils = ['asArray', 'asResult', 'asStatus', 'pathParam'].filter((n) =>
    new RegExp(`\\b${n}\\(|\\(${n}\\)`).test(text),
  );
  const models = referencedTypes(text, MODELS.keys());
  const params = referencedTypes(
    text,
    OPS.filter((o) => o.paramsType).map((o) => o.paramsType),
  );
  const head = [HEADER, "import type { RequestOptions } from '../core.js';"];
  if (ops.some((o) => o.kind === 'page')) head.push("import type { PagePromise } from '../pagination.js';");
  head.push("import { APIResource } from '../resource.js';");
  if (models.length) head.push(`import type { ${models.join(', ')} } from '../types/models.js';`);
  if (params.length) head.push(`import type { ${params.join(', ')} } from '../types/params.js';`);
  if (utils.length) head.push(`import { ${utils.join(', ')} } from '../utils.js';`);
  head.push('');
  return head.join('\n') + text;
}

function emitResourcesIndex() {
  const out = [HEADER, "import type { BaseClient } from '../core.js';"];
  for (const [, [stem, , file]] of Object.entries(RESOURCES))
    out.push(`import { ${stem}Resource } from './${file}.js';`);
  out.push('');
  out.push(
    `export { ${Object.values(RESOURCES)
      .map(([stem]) => `${stem}Resource`)
      .join(', ')} };`,
    '',
  );
  out.push('/** Resource groups of the client. */', 'export interface Resources {');
  for (const [prop, [stem, tag]] of Object.entries(RESOURCES)) {
    out.push(...jsdoc(tagDescription(tag), '  '));
    out.push(`  readonly ${prop}: ${stem}Resource;`);
  }
  out.push(
    '}',
    '',
    '/** @internal */',
    'export function createResources(client: BaseClient): Resources {',
    '  return {',
  );
  for (const [prop, [stem]] of Object.entries(RESOURCES))
    out.push(`    ${prop}: new ${stem}Resource(client),`);
  out.push('  };', '}', '');
  return out.join('\n');
}

// ------------------------------------------------------------------------------------------------ emit: api.md

function emitApiMd() {
  const out = [
    '# API reference',
    '',
    'Every method of the `Teleleo` client, generated from [`spec/openapi.yaml`](spec/openapi.yaml). Types are exported from the package root.',
  ];
  for (const [prop, [, tag]] of Object.entries(RESOURCES)) {
    out.push(
      '',
      `## \`client.${prop}\``,
      '',
      tagDescription(tag),
      '',
      '| Method | HTTP | Returns | Description |',
      '|---|---|---|---|',
    );
    for (const op of OPS.filter((o) => o.resource === prop)) {
      const args = op.pathArgs.map((a) => a.name);
      if (op.paramsType) args.push(op.fields.some((f) => f.required) ? 'params' : 'params?');
      const ret = op.kind === 'page' ? op.type : `Promise<${op.type}>`;
      out.push(
        `| \`${op.method}(${args.join(', ')})\` | \`${op.httpMethod} ${op.path}\` | \`${ret}\` | ${op.summary} |`,
      );
    }
  }
  return out.join('\n') + '\n';
}

// ------------------------------------------------------------------------------------------------ emit: tests

function sample(type) {
  const t = type.replace(/ \| null$/, '');
  const array = /^ReadonlyArray<(.+)>$/.exec(t);
  if (array) return [sample(array[1])];
  if (t.startsWith('"')) return JSON.parse(t.split(' | ')[0]);
  if (t === 'number' || ENUM_DEFS.some((e) => e.typeName === t)) return 1;
  if (t === 'boolean') return true;
  if (t === 'string | Date') return '2026-01-02 03:04:05';
  if (t === 'string') return 'x';
  return {};
}

function emitTests() {
  const cases = OPS.map((op, idx) => {
    const args = [];
    let urlPath = op.path;
    for (const a of op.pathArgs) {
      let value;
      if (a.keepSlashes) value = 'ab/0123456789abcdef0123456789abcdef/greeting.wav';
      else if (a.type === 'number') value = 1000 + idx;
      else value = `file${idx}`;
      args.push(value);
      urlPath = urlPath.replace(`{${a.wire}}`, String(value));
    }
    const required = op.fields.filter((f) => f.required);
    if (required.length) args.push(Object.fromEntries(required.map((f) => [f.name, sample(f.type)])));
    const bodyKeys = op.fields
      .filter((f) => f.location === 'body' && (f.required || f.defaultValue))
      .map((f) => f.wire);
    const response = {
      page: { data: { [op.itemKey]: [{}], total_count: 1 } },
      list: { data: [{}] },
      listKey: { data: { [op.itemKey]: [{}] } },
      result: { data: { result: { ok: 1 } } },
      status: { data: { status: true } },
      none: { data: null },
      bytes: null,
      model: { data: { ok: 1 } },
    }[op.kind];
    return {
      resource: op.resource,
      method: op.method,
      args,
      http: op.httpMethod,
      path: urlPath,
      response,
      kind: op.kind,
      bodyKeys,
    };
  });
  return `${HEADER}// One request per operation of the spec: method, path, auth header, required body fields and the result shape.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import Teleleo, { Page } from '../dist/index.js';

const BASE_URL = 'https://api.example.test/react_api';

const CASES = ${JSON.stringify(cases, null, 2)};

function fakeFetch(response, calls) {
  return async (url, init) => {
    calls.push({ url: new URL(url), init });
    if (response === null) return new Response(new Uint8Array([0, 1]), { status: 200 });
    return new Response(JSON.stringify(response), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

for (const c of CASES) {
  test(\`\${c.resource}.\${c.method}\`, async () => {
    const calls = [];
    const client = new Teleleo({ apiKey: 'test-key', baseURL: BASE_URL, maxRetries: 0, fetch: fakeFetch(c.response, calls) });
    const result = await client[c.resource][c.method](...c.args);
    assert.equal(calls.length, 1);
    const { url, init } = calls[0];
    assert.equal(init.method, c.http);
    assert.equal(decodeURIComponent(url.pathname), '/react_api' + c.path);
    assert.equal(init.headers['auth-key'], 'test-key');
    if (c.bodyKeys.length) {
      const sent = JSON.parse(init.body);
      for (const key of c.bodyKeys) assert.ok(key in sent, \`body has \${key}\`);
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
  assert.equal(CASES.length, ${OPS.length});
});
`;
}

// ------------------------------------------------------------------------------------------------ write

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

const resourcesDir = join(ROOT, 'src', 'resources');
mkdirSync(resourcesDir, { recursive: true });
for (const file of readdirSync(resourcesDir)) rmSync(join(resourcesDir, file));
for (const [prop, [, , file]] of Object.entries(RESOURCES))
  write(join(resourcesDir, `${file}.ts`), emitResource(prop));
write(join(resourcesDir, 'index.ts'), emitResourcesIndex());
write(join(ROOT, 'src', 'types', 'enums.ts'), emitEnums());
write(join(ROOT, 'src', 'types', 'models.ts'), emitModels());
write(join(ROOT, 'src', 'types', 'params.ts'), emitParams());
write(join(ROOT, 'src', 'types', 'index.ts'), emitTypesIndex());
write(join(ROOT, 'api.md'), emitApiMd());
write(join(ROOT, 'test', 'operations.generated.test.mjs'), emitTests());

execFileSync(
  join(ROOT, 'node_modules', '.bin', 'prettier'),
  ['--write', '--log-level', 'warn', 'src/resources', 'src/types', 'test/operations.generated.test.mjs'],
  { cwd: ROOT, stdio: 'inherit' },
);
console.log(
  `${OPS.length} operations, ${MODELS.size} models, ${ENUM_DEFS.length} enums, ${OPS.filter((o) => o.paramsType).length} parameter types`,
);
