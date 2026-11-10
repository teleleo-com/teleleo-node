// Fetch the details of every modem in parallel.
//
//     export TELELEO_API_KEY=...
//     node examples/dongle-details.ts

import Teleleo from 'teleleo';

const client = new Teleleo();
const page = await client.dongles.list({ is_short: true });
const dongles = await Promise.all(page.items.map((d) => client.dongles.get(d.dongle_id)));
for (const dongle of dongles) console.log(dongle.dongle_id, dongle.name, dongle.dongle_online_status);
