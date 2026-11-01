import type {Episode} from '../types';
export interface Progress {completed:string[]; endings:Record<string,string[]>; lastEpisode:string | null;}
const KEY='declic:progress:v5';
export const emptyProgress=():Progress=>({completed:[],endings:{},lastEpisode:null});
export function loadProgress():Progress {try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&Array.isArray(raw.completed)&&typeof raw.endings==='object'&&raw.endings)return {completed:raw.completed.filter((x:unknown)=>typeof x==='string'),endings:raw.endings,lastEpisode:typeof raw.lastEpisode==='string'?raw.lastEpisode:null}}catch{}return emptyProgress()}
export function saveProgress(p:Progress){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
export function discoverEnding(p:Progress,episode:Episode,endingId:string):Progress{
 if(episode.nodes[endingId]?.kind!=='ending')return p;
 const prev=p.endings[episode.id]??[];
 const endings={...p.endings,[episode.id]:prev.includes(endingId)?prev:[...prev,endingId]};
 const completed=p.completed.includes(episode.id)?p.completed:[...p.completed,episode.id];
 return {completed,endings,lastEpisode:episode.id};
}
export function isUnlocked(p:Progress,ordered:Episode[],index:number){return index===0||ordered.slice(0,index).every(e=>p.completed.includes(e.id))}
export function endingCount(p:Progress,episodeId:string){return p.endings[episodeId]?.length??0}
