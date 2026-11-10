# Teleleo TypeScript and JavaScript library

Teleleo is a platform for managing SIM-card modems from the cloud: SMS, calls, USSD, mailings, redirections, Wi-Fi, VPN and SOCKS proxy. `teleleo` is the official TypeScript and JavaScript library for the [Teleleo REST API](https://github.com/teleleo-com/teleleo-openapi).

- Types for every request and answer, docs on every method
- Every error is an exception with the API error code
- Automatic pagination with `for await`
- Safe retries and timeouts
- No runtime dependencies; Node.js 20.19+

## Installation

```bash
npm install teleleo
```

## Quickstart

Take the API key in the Teleleo cabinet (Settings → API key) and put it into the `TELELEO_API_KEY` environment variable.

```ts
import Teleleo from 'teleleo';

const client = new Teleleo(); // reads TELELEO_API_KEY

for await (const dongle of client.dongles.list()) {
  console.log(dongle.dongle_id, dongle.name, dongle.number);
}

const sms = await client.sms.send(1234, {
  number: '+447700900123',
  message: 'Hello from Teleleo',
});
console.log(sms.sms_id, sms.sms_status_id);
```

Methods take the path parameters first (`dongleId`, `smsId`, ...), then an object with the parameters of the request. The parameter and field names are the ones of the API, so the [API documentation](https://github.com/teleleo-com/teleleo-openapi) reads one to one.

## Usage

### Read incoming SMS

```ts
import Teleleo, { SmsType, toDate } from 'teleleo';

const client = new Teleleo();
const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

for await (const sms of client.sms.list({ sms_type_ids: [SmsType.INCOMING], from: since, limit: 100 })) {
  console.log(toDate(sms.created_at), sms.number_caller, sms.message_decoded);
}
```

Dates in answers are strings in UTC, `YYYY-MM-DD HH:MM:SS[.ffffff]`, as the API sends them; `toDate()` turns one into a `Date`. Date parameters take a `Date` or a string in the API format.

### Pagination

A list method returns a `PagePromise`: `await` it for one page, or iterate it with `for await` to go through every item; the next pages are requested as needed.

```ts
const page = await client.contacts.list({ limit: 50 });
console.log(page.totalCount, page.items.length);

for await (const contact of client.contacts.list({ limit: 50 })) {
  console.log(contact.name);
}

let current = page;
while (current.hasNextPage()) {
  current = await current.getNextPage();
}
```

Without `page` and `limit` the API returns the whole list in one answer (mailings return the first 50).

### Modem commands

```ts
await client.dongles.reboot(1234);
const info = await client.dongles.getNetworkInfo(1234);
console.log(info.current_network_name, info.network_type, info.is_roaming);
```

Every method and its parameters are listed in [api.md](api.md).

### Errors

Every error is a subclass of `TeleleoError`. When the API answers with an error, the exception carries the machine-readable code in `errorMessage`, details in `errorDetails` and `requestId` for support.

```ts
import Teleleo, { APIConnectionError, APIStatusError, BadRequestError, NotFoundError } from 'teleleo';

const client = new Teleleo();

try {
  await client.contacts.get(999999);
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('No such contact:', error.errorMessage);
  } else if (error instanceof BadRequestError) {
    console.log(error.status, error.errorMessage, error.errorDetails);
  } else if (error instanceof APIStatusError) {
    console.log('Teleleo error', error.status, error.errorMessage, 'request_id:', error.requestId);
  } else if (error instanceof APIConnectionError) {
    console.log('Teleleo is unreachable');
  } else {
    throw error;
  }
}
```

| Status                      | Exception                               |
| --------------------------- | --------------------------------------- |
| 400                         | `BadRequestError`                       |
| 400 with `*NOT_FOUND*`, 404 | `NotFoundError`                         |
| 401                         | `AuthenticationError`                   |
| 403                         | `PermissionDeniedError`                 |
| 409                         | `ConflictError`                         |
| 429                         | `RateLimitError`                        |
| 5xx                         | `InternalServerError`                   |
| no answer                   | `APIConnectionError`, `APITimeoutError` |

API v1 answers 400, not 404, for a missing object; the library throws `NotFoundError` for both, so your code keeps working when the API moves to 404.

### Retries, timeouts and abort

Requests that failed for a transient reason are repeated twice with exponential backoff: connection errors, 429, and 408/502/503/504 for requests that are safe to repeat. A POST (sending an SMS, creating a call) is repeated only when the server could not have acted on it, so a retry never sends an SMS twice.

```ts
const client = new Teleleo({ timeout: 20_000, maxRetries: 3 });

await client.dongles.list({}, { timeout: 5_000, maxRetries: 0 });

const controller = new AbortController();
const request = client.dongles.get(1234, { signal: controller.signal });
controller.abort();
```

The default timeout is 60 seconds.

### Configuration

| Option           | Environment variable | Default                                                        |
| ---------------- | -------------------- | -------------------------------------------------------------- |
| `apiKey`         | `TELELEO_API_KEY`    | required                                                       |
| `baseURL`        | `TELELEO_BASE_URL`   | `https://app.teleleo.com/react_api`                            |
| `timeout`        |                      | 60 000 ms                                                      |
| `maxRetries`     |                      | 2                                                              |
| `defaultHeaders` |                      |                                                                |
| `fetch`          |                      | the global `fetch`; pass your own for proxies or custom agents |

Every method also takes request options as its last argument: `headers`, `query`, `body`, `timeout`, `maxRetries`, `signal`. Use `query` and `body` to send a parameter the library does not have yet.

### Answers

Answers are returned as the API sends them, without validation, so a new field or enum value in the API never breaks your code. Enums are plain numbers with named constants (`SmsType.INCOMING === 2`).

### CommonJS

The package is an ES module. Node.js 20.19+ and 22.12+ load it with `require()` too:

```js
const { Teleleo } = require('teleleo');
```

## Versioning

The library follows [semver](https://semver.org/). Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Development

Types and resources in `src/resources` and `src/types` are generated from [`spec/openapi.yaml`](spec/openapi.yaml):

```bash
npm install
npm run generate
npm test
```

## Support

support@teleleo.com · [teleleo.com](https://teleleo.com) · [issues](https://github.com/teleleo-com/teleleo-node/issues)

## License

[MIT](LICENSE)
