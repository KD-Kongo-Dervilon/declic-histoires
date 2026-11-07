import {useEffect,useMemo,useRef,useState} from 'react';
import type {Episode,NarrativeNode,StoryState} from '../types';
import {bookPages,sceneShot} from './readability';
import {narratePage,narrativeAIEnabled} from '../services/narrative';
import {memoryEcho} from './continuity';
import {AudioNarrator} from './AudioNarrator';
import {findNarration} from '../content/audioManifest';

type Props={episode:Episode;node:NarrativeNode;game:StoryState;episodeIndex:number;knownEndings:number;emotion:string;onEmotion:(v:string)=>void;onChoose:(id:string)=>void;onNext:()=>void;onComplete:()=>void;onBack:()=>void;onPageTurn:()=>void;onFreeText?:(value:string)=>Promise<void>;busy?:boolean;error?:string;reducedMotion?:boolean;adaptiveReply?:string};
export function CinematicReader({episode,node,game,episodeIndex,knownEndings,emotion,onEmotion,onChoose,onNext,onComplete,onBack,onPageTurn,onFreeText,busy,error,reducedMotion,adaptiveReply}:Props){
 const [pageIndex,setPageIndex]=useState(0);
 const hasTurnedPage=useRef(false);
 const [textInput,setTextInput]=useState('');
 const [variation,setVariation]=useState<{text:string;dialogue?:string;consequence?:string;mode:'ai'|'offline'}>({text:node.text,dialogue:node.dialogue,mode:'offline'});
 const [loading,setLoading]=useState(narrativeAIEnabled());
 useEffect(()=>{let active=true;const controller=new AbortController();if(narrativeAIEnabled()){
  void narratePage({episodeId:episode.id,node,history:game.history,impact:game.impact,signal:controller.signal}).then(v=>{if(active){
   // Never rewrite a page while the reader is already turning through it.
   if(!hasTurnedPage.current)setVariation(v);
   setLoading(false);
  }});
 }else setLoading(false);
 return ()=>{active=false;controller.abort()};
 // This reader is remounted with a key for each story node.
 },[episode.id,node,game.history,game.impact]);
 const pages=useMemo(()=>bookPages(variation.text,node.kind==='decision'?185:210),[variation.text,node.kind]);
 const currentPage=pages[Math.min(pageIndex,pages.length-1)];
 const last=pageIndex>=pages.length-1;
 const image=sceneShot(episode.id,node.id,pageIndex)||episode.image;
 const earlierEcho=node.kind==='ending'?memoryEcho(episode.id,game.history):null;
 const consequenceSource=node.id.startsWith('atelier-suite')||/^banc-(promesse|prevenu|flou)$/.test(node.id)?'atelier-':
   (node.id.startsWith('soir-suite')||node.id.startsWith('banc-veille'))?'soir-':
   node.id.startsWith('photo-suite')||/^echo-(direct|camille|ignore)$/.test(node.id)?'photo-':null;
 const cause=consequenceSource?[...game.history].reverse().find(h=>h.id.startsWith(consequenceSource)):undefined;
 const visibleConsequence=node.kind==='scene'&&!!cause;
 const shotName=episode.id==='ce-qu-on-na-pas-dit'?['photo','maison','souvenir','attente','approche','conversation'].find(x=>image.includes(x))||'story':'histoire';
 const progress=Math.min(100,Math.round(100*(game.visited.length+(pageIndex+1)/Math.max(1,pages.length))/Math.max(episodeIndex===0?35:14,game.visited.length+1)));
 const goPage=()=>{hasTurnedPage.current=true;onPageTurn();setPageIndex(i=>Math.min(i+1,pages.length-1))};
 const previousPage=()=>{hasTurnedPage.current=true;onPageTurn();setPageIndex(i=>Math.max(0,i-1))};
 return <main className={'v11-reader'+(reducedMotion?' v11-reduced':'')} aria-label={`Lecture interactive de ${episode.title}`}>
  <section className="v11-book-art" aria-label="Illustration de l'histoire">
   <div className="v11-book-art__top"><span>✦ DÉCLIC <small>HISTOIRES À VIVRE</small></span><span>ÉPISODE {String(episodeIndex+1).padStart(2,'0')}</span></div>
   <div key={`${node.id}-${pageIndex}`} className="v11-book-art__visual" data-shot={shotName}>
    <img src={image} alt={`Scène illustrée : ${node.title}`} loading="eager"/>
    <span className="v11-book-art__film">UNE HISTOIRE QUI CHANGE AVEC TES CHOIX</span>
   </div>
   <div className="v11-book-art__bottom"><div><span className="v11-chapter">{node.eyebrow}</span><h2>{episode.title}</h2></div><span className="v11-end-count">{knownEndings} / 9 fins</span></div>
   <div className="v11-art-pagination"><div className="v11-progress-track"><span style={{width:`${progress}%`}}/></div><small>{game.history.length} choix déjà faits</small></div>
  </section>
  <section className="v11-reading-pane">
   <div className="v11-reader-tools"><button onClick={onBack} className="v11-back">← Histoires</button><span>CHAPITRE {node.phase||'01'} · PAGE {pageIndex+1}/{pages.length}</span></div>
   <>
    {loading&&<p className="v13-pending" role="status">Tu peux déjà lire pendant que la scène s’adapte à tes choix.</p>}
    <div key={`${node.id}-${pageIndex}-${variation.mode}`} className="v11-page-turn">
     <span className="v11-kicker">{node.kind==='decision'?'À TOI DE JOUER':node.kind==='ending'?'UNE FIN POSSIBLE':'TON HISTOIRE'}</span>
     <h1>{node.title}</h1>
     <div className="v11-readable-text">{currentPage}</div>
     <AudioNarrator text={currentPage} pageKey={`${episode.id}:${node.id}:${pageIndex}:${variation.mode}`} recording={findNarration(episode.id,node.id,pageIndex,currentPage)} />
     {earlierEcho&&last&&<div className="v12-choice-impact"><span>DES CHOIX QUI REVIENNENT</span><p>{earlierEcho}</p></div>}
     {visibleConsequence&&cause&&pageIndex===0&&<div className="v12-choice-impact"><span>↳ CONSÉQUENCE D’UN CHOIX PRÉCÉDENT</span><strong>{cause.label}</strong></div>}
     {(variation.dialogue||adaptiveReply)&&pageIndex===0&&<blockquote className="v11-character-line"><span>{node.speaker||'DANS LA SCÈNE'}</span><p>{node.kind==='reaction'&&adaptiveReply?adaptiveReply:variation.dialogue}</p></blockquote>}
     {variation.mode==='ai'&&<span className="v11-ai-label">✦ Adaptation narrative IA</span>}
     {variation.consequence&&last&&<p className="v11-consequence">{variation.consequence}</p>}
    </div>
    {pageIndex>0&&<button type="button" className="v13-previous" onClick={previousPage} aria-label="Revenir à la page précédente de cette scène">← Page précédente</button>}
    {!last?<div className="v11-page-actions"><button className="v11-primary" onClick={goPage}>Tourner la page <span aria-hidden>↗</span></button><span className="v11-page-hint">La scène continue. Le décor change quand l’histoire change.</span></div>:node.kind==='decision'?<>
     <div className="v11-decision-header"><span>ET MAINTENANT ?</span><p>Tu décides de la suite.</p></div>
     <div className="v11-decisions">{node.choices?.map((choice,i)=><button key={choice.id} onClick={()=>onChoose(choice.id)} className="v11-decision"><span className="v11-decision-number">0{i+1}</span><span><strong>{choice.title}</strong><small>{choice.words}</small></span><b aria-hidden>›</b></button>)}</div>
     <details className="v11-feelings"><summary>Quelle émotion ressens-tu ? <small>Facultatif</small></summary><div>{['Blessure','Colère','Tristesse','Incompréhension','Peur','Confiance'].map(e=><button key={e} aria-pressed={emotion===e} className={emotion===e?'active':''} onClick={()=>onEmotion(e)}>{e}</button>)}</div></details>
     {onFreeText&&<details className="v11-free"><summary>Ou réponds avec tes propres mots</summary><label htmlFor="v11-freetext">Une réponse fictive, sans information personnelle.</label><textarea id="v11-freetext" maxLength={220} rows={2} placeholder="Je dirais…" value={textInput} onChange={e=>setTextInput(e.target.value)}/><button disabled={busy||textInput.trim().length<5} onClick={()=>void onFreeText(textInput)}>{busy?'Adaptation…':'Voir sa réaction →'}</button>{error&&<p role="alert">{error}</p>}</details>}
    </>:node.kind==='ending'?<><div className="v11-after"><strong>De son côté…</strong><p>{node.perspective}</p></div><button className="v11-primary" onClick={onComplete}>Découvrir mon parcours et cette fin →</button></>:<div className="v11-page-actions"><button className="v11-primary" onClick={onNext}>Continuer l’histoire <span aria-hidden>↗</span></button><span className="v11-page-hint">Observe ce qui a changé depuis ta dernière décision.</span></div>}
    <div className="v11-reader-footer"><span>✦ Une fiction · Chaque décision compte</span><span>{game.history.length} décisions</span></div>
   </>
  </section>
 </main>;
}
