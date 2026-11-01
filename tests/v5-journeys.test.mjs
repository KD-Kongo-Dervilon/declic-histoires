import test from 'node:test';
import assert from 'node:assert/strict';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,endingNodes,validateEpisode} from '../src/engine/story.ts';
import {emptyProgress,discoverEnding,isUnlocked,endingCount} from '../src/engine/progress.ts';

test('every DÉCLIC episode has nine reachable, different endings',()=>{
 assert.equal(episodes.length,6);
 const total=new Set();
 for(const e of episodes){
  assert.deepEqual(validateEpisode(e),[],`${e.id} graph`);
  assert.equal(endingNodes(e).length,9,`${e.id} endings`);
  let progress=newGame(e);
  for(let i=0;i<3;i++)progress=nextScene(e,progress);
  assert.equal(e.nodes[progress.nodeId].kind,'decision',`${e.id} first decision`);
  const ends=new Set();
  for(const first of e.nodes[progress.nodeId].choices){
   let s=pickChoice(e,progress,first.id);
   assert.equal(e.nodes[s.nodeId].kind,'reaction');
   s=nextScene(e,s);
   assert.equal(e.nodes[s.nodeId].kind,'decision');
   for(const second of e.nodes[s.nodeId].choices){
    const end=pickChoice(e,s,second.id);
    assert.equal(e.nodes[end.nodeId].kind,'ending');
    assert.equal(end.history.length,2);
    ends.add(end.nodeId);total.add(`${e.id}/${end.nodeId}`);
   }
  }
  assert.equal(ends.size,9,`unique endings: ${e.id}`);
 }
 assert.equal(total.size,54);
});

test('one ending unlocks exactly next episode and replay does not duplicate',()=>{
 let p=emptyProgress();
 for(let i=0;i<episodes.length;i++){
  const e=episodes[i];
  assert.ok(isUnlocked(p,episodes,i),`episode ${i+1} available`);
  if(i+1<episodes.length)assert.equal(isUnlocked(p,episodes,i+1),false);
  const firstEnding=endingNodes(e)[0];
  p=discoverEnding(p,e,firstEnding);
  p=discoverEnding(p,e,firstEnding);
  assert.equal(endingCount(p,e.id),1);
  assert.ok(p.completed.includes(e.id));
  if(i+1<episodes.length)assert.ok(isUnlocked(p,episodes,i+1));
 }
 assert.equal(p.completed.length,6);
 const total=Object.values(p.endings).flat().length;
 assert.equal(total,6);
});
