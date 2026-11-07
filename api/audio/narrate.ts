// Preview-only TTS proof of concept. The service never accepts arbitrary text.
const VOICE_ID='sANWqF1bCMzR6eyZbCGw';
const SAMPLE='ce-qu-on-na-pas-dit/ouverture/0';
const TEXT='Le lundi où tout allait encore bien\n\nLéa et Noa sont amis depuis trois ans. Chaque lundi, ils se retrouvent à l’atelier de dessin du collège. Ils inventent ensemble une ville imaginaire dans un carnet bleu.';
function respond(res:any,code:number,msg:string){
 res.status(code).setHeader('Cache-Control','no-store').json({error:msg});
}
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return respond(res,405,'Méthode non autorisée');
 const origin=req.headers.origin;
 const host=req.headers.host;
 if(!host||!origin||origin!=='https://'+host)return respond(res,403,'Origine non autorisée');
 if(Number(req.headers['content-length']||0)>1000)return respond(res,413,'Requête trop grande');
 // Do not enable in production. This route is for testing a single sample.
 if(process.env.VERCEL_ENV==='production'){
  return respond(res,503,'Narration ElevenLabs réservée à la prévisualisation');
 }
 const apiKey=process.env.ELEVENLABS_API_KEY;
 if(!apiKey)return respond(res,503,'Clé ElevenLabs manquante sur Vercel');
 let body:any=req.body;
 if(typeof body==='string'){try{body=JSON.parse(body)}catch{return respond(res,400,'Requête invalide')}}
 if(!body||body.sampleId!==SAMPLE)return respond(res,400,'Extrait non disponible');
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),18000);
 try{
  const upstream=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+VOICE_ID+'?output_format=mp3_44100_128',{
   method:'POST',
   headers:{'xi-api-key':apiKey,'content-type':'application/json'},
   body:JSON.stringify({text:TEXT,model_id:'eleven_multilingual_v2',voice_settings:{stability:0.62,similarity_boost:0.75,style:0.1,use_speaker_boost:true}}),
   signal:controller.signal
  });
  if(!upstream.ok){
   if(upstream.status===401||upstream.status===403)return respond(res,502,'Clé ou accès à la voix ElevenLabs invalide');
   if(upstream.status===429)return respond(res,429,'Quota ElevenLabs atteint');
   return respond(res,502,'ElevenLabs n’a pas pu générer cet extrait');
  }
  const data=Buffer.from(await upstream.arrayBuffer());
  if(data.length===0||data.length>3_000_000)return respond(res,502,'Audio inattendu');
  res.setHeader('Content-Type','audio/mpeg');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Content-Length',data.length);
  return res.status(200).end(data);
 }catch{return respond(res,502,'La génération vocale a échoué')}
 finally{clearTimeout(timeout)}
}
