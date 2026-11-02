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
/** An illustration represents a narrative event, never a random page number.
 * Keep the same illustration while turning pages inside one scene. */
export function sceneShot(episodeId:string,nodeId:string,_pageIndex:number):string{
 if(episodeId!=='ce-qu-on-na-pas-dit')return '';
 const id=nodeId.toLowerCase();
 // The illustration is chosen by the event, not by arbitrary page alternation.
 let shot:Shot;
 if(id==='ouverture'||id==='choix-atelier'||id.startsWith('atelier-'))shot='souvenir';
 else if(id==='soir-maison'||id==='choix-soir'||id.startsWith('soir-'))shot='maison';
 else if(id==='mardi-photo'||id==='choix-photo'||id.startsWith('photo-'))shot='photo';
 else if(id==='banc-arrivee'||id==='banc-echo'||id.startsWith('banc-')||id.startsWith('echo-'))shot='approche';
 else if(id==='choix-banc'||id.startsWith('reaction-')||id.startsWith('choix-fin-'))shot='conversation';
 else if(id.startsWith('fin-'))shot=/attaquer|cacher|soupcon/.test(id)?'attente':/pause|plus-tard/.test(id)?'approche':'conversation';
 else shot='souvenir';
 return `/assets/lea-${shot}.webp`;
}
