# DÉCLIC — Narration ElevenLabs

Voix sélectionnée par le propriétaire : `sANWqF1bCMzR6eyZbCGw`.

## Principe

Les MP3 sont **générés une fois**, hors du navigateur, avec une licence permettant leur diffusion. Les visiteurs lisent des fichiers audio statiques; **aucune clé ElevenLabs et aucun appel à l'API ElevenLabs ne sont présents côté client**.

Une narration se rattache à un **épisode + nœud narratif + index de page (à partir de 0)**. Le fichier n'est utilisé que si le texte exact du manifeste correspond au texte affiché. Cela évite de lire le mauvais passage lorsque les choix ou l'adaptation narrative modifient l'histoire.

## Préparer un premier MP3

1. Dans l'éditeur ElevenLabs, utiliser la voix `sANWqF1bCMzR6eyZbCGw`.
2. Lire le texte exact de la **première page** de l'épisode choisi (sans ajouter de titre ou d'autres phrases). Le lecteur DÉCLIC découpe le texte avec `bookPages` depuis `src/features/readability.ts`; il ne faut pas générer un MP3 pour tout le nœud si plusieurs pages sont affichées.
3. Exporter en MP3 avec les droits de diffusion nécessaires. Le forfait gratuit ElevenLabs ne doit pas servir à une exploitation commerciale.
4. Ajouter le fichier dans `public/audio/<episode-id>/<node-id>-0.mp3`.
5. Renseigner `src/content/audioManifest.ts` avec la clé `<episode-id>/<node-id>/0`, le chemin public, le **texte exact**, et `voiceId: SELECTED_ELEVENLABS_VOICE_ID`.
6. Ajouter les pages suivantes de la même façon, puis vérifier sur Safari iOS et Chrome.

Exemple à adapter (texte et noms fictifs, **ne pas recopier tels quels**) :

```ts
'mon-episode/ma-scene/0': {
  src:'/audio/mon-episode/ma-scene-0.mp3',
  text:'Le texte exact affiché sur la première page.',
  voiceId:SELECTED_ELEVENLABS_VOICE_ID
}
```

## Comportement

- Lecture, pause, reprise, arrêt, vitesse.
- Arrêt lors d'un changement de page / scène, y compris lorsqu'un choix narratif est effectué.
- Une page personnalisée par IA peut avoir un texte différent : par sécurité, son MP3 préenregistré ne sera pas utilisé s'il ne correspond plus.
- Sans MP3 correspondant, le lecteur conserve temporairement la voix de l'appareil, **explicitement étiquetée comme provisoire**, jamais comme ElevenLabs.

## Avant la mise en production

- Vérifier le droit d'utiliser commercialement chaque audio produit, si DÉCLIC est commercial ou promotionnel.
- Tester le rendu de la voix, le chargement des assets et les transitions sur de vrais appareils.
- Ne jamais inscrire `ELEVENLABS_API_KEY` dans le code source, le manifeste, l'interface web ou un commit GitHub.
- Évaluer le poids des MP3 et la politique de cache PWA pour éviter de télécharger toute la bibliothèque hors ligne.
