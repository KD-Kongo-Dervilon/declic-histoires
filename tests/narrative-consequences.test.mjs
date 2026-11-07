import test from 'node:test';
import assert from 'node:assert/strict';
import {episodeById,episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice} from '../src/engine/story.ts';
import {narrativeContext,resolveScene} from '../src/engine/consequences.ts';

const episode=episodeById['le-message-de-trop'];
function play(first,route,followup){
 let state=newGame(episode);
 const decisions=[first,route,followup];
 for(let step=0;step<50;step++){
  const node=episode.nodes[state.nodeId];
  if(node.id.startsWith('second-'))return state;
  if(node.kind==='decision'){
   const id=decisions.shift();
   assert(node.choices.some(choice=>choice.id===id),'a planned choice must belong to the current scene');
   state=pickChoice(episode,state,id);
  }else state=nextScene(episode,state);
 }
 assert.fail('the path must reach the last conversation');
}
test('three routes produce exclusive encounters before the final decision',()=>{
 const face=play('exprimer','source-confronter','face-assumer');
 const secret=play('exprimer','source-proteger','pacte-preuve');
 const help=play('exprimer','source-aide','aide-maintenant');
 assert(face.visited.includes('couloir-seul'));
 assert(secret.visited.includes('couloir-preuve'));
 assert(help.visited.includes('couloir-bureau'));
 assert(!help.visited.includes('source-face'));
 assert(!face.visited.includes('source-deleguee'));
});
test('the same later choices lead to a different conversation after earlier trust is lost',()=>{
 const heard=play('exprimer','source-proteger','pacte-preuve');
 const guarded=play('eviter','source-proteger','pacte-preuve');
 assert(heard.visited.includes('ines-ecoute'));
 assert(guarded.visited.includes('ines-distance'));
 assert(heard.visited.includes('couloir-preuve')&&guarded.visited.includes('couloir-preuve'));
});
test('waiting for Alex changes whether he returns with confirmations',()=>{
 const waited=play('exprimer','source-confronter','face-attendre');
 const named=play('exprimer','source-confronter','face-assumer');
 assert(waited.visited.includes('couloir-alex'));
 assert(named.visited.includes('couloir-seul'));
});
test('the same published ending recalls different paths',()=>{
 const a=play('exprimer','source-proteger','pacte-preuve');
 const b=play('exprimer','source-aide','aide-maintenant');
 const endingA=pickChoice(episode,a,'e0-1');
 const endingB=pickChoice(episode,b,'e0-1');
 assert.equal(endingA.nodeId,endingB.nodeId);
 assert.notEqual(resolveScene(episode,endingA).afterword,resolveScene(episode,endingB).afterword);
});
test('consequences rebuild identically after reload and tolerate an old journal without new choices',()=>{
 const state=play('exprimer','source-proteger','pacte-preuve');
 const restored=JSON.parse(JSON.stringify(state));
 assert.deepEqual(narrativeContext(episode,restored),narrativeContext(episode,state));
 const old={...newGame(episode),nodeId:'second-0',history:[{sceneId:'premier-choix',id:'exprimer',label:'Dire',words:'Je suis désolé'}]};
 assert.equal(resolveScene(episode,old).id,'second-0');
 assert.equal(pickChoice(episode,old,'e0-1').nodeId,'fin-0-1');
});
test('all actual consequence routes terminate and conditional scenes are really attainable',()=>{
 const seen=new Set(),endings=new Set();
 function walk(state,depth=0){
  assert(depth<50);
  const node=resolveScene(episode,state);seen.add(node.id);
  if(node.kind==='ending'){assert(node.afterword);endings.add(node.id);return}
  if(node.kind==='decision')node.choices.forEach(choice=>walk(pickChoice(episode,state,choice.id),depth+1));
  else walk(nextScene(episode,state),depth+1);
 }
 walk(newGame(episode));
 assert.equal(endings.size,9);
 for(const node of Object.values(episode.nodes))assert(seen.has(node.id),node.id+' must be playable');
 for(const other of episodes.filter(item=>item.id!==episode.id))assert.equal(narrativeContext(other,newGame(other)).flags.size,0);
});

test('each short episode has exclusive middle scenes and remembers them at the same ending',()=>{
 for(const id of ['invisible','juste-pour-rire','dire-non','un-pas-vers-toi']){
  const story=episodeById[id];
  let state=newGame(story);
  for(let steps=0;state.nodeId!=='relation-contretemps';steps++){
   assert(steps<25);
   const node=story.nodes[state.nodeId];
   state=node.kind==='decision'?pickChoice(story,state,node.choices[0].id):nextScene(story,state);
  }
  const outcomes=story.nodes[state.nodeId].choices.map(choice=>{
   let branch=pickChoice(story,state,choice.id);
   const exclusive=branch.nodeId;
   branch=nextScene(story,branch);
   assert.equal(branch.nodeId,'relation-retour');
   branch=nextScene(story,branch);
   branch=pickChoice(story,branch,story.nodes[branch.nodeId].choices[0].id);
   return {exclusive,ending:branch.nodeId,afterword:resolveScene(story,branch).afterword};
  });
  assert.notEqual(outcomes[0].exclusive,outcomes[1].exclusive,id);
  assert.equal(outcomes[0].ending,outcomes[1].ending,id);
  assert(outcomes.every(item=>item.afterword),id);
  assert.notEqual(outcomes[0].afterword,outcomes[1].afterword,id);
 }
});
