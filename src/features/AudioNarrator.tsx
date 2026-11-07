import {useEffect,useRef,useState} from 'react';
import type {NarrationAsset} from '../content/audioManifest';
import './audio-narrator.css';

type Status='idle'|'playing'|'paused';
type Props={text:string;pageKey:string;recording?:NarrationAsset|null};
const RATE_KEY='declic:narrator-rate';
const rates=[0.8,1,1.15,1.25];

/**
 * Plays only approved narration files. Never silently substitutes
 * the device's robotic voice for the selected ElevenLabs narrator.
 */
export function AudioNarrator({text,pageKey,recording}:Props){
 const media=useRef<HTMLAudioElement|null>(null);
 const [status,setStatus]=useState<Status>('idle');
 const [rate,setRate]=useState<number>(()=>{
  try{const n=Number(localStorage.getItem(RATE_KEY));return rates.includes(n)?n:1}catch{return 1}
 });
 const [error,setError]=useState('');
 const recorded=Boolean(recording?.src);
 useEffect(()=>{
  const current=media.current;
  if(current){current.pause();current.currentTime=0}
  setStatus('idle');setError('');
  return ()=>{current?.pause()};
 },[pageKey,recording?.src]);

 const toggle=async()=>{
  const player=media.current;
  if(!recorded||!player)return;
  if(status==='playing'){player.pause();setStatus('paused');return}
  setError('');
  try{
   player.playbackRate=rate;
   await player.play();
   setStatus('playing');
  }catch{setStatus('idle');setError('Impossible de lire cet enregistrement sur cet appareil.')}
 };
 const stop=()=>{
  if(media.current){media.current.pause();media.current.currentTime=0}
  setStatus('idle');
 };
 const changeRate=(next:number)=>{
  setRate(next);
  try{localStorage.setItem(RATE_KEY,String(next))}catch{}
  if(media.current)media.current.playbackRate=next;
 };
 return <section className="v11-narrator" aria-label="Narration audio de la page">
  {recording&&<audio ref={media} src={recording.src} preload="none" onEnded={()=>setStatus('idle')} onError={()=>{setStatus('idle');setError('Enregistrement indisponible.')}} />}
  <div className="v11-narrator__heading"><span aria-hidden="true">♫</span> ÉCOUTER CETTE PAGE
   <small>{recorded?'Narration enregistrée · ElevenLabs':'Narration ElevenLabs en préparation'}</small>
  </div>
  {recorded?<div className="v11-narrator__controls">
   <button type="button" onClick={()=>void toggle()} aria-label={status==='playing'?'Mettre la narration en pause':status==='paused'?'Reprendre la narration':'Écouter la page'}>{status==='playing'?'⏸ Pause':status==='paused'?'▶ Reprendre':'▶ Écouter'}</button>
   <button type="button" onClick={stop} disabled={status==='idle'}>■ Arrêter</button>
   <label>Vitesse <select value={rate} onChange={e=>changeRate(Number(e.target.value))}>{rates.map(r=><option key={r} value={r}>{r.toFixed(2).replace(/0$/,'')}×</option>)}</select></label>
  </div>:<p className="v11-narrator__status">La voix sélectionnée n'est pas encore disponible pour ce passage. Aucun enregistrement ElevenLabs n'a été ajouté.</p>}
  {recorded&&<span className="v11-narrator__status" role="status">{error|| (status==='playing'?'Narration en cours':status==='paused'?'Narration en pause':'Enregistrement prêt')}</span>}
  <span className="v11-narrator__sr-only">{text}</span>
 </section>;
}
