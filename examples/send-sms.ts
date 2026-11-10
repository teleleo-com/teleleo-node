// Send an SMS from a modem and handle the errors the API can answer with.
//
//     export TELELEO_API_KEY=...
//     node examples/send-sms.ts 1234 +447700900123 "Hello from Teleleo"

import Teleleo, { BadRequestError, NotFoundError, SmsStatus } from 'teleleo';

const [dongleId, number, message] = process.argv.slice(2);
if (!dongleId || !number || !message) throw new Error('usage: send-sms.ts <dongle_id> <number> <message>');

const client = new Teleleo();

try {
  const sms = await client.sms.send(Number(dongleId), { number, message });
  // SENT means the mobile network accepted the SMS, not that the handset received it.
  console.log(`SMS ${sms.sms_id} created, sent: ${sms.sms_status_id === SmsStatus.SENT}`);
} catch (error) {
  if (error instanceof NotFoundError) console.error(`Modem ${dongleId} is not in this account`);
  else if (error instanceof BadRequestError)
    console.error('Not sent:', error.errorMessage, error.errorDetails);
  else throw error;
  process.exitCode = 1;
}
