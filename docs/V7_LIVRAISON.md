# DÉCLIC V7 — Publication technique et choix éditoriaux

## Expérience

- Six histoires originales à embranchements : une fin terminée déverrouille l'épisode suivant.
- Neuf fins possibles par épisode (54 au total) ; chaque fin est comptée une seule fois dans le navigateur.
- Scènes d'introduction enrichies par de nouveaux souvenirs et motifs propres à chaque personnage. Deux choix principaux influencent les scènes de réaction et les conclusions. Les durées sont indicatives ; l'expérience reste un prototype à approfondir pour une lecture longue.
- Bonus interactif **Avant vendredi — le choix de Louis**, adapté librement avec les personnages et les thèmes des premiers chapitres du manuscrit remis par l'autrice. Les embranchements et fins alternatifs ne sont PAS le déroulement canonique du roman et sont explicitement présentés comme tels. Le livre est à acheter séparément.

## Lecture sur téléphone

- Sur les écrans étroits, photographie héro indépendante de la zone de texte : les personnages sont visibles sans découpe latérale.
- Les cartes du catalogue utilisent une image 16:9 entière, au-dessus du titre et des contrôles.
- L'image d'un épisode est présentée entière avec `object-fit: contain`.
- La barre de navigation inférieure est masquée en lecture et en débrief pour ne pas intercepter les boutons.

## Son

- Quatre ambiances compressées issues des fichiers fournis par l'autrice : forêt/oiseaux, ruisseau, vent, nuit.
- Sélection volontaire au toucher, possibilité de suspendre le son et de régler le volume.
- Import personnel via `input[type=file]` : création d'une URL `blob:` **locale**. Le contenu n'est pas envoyé au serveur, n'est pas sauvegardé après le rechargement, et l'utilisateur doit le sélectionner de nouveau.
- Certains navigateurs iOS peuvent exiger une action de l'utilisateur pour déclencher la lecture ; l'application déclenche `play()` depuis le clic quand c'est possible.

## Bibliothèque

- Louis (FR) : https://amzn.eu/d/0j6QdKFd
- Ethan (EN) : https://amzn.eu/d/094261dL
- Où est maman ? : https://amzn.eu/d/05GInpVx
- Brindétoile n'est pas présenté dans la bibliothèque de cette version.
- Liens fournis par l'autrice. Les passages interactifs sont des adaptations originales de présentation, non un remplacement des livres.

## Architecture

- React + TypeScript + Vite PWA ; données narratives séparées dans `src/content`.
- `src/content/enrich.ts` injecte des scènes supplémentaires tout en conservant le graphe des 54 conclusions et l'identité de chaque épisode.
- Moteur déterministe et sauvegarde locale, tests Node, édition séparée du code IA.
- Le Worker Cloudflare est préparé mais l'IA distante ne fonctionne pas tant qu'elle n'est pas connectée et configurée. L'application offre un traitement local à défaut.

## Critères de QA

1. `npm run build` doit réussir ; `npm test` doit réussir.
2. Sur 320, 390, 1024 et 1440 px : aucune image cassée, aucun débordement horizontal, personnages visibles en entier.
3. Un premier scénario se termine et déverrouille le second ; la sauvegarde survit au rechargement.
4. Les quatre pistes audio répondent ; import et réglage de volume testés sur navigateur mobile simulé. Vérification sur iPhone physique reste distincte.
