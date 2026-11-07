// Limited non-commercial preview of a fixed story excerpt.
// Uses voices returned as default or personally owned by this workspace;
// community Voice Library voices are excluded on the free API tier.
const SAMPLE='ce-qu-on-na-pas-dit/ouverture/0';
const TEXT='Le lundi où tout allait encore bien\n\nLéa et Noa sont amis depuis trois ans. Chaque lundi, ils se retrouvent à l’atelier de dessin du collège. Ils inventent ensemble une ville imaginaire dans un carnet bleu.';
type Candidate={voice_id:string;name?:string;category?:string;labels?:Record<string,string>;is_owner?:boolean};
const json=(res:any,status:number,error:string,reason?:string)=>res.status(status).setHeader('Cache-Control','no-store').json({error,...(reason?{reason}:{})});
function safeReason(detail:any):string{
 const x=detail?.detail?.code||detail?.detail?.status||detail?.error?.code;
 return typeof x==='string'&&/^[a-z0-9_]{1,60}$/i.test(x)?x:'unknown';
}
function describe(code:number,reason:string):string{
 if(code===401)return 'La clé ElevenLabs a été refusée. Vérifie ses autorisations Text to Speech.';
 if(code===403)return 'L’accès à la voix ou au modèle n’est pas autorisé par le forfait ou la clé ElevenLabs.';
 if(code===402)return 'Ce compte ou cette voix nécessite un abonnement ou un paiement, même si le solde de crédits est positif.';
 if(code===429)return 'La limite d’appels ElevenLabs est atteinte.';
 if(code===404)return 'La voix n’est pas accessible depuis ce compte.';
 return 'ElevenLabs a refusé la génération audio.';
}
async function listVoices(key:string,kind:'default'|'personal',signal:AbortSignal){
 const url='https://api.elevenlabs.io/v2/voices?voice_type='+kind+'&page_size=100';
 const r=await fetch(url,{headers:{'xi-api-key':key},signal});
 if(!r.ok){
  const d=await r.json().catch(()=>({}));
  throw Object.assign(new Error(describe(r.status,safeReason(d))),{code:r.status,reason:safeReason(d)});
 }
 const data=await r.json() as {voices?:Candidate[]};
 return Array.isArray(data.voices)?data.voices:[];
}
function voiceScore(voice:Candidate):number{
 const info=((voice.name||'')+' '+JSON.stringify(voice.labels||{})).toLowerCase();
 let points=0;
 if(/female|feminine|woman|femme/.test(info))points+=6;
 if(/french|français|france|fr-fr/.test(info))points+=8;
 if(/warm|soft|gentle|calm|douce|chaleureuse|narrat|storytell|story|mature/.test(info))points+=5;
 if(/young|child|high.pitched|energetic/.test(info))points-=5;
 return points;
}
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return json(res,405,'Méthode non autorisée');
 if(!req.headers.host||req.headers.origin!=='https://'+req.headers.host)return json(res,403,'Origine non autorisée');
 if(Number(req.headers['content-length']||0)>1000)return json(res,413,'Requête trop grande');
 if(process.env.VERCEL_ENV==='production')return json(res,503,'Essai ElevenLabs réservé à la prévisualisation');
 const key=process.env.ELEVENLABS_API_KEY;
 if(!key)return json(res,503,'Clé ElevenLabs manquante sur Vercel');
 let body:any=req.body;
 if(typeof body==='string'){try{body=JSON.parse(body)}catch{return json(res,400,'Requête invalide')}}
 if(body?.sampleId!==SAMPLE)return json(res,400,'Extrait non disponible');
 const ctrl=new AbortController();
 const timeout=setTimeout(()=>ctrl.abort(),23000);
 try{
  const [defaults,personal]=await Promise.all([listVoices(key,'default',ctrl.signal),listVoices(key,'personal',ctrl.signal)]);
  // No shared community voices. A new account might have no default voices at all.
  const unique=new Map<string,Candidate>();
  for(const voice of [...defaults,...personal]){
   if(typeof voice.voice_id==='string'&&/^[a-zA-Z0-9]{15,30}$/.test(voice.voice_id))unique.set(voice.voice_id,voice);
  }
  const candidates=[...unique.values()].sort((a,b)=>voiceScore(b)-voiceScore(a)).slice(0,3);
  if(!candidates.length)return json(res,422,'Aucune voix accessible via l’API gratuite ne figure dans ce compte ElevenLabs. Les voix communautaires nécessitent un abonnement.','no_free_api_voice');
  for(const voice of candidates){
   const upstream=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+voice.voice_id+'?output_format=mp3_44100_128',{
    method:'POST',headers:{'xi-api-key':key,'content-type':'application/json'},
    body:JSON.stringify({text:TEXT,model_id:'eleven_multilingual_v2',voice_settings:{stability:0.62,similarity_boost:0.75,style:0.1,use_speaker_boost:true}}),
    signal:ctrl.signal
   });
   if(upstream.ok){
    const data=Buffer.from(await upstream.arrayBuffer());
    if(!data.length||data.length>3_000_000)return json(res,502,'Format audio inattendu');
    res.setHeader('Content-Type','audio/mpeg');
    res.setHeader('Cache-Control','private, no-store');
    res.setHeader('Content-Length',data.length);
    res.setHeader('X-Narrator-Voice',encodeURIComponent(voice.name||'ElevenLabs'));
    return res.status(200).end(data);
   }
   const d=await upstream.json().catch(()=>({}));
   const reason=safeReason(d);
   console.warn('ElevenLabs accessible voice rejected',{httpStatus:upstream.status,reason,voiceCategory:voice.category||'unknown'});
   if(upstream.status===401||upstream.status===429||reason==='insufficient_credits'||reason==='quota_exceeded')return json(res,upstream.status===429?429:502,describe(upstream.status,reason),reason);
  }
  return json(res,502,'Aucune voix disponible avec ton forfait ElevenLabs n’a accepté ce passage.','all_accessible_voices_rejected');
 }catch(e){
  const info=e as Error&{code?:number,reason?:string};
  console.warn('ElevenLabs voices request failed',{name:info.name,code:info.code,reason:info.reason});
  return json(res,502,info.message||'Impossible de joindre ElevenLabs',info.reason);
 }finally{clearTimeout(timeout)}
}
