import type {Episode} from '../types';
import type {ReactNode} from 'react';
import type {Progress,Journey} from '../engine/progress';
import {emotionTallies,endingCount,isUnlocked} from '../engine/progress';

export type InsightsMode='emotions'|'journal'|'learning'|'endings'|'profile'|'settings';
export type ReaderSettings={nickname:string;fontScale:number;reducedMotion:boolean;highContrast:boolean;nightMode?:boolean};
export type InsightsProps={
 mode:InsightsMode; progress:Progress; episodes:Episode[]; settings:ReaderSettings;
 onChange:(next:ReaderSettings)=>void; onGo:(mode:InsightsMode)=>void;
 onHome:()=>void; onRestart:()=>void; onPlay:(index:number)=>void;
 onSound:()=>void; audioOn:boolean; soundPanel:ReactNode;
};
function dateOf(value:string){try{return new Date(value).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}catch{return 'Date inconnue'}}
function downloadJourneys(progress:Progress){
 const file=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),journeys:progress.journeys||[]},null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download='declic-mon-parcours.json';a.click();URL.revokeObjectURL(url);
}
const emotionDescriptions:Record<string,string>={
 Blessure:'Ce sentiment peut apparaître quand un lien ou une attente a été touché.',
 Colère:'La colère peut signaler une limite ou quelque chose qui te semble injuste.',
 Tristesse:'La tristesse invite parfois à reconnaître ce à quoi tu tiens.',
 Incompréhension:'Ne pas comprendre peut amener à demander une explication plutôt qu’à supposer.',
 Peur:'La peur peut te donner envie de te protéger ou de chercher une présence rassurante.',
 Honte:'La honte peut te pousser à te cacher. La situation ne définit pas ta valeur.',
 Solitude:'Se sentir seul ne signifie pas forcément être oublié ; parler peut aider à clarifier.',
 Confiance:'La confiance se construit avec des gestes répétés, pas une seule formule.',
 Pression:'La pression peut rendre difficile un refus que tu souhaiterais pourtant exprimer.',
};
function pathCard(j:Journey,episodes:Episode[],i:number){
 const episode=episodes.find(e=>e.id===j.episodeId);const ending=episode?.nodes[j.endingId];
 return <article className="insight-journey" key={j.id+'-'+i}>
  <div className="insight-journey__top"><div><small>ÉPISODE {episodes.indexOf(episode!)+1} · {dateOf(j.finishedAt)}</small><h3>{episode?.title||'Histoire'} — {ending?.title||'Fin découverte'}</h3></div><span>{j.choices.length} choix</span></div>
  <ol className="insight-timeline">{j.choices.map((c,k)=><li key={c.sceneId+'-'+k}><span>{k+1}</span><div><strong>{c.label}</strong><p>{c.words}</p>{c.emotion&&<small>Émotion indiquée : {c.emotion}</small>}</div></li>)}</ol>
  <p className="insight-takeaway">{ending?.takeaway||'Rejoue ce parcours en essayant une autre décision.'}</p>
 </article>
}
export function Insights(props:InsightsProps){
 const {mode,progress,episodes,settings,onChange,onGo,onHome,onRestart,onPlay,onSound,audioOn,soundPanel}=props;
 const journeys=[...(progress.journeys||[])].reverse();
 const total=episodes.reduce((n,e)=>n+endingCount(progress,e.id),0);
 const tallies=emotionTallies(progress);
 const narrativeConsequences=journeys.slice(0,6).map(j=>({
  id:j.id,episode:episodes.find(e=>e.id===j.episodeId)?.title||'Histoire',
  relation:j.impact.relation>1?'Lien qui s’ouvre':j.impact.relation<0?'Lien fragilisé':'Lien incertain',
  tension:j.impact.tension>1?'Tension accrue':j.impact.tension<0?'Tension apaisée':'Tension encore présente',
  expression:j.impact.expression>1?'Les mots ont trouvé une place':j.impact.expression<0?'Des non-dits persistent':'L’expression reste hésitante'
 }));
 const titles:Record<InsightsMode,string>={emotions:'Mes émotions',journal:'Mon parcours',learning:'Débrief & apprentissages',endings:'Les fins à découvrir',profile:'Mon profil',settings:'Paramètres'};
 return <main className="insights-page">
  <div className="insights-header"><span className="eyebrow">TON ESPACE DÉCLIC · PERSONNEL ET LOCAL</span><h1>{titles[mode]}</h1><p>Ton histoire change selon tes décisions. Tu peux explorer les autres chemins sans être jugé.</p></div>
  <nav className="insights-tabs" aria-label="Rubriques de mon espace">
   {(['emotions','journal','learning','endings','profile','settings'] as const).map(s=><button key={s} className={mode===s?'current':''} onClick={()=>onGo(s)} aria-current={mode===s?'page':undefined}>{titles[s]}</button>)}
  </nav>
  {mode==='emotions'&&<section className="insights-section"><div className="insights-section__title"><h2>Ce que tu as ressenti en jouant</h2><p>Ce sont uniquement les émotions que tu as indiquées au moment des choix. DÉCLIC ne prétend pas deviner tes émotions.</p></div>
   {narrativeConsequences.length>0&&<div className="narrative-consequences"><h3>Comment tes choix ont fait évoluer les personnages</h3><p>Ces indicateurs décrivent les conséquences de la fiction, pas ton état psychologique.</p>{narrativeConsequences.map(c=><article key={c.id}><strong>{c.episode}</strong><div><span>♡ {c.relation}</span><span>⚡ {c.tension}</span><span>◈ {c.expression}</span></div></article>)}</div>}
   {tallies.length?<div className="emotion-meters">{tallies.map(([name,count])=><article key={name}><div><strong>{name}</strong><span>Ressentie dans {count} parcours</span></div><div className="emotion-meter"><i style={{width:`${100*count/Math.max(...tallies.map(x=>x[1]))}%`}}/></div><p>{emotionDescriptions[name]||'Chaque ressenti mérite qu’on lui donne une place.'}</p></article>)}</div>:<div className="empty-insight"><h3>Aucune émotion déclarée pour le moment</h3><p>Au prochain choix dans une histoire, sélectionne le ressenti qui te correspond. Tu le retrouveras ici après avoir terminé une fin.</p><button className="btn btn-primary" onClick={()=>onPlay(0)}>Vivre la première histoire →</button></div>}
  </section>}
  {mode==='journal'&&<section className="insights-section"><div className="insights-section__title"><h2>Tous tes chemins, dans l’ordre</h2><p>Les choix réels de chaque parcours terminé sont conservés, même lorsque tu rejoues la même fin. Ils restent sur cet appareil.</p></div>
   {journeys.length?<><div className="insights-actions"><button className="btn btn-outline" onClick={()=>downloadJourneys(progress)}>Exporter mon journal</button><span>{journeys.length} parcours enregistrés</span></div><div className="insights-journeys">{journeys.map((j,i)=>pathCard(j,episodes,i))}</div></>:<div className="empty-insight"><h3>Ton journal commence avec ta première fin</h3><p>Choisis, observe ce qui arrive et termine l’histoire pour enregistrer les décisions dans ton parcours.</p><button className="btn btn-primary" onClick={()=>onPlay(0)}>Commencer l’histoire →</button></div>}
  </section>}
  {mode==='learning'&&<section className="insights-section"><div className="insights-section__title"><h2>Ce que tes choix t’ont permis d’explorer</h2><p>Un débrief concret de tes parcours terminés : ce qui a changé, le point de vue de l’autre et ce que tu peux essayer autrement.</p></div>
   {journeys.length?<div className="insights-learnings">{journeys.slice(0,12).map((j,i)=>{const e=episodes.find(x=>x.id===j.episodeId);const n=e?.nodes[j.endingId];return <article key={j.id+'-'+i}><span className="eyebrow">{e?.title} · {dateOf(j.finishedAt)}</span><h3>{n?.title}</h3><div className="learning-cols"><section><strong>Ce que j’ai choisi</strong><p>{j.choices.map(c=>c.label).join(' → ')}</p></section><section><strong>Ce que l’autre a pu vivre</strong><p>{n?.perspective}</p></section><section><strong>Ce que je peux retenir</strong><p>{n?.takeaway}</p></section></div>{j.emotions.length>0&&<p className="learning-emotions">Mes émotions déclarées : {j.emotions.join(' · ')}</p>}</article>})}</div>:<div className="empty-insight"><h3>Ton premier débrief t’attend</h3><p>Les apprentissages s’appuieront sur tes décisions, pas sur un commentaire générique.</p><button className="btn btn-primary" onClick={()=>onPlay(0)}>Vivre une histoire →</button></div>}
  </section>}
  {mode==='endings'&&<section className="insights-section"><div className="insights-section__title"><h2>{total} fins découvertes sur {episodes.length*9}</h2><p>Une fin reste secrète tant que tu ne l’as pas vécue. Découvre les neuf possibilités de chaque épisode sans dévoiler les histoires verrouillées.</p></div><div className="ending-gallery">{episodes.map((e,i)=>{const available=isUnlocked(progress,episodes,i);const endings=Object.values(e.nodes).filter(n=>n.kind==='ending');const known=new Set(progress.endings[e.id]||[]);return <article key={e.id}><div className="ending-gallery__heading"><img src={e.image} alt=""/><div><span className="eyebrow">ÉPISODE {String(i+1).padStart(2,'0')}</span><h3>{e.title}</h3><p>{known.size}/9 fins révélées</p></div></div><div className="ending-grid">{endings.map((n,k)=><div className={known.has(n.id)?'found':'hidden'} key={n.id}><span>{known.has(n.id)?'✦':'◇'} Fin {k+1}</span><strong>{known.has(n.id)?n.title:'À découvrir'}</strong></div>)}</div><button className="btn btn-outline" disabled={!available} onClick={()=>onPlay(i)}>{available?'Rejouer et explorer →':'🔒 Termine les épisodes précédents'}</button></article>})}</div></section>}
  {mode==='profile'&&<section className="insights-section"><div className="profile-card"><div className="profile-avatar" aria-hidden="true">✦</div><div><span className="eyebrow">EXPLORATEUR · EXPLORATRICE</span><h2>{settings.nickname.trim()||'Mon aventure DÉCLIC'}</h2><p>Ton profil reste sur cet appareil. Aucun compte ni information personnelle n’est nécessaire.</p></div></div><div className="profile-stats"><article><strong>{progress.completed.length}/{episodes.length}</strong><span>épisodes terminés</span></article><article><strong>{total}/54</strong><span>fins découvertes</span></article><article><strong>{journeys.length}</strong><span>parcours vécus</span></article></div><label className="setting-label" htmlFor="declic-nickname">Nom affiché (facultatif)</label><input id="declic-nickname" className="settings-input" maxLength={32} value={settings.nickname} placeholder="Explorateur" onChange={e=>onChange({...settings,nickname:e.target.value})}/></section>}
  {mode==='settings'&&<section className="insights-section settings-grid"><h2>Une lecture à ton rythme</h2><label className="setting-row"><span><strong>Mode nuit</strong><small>Un fond plus sombre et une lumière atténuée</small></span><input type="checkbox" checked={!!settings.nightMode} onChange={e=>onChange({...settings,nightMode:e.target.checked})}/></label><label className="setting-row"><span><strong>Texte plus grand</strong><small>Pour lire confortablement sur téléphone</small></span><input type="checkbox" checked={settings.fontScale>1} onChange={e=>onChange({...settings,fontScale:e.target.checked?1.17:1})}/></label><label className="setting-row"><span><strong>Réduire les animations</strong><small>Évite les mouvements non nécessaires</small></span><input type="checkbox" checked={settings.reducedMotion} onChange={e=>onChange({...settings,reducedMotion:e.target.checked})}/></label><label className="setting-row"><span><strong>Contraste renforcé</strong><small>Rend les blocs et les textes plus lisibles</small></span><input type="checkbox" checked={settings.highContrast} onChange={e=>onChange({...settings,highContrast:e.target.checked})}/></label><section className="settings-audio"><h2>Ambiance et écoute</h2><p>Choisis une ambiance ou importe ton propre son. La lecture ne démarre qu’après ton action.</p><div className="setting-row"><span><strong>Son d’ambiance</strong><small>{audioOn?'Lecture activée':'Désactivé'}</small></span><button className="btn btn-outline" onClick={onSound}>{audioOn?'Couper le son':'Activer le son'}</button></div>{soundPanel}</section><details className="settings-danger"><summary>Gestion de mes données et de la saison</summary><h3>Recommencer la saison</h3><p>Efface les fins découvertes, le journal et les parties enregistrées sur cet appareil. Une confirmation sera demandée. Les paramètres de lecture sont conservés.</p><button className="btn btn-outline" onClick={onRestart}>↺ Effacer ma progression</button></details></section>}
  <button className="btn btn-quiet insight-back" onClick={onHome}>← Retour au catalogue</button>
 </main>
}
