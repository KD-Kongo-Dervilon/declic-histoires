import test from 'node:test';
import assert from 'node:assert/strict';
import {episode01} from '../src/content/episode01.ts';
import {newGame,pickChoice,nextScene,validateEpisode,endingNodes} from '../src/engine/story.ts';
test('intégrité et accessibilité du graphe',()=>{assert.deepEqual(validateEpisode(episode01),[]);assert.equal(endingNodes(episode01).length,9)});
test('trois scènes de contexte avant la première décision',()=>{let s=newGame(episode01);assert.equal(s.nodeId,'souvenir');for(const target of ['message','attente','premier-choix']){s=nextScene(episode01,s);assert.equal(s.nodeId,target)}});
test('chaque décision du joueur bifurque vers une fin différente',()=>{const end=new Set();for(const first of episode01.nodes['premier-choix'].choices){let s=newGame(episode01);s={...s,nodeId:'premier-choix'};s=pickChoice(episode01,s,first.id);assert.equal(episode01.nodes[s.nodeId].kind,'reaction');s=nextScene(episode01,s);assert.equal(episode01.nodes[s.nodeId].kind,'decision');for(const second of episode01.nodes[s.nodeId].choices){const final=pickChoice(episode01,s,second.id);assert.equal(episode01.nodes[final.nodeId].kind,'ending');end.add(final.nodeId);assert.equal(final.history.length,2)}}assert.equal(end.size,9)});
test('choix invalide n’altère pas le parcours',()=>{const s=newGame(episode01);assert.deepEqual(pickChoice(episode01,s,'unknown'),s)});
