import type {StoryState} from '../types';
const key=(id:string)=>'declic:episode:v5:'+id;
export function saveGame(id:string,state:StoryState){try{localStorage.setItem(key(id),JSON.stringify(state))}catch{}}
export function loadGame(id:string):StoryState|null{try{const raw=localStorage.getItem(key(id));if(!raw)return null;const s=JSON.parse(raw) as StoryState;if(!s||typeof s.nodeId!=='string'||!Array.isArray(s.history)||!Array.isArray(s.visited)||!s.impact)return null;return s}catch{return null}}
export function clearGame(id:string){try{localStorage.removeItem(key(id))}catch{}}
