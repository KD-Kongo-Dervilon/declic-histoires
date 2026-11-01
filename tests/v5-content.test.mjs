import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('V5 six stories and image assets are included',()=>{
 const text=read('../src/content/episodes.ts');
 const catalog=read('../src/content/catalog.ts');
 assert.equal((catalog.match(/episode:\d/g)||[]).length,6);
 assert.equal((text.match(/\{id:'[^']+',number:\d/g)||[]).length,5);
 for(let i=1;i<=6;i++)assert.ok(existsSync(new URL(`../public/assets/episode${String(i).padStart(2,'0')}.webp`,import.meta.url)));
});
test('Progress includes completion gate and deduplicated endings',()=>{
 const text=read('../src/engine/progress.ts');
 assert.match(text,/if\(episode\.nodes\[endingId\]\?\.kind!=='ending'\)/);
 assert.match(text,/prev\.includes\(endingId\)/);
 assert.match(text,/every\(e=>p\.completed\.includes\(e\.id\)\)/);
});
