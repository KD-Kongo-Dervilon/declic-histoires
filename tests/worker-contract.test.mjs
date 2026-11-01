import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const worker=fs.readFileSync(new URL('../workers/ai/src/index.ts',import.meta.url),'utf8');
test('worker privacy and server-side AI binding',()=>{assert.match(worker,/env\.AI\.run/);assert.match(worker,/ALLOWED_ORIGIN/);assert.match(worker,/content.*?type|Content-Type/i);assert.match(worker,/no-store/);assert.match(worker,/input\.text\.length>220/)});
