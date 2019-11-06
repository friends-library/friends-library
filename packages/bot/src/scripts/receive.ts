import '@friends-library/env/load';
import env from '@friends-library/env';
import path from 'path';
import nodeFetch from 'node-fetch';
import fs from 'fs';
import uuid from 'uuid/v4';
import CryptoJS from 'crypto-js';

const { BOT_WEBHOOK_PROXY_URL, BOT_WEBHOOK_SECRET } = env.require(
  'BOT_WEBHOOK_SECRET',
  'BOT_WEBHOOK_PROXY_URL',
);

const {
  argv: [, , fixture],
} = process;

try {
  const filepath = path.resolve(
    __dirname,
    '..',
    '__tests__',
    'fixtures',
    `${fixture}.json`,
  );
  if (!fs.existsSync(filepath)) {
    throw new Error(`Filepath ${filepath} for fixture ${fixture} does not exist.`);
  }

  const payload = JSON.parse(fs.readFileSync(filepath).toString());
  if (!payload.__github_event__) {
    throw new Error('Payload must have `__github_event__` prop.');
  }

  const event = payload.__github_event__;
  delete payload.event;

  nodeFetch(BOT_WEBHOOK_PROXY_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': event,
      'X-GitHub-Delivery': uuid(),
      'X-Hub-Signature': getSignature(payload),
    },
    body: JSON.stringify(payload),
  });
} catch (e) {
  console.log(`ERROR: ${e.message}`);
}

// @see https://stackoverflow.com/questions/44850789
function getSignature(payload: Record<string, any>): string {
  const sha = CryptoJS.HmacSHA1(JSON.stringify(payload), BOT_WEBHOOK_SECRET);
  return `sha1=${sha.toString(CryptoJS.enc.Hex)}`;
}
