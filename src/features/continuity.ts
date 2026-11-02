import type {HistoryEntry} from '../types';
/** Consequence recalled from earlier decisions, not invented psychological profiling. */
export function memoryEcho(episodeId:string,history:HistoryEntry[]):string|null{
 if(episodeId!=='ce-qu-on-na-pas-dit')return null;
 const ids=new Set(history.map(h=>h.id));
 const first=ids.has('atelier-promettre')?'Lundi, Léa avait promis de venir. Elle comprend maintenant pourquoi Noa pensait leur rendez-vous assuré.':
  ids.has('atelier-prevenir')?'Lundi, Léa avait prévenu qu’elle était épuisée. Noa avait entendu sa fatigue, mais pas forcément ce qu’elle voulait préserver.':
  ids.has('atelier-esquiver')?'Lundi, Léa avait répondu « On verra ». Ce flou a compté : ils ont chacun imaginé une suite différente.':null;
 const second=ids.has('soir-clair')?'Le lundi soir, elle avait pourtant expliqué les devoirs de son frère. Elle se souvient que Noa lui avait proposé de garder les feuilles.':
  ids.has('soir-vague')?'Le lundi soir, son message « J’ai besoin de souffler » n’avait pas dit ce qui comptait le plus pour elle.':
  ids.has('soir-muet')?'Le lundi soir, elle avait gardé le silence. L’inquiétude de Noa s’était ajoutée à la sienne.':null;
 return [first,second].filter(Boolean).join(' ')||null;
}
