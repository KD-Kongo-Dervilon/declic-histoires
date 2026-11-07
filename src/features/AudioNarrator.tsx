import {useEffect,useRef,useState} from 'react';
import './audio-narrator.css';

type Status='idle'|'playing'|'paused';
type Props={text:string;pageKey:string};

const RATE_KEY='declic:narrator-rate';
const rates=[0.8,1,1.15,1.25];

export function AudioNarrator({text,pageKey}:Props){
 const supported=typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const [status,setStatus]=useState<Status>('idle');
 const [rate,setRate]=useState<number>(()=>{
  try{const n=Number(localStorage.getItem(RATE_KEY));return rates.includes(n)?n:1}catch{return 1}
 });
 const [message,setMessage]=useState('');
 const token=useRef(0);
 const rateRef=useRef(rate);
 rateRef.current=rate;

 const stop=()=>{
  token.current+=1;
  if(supported)window.speechSynthesis.cancel();
  setStatus('idle');
 };
 useEffect(()=>{
  token.current+=1;
  if(supported)window.speechSynthesis.cancel();
  setStatus('idle');
  setMessage('');
  return ()=>{token.current+=1;if(supported)window.speechSynthesis.cancel()};
 },[pageKey,supported]);

 const start=()=>{
  if(!supported)return;
  const synth=window.speechSynthesis;
  synth.cancel();
  const current=++token.current;
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';
  utterance.rate=rateRef.current;
  utterance.pitch=1;
  const voices=synth.getVoices();
  const french=voices.filter(v=>v.lang.toLowerCase().startsWith('fr'));
  const preferred=french.find(v=>v.lang.toLowerCase()==='fr-fr'&&v.localService)
   ||french.find(v=>v.lang.toLowerCase()==='fr-fr')
   ||french[0];
  if(preferred)utterance.voice=preferred;
  utterance.onend=()=>{if(token.current===current)setStatus('idle')};
  utterance.onerror=e=>{
   if(token.current!==current||e.error==='canceled'||e.error==='interrupted')return;
   setStatus('idle');setMessage('La voix n’a pas pu démarrer sur cet appareil.');
  };
  setMessage('');
  synth.speak(utterance);
  setStatus('playing');
 };
 const toggle=()=>{
  if(status==='idle'){start();return}
  if(status==='playing'){window.speechSynthesis.pause();setStatus('paused');return}
  window.speechSynthesis.resume();setStatus('playing');
 };
 const changeRate=(next:number)=>{
  setRate(next);
  try{localStorage.setItem(RATE_KEY,String(next))}catch{}
  // Changing speed restarts the current page, which avoids desynchronised speech.
  if(status!=='idle'){stop()}
 };
 if(!supported)return <p className="v11-narrator-note">Lecture vocale non disponible sur ce navigateur.</p>;
 return <section className="v11-narrator" aria-label="Narrateur audio de la page">
  <div className="v11-narrator__heading"><span aria-hidden="true">♫</span> ÉCOUTER CETTE PAGE <small>Voix française · gratuite</small></div>
  <div className="v11-narrator__controls">
   <button type="button" onClick={toggle} aria-label={status==='playing'?'Mettre la narration en pause':status==='paused'?'Reprendre la narration':'Écouter la page'}>{status==='playing'?'⏸ Pause':status==='paused'?'▶ Reprendre':'▶ Écouter'}</button>
   <button type="button" onClick={stop} disabled={status==='idle'}>■ Arrêter</button>
   <label>Vitesse <select value={rate} onChange={e=>changeRate(Number(e.target.value))}>{rates.map(r=><option key={r} value={r}>{r.toFixed(2).replace(/0$/,'')}×</option>)}</select></label>
  </div>
  <span className="v11-narrator__status" role="status">{message|| (status==='playing'?'Narration en cours':status==='paused'?'Narration en pause':'Prêt à écouter')}</span>
 </section>;
}
