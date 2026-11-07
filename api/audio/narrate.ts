// Single-sample, preview-only ElevenLabs narration test. No arbitrary client text.
const VOICE_ID='sANWqF1bCMzR6eyZbCGw';
const SAMPLE='ce-qu-on-na-pas-dit/ouverture/0';
const TEXT='Le lundi où tout allait encore bien\n\nLéa et Noa sont amis depuis trois ans. Chaque lundi, ils se retrouvent à l’atelier de dessin du collège. Ils inventent ensemble une ville imaginaire dans un carnet bleu.';
function respond(res:any,code:number,msg:string,reason?:string){
 return res.status(code).setHeader('Cache-Control','no-store').json({error:msg,...(reason?{reason}:{})});
}
function providerError(code:number,reason:string):string{
 if(['voice_not_found','voice_access_denied','voice_not_in_library'].includes(reason)||code===404)
  return 'Cette voix ElevenLabs n’est pas accessible avec ta clé. Ajoute-la à « Mes voix » dans ElevenLabs, puis réessaie.';
 if(['invalid_api_key','authentication_error'].includes(reason)||code===401)
  return 'La clé API ElevenLabs est refusée. Vérifie la valeur enregistrée dans Vercel.';
 if(['missing_permissions','insufficient_permissions','authorization_error','model_access_denied'].includes(reason)||code===403)
  return 'La clé ou le forfait ElevenLabs n’autorise pas cette génération. Vérifie les permissions Text to Speech.';
 if(['paid_plan_required','free_users_not_allowed','subscription_required','feature_not_available'].includes(reason))
  return 'La voix sélectionnée requiert un forfait ElevenLabs payant pour être utilisée via l’API. Tes crédits gratuits ne sont pas épuisés.';
 if(['insufficient_credits','quota_exceeded'].includes(reason))
  return 'Crédits ElevenLabs insuffisants pour cette génération.';
 if(code===402)
  return 'ElevenLabs exige un paiement ou un forfait supérieur pour cette génération. Cela ne signifie pas forcément que tes crédits sont épuisés.';
 if(code===429)return 'Limite de requêtes ElevenLabs atteinte. Réessaie plus tard.';
 if(code===400||code===422)return 'ElevenLabs rejette les paramètres de cette voix ou de ce modèle.';
 return 'ElevenLabs a refusé la génération. Vérifie les droits de cette voix et les crédits du compte.';
}
export default async function handler(req:any,res:any){
 if(req.method!=='POST')return respond(res,405,'Méthode non autorisée');
 const origin=req.headers.origin;
 const host=req.headers.host;
 if(!host||!origin||origin!=='https://'+host)return respond(res,403,'Origine non autorisée');
 if(Number(req.headers['content-length']||0)>1000)return respond(res,413,'Requête trop grande');
 if(process.env.VERCEL_ENV==='production')return respond(res,503,'Narration ElevenLabs réservée à la prévisualisation');
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
   let providerReason='';
   try{
    const raw=await upstream.json() as {detail?:{status?:unknown,code?:unknown},error?:{code?:unknown}};
    const candidate=raw.detail?.code||raw.detail?.status||raw.error?.code;
    if(typeof candidate==='string'&&/^[a-z0-9_]{1,60}$/i.test(candidate))providerReason=candidate;
   }catch{}
   // Only return a safe standardized code; never return provider text, headers or secrets.
   const message=providerError(upstream.status,providerReason);
   console.warn('ElevenLabs TTS rejected',{httpStatus:upstream.status,reason:providerReason||'unknown'});
   return respond(res,upstream.status===429?429:502,message,providerReason||'http_'+upstream.status);
  }
  const data=Buffer.from(await upstream.arrayBuffer());
  if(!data.length||data.length>3_000_000)return respond(res,502,'Format audio inattendu');
  res.setHeader('Content-Type','audio/mpeg');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Content-Length',data.length);
  return res.status(200).end(data);
 }catch(e){
  console.warn('ElevenLabs TTS transport error',e instanceof Error?e.name:'unknown');
  return respond(res,502,'Impossible de contacter ElevenLabs pour générer la voix');
 }finally{clearTimeout(timeout)}
}
