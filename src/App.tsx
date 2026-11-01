import {useEffect,useRef,useState} from 'react';
import {catalog,filters} from './content/catalog';
import {episode01} from './content/episode01';
import {estimateEmotion,newGame,nextScene,pickChoice} from './engine/story';
import {clearGame,loadGame,saveGame} from './engine/storage';
import {aiConfigured,interpretFreeText} from './services/ai';
import type {Emotion,StoryState} from './types';

type Screen='catalog'|'story'|'debrief'|'about';
const art='/assets/scene.webp';
function Icon({name}:{name:'arrow'|'play'|'volume'|'mute'|'restart'|'book'|'compass'}){return <span className="ic" aria-hidden="true">{{arrow:'→',play:'▶',volume:'♫',mute:'♪',restart:'↺',book:'▤',compass:'✧'}[name]}</span>}
function StoryArt({caption,small=false}:{caption?:string;small?:boolean}){
  return <div className={`story-art ${small?'story-art--small':''}`}>
    <div className="story-art__back" aria-hidden="true" style={{backgroundImage:`url(${art})`}} />
    <img className="story-art__image" src={art} alt="Léa, inquiète et en larmes, tente de parler à Noa dans la cour de leur établissement" />
    <div className="story-art__shadow" />
    {caption&&<div className="art-caption">{caption}</div>}
  </div>
}
function ChapterProgress({nodeId}:{nodeId:string}){
  const stage=nodeId==='souvenir'?0:nodeId==='message'?1:nodeId==='attente'?2:nodeId==='premier-choix'?3:nodeId.startsWith('reponse-')?4:nodeId.startsWith('deuxieme-')?5:6;
  return <div className="progress-wrap" aria-label={`Étape ${stage+1} sur 7`}><span className="progress-label">TON HISTOIRE</span><div className="progress-track">{Array.from({length:7},(_,i)=><span className={i<=stage?'active':''} key={i}/>)}</div><span className="progress-label">{stage+1} / 7</span></div>
}
function App(){
 const [screen,setScreen]=useState<Screen>('catalog');
 const [game,setGame]=useState<StoryState>(()=>{const saved=loadGame();return saved&&episode01.nodes[saved.nodeId]?saved:newGame(episode01)});
 const [emotion,setEmotion]=useState<string>('');
 const [filter,setFilter]=useState<string>('Toutes');
 const [customText,setCustomText]=useState('');
 const [adaptive,setAdaptive]=useState<{reply:string;mode:'ai'|'offline'}|null>(null);
 const [busy,setBusy]=useState(false);
 const [audioOn,setAudioOn]=useState(false);
 const [error,setError]=useState('');
 const ambience=useRef<HTMLAudioElement|null>(null);
 const stepAudio=useRef<HTMLAudioElement|null>(null);
 const node=episode01.nodes[game.nodeId];
 useEffect(()=>{saveGame(game)},[game]);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[screen,game.nodeId]);
 function setView(view:Screen){setScreen(view);setError('')}
 function begin(fresh=false){if(fresh){clearGame();setGame(newGame(episode01));setEmotion('');setAdaptive(null);setCustomText('');}setView('story')}
 function soundToggle(){const next=!audioOn;setAudioOn(next);if(next){void ambience.current?.play().catch(()=>setAudioOn(false))}else ambience.current?.pause()}
 function chime(){if(!audioOn||!stepAudio.current)return;stepAudio.current.currentTime=0;void stepAudio.current.play().catch(()=>{});}
 function advance(){chime();setAdaptive(null);setGame(s=>nextScene(episode01,s))}
 function choose(id:string){chime();setAdaptive(null);setGame(s=>pickChoice(episode01,s,id))}
 async function sendOwnWords(){if(busy)return;setError('');if(customText.trim().length<5){setError('Écris au moins quelques mots.');return;}setBusy(true);try{const reply=await interpretFreeText(customText,game.nodeId);const map:{[key:string]:string}={express:'exprimer',avoid:'eviter',ask:'questionner'};setAdaptive({reply:reply.reply,mode:reply.mode});setGame(s=>({...pickChoice(episode01,s,map[reply.intent]),customResponse:customText.trim().slice(0,220)}));setCustomText('');}catch{setError('Une erreur est survenue. Tu peux toujours choisir une réponse proposée.')}finally{setBusy(false)}}
 const visible=catalog.filter(c=>filter==='Toutes'||c.emotions.includes(filter as Emotion));
 return <div className="app">
   <audio ref={ambience} loop preload="none" src="/assets/ambience.mp3"/>
   <audio ref={stepAudio} preload="none" src="/assets/step.mp3"/>
   <header className="site-head"><button className="wordmark" type="button" onClick={()=>setView('catalog')} aria-label="DÉCLIC, revenir au catalogue"><span className="wordmark__seal">D</span><span><strong>DÉCLIC</strong><small>HISTOIRES À VIVRE</small></span></button>
    <nav aria-label="Navigation principale" className="nav"><button className={screen==='catalog'?'selected':''} onClick={()=>setView('catalog')}>Explorer</button><button className={screen==='about'?'selected':''} onClick={()=>setView('about')}>Le concept</button></nav>
    <div className="head-actions"><button className="sound-btn" onClick={soundToggle} aria-pressed={audioOn}><Icon name={audioOn?'volume':'mute'}/><span>{audioOn?'Son activé':'Activer le son'}</span></button></div>
   </header>
   {screen==='catalog'&&<main className="catalog">
     <section className="feature-hero" aria-label="Épisode à la une"><div className="feature-hero__photo" style={{backgroundImage:`url(${art})`}}/><div className="feature-hero__overlay"/>
       <div className="feature-hero__content"><span className="eyebrow ornament">LA COLLECTION INTERACTIVE</span><h1>Et si tu pouvais<br/><em>vivre</em> les histoires ?</h1><p>Ressens ce que vivent les personnages. Choisis tes mots. Découvre ce qu’une décision peut changer — pour toi et pour les autres.</p>
       <div className="hero-actions"><button className="btn btn-primary" onClick={()=>begin()}><Icon name="play"/>{game.history.length?'Reprendre mon histoire':'Vivre l’épisode 01'}</button><span className="hero-fact">10–15 min · Gratuit · Sans compte</span></div></div><span className="feature-hero__episode">01 / CE QU’ON N’A PAS DIT</span></section>
     <div className="catalog-main"><div className="section-heading"><div><span className="eyebrow">LES HISTOIRES À VIVRE</span><h2>Choisis ce que tu veux <em>explorer.</em></h2></div><p>Chaque histoire est une autre manière de comprendre les émotions. Aucune réponse n’est jugée.</p></div>
     <div className="filter-list" aria-label="Filtrer les émotions">{filters.map(x=><button key={x} className={x===filter?'chip active':'chip'} aria-pressed={x===filter} onClick={()=>setFilter(x)}>{x}</button>)}</div>
     <div className="catalog-grid">{visible.map((item,i)=><article key={item.id} className={`episode-card ${item.status==='disponible'?'episode-card--live':'episode-card--soon'} color-${i%5}`}><div className="episode-card__art">{item.art?<img loading="lazy" src={item.art} alt="Léa et Noa devant le collège"/>:<div className="episode-card__symbol" aria-hidden="true">{['','✉','◌','“','∿','∞'][item.episode-1]||'✦'}</div>}<span className="episode-card__index">ÉPISODE {String(item.episode).padStart(2,'0')}</span></div><div className="episode-card__body"><div className="episode-card__tags">{item.emotions.map(e=><span key={e}>{e}</span>)}</div><h3>{item.title}</h3><p>{item.tagline}</p><div className="episode-card__footer"><span>{item.duration}</span>{item.status==='disponible'?<button onClick={()=>begin()} aria-label={`Jouer à ${item.title}`}>Jouer <Icon name="arrow"/></button>:<span className="upcoming">En préparation</span>}</div></div></article>)}</div>
     <aside className="catalog-note"><span className="catalog-note__ornament">✳</span><div><h3>Pas de bonne réponse universelle.</h3><p>DÉCLIC n’est pas un test. C’est un espace pour expérimenter des choix, questionner ses premières impressions et imaginer d’autres issues.</p></div><button onClick={()=>setView('about')}>Découvrir la méthode <Icon name="arrow"/></button></aside></div>
   </main>}
   {screen==='story'&&<main className="player"><div className="player-visual"><StoryArt caption={node.phase==='00'?'AVANT LES CHOIX · LA VIE CONTINUE':'UN INSTANT PEUT TOUT CHANGER'}/><div className="player-visual__overlay"><span className="eyebrow">LÉA · À TOI DE VIVRE</span><h2>{node.phase==='00'?'Tu n’es pas seulement spectateur.':'Une autre suite est possible.'}</h2></div></div>
    <section key={node.id} className="story-panel" aria-live="polite"><div className="player-topline"><button className="back-link" onClick={()=>setView('catalog')}>← Catalogue</button><span>ÉPISODE 01</span></div><ChapterProgress nodeId={node.id}/>
    <span className="eyebrow">{node.eyebrow}</span><h1>{node.title}</h1>
    {node.dialogue&&<blockquote className="dialogue"><span>{node.speaker}</span><p>{adaptive&&node.kind==='reaction'?adaptive.reply:node.dialogue}</p></blockquote>}
    <p className="story-text">{node.text}</p>
    {node.note&&<p className="scene-aside">{node.note}</p>}
    {node.observation&&<div className="observation"><span className="eyebrow">LE DÉTAIL QUI COMPTE</span><p>{node.observation}</p></div>}
    {node.kind==='decision'&&<><div className="emotion-cue"><strong>Avant de répondre…</strong><p>Qu’est-ce que tu ressentirais à la place de Léa ?</p><div className="emotion-buttons">{['Blessure','Colère','Tristesse','Incompréhension','Peur'].map(e=><button className={emotion===e?'picked':''} aria-pressed={emotion===e} key={e} onClick={()=>setEmotion(e)}>{e}</button>)}</div></div><div className="choices-heading"><span className="eyebrow">À TOI DE CHOISIR</span><span>Chaque option ouvre une autre suite.</span></div><div className="choices">{node.choices?.map((c,i)=><button key={c.id} className="choice" onClick={()=>choose(c.id)}><span className="choice__num">0{i+1}</span><span className="choice__body"><strong>{c.title}</strong><span>{c.words}</span></span><span className="choice__arrow">↗</span></button>)}</div>
     {node.id==='premier-choix'&&<details className="free-choice"><summary>Ou écris ce que tu dirais vraiment <span>↘</span></summary><label htmlFor="free-text">Tes propres mots (sans informations personnelles)</label><textarea id="free-text" placeholder="J’aimerais te dire que…" maxLength={220} rows={3} value={customText} onChange={e=>setCustomText(e.target.value)}/><div className="free-choice__actions"><span>{aiConfigured()?'IA adaptative disponible':'Mode histoire hors ligne · IA non activée'}</span><button className="btn btn-outline" disabled={busy} onClick={()=>void sendOwnWords()}>{busy?'J’analyse ton choix…':'Faire évoluer la scène →'}</button></div>{error&&<p role="alert" className="error">{error}</p>}</details>}
     </>}
     {(node.kind==='scene'||node.kind==='reaction')&&<button className="btn btn-primary next-action" onClick={advance}>{node.kind==='scene'?'Continuer l’histoire':'Voir ce qui se passe ensuite'} <Icon name="arrow"/></button>}
     {node.kind==='ending'&&<><div className="perspective"><span className="eyebrow">CHANGER DE POINT DE VUE</span><h3>Et si tu étais à la place de Noa ?</h3><p>{node.perspective}</p></div><div className="takeaway"><span className="eyebrow">UNE PISTE DE RÉFLEXION</span><p>{node.takeaway}</p></div><button className="btn btn-primary next-action" onClick={()=>setView('debrief')}>Découvrir mon parcours <Icon name="arrow"/></button></>}
    </section></main>}
   {screen==='debrief'&&<main className="debrief-page"><div className="debrief-hero"><span className="eyebrow">ÉPISODE TERMINÉ · LE TEMPS DU RECUL</span><h1>Ce que tes choix <em>racontent.</em></h1><p>Tu as vécu une version de l’histoire. D’autres chemins existent. Il n’y a pas de verdict : seulement des pistes pour mieux comprendre.</p></div><div className="debrief-cols"><section className="debrief-card"><span className="eyebrow">TON CHEMIN</span><h2>Les moments décisifs</h2>{game.history.map((c,i)=><div className="history-step" key={`${c.id}-${i}`}><b>{String(i+1).padStart(2,'0')}</b><div><strong>{c.label}</strong><p>{c.words}</p></div></div>)}<p className="debrief-hint">{estimateEmotion(game.impact)}</p>{emotion&&<p className="debrief-hint">Tu avais choisi l’émotion « {emotion} » avant de répondre.</p>}</section><section className="debrief-card"><span className="eyebrow">SE METTRE À SA PLACE</span><h2>Et si tu étais Noa ?</h2><p>{node.perspective??'Noa avait peut-être une autre explication. La découvrir peut changer ton regard sans nier ce que tu as ressenti.'}</p><label className="reflection-label" htmlFor="reflect">Qu’aimerais-tu dire ou demander maintenant ?</label><textarea id="reflect" rows={4} maxLength={800} placeholder="Je voudrais comprendre…" value={game.reflection} onChange={e=>setGame(s=>({...s,reflection:e.target.value}))}/><span className="privacy-note">Ta réponse reste sur cet appareil.</span></section></div><div className="end-actions"><button className="btn btn-primary" onClick={()=>begin(true)}>Revivre un autre chemin <Icon name="restart"/></button><button className="btn btn-outline" onClick={()=>window.print()}>Imprimer mon parcours</button><button className="btn btn-quiet" onClick={()=>setView('catalog')}>Explorer le catalogue →</button></div></main>}
   {screen==='about'&&<main className="about-page"><span className="eyebrow">LA PROMESSE DÉCLIC</span><h1>Vivre une histoire.<br/><em>Voir autrement.</em></h1><p>DÉCLIC donne une place aux émotions dans les histoires interactives. Tu incarnes un personnage, tu comprends son passé, tu choisis ses mots et tu vois ce que ces décisions peuvent provoquer.</p><div className="values"><article><b>01</b><h2>Ressentir</h2><p>Vivre le contexte, pas juste répondre à une question.</p></article><article><b>02</b><h2>Choisir</h2><p>Explorer de vraies conséquences, sans score moral.</p></article><article><b>03</b><h2>Comprendre</h2><p>Regarder aussi depuis la place de l’autre.</p></article></div><div className="educator-note"><h2>Pour les professionnels</h2><p>Un support de dialogue pour les adolescents, utilisable individuellement ou en atelier accompagné. Proposez une première exploration, discutez les émotions perçues, puis rejouez une autre branche et comparez. Les situations sont fictives ; les interprétations émotionnelles restent des hypothèses et ne constituent pas un diagnostic.</p><p>Prototype pédagogique à tester avec les publics concernés avant diffusion professionnelle.</p></div><button className="btn btn-primary" onClick={()=>setView('catalog')}>Explorer les histoires <Icon name="arrow"/></button></main>}
   <footer className="site-footer"><span>DÉCLIC © 2026 · Histoires à vivre</span><span>Fiction interactive · Sans note ni diagnostic · Progression locale</span><span>Épisode pilote</span></footer>
 </div>
}
export default App;
