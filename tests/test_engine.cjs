const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path=require('node:path');
const root=path.join(__dirname,'..');
const context=vm.createContext({structuredClone});
vm.runInContext(fs.readFileSync(path.join(root,'src/content/episode01.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'src/core/engine.js'),'utf8'),context);
const { episode, make } = vm.runInContext('({episode: EPISODE, make:createEngine})',context);
assert.equal(Object.values(episode.nodes).filter(n=>n.type==='ending').length,9);
for (const [i,first] of episode.nodes.first.choices.entries()) {
  for (const [j] of [0,1,2].entries()) {
    const e=make(episode);e.start();
    assert.equal(e.getNode().type,'choice');
    e.choose(first.id);assert.equal(e.getNode().type,'dialogue');
    e.next();assert.equal(e.getNode().type,'choice');
    const second=e.getNode().choices[j];e.choose(second.id);
    assert.equal(e.getNode().type,'ending');
    assert.equal(e.getState().history.length,2);
    e.debrief();assert.equal(e.getState().screen,'debrief');
    e.saveReflection('nexttime','Test');assert.equal(e.getState().reflection.nexttime,'Test');
  }
}
const e=make(episode);
assert.equal(e.load({screen:'story',nodeId:null,history:[],reflection:{}}),false,'corrupt state rejected');
console.log('PASS: nine branches, debrief, state validation');
