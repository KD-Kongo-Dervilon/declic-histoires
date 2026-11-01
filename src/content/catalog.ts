import type {Emotion} from '../types';
export interface CatalogItem {id:string; episode:number; title:string; tagline:string; emotions:Emotion[]; duration:string; status:'disponible'|'bientot'; art:string;}
export const catalog:CatalogItem[] = [
 {id:'ce-qu-on-na-pas-dit',episode:1,title:'Ce qu’on n’a pas dit',tagline:'Quand l’amitié fait mal, comment trouver les mots ?',emotions:['Blessure','Confiance'],duration:'10–15 min',status:'disponible',art:'/assets/scene.webp'},
 {id:'le-message-de-trop',episode:2,title:'Le message de trop',tagline:'Une phrase envoyée trop vite peut tout changer.',emotions:['Colère','Honte'],duration:'À venir',status:'bientot',art:''},
 {id:'invisible',episode:3,title:'Invisible dans le groupe',tagline:'Être entouré et se sentir seul.',emotions:['Solitude','Tristesse'],duration:'À venir',status:'bientot',art:''},
 {id:'juste-pour-rire',episode:4,title:'C’était pour rire',tagline:'Et si une blague faisait plus mal qu’on ne le pense ?',emotions:['Honte','Colère'],duration:'À venir',status:'bientot',art:''},
 {id:'dire-non',episode:5,title:'Le courage de dire non',tagline:'Quand la pression des autres devient trop forte.',emotions:['Pression','Confiance'],duration:'À venir',status:'bientot',art:''},
 {id:'un-pas-vers-toi',episode:6,title:'Un pas vers toi',tagline:'Peut-on réparer après s’être éloignés ?',emotions:['Tristesse','Confiance'],duration:'À venir',status:'bientot',art:''}
];
export const filters = ['Toutes','Blessure','Colère','Tristesse','Solitude','Honte','Pression','Confiance'] as const;
