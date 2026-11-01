import type {NarrativeNode,HistoryEntry,Impact} from '../types';
export type StoryVariation={text:string;dialogue?:string;consequence?:string;mode:'ai'|'offline'};
const endpoint=(import.meta.env.VITE_DEClic_AI_URL as string|undefined)?.replace(/\/$/,'');
export function narrativeAIEnabled(){return Boolean(endpoint&&/^https:\/\//.test(endpoint))}
export async function narratePage(opts:{episodeId:string;node:NarrativeNode;history:HistoryEntry[];impact:Impact;signal:AbortSignal}):Promise<StoryVariation>{
 if(!narrativeAIEnabled())return {text:opts.node.text,dialogue:opts.node.dialogue,mode:'offline'};
 const controller=new AbortController();
 const relay=()=>controller.abort();opts.signal.addEventListener('abort',relay,{once:true});
 const timeout=setTimeout(()=>controller.abort(),9500);
 try{
  const resp=await fetch(`${endpoint}/narrate`,{method:'POST',headers:{'content-type':'application/json'},signal:controller.signal,body:JSON.stringify({episodeId:opts.episodeId,scene:{id:opts.node.id,kind:opts.node.kind,title:opts.node.title,text:opts.node.text,dialogue:opts.node.dialogue,allowedChoices:opts.node.choices?.map(c=>({id:c.id,title:c.title,words:c.words}))||[]},history:opts.history.slice(-10).map(x=>({id:x.id,label:x.label,emotion:x.emotion})),impact:opts.impact})});
  if(!resp.ok)throw Error('narration non disponible');
  const data=await resp.json() as {text?:unknown;dialogue?:unknown;consequence?:unknown};
  if(typeof data.text!=='string'||data.text.length<15||data.text.length>900)throw Error('format IA invalide');
  return {text:data.text,dialogue:typeof data.dialogue==='string'?data.dialogue.slice(0,180):opts.node.dialogue,consequence:typeof data.consequence==='string'?data.consequence.slice(0,160):undefined,mode:'ai'};
 }catch{
  return {text:opts.node.text,dialogue:opts.node.dialogue,mode:'offline'};
 }finally{clearTimeout(timeout);opts.signal.removeEventListener('abort',relay)}
}
