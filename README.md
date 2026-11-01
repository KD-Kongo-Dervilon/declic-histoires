# DÉCLIC V11 — Histoires à vivre

PWA narrative interactive accessible sur téléphone, tablette et ordinateur.

- 6 épisodes et **9 fins par épisode** ; l’épisode 1 comprend désormais **6 décisions narratives**, des conséquences différées et un lecteur en micro-pages.
- Les épisodes se débloquent **un par un après avoir terminé une fin** de l'épisode précédent.
- Compteur de fins inédites par épisode + compteur général ; stockage local.
- Visuels propres à chaque épisode, sans recadrage des personnages en mode mobile ; lecture responsive.
- Audio d'ambiance facultatif, sans lecture automatique.
- Réponses écrites libres avec adaptation locale et Worker Cloudflare IA facultatif.
- Bibliothèque avec les éditions Louis (français) et Ethan (anglais), Où est maman ?, liens Amazon fournis par l’autrice et une aventure interactive originale autour de Louis.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir l'URL localhost affichée. Ne pas ouvrir directement `index.html` via `file://`.

## Qualité

```bash
npm run build
npm run test
```

## Structure & confidentialité

Voir [documentation V5](docs/V5_PRODUIT.md), [architecture](docs/ARCHITECTURE.md), [déploiement](docs/DEPLOIEMENT.md).
L'IA Cloudflare n'est **pas active** tant que le Worker n'est pas connecté. Les choix et fins sont enregistrés seulement dans le navigateur. L'IA, si activée, traite les réponses libres uniquement après action explicite.

## Statut éditorial

Prototype fonctionnel, **pas encore un produit commercial validé** : cinq couvertures intermédiaires (à illustrer en pleine résolution) et validation pédagogique terrain nécessaire. Aucun achat Amazon ne peut être garanti sans lien officiel vérifié.

## V7 — Expérience enrichie et son personnel

Refonte responsive de la page d’accueil, catalogue émotionnel à six épisodes, couvertures narratives (quelques visuels encore à perfectionner), trois liens Amazon fournis par l’autrice, couvertures réelles Louis et Où est maman ?, mini-scènes de découverte et recommandations après les fins. Voir [`docs/V6_REDESIGN.md`](docs/V6_REDESIGN.md).

## V9 — lecture interactive et espace lecteur

Le premier épisode a été étendu en chapitres et trois décisions à conséquences visibles, tout en conservant neuf fins distinctes. L'application permet de consulter les émotions déclarées, l'historique de chaque chemin terminé, le débrief contextualisé, les fins révélées et un profil local avec réglages de lecture. Documentation : [`docs/V9_LECTURE_PROFIL_ET_SUIVI.md`](docs/V9_LECTURE_PROFIL_ET_SUIVI.md).


## V11 — Lecteur cinématographique et IA narrative optionnelle

Le lecteur commence sur un **premier choix immédiat**. Les passages sont distribués en micro-pages avec animation de page tournée et **six nouvelles images de scène** : photo, maison, souvenir, attente, approche, conversation. Les images sont intégralement visibles sur mobile. Le choix du carnet bleu modifie une scène plus tardive au banc. Les fins découvertes sont conservées.

**IA réelle si Cloudflare est connecté :** route `POST /narrate` dans `workers/ai/src/index.ts`, exécutée avec le binding Cloudflare Workers AI. Le texte de chaque scène tient compte de la mémoire des choix et de l’état narratif. Le moteur garde le contrôle des choix possibles et des fins pour assurer la continuité. **Le Worker n’est pas encore connecté au site officiel**, donc le scénario écrit est utilisé en attendant. Aucun secret ne se trouve dans le client.

Voir [la documentation V11](docs/V11_EXPERIENCE_ET_MOTEUR_IA.md) pour UX, contenu, contrat IA, confidentialité, tests et activation Cloudflare. Les tests sont exécutables avec `npm test` et la compilation avec `npm run build`.
