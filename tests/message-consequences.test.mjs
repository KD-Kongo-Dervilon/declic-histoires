import test from 'node:test';
import assert from 'node:assert/strict';
import {episodeById} from '../src/content/episodes.ts';
import {newGame,pickChoice,nextScene} from '../src/engine/story.ts';

test('Sami can limit the audience in two distinct ways and keep the original ending',()=>{
 const episode=episodeById['le-message-de-trop'];
 const saved={...newGame(episode),nodeId:'second-0'};
 const draft=pickChoice(episode,saved,'e0-2');
 assert.equal(draft.nodeId,'avant-le-groupe');
 for(const [choice,scene] of [['groupe-sans-nom','groupe-retrait'],['groupe-en-prive','groupe-prive']]){
  const result=pickChoice(episode,draft,choice);
  assert.equal(result.nodeId,scene);
  assert.equal(result.history.at(-1).id,choice);
  assert.equal(nextScene(episode,result).nodeId,'fin-0-2');
 }
});

test('a legacy journal entry can still be opened without impact or emotion fields',async()=>{
 const {loadProgress}=await import('../src/engine/progress.ts');
 const episode=episodeById['le-message-de-trop'];
 const old={episodeId:episode.id,endingId:'fin-0-2',choices:[],finishedAt:'2025-01-01'};
 const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 try{
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>JSON.stringify({endings:{[episode.id]:['fin-0-2']},journeys:[old]})}});
  const loaded=loadProgress();
  assert.deepEqual(loaded.journeys[0],{...old,emotions:[],impact:{relation:0,tension:0,expression:0}});
  assert.deepEqual(loaded.endings[episode.id],['fin-0-2']);
 }finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage}
});
