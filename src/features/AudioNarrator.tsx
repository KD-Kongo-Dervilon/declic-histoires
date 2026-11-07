import {useEffect,useRef,useState} from 'react';
import type {NarrationAsset} from '../content/audioManifest';
import './audio-narrator.css';

type Status='idle'|'playing'|'paused';
type Props={text:string;pageKey:string;recording?:NarrationAsset|null};
const RATE_KEY='declic:narrator-rate';
const rates=[0.8,1,1.15,1.25];

export function AudioNarrator({text,pageKey,recording}:Props){
 const supported=typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const media=useRef<HTMLAudioElement|null>(null);
 const token=useRef(0);
 const [status,setStatus]=useState<Status>('idle');
 const [rate,setRate]=useState<number>(()=>{
  try{const n=Number(localStorage.getItem(RATE_KEY));return rates.includes(n)?n:1}catch{return 1}
 });
 const [error,setError]=useState('');
 const [usingDeviceVoice,setUsingDeviceVoice]=useState(false);
 const recorded=Boolean(recording?.src);
 const stop=()=>{
  token.current++;
  window.speechSynthesis?.cancel();
  if(media.current){media.current.pause();media.current.currentTime=0}
  setStatus('idle');
  setUsingDeviceVoice(false);
 };
 useEffect(()=>{
  token.current++;
  window.speechSynthesis?.cancel();
  if(media.current){media.current.pause();media.current.currentTime=0}
  setStatus('idle');setError('');setUsingDeviceVoice(false);
  return ()=>{
   token.current++;
   window.speechSynthesis?.cancel();
   media.current?.pause();
  };
 },[pageKey,recording?.src]);

 const startDeviceVoice=()=>{
  if(!supported)return;
  window.speechSynthesis.cancel();
  const current=++token.current;
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';utterance.rate=rate;utterance.pitch=1;
  const french=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('fr'));
  const voice=french.find(v=>v.lang.toLowerCase()==='fr-fr'&&v.localService)||french.find(v=>v.lang.toLowerCase()==='fr-fr')||french[0];
  if(voice)utterance.voice=voice;
  utterance.onend=()=>{if(token.current===current)setStatus('idle')};
  utterance.onerror=e=>{
   if(token.current!==current||e.error==='canceled'||e.error==='interrupted')return;
   setStatus('idle');setError('La lecture vocale n’a pas pu démarrer.');
  };
  setUsingDeviceVoice(true);setError('');
  window.speechSynthesis.speak(utterance);setStatus('playing');
 };
 const startRecording=async()=>{
  const element=media.current;
  if(!element)return;
  token.current++;
  setUsingDeviceVoice(false);setError('');
  element.playbackRate=rate;
  try{await element.play();setStatus('playing')}
  catch{setStatus('idle');setError('Impossible de lire cet enregistrement sur cet appareil.')}
 };
 const toggle=()=>{
  if(status==='idle'){if(recorded)void startRecording();else startDeviceVoice();return}
  if(recorded){
   const element=media.current;
   if(!element)return;
   if(status==='playing'){element.pause();setStatus('paused')}
   else void element.play().then(()=>setStatus('playing')).catch(()=>setError('Impossible de reprendre la lecture.'));
  }else if(supported){
   if(status==='playing'){window.speechSynthesis.pause();setStatus('paused')}
   else{window.speechSynthesis.resume();setStatus('playing')}
  }
 };
 const changeRate=(next:number)=>{
  setRate(next);
  try{localStorage.setItem(RATE_KEY,String(next))}catch{}
  if(media.current)media.current.playbackRate=next;
  if(!recorded&&status!=='idle')stop();
 };
 if(!recorded&&!supported)return <p className="v11-narrator-note">La narration audio n'est pas encore disponible pour cette page.</p>;
 return <section className="v11-narrator" aria-label="Narration audio de la page">
  {recording&&<audio ref={media} src={recording.src} preload="none" onEnded={()=>setStatus('idle')} onError={()=>{setStatus('idle');setError('Enregistrement indisponible.')}} />}
  <div className="v11-narrator__heading"><span aria-hidden="true">♫</span> ÉCOUTER CETTE PAGE
   <small>{recorded?'Narration enregistrée · ElevenLabs':'Voix de l’appareil · version provisoire'}</small>
  </div>
  <div className="v11-narrator__controls">
   <button type="button" onClick={toggle} aria-label={status==='playing'?'Mettre la narration en pause':status==='paused'?'Reprendre la narration':'Écouter la page'}>{status==='playing'?'⏸ Pause':status==='paused'?'▶ Reprendre':'▶ Écouter'}</button>
   <button type="button" onClick={stop} disabled={status==='idle'}>■ Arrêter</button>
   <label>Vitesse <select value={rate} onChange={e=>changeRate(Number(e.target.value))}>{rates.map(r=><option key={r} value={r}>{r.toFixed(2).replace(/0$/,'')}×</option>)}</select></label>
  </div>
  <span className="v11-narrator__status" role="status">{error|| (recorded
   ?(status==='playing'?'Narration en cours':status==='paused'?'Narration en pause':'Enregistrement prêt')
   :(usingDeviceVoice?'Voix provisoire de l’appareil':'La voix ElevenLabs choisie sera disponible après ajout des enregistrements.'))}</span>
 </section>;
}
