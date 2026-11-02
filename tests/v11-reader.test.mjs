import test from 'node:test';import assert from 'node:assert/strict';
import {bookPages,sceneShot} from '../src/features/readability.ts';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,endingNodes,validateEpisode} from '../src/engine/story.ts';

test('short readable pages preserve sentences in order',()=>{
 const source='Léa voit la photo. Son ami ne lui a rien dit. Elle se souvient de leur carnet bleu. Le téléphone vibre. Elle hésite.';
 const pages=bookPages(source,48);assert(pages.length>=2);assert.equal(pages.join(' '),source);
});
test('visuals change with each significant scene',()=>{
 const id=episodes[0].id;const sample=['mardi-photo','soir-maison','ouverture','banc-arrivee','reaction-dire'];
 assert(new Set(sample.map(n=>sceneShot(id,n,0))).size>=3);
});
test('story starts with clear context, then offers a real choice',()=>{
 const e=episodes[0];assert.equal(e.start,'ouverture');assert.match(e.nodes[e.start].text,/Léa et Noa sont amis depuis trois ans/);
 let s=nextScene(e,newGame(e));assert.equal(s.nodeId,'choix-atelier');assert.equal(e.nodes[s.nodeId].choices.length,3);
});
test('all nine endings remain reachable and no unreachable passages remain',()=>{
 for(const ep of episodes){assert.deepEqual(validateEpisode(ep),[]);assert.equal(endingNodes(ep).length,9)}
});
test('every first choice changes something visible at the later bench encounter',()=>{
 const e=episodes[0], results=new Set();
 for(const first of ['atelier-promettre','atelier-prevenir','atelier-esquiver']){
  let s=nextScene(e,newGame(e));s=pickChoice(e,s,first);
  for(let i=0;i<30 && s.nodeId!=='banc-echo';i++){
   const node=e.nodes[s.nodeId];s=node.kind==='decision'?pickChoice(e,s,node.choices[0].id):nextScene(e,s);
  }
  assert.equal(s.nodeId,'banc-echo');s=nextScene(e,s);results.add(s.nodeId);
 }
 assert.equal(results.size,3);
});
test('opening to endings is chronologically ordered for all decision paths',()=>{
 const e=episodes[0], finishes=new Set();let paths=0;
 function visit(s,depth=0){assert(depth<35,'cycle in story');const node=e.nodes[s.nodeId];assert(node,'missing scene '+s.nodeId);
  if(node.kind==='ending'){finishes.add(node.id);paths++;return}
  if(node.kind==='decision'){for(const c of node.choices)visit(pickChoice(e,s,c.id),depth+1)}
  else visit(nextScene(e,s),depth+1);
 }
 visit(newGame(e));assert.deepEqual(finishes,new Set(endingNodes(e)));assert.equal(paths,243);
});
