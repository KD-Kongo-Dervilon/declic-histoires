import test from 'node:test';
import assert from 'node:assert/strict';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,endingNodes,validateEpisode} from '../src/engine/story.ts';
import {emptyProgress,discoverEnding,isUnlocked,endingCount} from '../src/engine/progress.ts';

test('each episode has exactly nine reachable endings; episode one adds deeper chapters',()=>{
 assert.equal(episodes.length,6);
 const all=new Set();
 for(const e of episodes){
  assert.deepEqual(validateEpisode(e),[],`${e.id} graph`);
  assert.equal(endingNodes(e).length,9,`${e.id} endings`);
  const found=new Set();
  const counts=[];
  function walk(state,depth=0){
   assert.ok(depth<50,'story must terminate');
   const node=e.nodes[state.nodeId];assert.ok(node);
   if(node.kind==='ending'){
    found.add(node.id);all.add(e.id+'/'+node.id);
    counts.push(state.history.length);return;
   }
   if(node.kind==='decision'){
    for(const ch of node.choices){
     const next=pickChoice(e,state,ch.id,'Confiance');
     assert.equal(next.history.at(-1).emotion,'Confiance');
     walk(next,depth+1);
    }
   }else{walk(nextScene(e,state),depth+1)}
  }
  walk(newGame(e));
  assert.equal(found.size,9,`unique endings: ${e.id}`);
  assert.ok(e.id!=='ce-qu-on-na-pas-dit'||counts.every(c=>c>=3),'chaptered opening includes an actual third decision');
 }
 assert.equal(all.size,54);
});
test('one ending unlocks the next episode; replay keeps distinct endings',()=>{
 let p=emptyProgress();
 for(let i=0;i<episodes.length;i++){
  const e=episodes[i];
  assert.equal(isUnlocked(p,episodes,i),true);
  if(i+1<episodes.length)assert.equal(isUnlocked(p,episodes,i+1),false);
  p=discoverEnding(p,e,endingNodes(e)[0]);
  p=discoverEnding(p,e,endingNodes(e)[0]);
  assert.equal(endingCount(p,e.id),1);
 }
 assert.equal(p.completed.length,6);
});
