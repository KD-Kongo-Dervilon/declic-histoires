import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/ai/src/index.ts';
const origin='https://declic-histoires.vercel.app';
const payload={episodeId:'ce-qu-on-na-pas-dit',scene:{id:'intro-decision',kind:'decision',title:'La photo',text:'Léa découvre une photographie de Noa à l’atelier.'},history:[],impact:{relation:1,tension:0,expression:1}};
const call=(from=origin)=>new Request('https://worker.test/narrate',{method:'POST',headers:{Origin:from,'content-type':'application/json'},body:JSON.stringify(payload)});
test('Cloudflare AI is never faked when binding is absent',async()=>{const env={ALLOWED_ORIGIN:origin,AI_MODEL:'@cf/meta/llama-3.1-8b-instruct-fp8'};assert.equal((await worker.fetch(call(),env)).status,503);assert.equal((await worker.fetch(call('https://bad.example'),env)).status,403)});
test('valid model output is constrained to fiction text, not unlocks',async()=>{const env={ALLOWED_ORIGIN:origin,AI_MODEL:'@cf/meta/llama-3.1-8b-instruct-fp8',AI:{async run(){return {response:JSON.stringify({text:'Noa lit son message et pose le carnet bleu sur le banc, sans parler.',dialogue:'Je ne savais pas.',consequence:'Elle hésite encore.'})}}}};const resp=await worker.fetch(call(),env);assert.equal(resp.status,200);const data=await resp.json();assert.equal(data.mode,'ai');assert.equal(data.dialogue,'Je ne savais pas.');assert.equal('choices' in data,false)});
