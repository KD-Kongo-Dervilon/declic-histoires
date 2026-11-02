import {useEffect,useState} from 'react';

/**
 * A short reader's preview of the author's published novel, not a counterfeit
 * interactive replacement with invented endings. Facts follow the opening
 * chapters of Les Graines — Louis, supplied by the author.
 */
const excerpts=[
 {label:'01 · LE COLLÈGE',title:'Trois minutes.',body:[
  'Monsieur Delmas annonce un concours de courts-métrages. Trois minutes pour raconter une histoire.',
  'Louis regarde l’affiche. Dans sa tête, une ville se vide, un téléphone sonne, quelqu’un cherche une réponse.',
  'Il note deux mots sur sa feuille. Inès les aperçoit. Elle connaît déjà son talent pour le montage.'
 ],line:'INÈS — « Toi, tu vas le faire. »',cta:'Que va répondre Louis ?'},
 {label:'02 · LA PETITE PHRASE',title:'« C’est pas mon truc. »',body:[
  'Louis répond qu’il ne participera pas. Les concours, ce n’est pas pour lui.',
  'Pourtant, il a déjà imaginé le film, le plan final et même son nom sur l’écran du cinéma municipal.',
  'Inès n’insiste pas tout de suite. Elle pose une question toute simple.'
 ],line:'INÈS — « T’as déjà fait un concours de films ? »',cta:'Découvrir sa réponse'},
 {label:'03 · DEUX FAÇONS D’AVANCER',title:'Et si l’idée était mauvaise ?',body:[
  'Monsieur Delmas passe les fiches d’inscription. Louis regarde la pile, mais ne tend pas la main.',
  'Inès, elle, remplit sa fiche. Elle ne sait même pas encore quel film elle tournera.',
  'Louis lui demande si elle n’a pas peur que son idée soit nulle.'
 ],line:'INÈS — « Si. Mais je vais pas mourir. »',cta:'Et le soir, que fait Louis ?'},
 {label:'04 · 21 H 47',title:'Nouveau dossier.',body:[
  'Le soir, Louis est devant son ordinateur. Il crée un dossier, change son nom, l’efface, puis recommence.',
  'Finalement, il ouvre un document. Une phrase apparaît : « Un garçon se réveille et tout le monde a disparu. »',
  'Une deuxième ligne suit. Puis une troisième. Louis avait dit qu’il ne ferait pas le concours. Mais son histoire, elle, a déjà commencé.'
 ],line:'Reste à savoir s’il osera la montrer.',cta:'Découvrir la suite dans le roman'}
];
export function LouisImmersion(){
 const [step,setStep]=useState(0),[guess,setGuess]=useState<number|null>(null);
 useEffect(()=>{setStep(0);setGuess(null)},[]);
 const p=excerpts[step];
 function next(){setStep(i=>Math.min(i+1,excerpts.length-1));setGuess(null)}
 return <section className="louis-immersion v12-louis" id="louis-immersion" aria-label="Découvrir les premières pages du roman Louis">
  <span className="eyebrow">DÉCOUVRIR LES GRAINES · EXTRAIT NARRATIF</span>
  <h3>Avant d'oser, Louis avait déjà une histoire.</h3>
  <p className="v12-louis__intro">Une découverte fidèle au début du roman, sans fausses fins ni spoilers. Suis Louis pendant quelques minutes, puis retrouve sa véritable aventure dans le livre.</p>
  <div className="v12-louis__reading" aria-live="polite">
   <div className="v12-louis__head"><span>{p.label}</span><span>{step+1} / {excerpts.length}</span></div>
   <h4>{p.title}</h4>
   {p.body.map((line,i)=><p key={i}>{line}</p>)}
   <blockquote>{p.line}</blockquote>
   {step===1&&<div className="v12-louis__moment"><strong>Et toi, à sa place, qu’est-ce qui te retiendrait ?</strong>
    <div className="v12-louis__options">
     {['La peur de rater','Le regard des autres','Ne pas me sentir prêt'].map((text,i)=><button key={text} className={guess===i?'active':''} onClick={()=>setGuess(i)}>{text}</button>)}
    </div>
    {guess!==null&&<p className="v12-louis__reflection">Louis aussi trouve des raisons de ne pas participer. Son histoire invite à découvrir d’où viennent ces petites phrases qui nous retiennent.</p>}
   </div>}
   <div className="v12-louis__actions">
    {step>0&&<button className="btn btn-outline" onClick={()=>{setStep(i=>i-1);setGuess(null)}}>← Précédent</button>}
    {step<excerpts.length-1?<button className="btn btn-primary" onClick={next}>{p.cta} →</button>:<a className="btn btn-primary" href="https://amzn.eu/d/0j6QdKFd" target="_blank" rel="noopener noreferrer">Lire la suite de Louis sur Amazon ↗</a>}
   </div>
   <p className="v12-louis__disclaimer">Cette présentation reprend les événements de l'ouverture du roman ; elle n'en reproduit pas l'intégralité.</p>
  </div>
 </section>;
}
