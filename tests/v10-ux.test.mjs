import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,validateEpisode,endingNodes} from '../src/engine/story.ts';
const ep=episodes[0];
test('the opening is already playable, before a wall of narrative',()=>{
 assert.equal(ep.start,'intro-decision');
 assert.equal(ep.nodes[ep.start].kind,'decision');
 assert.equal(ep.nodes[ep.start].choices.length,3);
});
test('the first choice has an immediate and later consequence',()=>{
 const pairs=[['intro-franche','retour-franche'],['intro-camille','retour-camille'],['intro-silence','retour-silence']];
 for(const [choice,expected] of pairs){
  let state=pickChoice(ep,newGame(ep),choice);
  assert.ok(state.nodeId.startsWith('intro-suite-'));
  let encounter=false;
  for(let step=0;step<30;step++){
   if(state.nodeId==='chapitre-rencontre'){state=nextScene(ep,state);encounter=true;break;}
   const node=ep.nodes[state.nodeId];
   state=node.kind==='decision'?pickChoice(ep,state,node.choices[0].id):nextScene(ep,state);
  }
  assert.equal(encounter,true);
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
