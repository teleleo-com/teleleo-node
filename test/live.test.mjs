// Read-only checks against the real API.
// Skipped unless TELELEO_LIVE_TESTS=1 and TELELEO_API_KEY are set. Nothing here sends, creates, changes or deletes.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import Teleleo, { AuthenticationError, NotFoundError, Page } from '../dist/index.js';

const enabled = process.env.TELELEO_LIVE_TESTS === '1' && Boolean(process.env.TELELEO_API_KEY);

describe('live API (read-only)', { skip: !enabled && 'set TELELEO_LIVE_TESTS=1 and TELELEO_API_KEY' }, () => {
  const client = enabled ? new Teleleo({ maxRetries: 1 }) : null;

  test('lists', async () => {
    assert.ok((await client.dongles.list({ is_short: true, limit: 5 })) instanceof Page);
    for (const page of await Promise.all([
      client.sms.list({ limit: 5 }),
      client.calls.list({ limit: 5 }),
      client.contacts.list({ limit: 5 }),
      client.contactGroups.list({ limit: 5 }),
      client.mailings.list({ limit: 5 }),
      client.redirections.list({ limit: 5 }),
      client.callScenarios.list({ limit: 5 }),
      client.followUpSmsSettings.list({ limit: 5 }),
      client.socksProxies.list({ limit: 5 }),
      client.sms.listThreads({ limit: 5 }),
    ])) {
      assert.ok(page instanceof Page);
      assert.ok(page.totalCount === null || page.totalCount >= page.items.length);
    }
    assert.ok(Array.isArray(await client.publicVpn.listSessions()));
    assert.ok(Array.isArray(await client.sipUsers.list()));
  });

  test('dongle details', async (t) => {
    const page = await client.dongles.list({ limit: 1 });
    if (!page.items.length) return t.skip('the account has no modems');
    const dongleId = page.items[0].dongle_id;
    assert.equal((await client.dongles.get(dongleId)).dongle_id, dongleId);
    assert.ok((await client.ussd.list(dongleId, { limit: 5 })) instanceof Page);
    assert.ok((await client.sms.listForDongle(dongleId, { limit: 5 })) instanceof Page);
    assert.ok(Array.isArray(await client.dongles.listStatistics(dongleId)));
  });

  test('pages do not overlap', async (t) => {
    const first = await client.sms.list({ limit: 2 });
    if (first.totalCount === null || first.totalCount < 3) return t.skip('not enough SMS to page through');
    const second = await first.getNextPage();
    const ids = new Set(first.items.map((s) => s.sms_id));
    assert.ok(second.items.every((s) => !ids.has(s.sms_id)));
  });

  test('errors', async () => {
    await assert.rejects(client.contacts.get(2_000_000_000), NotFoundError);
    await assert.rejects(
      client.withOptions({ apiKey: 'invalid-key', maxRetries: 0 }).dongles.list({ limit: 1 }),
      AuthenticationError,
    );
  });
});
