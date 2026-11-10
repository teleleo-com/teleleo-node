// Print the SMS received in the last 24 hours, newest first.
//
//     export TELELEO_API_KEY=...
//     node examples/incoming-sms.ts

import Teleleo, { SmsType, toDate } from 'teleleo';

const client = new Teleleo();
const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

for await (const sms of client.sms.list({ sms_type_ids: [SmsType.INCOMING], from: since, limit: 100 })) {
  console.log(toDate(sms.created_at)?.toISOString(), sms.number_caller, sms.message_decoded);
}
