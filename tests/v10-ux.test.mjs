import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,validateEpisode,endingNodes} from '../src/engine/story.ts';
const ep=episodes[0];
test('the opening is coherent and offers a meaningful first choice after one short scene',()=>{
 assert.equal(ep.start,'ouverture');
 assert.equal(ep.nodes[ep.start].kind,'scene');
 const next=nextScene(ep,newGame(ep));assert.equal(next.nodeId,'choix-atelier');
 assert.equal(ep.nodes[next.nodeId].kind,'decision');
 assert.equal(ep.nodes[next.nodeId].choices.length,3);
});
test('Monday evening words change a specific concrete event at the Wednesday bench',()=>{
 const cases=[
  ['soir-clair','banc-veille-clair'],
  ['soir-vague','banc-veille-vague'],
  ['soir-muet','banc-veille-muet']
 ];
 for(const [choice,expected] of cases){
  let state=nextScene(ep,newGame(ep));
  state=pickChoice(ep,state,'atelier-promettre');
  let visited=0;
  while(state.nodeId!=='choix-soir'&&visited++<12)state=nextScene(ep,state);
  assert.equal(state.nodeId,'choix-soir');
  state=pickChoice(ep,state,choice);
  visited=0;
  while(state.nodeId!=='choix-photo'&&visited++<12)state=nextScene(ep,state);
  assert.equal(state.nodeId,'choix-photo');
  state=pickChoice(ep,state,'photo-direct');
  visited=0;
  while(state.nodeId!=='banc-contexte'&&visited++<12)state=nextScene(ep,state);
  assert.equal(state.nodeId,'banc-contexte');
  state=nextScene(ep,state);
  assert.equal(state.nodeId,expected);
 }
});
test('all episodes remain reachable with 9 endings',()=>{
 for(const e of episodes){assert.deepEqual(validateEpisode(e),[],e.title);assert.equal(endingNodes(e).length,9);}
});
test('audio and deleting progression are confined to settings',()=>{
 const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 const insights=readFileSync(new URL('../src/features/Insights.tsx',import.meta.url),'utf8');
 assert.ok(app.includes('soundPanel={<>'));
 assert.ok(!app.includes('className="season-reset"'));
 assert.ok(insights.includes('<details className="settings-danger">'));
});
