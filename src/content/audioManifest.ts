/**
 * Only published, licensed recordings belong in this manifest.
 * Generated texts can vary by path; a recording is used only if its
 * source text exactly matches the page being read.
 */
export type NarrationAsset={src:string;text:string;voiceId:string};
export const SELECTED_ELEVENLABS_VOICE_ID='sANWqF1bCMzR6eyZbCGw';

/** Key format: episodeId/nodeId/pageIndex (zero-based). */
export const narrationAssets:Record<string,NarrationAsset>={
 // Example after generating a licensed MP3:
 // 'ce-qu-on-na-pas-dit/ouverture/0': {
 //   src:'/audio/ce-qu-on-na-pas-dit/ouverture-0.mp3',
 //   text:'The exact text shown on this page',
 //   voiceId:SELECTED_ELEVENLABS_VOICE_ID
 // }
};

export function findNarration(episodeId:string,nodeId:string,pageIndex:number,pageText:string):NarrationAsset|null{
 const asset=narrationAssets[`${episodeId}/${nodeId}/${pageIndex}`];
 return asset&&asset.voiceId===SELECTED_ELEVENLABS_VOICE_ID&&asset.text===pageText?asset:null;
}
