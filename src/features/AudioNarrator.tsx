import {useEffect,useRef,useState} from 'react';
import type {NarrationAsset} from '../content/audioManifest';
import './audio-narrator.css';

type Status='idle'|'loading'|'playing'|'paused';
type Props={text:string;pageKey:string;recording?:NarrationAsset|null;sampleId?:string|null};
const RATE_KEY='declic:narrator-rate';
const rates=[0.8,1,1.15,1.25];
// A single generated sample is reused during this browser session.
const sampleCache=new Map<string,string>();

export function AudioNarrator({text,pageKey,recording,sampleId}:Props){
 const audio=useRef<HTMLAudioElement|null>(null);
 const pending=useRef<AbortController|null>(null);
 const [status,setStatus]=useState<Status>('idle');
 const [rate,setRate]=useState<number>(()=>{
  try{const n=Number(localStorage.getItem(RATE_KEY));return rates.includes(n)?n:1}catch{return 1}
 });
 const [error,setError]=useState('');
 const available=Boolean(recording?.src||sampleId);
 useEffect(()=>{
  const player=audio.current;
  pending.current?.abort();
  pending.current=null;
  if(player){player.pause();player.removeAttribute('src');player.load()}
  setStatus('idle');setError('');
  return ()=>{pending.current?.abort();player?.pause()};
 },[pageKey,recording?.src,sampleId]);
 const toggle=async()=>{
  if(!available)return;
  let player=audio.current;
  if(!player){player=new Audio();audio.current=player}
  const selected=player;
  selected.onended=()=>setStatus('idle');
  selected.onerror=()=>{setStatus('idle');setError('Impossible de lire cet enregistrement.')};
  if(status==='playing'){selected.pause();setStatus('paused');return}
  if(status==='paused'){
   try{await selected.play();setStatus('playing')}
   catch{setError('Impossible de reprendre la narration');setStatus('idle')}
   return;
  }
  setError('');
  setStatus('loading');
  let src=recording?.src;
  if(!src&&sampleId){
   src=sampleCache.get(sampleId);
   if(!src){
    const controller=new AbortController();
    pending.current=controller;
    try{
     const response=await fetch('/api/audio/narrate',{
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({sampleId}),signal:controller.signal
     });
     if(!response.ok){
      const data=await response.json().catch(()=>({error:''})) as {error?:string};
      throw new Error(data.error||'Narration ElevenLabs indisponible');
     }
     const blob=await response.blob();
     if(controller.signal.aborted)return;
     src=URL.createObjectURL(blob);
     sampleCache.set(sampleId,src);
    }catch(e){
     if(controller.signal.aborted)return;
     setError(e instanceof Error?e.message:'Erreur de narration');
     setStatus('idle');return;
    }finally{if(pending.current===controller)pending.current=null}
   }
  }
  if(!src)return;
  selected.src=src;
  selected.playbackRate=rate;
  try{await selected.play();setStatus('playing')}
  catch{setError('Impossible de démarrer la lecture audio');setStatus('idle')}
 };
 const stop=()=>{
  pending.current?.abort();pending.current=null;
  if(audio.current){audio.current.pause();audio.current.currentTime=0}
  setStatus('idle');
 };
 const changeRate=(next:number)=>{
  setRate(next);
  try{localStorage.setItem(RATE_KEY,String(next))}catch{}
  if(audio.current)audio.current.playbackRate=next;
 };
 return <section className="v11-narrator" aria-label="Narration audio de la page">
  <div className="v11-narrator__heading"><span aria-hidden="true">♫</span> ÉCOUTER CETTE PAGE
   <small>{recording?.src?'Voix ElevenLabs · enregistrement':sampleId?'Voix ElevenLabs · essai API':'Narration ElevenLabs en préparation'}</small>
  </div>
  {available?<div className="v11-narrator__controls">
   <button type="button" disabled={status==='loading'} onClick={()=>void toggle()} aria-label={status==='playing'?'Mettre la narration en pause':status==='paused'?'Reprendre la narration':'Écouter la page'}>{status==='loading'?'Préparation…':status==='playing'?'⏸ Pause':status==='paused'?'▶ Reprendre':'▶ Écouter'}</button>
   <button type="button" onClick={stop} disabled={status==='idle'}>■ Arrêter</button>
   <label>Vitesse <select value={rate} onChange={e=>changeRate(Number(e.target.value))}>{rates.map(r=><option key={r} value={r}>{r.toFixed(2).replace(/0$/,'')}×</option>)}</select></label>
  </div>:<p className="v11-narrator__status">La narration ElevenLabs n'est pas encore disponible pour cette page.</p>}
  {available&&<span className="v11-narrator__status" role="status">{error|| (status==='loading'?'Génération de la voix…':status==='playing'?'Narration en cours':status==='paused'?'Narration en pause':'Prêt à écouter')}</span>}
  <span className="v11-narrator__sr-only">{text}</span>
 </section>;
}
