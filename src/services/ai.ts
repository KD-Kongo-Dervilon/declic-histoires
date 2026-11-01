export type AdaptiveReply={intent:'express'|'avoid'|'ask';reply:string;perceivedEmotion:string;mode:'ai'|'offline'};
const ENDPOINT=import.meta.env.VITE_DEClic_AI_URL as string|undefined;
export function aiConfigured(){return Boolean(ENDPOINT&&/^https:\/\//.test(ENDPOINT))}
export async function interpretFreeText(text:string,sceneId:string,episodeId:string):Promise<AdaptiveReply>{
  const clean=text.trim().slice(0,220);
  if(!clean)throw new Error('Écris quelques mots avant de continuer.');
  if(!aiConfigured())return offlineInterpret(clean);
  try{
    const abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),9000);
    try{const res=await fetch(`${ENDPOINT}/adapt`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({episodeId,sceneId,text:clean}),signal:abort.signal});if(!res.ok)throw new Error('Service indisponible');const data=await res.json() as AdaptiveReply;if(!['express','avoid','ask'].includes(data.intent)||typeof data.reply!=='string')throw new Error('Réponse invalide');return {...data,mode:'ai'}}finally{clearTimeout(timeout)}
  }catch{return offlineInterpret(clean)}
}
export function offlineInterpret(text:string):AdaptiveReply {const t=text.toLowerCase();const intent=/pourquoi|comment|explique|comprendre|qu'est-ce|question|savais/.test(t)?'ask':/pas grave|laisse|rien|oublie|tant pis|pas envie|plus tard/.test(t)?'avoid':'express';return {intent,reply:intent==='ask'?'Noa hésite. « Tu veux savoir pourquoi j’ai décidé ça ? »':intent==='avoid'?'Noa se tait, puis murmure : « Tu es sûre que ça va ? »':'Noa t’écoute enfin : « Je ne savais pas que tu ressentais ça. »',perceivedEmotion:'Tes mots peuvent ouvrir plusieurs chemins. Cette interprétation n’est qu’une hypothèse.',mode:'offline'} }
