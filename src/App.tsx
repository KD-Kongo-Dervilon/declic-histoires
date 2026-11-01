import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {catalog,filters} from './content/catalog';
import {episodes} from './content/episodes';
import {estimateEmotion,newGame,nextScene,pickChoice} from './engine/story';
import {clearGame,loadGame,saveGame} from './engine/storage';
import {discoverEnding,endingCount,isUnlocked,loadProgress,saveProgress,emptyProgress,clearProgress} from './engine/progress';
import type {Progress} from './engine/progress';
import {aiConfigured,interpretFreeText} from './services/ai';
import type {StoryState} from './types';
import {LouisImmersion} from './features/LouisImmersion';
import {Insights,type InsightsMode,type ReaderSettings} from './features/Insights';
import {CinematicReader} from './features/CinematicReader';

type Screen='catalog'|'story'|'debrief'|'about'|'progress'|'universe'|InsightsMode;
type Book={id:string;name:string;eyebrow:string;tag:string;desc:string;age:string;image:string;url?:string;source:string;teaser:string;choices:[string,string];after:[string,string]};
const moneyBooks:Book[]=[
 {id:'louis',name:'Les Graines — Louis : J’essaie quand même',eyebrow:'ROMAN · FRANÇAIS',tag:'Oser malgré cette petite voix qui nous retient.',desc:'À quatorze ans, Louis rêve de réaliser un court-métrage. Et si ses doutes ne lui appartenaient pas vraiment ?',age:'À partir de 10 ans',image:'/assets/book_louis.webp',url:'https://amzn.eu/d/0j6QdKFd',source:'Couverture originale du livre',teaser:'Une affiche annonce un concours de courts-métrages. Louis observe le règlement. Sur son carnet, il avait déjà dessiné les premières scènes… Pourtant, une phrase tourne dans sa tête : « Et si je n’étais pas assez bon ? »',choices:['Il commence par filmer une scène, même imparfaite.','Il range son carnet pour ne pas se tromper.'],after:['En avançant, Louis découvre qu’essayer n’exige pas d’être déjà prêt.','Le doute gagne du terrain. Mais le concours est encore ouvert, et rien n’est définitivement joué.']},
 {id:'ethan',name:'Ethan: I Try Anyway',eyebrow:'ROMAN · ENGLISH EDITION',tag:'A story about courage, doubt and trying anyway.',desc:'Discover an English-language story about believing in yourself and daring to begin.',age:'English · Ages 10+',image:'/assets/book_ethan_real.webp',url:'https://amzn.eu/d/094261dL',source:'Couverture anglaise fournie via capture Amazon',teaser:'Ethan is looking at an opportunity that feels just out of reach. He has imagined what he might create—but the question remains: what if he fails?',choices:['Take a first small step.','Wait until everything feels certain.'],after:['Even a small attempt can change how Ethan sees what is possible.','Waiting feels safer for a moment, but the question stays with him.']},
 {id:'maman',name:'Où est maman ?',eyebrow:'ALBUM JEUNESSE · FRANÇAIS',tag:'Une histoire tendre sur l’amour, la séparation et l’espoir.',desc:'Un album à partager avec les plus jeunes pour parler des liens qui restent présents, même dans l’absence.',age:'3–7 ans · Lecture accompagnée',image:'/assets/book_maman_real.webp',url:'https://amzn.eu/d/05GInpVx',source:'Couverture réelle du livre',teaser:'Un enfant serre son doudou contre lui et regarde la porte. Il voudrait poser une question, mais les mots restent coincés. Un adulte s’assied près de lui pour l’écouter.',choices:['« Tu veux me raconter ce que tu ressens ? »','« Viens, on reste ensemble un moment. »'],after:['Les mots peuvent aider à donner une place à la peine.','Parfois, la présence et la douceur parlent avant les explications.']},
];
const bookByEpisode:Record<number,string>={0:'louis',1:'louis',2:'ethan',3:'louis',4:'maman',5:'louis'};
function App(){
 const [screen,setScreen]=useState<Screen>('catalog');
 const [readerSettings,setReaderSettings]=useState<ReaderSettings>(()=>{try{const x=JSON.parse(localStorage.getItem('declic:reader-settings')||'null');return {nickname:typeof x?.nickname==='string'?x.nickname.slice(0,32):'',fontScale:x?.fontScale===1.17?1.17:1,reducedMotion:!!x?.reducedMotion,highContrast:!!x?.highContrast}}catch{return {nickname:'',fontScale:1,reducedMotion:false,highContrast:false}}});
 const [progress,setProgress]=useState<Progress>(loadProgress);
 const [episodeIndex,setEpisodeIndex]=useState(0);
 const ep=episodes[episodeIndex];
 const [game,setGame]=useState<StoryState>(()=>loadGame(episodes[0].id)??newGame(episodes[0]));
 const [filter,setFilter]=useState<string>('Toutes');
 const [emotion,setEmotion]=useState('');
 const [customText,setCustomText]=useState('');
 const [adaptive,setAdaptive]=useState<{reply:string;mode:'ai'|'offline'}|null>(null);
 const [busy,setBusy]=useState(false);
 const [audioOn,setAudioOn]=useState(false);
 const [audioSource,setAudioSource]=useState('foret-oiseaux');
 const [audioCustom,setAudioCustom]=useState<string|null>(null);
 const [volume,setVolume]=useState(0.55);
 const uploadRef=useRef<HTMLInputElement|null>(null);
 const [soundError,setSoundError]=useState(false);
 const [error,setError]=useState('');
 const [bookIndex,setBookIndex]=useState(0);
 const [bookChoice,setBookChoice]=useState<number|null>(null);
 const ambience=useRef<HTMLAudioElement|null>(null),stepAudio=useRef<HTMLAudioElement|null>(null);
 const node=ep.nodes[game.nodeId]??ep.nodes[ep.start];
 const uniqueFinishes=endingCount(progress,ep.id);
 const totalFinishes=episodes.reduce((sum,x)=>sum+endingCount(progress,x.id),0);
 const unlocked=episodes.filter((_,i)=>isUnlocked(progress,episodes,i)).length;
 const canNext=episodeIndex<episodes.length-1&&isUnlocked(progress,episodes,episodeIndex+1);
 useEffect(()=>{saveGame(ep.id,game)},[ep.id,game]);
 useEffect(()=>{saveProgress(progress)},[progress]);
 useEffect(()=>{try{localStorage.setItem('declic:reader-settings',JSON.stringify(readerSettings))}catch{}},[readerSettings]);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[screen,game.nodeId,episodeIndex]);
 useEffect(()=>{if(ambience.current)ambience.current.volume=volume},[volume]);
 useEffect(()=>{if(!audioOn){ambience.current?.pause();return;}void ambience.current?.play().catch(()=>{setAudioOn(false);setSoundError(true)})},[audioOn,episodeIndex,audioSource,audioCustom]);
 useEffect(()=>()=>{if(audioCustom)URL.revokeObjectURL(audioCustom)},[audioCustom]);
 function resetSeason(){
  const confirmed=window.confirm('Recommencer la saison ? Tes fins découvertes et tes parties enregistrées seront effacées sur cet appareil.');
  if(!confirmed)return;
  episodes.forEach(e=>clearGame(e.id));
  clearProgress();
  setProgress(emptyProgress());setEpisodeIndex(0);setGame(newGame(episodes[0]));
  setFilter('Toutes');setEmotion('');setScreen('catalog');
 }
 function toCatalogue(){view('catalog');window.requestAnimationFrame(()=>document.getElementById('catalogue')?.scrollIntoView({behavior:'smooth',block:'start'}))}
 function view(to:Screen){setScreen(to);setError('')}
 function openBook(id:string){const i=moneyBooks.findIndex(b=>b.id===id);if(i>=0){setBookIndex(i);setBookChoice(null);view('universe')}}
 function begin(i:number,fresh=false){if(!isUnlocked(progress,episodes,i))return;const e=episodes[i];if(fresh)clearGame(e.id);setEpisodeIndex(i);const stored=fresh?null:loadGame(e.id);setGame(stored&&e.nodes[stored.nodeId]&&e.nodes[stored.nodeId]?.kind!=='ending'?stored:newGame(e));setEmotion('');setCustomText('');setAdaptive(null);view('story')}
 function startAudioWithGesture(url:string){const player=ambience.current;if(!player)return;player.src=url;player.volume=volume;player.load();void player.play().then(()=>{setSoundError(false)}).catch(()=>{setSoundError(true);setAudioOn(false)})}
 function soundToggle(){setSoundError(false);if(audioOn){ambience.current?.pause();setAudioOn(false)}else{setAudioOn(true);startAudioWithGesture(audioSource==='personal'&&audioCustom?audioCustom:`/assets/${audioSource}.mp3`)}}
 function chooseAudio(id:string){setAudioSource(id);setAudioCustom(null);setAudioOn(true);startAudioWithGesture(`/assets/${id}.mp3`)}
 function chooseFile(f?:File){if(!f)return;if(!f.type.startsWith('audio/')){setSoundError(true);return;}if(f.size>60_000_000){setSoundError(true);return;}const objectUrl=URL.createObjectURL(f);setAudioCustom(objectUrl);setAudioSource('personal');setAudioOn(false);setSoundError(false)}
 function soundStep(){if(!audioOn||!stepAudio.current)return;stepAudio.current.currentTime=0;void stepAudio.current.play().catch(()=>{})}
 function advance(){soundStep();setAdaptive(null);setGame(s=>nextScene(ep,s))}
 function choose(id:string){soundStep();setAdaptive(null);setGame(s=>pickChoice(ep,s,id,emotion||undefined));setEmotion('')}
 function complete(){if(node.kind==='ending'){setProgress(p=>discoverEnding(p,ep,node.id,game))}view('debrief')}
 async function sendFreeText(input?:string){if(busy)return;setError('');if((input??customText).trim().length<5){setError('Écris au moins cinq caractères.');return;}setBusy(true);try{const answer=await interpretFreeText(input??customText,game.nodeId,ep.id);const intents:{[key:string]:string}={express:'exprimer',avoid:'eviter',ask:'questionner'};const target=node.choices?.find(x=>x.intention===answer.intent)??node.choices?.find(x=>x.id===intents[answer.intent])??node.choices?.[0];if(!target){setError('Aucune réponse adaptée à cette scène.');return;}setGame(s=>({...pickChoice(ep,s,target.id,emotion||undefined),customResponse:(input??customText).trim().slice(0,220)}));setEmotion('');setAdaptive({reply:answer.reply,mode:answer.mode});setCustomText('');}catch{setError('L’adaptation est indisponible. Utilise une des réponses proposées.')}finally{setBusy(false)}}
 const visible=catalog.filter(x=>filter==='Toutes'||x.emotions.includes(filter as never));
 return <div className={"app v5-app"+(screen==='story'?" is-reading":"")+(readerSettings.highContrast?" is-high-contrast":"")+(readerSettings.reducedMotion?" is-reduced-motion":"")} style={{"--reader-scale":readerSettings.fontScale} as CSSProperties}>
  <audio ref={ambience} loop src={audioSource==='personal'&&audioCustom?audioCustom:`/assets/${audioSource}.mp3`} preload="none"/><audio ref={stepAudio} src="/assets/step.mp3" preload="auto"/>
  <header className="site-head">
   <button className="wordmark" onClick={()=>view('catalog')} aria-label="Accueil DÉCLIC"><span className="wordmark__seal">D</span><span><strong>DÉCLIC</strong><small>HISTOIRES À VIVRE</small></span></button>
   <nav className="nav" aria-label="Navigation principale">
    <button className={screen==='catalog'?'selected':''} onClick={()=>view('catalog')}>⌂ <span>Accueil</span></button>
    <button onClick={toCatalogue}>▦ <span>Catalogue</span></button>
    <button className={screen==='progress'?'selected':''} onClick={()=>view('progress')}>▥ <span>Mes histoires</span></button>
    <button className={screen==='universe'?'selected':''} onClick={()=>view('universe')}>▤ <span>Bibliothèque DÉCLIC</span></button>
   </nav>
   <div className="header-account"><button className="header-profile" onClick={()=>view('profile')} aria-label="Ouvrir mon profil">♙ <span>Mon profil</span></button><button className="header-settings" onClick={()=>view('settings')} aria-label="Ouvrir les paramètres">⚙</button></div>
   <button className="sound-btn" aria-pressed={audioOn} onClick={soundToggle} title={audioOn?'Couper les ambiances':'Activer les ambiances'}>{audioOn?'♫ Son activé':'♫ Son'}</button>
  </header>
  {soundError&&<div role="alert" className="sound-warning">Le navigateur empêche la lecture du son. Appuie à nouveau sur le bouton après une interaction.</div>}
  {screen==='catalog'&&<main className="catalog catalog-dashboard"><div className="landing-top">
   <section className="feature-hero" aria-label="Histoire à la une">
    <div className="feature-hero__photo" style={{backgroundImage:'url(/assets/episode01.webp)'}}/>
    <div className="feature-hero__overlay"/>
    <div className="feature-hero__content">
     <span className="hero-episode-tag">ÉPISODE 01</span>
     <h1>Ce qu’on<br/>n’a pas dit</h1>
     <p>Léa sent que Noa s’éloigne…<br/>Et si ce n’était pas ce qu’elle croyait ?</p>
     <div className="hero-meta"><span>◷ &nbsp; {episodes[0].duration} de lecture interactive</span><span>♧ &nbsp; 9 fins possibles</span><span>♡ &nbsp; Amitié · Incompréhension · Confiance</span></div>
     <button className="btn btn-primary hero-cta" onClick={()=>begin(0)}>▶ {progress.completed.includes(episodes[0].id)?'Rejouer l’épisode 01':'Commencer l’épisode 01'}</button>
    </div>
    <button className="feature-hero__progress" onClick={()=>view('progress')} aria-label="Voir ma progression de l’épisode 1"><strong>◎ &nbsp; Ma progression</strong><span>{endingCount(progress,episodes[0].id)} / 9 fins découvertes</span><span className="dashboard-track"><i style={{width:`${100*endingCount(progress,episodes[0].id)/9}%`}}/></span></button>
   </section>
   <aside className="landing-library">
    <div className="landing-library__head"><span className="eyebrow">▤ &nbsp; LA BIBLIOTHÈQUE DÉCLIC</span><h2>Une histoire en appelle une autre.</h2><p>Retrouve ces histoires en livre pour prolonger l’émotion.</p></div>
    <div className="landing-library__books">{moneyBooks.filter(b=>b.url).map(b=><article key={b.id}>
     <button className="landing-library__preview" onClick={()=>openBook(b.id)} aria-label={`Découvrir ${b.name}`}><img src={b.image} alt={`Couverture : ${b.name}`}/></button>
     <div className="landing-library__book-info"><h3>{b.name}</h3><p>{b.tag}</p><span>{b.age}</span></div>
     <a href={b.url} target="_blank" rel="noopener noreferrer" className="landing-library__buy">Voir sur Amazon ↗</a>
    </article>)}</div>
   </aside>
  </div>
   <section className="catalog-main" id="catalogue">
    <aside className="v5-status" aria-label="Progression de la saison">
     <div className="v5-status__heading">♕ &nbsp; Mon parcours</div>
     <div className="v5-status__main"><div className="v5-status__metrics">
      <div><span>◎ &nbsp; Épisodes terminés</span><strong>{progress.completed.length} / 6</strong></div>
      <div><span>◇ &nbsp; Fins découvertes</span><strong>{totalFinishes} / 54</strong></div>
      <div><span>♧ &nbsp; Histoires accessibles</span><strong>{unlocked} / 6</strong></div>
     </div><div className="v5-status__ring" style={{'--progress':`${Math.round(100*progress.completed.length/episodes.length)}%`} as CSSProperties}><strong>{Math.round(100*progress.completed.length/episodes.length)}%</strong><small>de la saison</small></div></div>
     <div className="v5-status__actions"><button onClick={()=>view('progress')}>Voir mon parcours →</button></div>
    </aside>
   <div className="section-heading"><div><span className="eyebrow">▣ &nbsp; LES HISTOIRES DÉCLIC — SAISON 1</span><h2>Choisis ton histoire.</h2></div><p>Termine un épisode pour débloquer le suivant.</p></div><div className="filter-list" aria-label="Filtrer les histoires par émotion">{filters.map(x=><button key={x} className={x===filter?'chip active':'chip'} aria-pressed={filter===x} onClick={()=>setFilter(x)}>{x}</button>)}</div>
   <div className="catalog-grid v5-catalog-grid">{visible.map(item=>{const i=episodes.findIndex(e=>e.id===item.id),e=episodes[i];const open=isUnlocked(progress,episodes,i),ends=endingCount(progress,e.id),finished=progress.completed.includes(e.id);return <article key={item.id} className={`episode-card v5-card ${open?'episode-card--live':'episode-card--locked'}`}><div className="episode-card__art"><img loading="lazy" src={e.image} alt={`Illustration de ${e.title}`}/><span className="episode-card__index">ÉPISODE {String(i+1).padStart(2,'0')}</span>{!open&&<span className="v5-lock">🔒</span>}</div><div className="episode-card__body"><div className="episode-card__tags">{e.emotions.map(t=><span key={t}>{t}</span>)}</div><h3>{e.title}</h3><p>{e.subtitle}</p><p className="episode-duration">◷ {e.duration}</p><div className="episode-card__footer"><span>{finished?'✓ Terminé':open?'À découvrir':'Termine l’épisode précédent'}<small>{ends} / 9 fins</small></span>{open?<button onClick={()=>begin(i)} aria-label={`Jouer à ${e.title}`}>Jouer →</button>:<span className="upcoming">Verrouillé</span>}</div></div></article>})}</div>
   <aside className="catalog-note"><span className="catalog-note__ornament">✳</span><div><h3>Tu peux changer l’histoire, pas effacer les émotions.</h3><p>Il n’y a pas de bonne réponse universelle. Chaque choix est une occasion de réfléchir au point de vue des autres.</p></div><button onClick={()=>view('about')}>Notre méthode →</button></aside>
   <section className="books-teaser"><div><span className="eyebrow">APRÈS DÉCLIC</span><h2>Prolonge l’émotion <em>en lisant.</em></h2><p>Découvre les autres univers narratifs. Une scène à découvrir, puis les livres qui prolongent les émotions vécues.</p></div><button className="btn btn-outline" onClick={()=>view('universe')}>Explorer les univers →</button></section>
    <div className="dashboard-actions" aria-label="Accès rapides">
     <button onClick={()=>begin(0)}>▷ &nbsp; Vivre une histoire</button>
     <button onClick={()=>view('emotions')}>♡ &nbsp; Mes émotions</button>
     <button onClick={()=>view('journal')}>▤ &nbsp; Mon parcours</button>
     <button onClick={()=>view('learning')}>✧ &nbsp; Débrief & apprentissages</button>
     <button onClick={soundToggle}>♫ &nbsp; {audioOn?'Couper l’ambiance':'Activer le son'}</button>
     <button onClick={()=>view('settings')}>⚙ &nbsp; Paramètres</button>
    </div>
   </section></main>}
  {screen==='story'&&<CinematicReader key={`${ep.id}:${node.id}:${game.visited.length}`} episode={ep} node={node} game={game} episodeIndex={episodeIndex} knownEndings={uniqueFinishes} emotion={emotion} onEmotion={setEmotion} onChoose={choose} onNext={advance} onComplete={complete} onBack={()=>view('catalog')} onPageTurn={soundStep} onFreeText={async value=>sendFreeText(value)} busy={busy} error={error} reducedMotion={readerSettings.reducedMotion} adaptiveReply={adaptive?.reply}/>}
  {screen==='debrief'&&<main className="debrief-page"><div className="debrief-hero"><span className="eyebrow">ÉPISODE {episodeIndex+1} TERMINÉ · BRAVO</span><h1>Une fin vécue.<br/><em>D’autres existent.</em></h1><p>Tu as découvert {uniqueFinishes} fin{uniqueFinishes>1?'s':''} sur 9 pour cet épisode. Tu peux rejouer une autre branche ou poursuivre la collection.</p><div className="v5-badge">🏅 {uniqueFinishes} / 9 fins découvertes · {progress.completed.length} / 6 épisodes terminés</div></div><div className="debrief-cols"><section className="debrief-card"><span className="eyebrow">LE CHEMIN PARCOURU</span><h2>Tes décisions</h2>{game.history.map((h,i)=><div className="history-step" key={i}><b>{i+1}</b><div><strong>{h.label}</strong><p>{h.words}</p></div></div>)}<p className="debrief-hint">{estimateEmotion(game.impact)}</p><button className="btn btn-outline" onClick={()=>view('journal')}>Voir mon journal complet →</button>{emotion&&<p className="debrief-hint">Émotion que tu as choisie : {emotion}.</p>}</section><section className="debrief-card"><span className="eyebrow">LE POINT DE VUE DE L’AUTRE</span><h2>Et si tu étais à sa place ?</h2><p>{node.perspective??'Cette personne peut vivre la situation autrement, sans que cela annule ce que tu ressens.'}</p><label className="reflection-label" htmlFor="reflection">Qu’aimerais-tu comprendre maintenant ?</label><textarea id="reflection" rows={4} maxLength={800} value={game.reflection} onChange={e=>setGame(s=>({...s,reflection:e.target.value}))} placeholder="Je voudrais lui demander…"/><span className="privacy-note">Cette réponse reste uniquement sur cet appareil.</span></section></div><section className="afterstory-book"><img src={moneyBooks.find(b=>b.id===bookByEpisode[episodeIndex])?.image} alt="Couverture du livre recommandé"/><div><span className="eyebrow">POUR PROLONGER TON HISTOIRE</span><h2>Ce récit t’a touché ?</h2><p>Découvre une autre histoire sur les doutes, les liens et le courage d’avancer.</p><button className="btn btn-outline" onClick={()=>openBook(bookByEpisode[episodeIndex])}>Découvrir le livre et lire une scène →</button></div></section><div className="debrief-learning"><span className="eyebrow">CE QUE J’AI APPRIS</span><h2>Ce que cette fin m’invite à comprendre</h2><p>{node.takeaway??'Tes décisions ont influencé cette histoire et la réaction des personnages.'}</p><button className="btn btn-outline" onClick={()=>view('learning')}>Voir mes apprentissages →</button></div><div className="end-actions"><button className="btn btn-primary" onClick={()=>begin(episodeIndex,true)}>↺ Découvrir une autre fin</button>{canNext&&<button className="btn btn-outline" onClick={()=>begin(episodeIndex+1)}>▶ Épisode suivant débloqué</button>}<button className="btn btn-outline" onClick={()=>view('endings')}>Découvrir mes 9 fins possibles →</button><button className="btn btn-outline" onClick={()=>window.print()}>Imprimer mon parcours</button><button className="btn btn-quiet" onClick={()=>view('catalog')}>Retour au catalogue →</button></div></main>}
  {screen==='progress'&&<main className="v5-progress"><span className="eyebrow">TA COLLECTION DE CHOIX</span><h1>Chaque fin est <em>une autre histoire.</em></h1><p>Le but n’est pas de choisir « parfaitement », mais d’expérimenter et de comprendre d’autres points de vue.</p><div className="v5-progress-summary"><div><strong>{progress.completed.length}/6</strong> histoires terminées</div><div><strong>{totalFinishes}/54</strong> fins découvertes</div><div><strong>{unlocked}/6</strong> épisodes débloqués</div></div> <div className="progress-tools"><button className="btn btn-outline" onClick={()=>view('journal')}>Mon journal de choix →</button><button className="btn btn-outline" onClick={()=>view('emotions')}>Mes émotions →</button><button className="btn btn-outline" onClick={()=>view('endings')}>Les 54 fins →</button></div><div className="v5-progress-list">{episodes.map((e,i)=>{const opens=isUnlocked(progress,episodes,i),ends=endingCount(progress,e.id);return <article key={e.id}><img src={e.image} alt=""/><div><span className="eyebrow">ÉPISODE {i+1}</span><h2>{e.title}</h2><div className="progress-track">{Array.from({length:9},(_,j)=><span key={j} className={j<ends?'active':''}/>)}</div><p>{ends} / 9 fins · {opens?(ends?'À rejouer':'Disponible'):'Verrouillé'}</p></div><button className="btn btn-outline" disabled={!opens} onClick={()=>begin(i)}>{opens?'Jouer →':'🔒'}</button></article>})}</div></main>}
  {screen==='universe'&&<main className="v5-universe books-page"><span className="eyebrow">LES LIVRES DE L’UNIVERS DÉCLIC</span><h1>Quand l’histoire continue <em>après l’écran.</em></h1><p>Tu as aimé ressentir et choisir dans DÉCLIC ? Des livres pour explorer autrement le courage, les liens et les émotions.</p><div className="books-library"><div className="books-list">{moneyBooks.map((b,i)=><button key={b.id} className={'books-list-item '+(bookIndex===i?'selected':'')} onClick={()=>{setBookIndex(i);setBookChoice(null)}}><img src={b.image} alt={`Visuel : ${b.name}`}/><span><small>{b.eyebrow}</small><strong>{b.name}</strong><em>{b.age}</em></span><span className="books-list-chevron">›</span></button>)}</div><article className="books-feature" key={moneyBooks[bookIndex].id}><div className="books-feature-main"><img className="books-feature-cover" src={moneyBooks[bookIndex].image} alt={`Couverture de ${moneyBooks[bookIndex].name}`}/><div><span className="eyebrow">{moneyBooks[bookIndex].eyebrow}</span><h2>{moneyBooks[bookIndex].name}</h2><p>{moneyBooks[bookIndex].desc}</p><p className="books-feature-age">{moneyBooks[bookIndex].age}</p>{moneyBooks[bookIndex].id==='louis'&&<button className="btn btn-outline" type="button" onClick={()=>document.getElementById('louis-immersion')?.scrollIntoView({behavior:'smooth',block:'start'})}>▶ Vivre l’histoire interactive de Louis</button>}{moneyBooks[bookIndex].url?<a className="btn btn-primary amazon-link" href={moneyBooks[bookIndex].url} target="_blank" rel="noopener noreferrer">Voir ce livre sur Amazon ↗</a>:<span className="books-feature-age">Explore cet univers dans nos autres créations.</span>}</div></div><div className="book-teaser"><span className="eyebrow">UN INSTANT DANS CET UNIVERS</span><h3>Et toi, que ferais-tu ?</h3><p>{moneyBooks[bookIndex].teaser}</p><div className="book-teaser-options">{moneyBooks[bookIndex].choices.map((c,i)=><button className={bookChoice===i?'selected':''} key={c} onClick={()=>setBookChoice(i)}>{c}</button>)}</div>{bookChoice!==null&&<p className="book-teaser-result">{moneyBooks[bookIndex].after[bookChoice]}</p>}<p className="book-teaser-disclaimer">Découvre l’ambiance de cet univers avant de poursuivre la lecture sur Amazon.</p></div>{moneyBooks[bookIndex].id==='louis'&&<LouisImmersion/>}</article></div></main>}
  {(['emotions','journal','learning','endings','profile','settings'] as Screen[]).includes(screen)&&<Insights mode={screen as InsightsMode} progress={progress} episodes={episodes} settings={readerSettings} onChange={setReaderSettings} onGo={view} onHome={()=>view('catalog')} onRestart={resetSeason} onPlay={begin} onSound={soundToggle} audioOn={audioOn} soundPanel={<>  <details className="sound-studio"><summary className="sound-studio__top"><strong>♫ Ambiances sonores</strong><span>Oiseaux, ruisseau, vent, nuit ou ton propre fichier</span></summary><div className="sound-studio__options">{[{id:'foret-oiseaux',label:'Oiseaux'},{id:'foret-ruisseau',label:'Ruisseau'},{id:'foret-vent',label:'Vent dans les arbres'},{id:'foret-nuit',label:'Forêt de nuit'}].map(o=><button type="button" className={audioSource===o.id?'active':''} key={o.id} aria-pressed={audioSource===o.id} onClick={()=>chooseAudio(o.id)}>{o.label}</button>)}<button type="button" className={audioSource==='personal'?'active':''} onClick={()=>uploadRef.current?.click()}>＋ Mon fichier</button><input ref={uploadRef} type="file" accept="audio/*" hidden onChange={e=>chooseFile(e.target.files?.[0])}/></div><div className="sound-studio__bottom"><label htmlFor="sound-volume">Volume <span>{Math.round(volume*100)} %</span></label><input id="sound-volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><button onClick={soundToggle} aria-pressed={audioOn}>{audioOn?'Couper le son':'▶ Écouter'}</button></div><p className="sound-studio__note">{audioSource==='personal'&&audioCustom?'Ton fichier est prêt : appuie sur « Écouter » pour démarrer. Il reste sur ton appareil.':'Un fichier importé reste sur ton appareil et n’est pas envoyé à notre serveur.'}</p></details></>}/>}
  {screen==='about'&&<main className="about-page"><span className="eyebrow">LA PROMESSE DÉCLIC</span><h1>Ressentir.<br/><em>Choisir. Comprendre.</em></h1><p>Six histoires interactives, neuf fins par épisode et aucun jugement sur les émotions. Une aide à la réflexion, et non un outil d’évaluation psychologique.</p><div className="values"><article><b>01</b><h2>Vivre</h2><p>Comprendre le contexte et les besoins de chacun.</p></article><article><b>02</b><h2>Décider</h2><p>Explorer des conséquences différentes dans chaque histoire.</p></article><article><b>03</b><h2>Revenir</h2><p>Rejouer les situations avec un autre regard.</p></article></div><div className="educator-note"><h2>Pour les professionnels</h2><p>Utilisez un premier parcours pour recueillir le ressenti du jeune, puis une seconde fin pour discuter des effets d’un autre choix. Les interprétations sont des pistes, pas des diagnostics. Les contenus doivent être évalués auprès des publics concernés avant un usage institutionnel.</p><p>Le mode IA n’est pas une évaluation clinique et reste optionnel : les histoires fonctionnent sans lui.</p></div><button className="btn btn-primary" onClick={()=>view('catalog')}>Explorer les histoires →</button></main>}
  <footer className="site-footer"><span>DÉCLIC © 2026 · Histoires à vivre</span><span>Fictions interactives · Sans score moral · Données enregistrées localement</span><button onClick={()=>view('about')}>Notre méthode</button></footer>
  {screen!=='story'&&screen!=='debrief'&&<nav className="v5-mobile-nav" aria-label="Navigation mobile"><button className={screen==='catalog'?'active':''} onClick={()=>view('catalog')}>⌂<span>Histoires</span></button><button className={['progress','journal','emotions','endings','learning'].includes(screen)?'active':''} onClick={()=>view('progress')}>◉<span>Mes fins</span></button><button className={screen==='universe'?'active':''} onClick={()=>view('universe')}>▤<span>Univers</span></button></nav>}
 </div>;
}
export default App;
