// Print the modems of the account.
//
//     export TELELEO_API_KEY=...
//     node examples/list-dongles.ts

import Teleleo from 'teleleo';

const client = new Teleleo();

for await (const dongle of client.dongles.list()) {
  const status = dongle.is_active ? 'active' : 'inactive';
  console.log(
    `${String(dongle.dongle_id).padStart(6)}  ${dongle.name.padEnd(30)} ${(dongle.number ?? '-').padEnd(16)} ${status}`,
  );
}
