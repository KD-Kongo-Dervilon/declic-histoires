import type {Episode} from '../types';
import {episodes as season} from '../content/episodes.ts';
export interface Progress {completed:string[]; endings:Record<string,string[]>; lastEpisode:string | null;}
const KEY='declic:progress:v5';
export const emptyProgress=():Progress=>({completed:[],endings:{},lastEpisode:null});
export function clearProgress(){try{localStorage.removeItem(KEY)}catch{}}
export function loadProgress():Progress {
 try {
  const raw=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!raw||!raw.endings||typeof raw.endings!=='object')return emptyProgress();
  const endings:Record<string,string[]>={};
  for(const e of season){
   const saved=raw.endings[e.id];
   endings[e.id]=Array.isArray(saved)?[...new Set(saved.filter((id:unknown):id is string=>typeof id==='string'&&e.nodes[id]?.kind==='ending'))]:[];
  }
  const completed=season.filter(e=>endings[e.id].length>0).map(e=>e.id);
  const lastEpisode=typeof raw.lastEpisode==='string'&&completed.includes(raw.lastEpisode)?raw.lastEpisode:null;
  return {completed,endings,lastEpisode};
 } catch {return emptyProgress()}
}
export function saveProgress(p:Progress){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
export function discoverEnding(p:Progress,episode:Episode,endingId:string):Progress{
 if(episode.nodes[endingId]?.kind!=='ending')return p;
 const prev=p.endings[episode.id]??[];
 const endings={...p.endings,[episode.id]:prev.includes(endingId)?prev:[...prev,endingId]};
 const completed=p.completed.includes(episode.id)?p.completed:[...p.completed,episode.id];
 return {completed,endings,lastEpisode:episode.id};
}
export function isUnlocked(p:Progress,ordered:Episode[],index:number){
 if(!Number.isInteger(index)||index<0||index>=ordered.length)return false;
 if(index===0)return true;
 // Previously saved `completed` alone is not proof of reaching an ending.
 return ordered.slice(0,index).every(e=>Array.isArray(p.endings[e.id])&&p.endings[e.id].some(id=>e.nodes[id]?.kind==='ending'));
}
export function endingCount(p:Progress,episodeId:string){return p.endings[episodeId]?.length??0}
