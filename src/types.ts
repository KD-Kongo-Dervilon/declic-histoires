export type Emotion = 'Blessure'|'Colère'|'Tristesse'|'Solitude'|'Honte'|'Pression'|'Confiance';
export type Impact = { relation:number; tension:number; expression:number };
export type NarrativeCondition = {
  flags?: string[];
  withoutFlags?: string[];
  relationship?: {character: string; atLeast?: number; atMost?: number};
};
export type NarrativeEffects = {relationships?: Record<string, number>; flags?: string[]};
export type NarrativeRoute = {when: NarrativeCondition; next: string};
export type NarrativeVariation = {
  when: NarrativeCondition;
  text?: string;
  dialogue?: string;
  afterword?: string;
};
export interface Choice {id:string; title:string; words:string; next:string; impact:Impact; effects?:NarrativeEffects; intention:'express'|'avoid'|'ask'|'attack'|'repair'|'pause';}
export type NarrativeNode = {
  id:string; kind:'scene'|'decision'|'reaction'|'ending'; phase:string; eyebrow:string; title:string;
  speaker?:string; dialogue?:string; text:string; note?:string; next?:string; choices?:Choice[];
  observation?:string; perspective?:string; takeaway?:string;
  /** Earlier decisions can affect later chapters, even after other scenes. */
  nextByChoice?:Record<string,string>;
  nextWhen?: NarrativeRoute[];
  variations?: NarrativeVariation[];
  afterword?: string;
  image?: string;
  imageAlt?: string;
};
export interface Episode {id:string; title:string; subtitle:string; emotions:Emotion[]; age:string; duration:string; image:string; characters?: Record<string,string>; start:string; nodes:Record<string,NarrativeNode>}
export type HistoryEntry = {id:string; label:string; words:string; sceneId:string; emotion?:string;};
export type StoryState = {nodeId:string; visited:string[]; history:HistoryEntry[]; impact:Impact; reflection:string; customResponse?:string};
