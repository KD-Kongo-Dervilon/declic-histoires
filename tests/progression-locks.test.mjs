import test from 'node:test';
import assert from 'node:assert/strict';
import {episodes} from '../src/content/episodes.ts';
import {emptyProgress,isUnlocked,discoverEnding,endingCount} from '../src/engine/progress.ts';
import {endingNodes} from '../src/engine/story.ts';

test('only episode one is open in a fresh session',()=>{
 const progress=emptyProgress();
 assert.deepEqual(episodes.map((_,i)=>isUnlocked(progress,episodes,i)),[true,false,false,false,false,false]);
});
test('a stale completion record cannot unlock the collection',()=>{
 const stale={completed:episodes.map(e=>e.id),lastEpisode:episodes[5].id,endings:{}};
 assert.deepEqual(episodes.map((_,i)=>isUnlocked(stale,episodes,i)),[true,false,false,false,false,false]);
});
test('one actual ending unlocks only the next story',()=>{
 let p=discoverEnding(emptyProgress(),episodes[0],endingNodes(episodes[0])[0]);
 assert.equal(endingCount(p,episodes[0].id),1);
 assert.deepEqual(episodes.map((_,i)=>isUnlocked(p,episodes,i)),[true,true,false,false,false,false]);
 p=discoverEnding(p,episodes[0],endingNodes(episodes[0])[0]);
 assert.equal(endingCount(p,episodes[0].id),1);
});
test('valid endings can unlock all in order; bad ending id cannot',()=>{
 let p=emptyProgress();
 p=discoverEnding(p,episodes[0],'not-a-real-ending');
 assert.equal(isUnlocked(p,episodes,1),false);
 for(const e of episodes.slice(0,5))p=discoverEnding(p,e,endingNodes(e)[0]);
 assert.deepEqual(episodes.map((_,i)=>isUnlocked(p,episodes,i)),[true,true,true,true,true,true]);
});
