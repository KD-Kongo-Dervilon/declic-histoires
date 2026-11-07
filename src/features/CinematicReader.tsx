import {useEffect,useMemo,useRef,useState} from 'react';
import type {Episode,NarrativeNode,StoryState} from '../types';
import {bookPages,sceneShot} from './readability';
import {narratePage} from '../services/narrative';
import {memoryEcho} from './continuity';

type Props={episode:Episode;node:NarrativeNode;game:StoryState;episodeIndex:number;knownEndings:number;emotion:string;onEmotion:(v:string)=>void;onChoose:(id:string)=>void;onNext:()=>void;onComplete:()=>void;onBack:()=>void;onPageTurn:()=>void;onFreeText?:(value:string)=>Promise<void>;busy?:boolean;error?:string;reducedMotion?:boolean;adaptiveReply?:string;proposal?:{id:string;title:string;line:string}|null;onClearProposal:()=>void;audioOn:boolean;onSound:()=>void;nightMode:boolean;onNightMode:()=>void};
export function CinematicReader({episode,node,game,episodeIndex,knownEndings,emotion,onEmotion,onChoose,onNext,onComplete,onBack,onPageTurn,onFreeText,busy,error,reducedMotion,adaptiveReply,proposal,onClearProposal,audioOn,onSound,nightMode,onNightMode}:Props){
 const [pageIndex,setPageIndex]=useState(0);
 const hasTurnedPage=useRef(false);
 const [textInput,setTextInput]=useState('');
 const [variation,setVariation]=useState<{text:string;dialogue?:string;consequence?:string;mode:'ai'|'offline'}>({text:node.text,dialogue:node.dialogue,mode:'offline'});
 const [requestNarration,setRequestNarration]=useState(false);
 const [loading,setLoading]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  const title=heading.current;
  title?.focus({preventScroll:true});
  if(hasTurnedPage.current && title && title.getBoundingClientRect().top<64){
   title.scrollIntoView({block:'center'});
  }
 },[pageIndex]);
 useEffect(()=>{if(!requestNarration)return;let active=true;const controller=new AbortController();setLoading(true);
  void narratePage({episodeId:episode.id,node,history:game.history,impact:game.impact,signal:controller.signal}).then(v=>{if(active){
   // An optional variation stays separate from the authored scene.
   setVariation(v);setLoading(false);

  }});

 return ()=>{active=false;controller.abort()};
 // This reader is remounted with a key for each story node.
 },[episode.id,node,game.history,game.impact,requestNarration]);
 const pages=useMemo(()=>bookPages(node.text,780),[node.text]);
 const currentPage=pages[Math.min(pageIndex,pages.length-1)];
 const last=pageIndex>=pages.length-1;
 const image=node.image||sceneShot(episode.id,node.id,pageIndex)||episode.image;
 const earlierEcho=node.kind==='ending'?memoryEcho(episode.id,game.history):null;
 const shotName=episode.id==='ce-qu-on-na-pas-dit'?['photo','maison','souvenir','attente','approche','conversation'].find(x=>image.includes(x))||'story':'histoire';
 const progress=Math.round(100*(pageIndex+1)/pages.length);
 const goPage=()=>{hasTurnedPage.current=true;onPageTurn();setPageIndex(i=>Math.min(i+1,pages.length-1))};
 const previousPage=()=>{hasTurnedPage.current=true;onPageTurn();setPageIndex(i=>Math.max(0,i-1))};
 return <main className={'v11-reader'+(reducedMotion?' v11-reduced':'')} aria-label={`Lecture interactive de ${episode.title}`}>
  <section className="v11-book-art" aria-label="Univers illustré de l’histoire">
   <div className="v11-book-art__top"><span>✦ DÉCLIC <small>HISTOIRES À VIVRE</small></span><span>ÉPISODE {String(episodeIndex+1).padStart(2,'0')}</span></div>
   <div key={image} className="v11-book-art__visual" data-shot={shotName}>
    <img src={image} alt={node.imageAlt||`Illustration de ${episode.title}`} loading="eager"/>

   </div>
   <div className="v11-book-art__bottom"><div><span className="v11-chapter">{node.eyebrow}</span><h2>{episode.title}</h2></div><span className="v11-end-count">{knownEndings} / 9 fins</span></div>
   <div className="v11-art-pagination"><div className="v11-progress-track"><span style={{width:`${progress}%`}}/></div><small>Scène · {pageIndex+1}/{pages.length}</small></div>
  </section>
  <section className="v11-reading-pane">
   <div className="reader-comfort" aria-label="Confort de lecture">
    <button type="button" aria-pressed={audioOn} onClick={onSound}>{audioOn?'Couper l’ambiance':'Ambiance sonore'}</button>
    <button type="button" aria-pressed={nightMode} onClick={onNightMode}>Mode nuit</button>
   </div>
   <div className="v11-reader-tools"><button onClick={onBack} className="v11-back">← Histoires</button><span>CHAPITRE {node.phase||'01'} · PAGE {pageIndex+1}/{pages.length}</span></div>
   <>
    <div key={`${node.id}-${pageIndex}`} className="v11-page-turn">
     <span className="v11-kicker">{node.kind==='decision'?'À TOI DE JOUER':node.kind==='ending'?'UNE FIN POSSIBLE':'TON HISTOIRE'}</span>
     <h1 ref={heading} tabIndex={-1} aria-label={node.title + ", page " + (pageIndex+1) + " sur " + pages.length}>{node.title}</h1>
     <div className="v11-readable-text">{currentPage}</div>
     {earlierEcho&&last&&<div className="v12-choice-impact"><span>DES CHOIX QUI REVIENNENT</span><p>{earlierEcho}</p></div>}
     {(node.dialogue||adaptiveReply)&&pageIndex===0&&<blockquote className="v11-character-line"><span>{node.speaker||'DANS LA SCÈNE'}</span><p>{node.kind==='reaction'&&adaptiveReply?adaptiveReply:node.dialogue}</p></blockquote>}
     {node.afterword&&last&&<p className="story-afterword">{node.afterword}</p>}
    </div>
    {pageIndex>0&&<button type="button" className="v13-previous" onClick={previousPage} aria-label="Revenir à la page précédente de cette scène">← Page précédente</button>}
    {!last?<div className="v11-page-actions"><button className="v11-primary" onClick={goPage}>Tourner la page <span aria-hidden>↗</span></button></div>:node.kind==='decision'?<>
     <div className="v11-decision-header"><span>ET MAINTENANT ?</span><p>Tu décides de la suite.</p></div>
     <div className="v11-decisions">{node.choices?.map((choice,i)=><button key={choice.id} onClick={()=>onChoose(choice.id)} className="v11-decision"><span className="v11-decision-number">0{i+1}</span><span><strong>{choice.title}</strong><small>{choice.words}</small></span><b aria-hidden>›</b></button>)}</div>
     <details className="v11-feelings"><summary>Quelle émotion ressens-tu ? <small>Facultatif</small></summary><div>{['Blessure','Colère','Tristesse','Incompréhension','Peur','Confiance'].map(e=><button key={e} aria-pressed={emotion===e} className={emotion===e?'active':''} onClick={()=>onEmotion(e)}>{e}</button>)}</div></details>
     {onFreeText&&<details className="v11-free"><summary>Ou réponds avec tes propres mots</summary><label htmlFor="v11-freetext">Une réponse fictive, sans information personnelle.</label><textarea id="v11-freetext" maxLength={220} rows={2} placeholder="Je dirais…" value={textInput} onChange={e=>{setTextInput(e.target.value);onClearProposal()}}/><button disabled={busy||textInput.trim().length<5} onClick={()=>void onFreeText(textInput)}>{busy?'Adaptation…':'Proposer une suite →'}</button>{proposal&&<div className="reader-proposal" role="status"><p>Tes mots peuvent mener à cette décision.</p><strong>{proposal.title}</strong><button type="button" onClick={()=>onChoose(proposal.id)}>Choisir cette suite</button></div>}{error&&<p role="alert">{error}</p>}</details>}
    </>:node.kind==='ending'?<><div className="v11-after"><strong>De son côté…</strong><p>{node.perspective}</p></div><button className="v11-primary" onClick={onComplete}>Découvrir mon parcours et cette fin →</button></>:<div className="v11-page-actions"><button className="v11-primary" onClick={onNext}>Continuer l’histoire <span aria-hidden>↗</span></button></div>}
    <details className="reader-variation">
     <summary>Lire une variation du texte</summary>
     <button type="button" onClick={()=>setRequestNarration(true)} disabled={requestNarration}>Adapter la narration</button>
     {loading&&<p role="status">La narration se prépare…</p>}
     {requestNarration&&!loading&&<p role="status">{variation.mode==='ai'?variation.text:'La narration alternative est indisponible pour le moment.'}</p>}
     {variation.mode==='ai'&&<small>Variation de texte générée par IA.</small>}
    </details>
    <div className="v11-reader-footer"><span>✦ Une fiction · Chaque décision compte</span><span>{game.history.length} décisions</span></div>
   </>
  </section>
 </main>;
}
