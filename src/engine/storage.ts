import type {StoryState} from '../types';
const KEY='declic:pwa:ep1:v4';
export function saveGame(state:StoryState){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
export function loadGame():StoryState|null{try{const raw=localStorage.getItem(KEY);if(!raw)return null;const s=JSON.parse(raw) as StoryState;if(!s||typeof s.nodeId!=='string'||!Array.isArray(s.history)||!Array.isArray(s.visited)||!s.impact)return null;return s}catch{return null}}
export function clearGame(){try{localStorage.removeItem(KEY)}catch{}}
