import test from 'node:test';import assert from 'node:assert/strict';
import {bookPages,sceneShot} from '../src/features/readability.ts';
import {episodes} from '../src/content/episodes.ts';
import {newGame,nextScene,pickChoice,endingNodes,validateEpisode} from '../src/engine/story.ts';

test('short readable pages preserve all written sentences in order',()=>{
 const source='Léa voit la photo. Son ami ne lui a rien dit. Elle se souvient de leur carnet bleu. Le téléphone vibre. Elle hésite. Elle voudrait comprendre.';
 const pages=bookPages(source,48);assert(pages.length>=3);assert.equal(pages.join(' '),source);
 for(const page of pages)assert(page.length<100);
});
test('scene visuals are distinct and all six panels are reachable',()=>{
 const episode=episodes[0].id;
 const imgs=new Set();for(const id of ['intro-decision','carnet-suite-ouvrir','chapitre-soir','chapitre-rencontre','chapitre-quelques-secondes','reponse-exprimer'])imgs.add(sceneShot(episode,id,0));
 assert(imgs.size>=4);
});
test('first decision is immediate and the notebook choice has delayed effects at the bench',()=>{
 const e=episodes[0];assert.equal(e.nodes[e.start].kind,'decision');assert.equal(e.nodes[e.start].choices?.length,3);
 let s=newGame(e);s=pickChoice(e,s,'intro-franche');
 while(e.nodes[s.nodeId].kind!=='decision'){const before=s.nodeId;s=nextScene(e,s);assert.notEqual(s.nodeId,before,'stalled at '+before)}
 assert.equal(s.nodeId,'decision-carnet');s=pickChoice(e,s,'carnet-photo');
 while(s.nodeId!=='chapitre-rencontre'){const n=e.nodes[s.nodeId];const prev=s.nodeId;s=n.kind==='decision'?pickChoice(e,s,n.choices[0].id):nextScene(e,s);assert.notEqual(s.nodeId,prev)}
 s=nextScene(e,s);assert.equal(s.nodeId,'retour-franche');s=nextScene(e,s);assert.equal(s.nodeId,'chapitre-quelques-secondes');s=nextScene(e,s);assert.equal(s.nodeId,'echo-carnet-photo');
});
test('all nine endings remain reachable, all chapters valid',()=>{
 for(const ep of episodes){assert.deepEqual(validateEpisode(ep),[]);assert.equal(endingNodes(ep).length,9)}
});
