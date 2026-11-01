/** Compact visual pages, not truncated summaries. Every sentence remains in order. */
export function bookPages(source:string,max=215):string[]{
 const clean=source.replace(/\*\*/g,'').replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim();
 if(!clean)return [''];
 const sentences=clean.match(/[^.!?…]+(?:[.!?…]+|$)/g)?.map(s=>s.trim()).filter(Boolean)??[clean];
 const pages:string[]=[];let page='';
 for(const sentence of sentences){
  if(page && (page.length+sentence.length+1)>max){pages.push(page);page='';}
  // A single exceptionally long sentence is kept intact, preserving its meaning.
  page=page?`${page} ${sentence}`:sentence;
 }
 if(page)pages.push(page);
 return pages;
}
export const SCENES=['photo','maison','souvenir','attente','approche','conversation'] as const;
export type Shot=typeof SCENES[number];
export function sceneShot(episodeId:string,nodeId:string,pageIndex:number):string{
 if(episodeId!=='ce-qu-on-na-pas-dit')return '';
 let index=0;
 if(/maison|secret|soir|fatigue/.test(nodeId))index=1;
 else if(/souvenir|carnet|atelier/.test(nodeId))index=2;
 else if(/intro|ouverture|photo|message|decouverte/.test(nodeId))index=0;
 else if(/attente|silence|pause|cacher|plus-tard/.test(nodeId))index=3;
 else if(/rencontre|banc|approche|premier-choix|deuxieme/.test(nodeId))index=4;
 else if(/reponse|fin-|reparer|expliquer/.test(nodeId))index=5;
 else if(/chapitre/.test(nodeId))index=3;
 const alternates:Record<number,number>={0:3,1:3,2:5,3:4,4:5,5:4};
 // Within a long scene, alternate between a wide shot and a complementary close shot.
 const finalIndex=pageIndex%3===1?alternates[index]:index;
 return `/assets/lea-${SCENES[finalIndex]}.webp`;
}
