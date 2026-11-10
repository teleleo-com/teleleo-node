import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';

import Teleleo, {
  APIConnectionError,
  APIResponseValidationError,
  APIStatusError,
  APITimeoutError,
  APIUserAbortError,
  AuthenticationError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  Page,
  PermissionDeniedError,
  SmsType,
  TeleleoError,
  VERSION,
  toDate,
} from '../dist/index.js';

const BASE_URL = 'https://api.example.test/react_api';

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

/** A fetch that answers from a list of responses (or functions) and records every call. */
function mockFetch(...answers) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url: new URL(url), init });
    const next = answers.length > 1 ? answers.shift() : answers[0];
    if (typeof next === 'function') return next(new URL(url), init);
    if (next instanceof Error) throw next;
    return next.clone();
  };
  return { fetch, calls };
}

const client = (fetch, options = {}) =>
  new Teleleo({ apiKey: 'test-key', baseURL: BASE_URL, fetch, maxRetries: 2, ...options });

function connectError(code) {
  const error = new TypeError('fetch failed');
  error.cause = Object.assign(new Error(code), { code });
  return error;
}

let savedEnv;
let realSetTimeout;
beforeEach(() => {
  savedEnv = { key: process.env.TELELEO_API_KEY, url: process.env.TELELEO_BASE_URL };
  // Make retry delays instant; keep real timers for request timeouts above 1 second.
  realSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (fn, ms, ...rest) => realSetTimeout(fn, ms >= 1000 && ms <= 8000 ? 0 : ms, ...rest);
});
afterEach(() => {
  globalThis.setTimeout = realSetTimeout;
  for (const [name, value] of [
    ['TELELEO_API_KEY', savedEnv.key],
    ['TELELEO_BASE_URL', savedEnv.url],
  ]) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

describe('configuration', () => {
  test('reads the key and base URL from the environment', () => {
    process.env.TELELEO_API_KEY = 'env-key';
    process.env.TELELEO_BASE_URL = 'https://api.teleleo.example/v1/';
    const c = new Teleleo({ fetch: async () => json(200, {}) });
    assert.equal(c.apiKey, 'env-key');
    assert.equal(c.baseURL, 'https://api.teleleo.example/v1');
  });

  test('default base URL', () => {
    delete process.env.TELELEO_BASE_URL;
    assert.equal(new Teleleo({ apiKey: 'k' }).baseURL, 'https://app.teleleo.com/react_api');
  });

  test('missing key', () => {
    delete process.env.TELELEO_API_KEY;
    assert.throws(
      () => new Teleleo(),
      (e) => e instanceof TeleleoError && /TELELEO_API_KEY/.test(e.message),
    );
  });

  test('headers', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: { dongles: [] } }));
    await client(fetch, { defaultHeaders: { 'X-Trace': '1' } }).dongles.list();
    const headers = calls[0].init.headers;
    assert.equal(headers['auth-key'], 'test-key');
    assert.equal(headers['Accept'], 'application/json');
    assert.equal(headers['User-Agent'], `teleleo-node/${VERSION}`);
    assert.equal(headers['X-Trace'], '1');
  });

  test('withOptions keeps the key and changes the rest', () => {
    const c = client(async () => json(200, {}));
    const copy = c.withOptions({ timeout: 5000, maxRetries: 0 });
    assert.equal(copy.apiKey, 'test-key');
    assert.equal(copy.baseURL, BASE_URL);
    assert.equal(copy.timeout, 5000);
    assert.equal(copy.maxRetries, 0);
  });
});

describe('request encoding', () => {
  test('query: arrays, dates, booleans, extra query', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: { smses: [], total_count: 0 } }));
    await client(fetch).sms.list(
      {
        sms_type_ids: [SmsType.INCOMING, 5],
        dongle_ids: [7],
        from: new Date('2026-11-09T15:42:00+03:00'),
        to: '2026-11-10 00:00:00',
        limit: 10,
      },
      { query: { custom: true } },
    );
    const params = calls[0].url.searchParams;
    assert.deepEqual(params.getAll('sms_type_ids[]'), ['2', '5']);
    assert.deepEqual(params.getAll('dongle_ids[]'), ['7']);
    assert.equal(params.get('from'), '2026-11-09 12:42:00');
    assert.equal(params.get('to'), '2026-11-10 00:00:00');
    assert.equal(params.get('limit'), '10');
    assert.equal(params.get('custom'), '1');
    assert.equal(params.has('page'), false);
  });

  test('body: undefined dropped, null kept, dates formatted, extra body', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: {} }));
    await client(fetch).sms.update(
      5,
      9,
      { message: 'hi', dongle_id: 6, scheduled_at: null, contact_id: undefined },
      { body: { x: 1 } },
    );
    assert.equal(calls[0].init.method, 'PUT');
    assert.equal(calls[0].url.pathname, '/react_api/dongle/5/sms/9');
    assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(calls[0].init.body), {
      message: 'hi',
      dongle_id: 6,
      scheduled_at: null,
      x: 1,
    });
  });

  test('date in body', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: {} }));
    await client(fetch).sms.send(5, {
      number: '+447700900123',
      message: 'hi',
      scheduled_at: new Date(Date.UTC(2026, 11, 1, 8, 30)),
    });
    assert.equal(JSON.parse(calls[0].init.body).scheduled_at, '2026-12-01 08:30:00');
  });

  test('temporary file id keeps its slashes', async () => {
    const { fetch, calls } = mockFetch(new Response(new Uint8Array([82, 73, 70, 70]), { status: 200 }));
    const bytes = await client(fetch).files.downloadTmp(
      'ab/0123456789abcdef0123456789abcdef/hello world.wav',
    );
    assert.deepEqual([...bytes], [82, 73, 70, 70]);
    assert.equal(
      calls[0].url.pathname,
      '/react_api/file/tmp/ab/0123456789abcdef0123456789abcdef/hello%20world.wav',
    );
    assert.equal(calls[0].init.headers['Accept'], '*/*');
  });

  test('other path parameters are escaped', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: {} }));
    await client(fetch).contacts.get('1/../2');
    assert.equal(calls[0].url.pathname, '/react_api/contact/1%2F..%2F2');
  });

  test('single-value enum field gets its value', async () => {
    const { fetch, calls } = mockFetch(json(200, { data: { tmp_file_id: 'ab/x/y.wav' } }));
    await client(fetch).files.uploadTmp({ file_base64: 'AAAA', file_name: 'a.wav' });
    assert.equal(JSON.parse(calls[0].init.body).scenario, 'SCENARIO_CONVERT_TO_DONGLE_AUDIO_AND_UPLOAD_TMP');
  });
});

describe('errors', () => {
  const cases = [
    [
      400,
      {
        is_successful: false,
        code: 400,
        error_message: 'REQUEST_VALIDATION_EXCEPTION',
        error_details: ['limit: must be at most 1000'],
        request_id: 'r-1',
      },
      BadRequestError,
      'REQUEST_VALIDATION_EXCEPTION',
      ['limit: must be at most 1000'],
    ],
    [
      400,
      { error_message: 'CONTACT_NOT_FOUND_EXCEPTION', error_details: null },
      NotFoundError,
      'CONTACT_NOT_FOUND_EXCEPTION',
      [],
    ],
    [
      400,
      { code: 400, error_message: 'Bad request', error_message_detail: null },
      BadRequestError,
      'Bad request',
      [],
    ],
    [404, { error_message: 'ROUTE_NOT_FOUND' }, NotFoundError, 'ROUTE_NOT_FOUND', []],
    [401, { error_message: 'UNAUTHORIZED' }, AuthenticationError, 'UNAUTHORIZED', []],
    [
      403,
      { error_message: 'PUBLIC_API_ROUTE_FORBIDDEN' },
      PermissionDeniedError,
      'PUBLIC_API_ROUTE_FORBIDDEN',
      [],
    ],
    [405, 'Error 405', APIStatusError, null, ['Error 405']],
    [409, { error_message: 'CONFLICT' }, ConflictError, 'CONFLICT', []],
  ];
  for (const [status, body, cls, errorMessage, details] of cases) {
    test(`${status} ${errorMessage ?? JSON.stringify(body)}`, async () => {
      const { fetch } = mockFetch(json(status, body));
      await assert.rejects(client(fetch, { maxRetries: 0 }).contacts.get(1), (e) => {
        assert.ok(e instanceof cls, e.constructor.name);
        assert.equal(e.status, status);
        assert.equal(e.errorMessage, errorMessage);
        assert.deepEqual(e.errorDetails, details);
        return true;
      });
    });
  }

  test('HTML error page', async () => {
    const { fetch } = mockFetch(new Response('<html>oops</html>', { status: 500 }));
    await assert.rejects(client(fetch, { maxRetries: 0 }).contacts.get(1), (e) => {
      assert.ok(e instanceof InternalServerError);
      assert.deepEqual(e.errorDetails, []);
      return true;
    });
  });

  test('error message text', async () => {
    const { fetch } = mockFetch(
      json(400, {
        is_successful: false,
        code: 400,
        error_message: 'CONTACT_NOT_FOUND_EXCEPTION',
        error_details: ['Contact not found'],
        request_id: 'abc',
      }),
    );
    await assert.rejects(client(fetch).contacts.get(1), (e) => {
      assert.equal(
        e.message,
        'Error code: 400 - CONTACT_NOT_FOUND_EXCEPTION: Contact not found (request_id: abc)',
      );
      assert.equal(e.requestId, 'abc');
      assert.equal(e.name, 'NotFoundError');
      return true;
    });
  });

  test('success with an HTML body', async () => {
    const { fetch } = mockFetch(
      new Response('<html></html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    );
    await assert.rejects(client(fetch).contacts.get(1), APIResponseValidationError);
  });
});

describe('retries', () => {
  test('GET is retried on 503 and 429', async () => {
    const { fetch, calls } = mockFetch(
      json(503, {}),
      json(429, {}, { 'retry-after': '0' }),
      json(200, { data: { dongle_id: 1 } }),
    );
    const dongle = await client(fetch).dongles.get(1);
    assert.equal(dongle.dongle_id, 1);
    assert.equal(calls.length, 3);
  });

  test('POST is not retried on 503', async () => {
    const { fetch, calls } = mockFetch(json(503, {}));
    await assert.rejects(
      client(fetch).sms.send(1, { number: '+447700900123', message: 'hi' }),
      InternalServerError,
    );
    assert.equal(calls.length, 1);
  });

  test('POST is retried on 429', async () => {
    const { fetch, calls } = mockFetch(json(429, {}), json(200, { data: { sms_id: 3 } }));
    const sms = await client(fetch).sms.send(1, { number: '+447700900123', message: 'hi' });
    assert.equal(sms.sms_id, 3);
    assert.equal(calls.length, 2);
  });

  test('POST is retried when nothing was sent', async () => {
    const { fetch, calls } = mockFetch(connectError('ECONNREFUSED'), json(200, { data: { status: true } }));
    assert.equal(await client(fetch).dongles.reboot(1), true);
    assert.equal(calls.length, 2);
  });

  test('POST is not retried after a reset connection', async () => {
    const { fetch, calls } = mockFetch(connectError('ECONNRESET'));
    await assert.rejects(client(fetch).dongles.reboot(1), APIConnectionError);
    assert.equal(calls.length, 1);
  });

  test('retries give up', async () => {
    const { fetch, calls } = mockFetch(connectError('ECONNREFUSED'));
    await assert.rejects(client(fetch).dongles.get(1), APIConnectionError);
    assert.equal(calls.length, 3);
  });

  test('500 is not retried', async () => {
    const { fetch, calls } = mockFetch(json(500, { error_message: 'X' }));
    await assert.rejects(client(fetch).dongles.get(1), InternalServerError);
    assert.equal(calls.length, 1);
  });
});

describe('timeouts and abort', () => {
  const hang = (url, init) =>
    new Promise((_, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    });

  test('timeout', async () => {
    const { fetch, calls } = mockFetch(hang);
    await assert.rejects(client(fetch, { timeout: 30, maxRetries: 0 }).dongles.get(1), APITimeoutError);
    assert.equal(calls.length, 1);
  });

  test('user abort', async () => {
    const { fetch } = mockFetch(hang);
    const controller = new AbortController();
    const promise = client(fetch).dongles.get(1, { signal: controller.signal });
    controller.abort();
    await assert.rejects(promise, APIUserAbortError);
  });
});

describe('pagination', () => {
  const contacts = (total) => (url) => {
    const limit = Number(url.searchParams.get('limit') ?? 1000);
    const page = Number(url.searchParams.get('page') ?? 0);
    const items = [];
    for (let i = page * limit; i < Math.min((page + 1) * limit, total); i++) items.push({ contact_id: i });
    return json(200, { data: { contacts: items, total_count: total } });
  };

  test('for await goes through every page', async () => {
    const { fetch, calls } = mockFetch(contacts(7));
    const ids = [];
    for await (const contact of client(fetch).contacts.list({ limit: 3, name: 'c' }))
      ids.push(contact.contact_id);
    assert.deepEqual(ids, [0, 1, 2, 3, 4, 5, 6]);
    assert.equal(calls.length, 3);
    assert.equal(calls[2].url.searchParams.get('page'), '2');
    assert.equal(calls[2].url.searchParams.get('name'), 'c');
  });

  test('await gives the first page', async () => {
    const { fetch } = mockFetch(contacts(5));
    let page = await client(fetch).contacts.list({ limit: 2 });
    assert.ok(page instanceof Page);
    assert.equal(page.totalCount, 5);
    let pages = 1;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      pages++;
    }
    assert.equal(pages, 3);
    assert.deepEqual(
      page.items.map((c) => c.contact_id),
      [4],
    );
  });

  test('whole list without page and limit', async () => {
    const { fetch, calls } = mockFetch(contacts(4));
    const page = await client(fetch).contacts.list();
    assert.equal(page.hasNextPage(), false);
    assert.equal(calls.length, 1);
  });

  test('mailings return the first 50 by default', async () => {
    const { fetch, calls } = mockFetch((url) =>
      json(200, {
        data: {
          mailings: Array.from({ length: url.searchParams.has('page') ? 10 : 50 }, (_, i) => ({
            mailing_id: i,
          })),
          total_count: 60,
        },
      }),
    );
    let count = 0;
    for await (const _ of client(fetch).mailings.list()) count++;
    assert.equal(count, 60);
    assert.equal(calls[1].url.searchParams.get('page'), '1');
    assert.equal(calls[1].url.searchParams.get('limit'), '50');
  });
});

describe('dates', () => {
  const utc = (...args) => new Date(Date.UTC(...args));
  const cases = [
    ['2026-11-09 12:42:00', utc(2026, 10, 9, 12, 42)],
    ['2026-11-09 12:42:00.5', utc(2026, 10, 9, 12, 42, 0, 500)],
    ['2026-11-09 12:42:00.123456', utc(2026, 10, 9, 12, 42, 0, 123)],
    ['2026-11-09T12:42:00Z', utc(2026, 10, 9, 12, 42)],
    ['2026-11-09T15:42:00+03:00', utc(2026, 10, 9, 12, 42)],
    ['2026-11-09', null],
    ['garbage', null],
    ['2026-13-40 00:00:00', null],
    [null, null],
  ];
  for (const [value, expected] of cases) {
    test(`toDate(${JSON.stringify(value)})`, () => assert.deepEqual(toDate(value), expected));
  }
});
