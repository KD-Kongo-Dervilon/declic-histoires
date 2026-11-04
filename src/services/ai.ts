import {aiAvailable,aiEndpoint} from './availability';
export type AdaptiveReply={intent:'express'|'avoid'|'ask';reply:string;perceivedEmotion:string;mode:'ai'|'offline'};
export async function interpretFreeText(text:string,sceneId:string,episodeId:string):Promise<AdaptiveReply>{
  const clean=text.trim().slice(0,220);
  if(!clean)throw new Error('Écris quelques mots avant de continuer.');
  if(!(await aiAvailable()))return offlineInterpret(clean,episodeId);
  try{
    const abort=new AbortController();const timeout=setTimeout(()=>abort.abort(),9000);
    try{const res=await fetch(`${aiEndpoint}/adapt`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({episodeId,sceneId,text:clean}),signal:abort.signal});if(!res.ok)throw new Error('Service indisponible');const data=await res.json() as AdaptiveReply;if(!['express','avoid','ask'].includes(data.intent)||typeof data.reply!=='string')throw new Error('Réponse invalide');return {...data,mode:'ai'}}finally{clearTimeout(timeout)}
  }catch{return offlineInterpret(clean,episodeId)}
}
const offlineCharacters:Record<string,{name:string;ask:string;avoid:string;express:string}>={
  'ce-qu-on-na-pas-dit':{name:'Noa',ask:'Je pensais que tu ne voulais plus venir… Je me suis trompé ?',avoid:'Tu es sûre que ça va ? Je sens qu’il se passe quelque chose.',express:'Je ne savais pas que tu t’étais sentie mise à l’écart.'},
  'le-message-de-trop':{name:'Inès',ask:'Tu veux savoir ce qui m’a fait mal ? Toute la classe a vu ce message.',avoid:'Tu crois que ne rien dire va effacer la capture ?',express:'J’avais confiance en toi. J’ai besoin que tu le comprennes.'},
  'invisible':{name:'Lina',ask:'On a organisé ça sans réfléchir. Je pensais que tu avais autre chose.',avoid:'Tu t’éloignes… Est-ce que je t’ai blessée ?',express:'Je n’avais pas réalisé que tu te sentais seule dans le groupe.'},
  'juste-pour-rire':{name:'Sarah',ask:'Je n’avais pas pensé à demander ton accord avant de partager.',avoid:'Tu dis que ce n’est rien, mais tu as l’air vraiment gêné.',express:'Je vois que la vidéo t’a fait du mal. Je suis désolée.'},
  'dire-non':{name:'Adam',ask:'Je voulais juste qu’on fasse tous la même chose… Mais je comprends ta question.',avoid:'Tu n’as pas vraiment envie, on dirait. Je me trompe ?',express:'Je vois que ce défi te met mal à l’aise.'},
  'un-pas-vers-toi':{name:'Yasmine',ask:'J’aimerais comprendre ce qui s’est passé, moi aussi.',avoid:'D’accord, on pourra reparler quand tu te sentiras prête.',express:'Je sais que je t’ai blessée. J’ai peur de recommencer.'}
};
export function offlineInterpret(text:string,episodeId='ce-qu-on-na-pas-dit'):AdaptiveReply {
  const t=text.toLowerCase();
  const intent=/pourquoi|comment|explique|comprendre|qu.est.ce|question|savais/.test(t)?'ask':/pas grave|laisse|rien|oublie|tant pis|pas envie|plus tard/.test(t)?'avoid':'express';
  const persona=offlineCharacters[episodeId]??offlineCharacters['ce-qu-on-na-pas-dit'];
  return {intent,reply:`« ${persona[intent]} »`,perceivedEmotion:'Tes mots peuvent ouvrir plusieurs chemins. Cette interprétation reste une hypothèse.',mode:'offline'};
}
