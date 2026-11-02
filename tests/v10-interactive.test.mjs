import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('opening scene establishes the relationship before the first decision',()=>{
 const x=read('src/content/episode01Novel.ts');
 assert.match(x,/Léa et Noa sont amis depuis trois ans/);
 assert.match(x,/choix-atelier/);
 assert.match(x,/nextByChoice/);
});
test('audio studio is only in Settings and reset hidden from dashboard',()=>{
 const app=read('src/App.tsx');const insights=read('src/features/Insights.tsx');
 assert.equal((app.match(/<details className="sound-studio"/g)||[]).length,1);
 assert.ok(app.includes('soundPanel={<>' ) && insights.includes('{soundPanel}'));
 assert.ok(insights.includes('<details className="settings-danger">'));
 assert.ok(!app.includes('className="season-reset"'));
});
