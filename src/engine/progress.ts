import type {Episode, HistoryEntry, Impact, StoryState} from '../types';
import {episodes as season} from '../content/episodes.ts';

export type Journey = {
 id:string; episodeId:string; endingId:string; finishedAt:string;
 choices:HistoryEntry[]; emotions:string[]; impact:Impact; reflection:string;
};
export interface Progress {
 completed:string[]; endings:Record<string,string[]>; lastEpisode:string|null;
 journeys?:Journey[];
}
const KEY='declic:progress:v5';
export const emptyProgress=():Progress=>({completed:[],endings:{},lastEpisode:null,journeys:[]});
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
  const journeys:Journey[]=Array.isArray(raw.journeys)?raw.journeys.filter((j:unknown):j is Journey=>{
   if(!j||typeof j!=='object')return false;
   const a=j as Partial<Journey>;
   const ep=season.find(e=>e.id===a.episodeId);
   return !!ep&&typeof a.endingId==='string'&&ep.nodes[a.endingId]?.kind==='ending'&&Array.isArray(a.choices)&&typeof a.finishedAt==='string';
  }).slice(-60).map((journey:Journey)=>({
   ...journey,
   emotions:Array.isArray(journey.emotions)?journey.emotions:[],
   impact:{relation:0,tension:0,expression:0,...(journey.impact as Partial<Impact>)}
  })):[];
  return {completed,endings,lastEpisode,journeys};
 }catch{return emptyProgress()}
}
export function saveProgress(p:Progress){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
export function discoverEnding(p:Progress,episode:Episode,endingId:string,game?:StoryState):Progress{
 if(episode.nodes[endingId]?.kind!=='ending')return p;
 const prev=p.endings[episode.id]??[];
 const endings={...p.endings,[episode.id]:prev.includes(endingId)?prev:[...prev,endingId]};
 const completed=p.completed.includes(episode.id)?p.completed:[...p.completed,episode.id];
 const entry:Journey|null=game?{
  id:`${episode.id}-${endingId}-${Date.now()}`,
  episodeId:episode.id,endingId,finishedAt:new Date().toISOString(),
  choices:game.history.map(h=>({...h})),
  emotions:[...new Set(game.history.map(h=>h.emotion).filter((e):e is string=>!!e))],
  impact:{...game.impact},reflection:game.reflection||''
 }:null;
 return {completed,endings,lastEpisode:episode.id,journeys:entry?[...(p.journeys||[]),entry].slice(-60):p.journeys||[]};
}
export function isUnlocked(p:Progress,ordered:Episode[],index:number){
 if(!Number.isInteger(index)||index<0||index>=ordered.length)return false;
 if(index===0)return true;
 return ordered.slice(0,index).every(e=>Array.isArray(p.endings[e.id])&&p.endings[e.id].some(id=>e.nodes[id]?.kind==='ending'));
}
export function endingCount(p:Progress,episodeId:string){return p.endings[episodeId]?.length??0}
export const emotionTallies=(progress:Progress)=>{
 const counts:Record<string,number>={};
 for(const journey of progress.journeys||[])for(const e of journey.emotions){counts[e]=(counts[e]||0)+1}
 return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
};
