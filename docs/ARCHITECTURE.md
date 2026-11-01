# Architecture technique — DÉCLIC V4

## Choix du socle

**Frontend : React 19 + TypeScript strict + Vite 8 + vite-plugin-pwa**. Aucun backend ni compte n'est nécessaire pour terminer un épisode. **Backend IA (facultatif) : Cloudflare Worker** avec liaison native Workers AI. Vercel sert l'application statique ; Cloudflare ne reçoit des requêtes que lorsqu'un joueur soumet des mots libres et accepte de le faire.

## Arborescence

```text
src/
  App.tsx                  Interface et écrans (catalogue, lecture, bilan, concept)
  content/catalog.ts       Métadonnées et filtres du catalogue
  content/episode01.ts     Graphe narratif éditorial : scènes, répliques, branches, fins
  engine/story.ts          Moteur pur : transitions, contraintes, validation
  engine/storage.ts        Sauvegarde locale versionnée
  services/ai.ts           Connecteur IA et repli déterministe hors connexion
  styles/main.css          Design tokens, layout, adaptatif et réduction du mouvement
public/assets/            Images et sons utilisés par la PWA, indépendants du code
workers/ai/
  wrangler.toml            Binding Workers AI, restriction d'origine
  src/index.ts             Contrat HTTP /health + POST /adapt
  package.json
  tsconfig.json
docs/                    Vision, architecture, sécurité, déploiement
 tests/                   Contrôle du graphe et du Worker
```

## Flux narratif

`episode.start → scene → scene → scene → decision(3 choix) → réaction(3) → seconde décision(3 par branche) → 9 fins → bilan`.

Les données éditoriales ne sont pas mélangées aux composants. Un nouvel épisode doit passer `validateEpisode` et disposer d'une illustration, des répliques, d'une perspective de l'autre et d'un bilan. Les conséquences pédagogiques sont **scénarisées** par l'éditeur : l'IA ne crée pas librement un nouveau noeud, ne change pas les règles et ne décide pas de la valeur du joueur.

## API IA (opt-in et non requise)

`POST {VITE_DEClic_AI_URL}/adapt`

```json
{"episodeId":"ce-qu-on-na-pas-dit","sceneId":"premier-choix","text":"Pourquoi tu ne m'en as pas parlé ?"}
```

Réponse (limitée à des valeurs contrôlées) :

```json
{"intent":"ask","reply":"Je pensais que tu ne voulais plus venir…","perceivedEmotion":"Une hypothèse, pas une certitude.","mode":"ai"}
```

L'intention renvoie à une des **trois branches prédéfinies**. Si Cloudflare est indisponible, le client utilise une classification locale et une réplique écrite. Aucun jeton Cloudflare dans le navigateur. Les réponses des joueurs sont limités à 220 caractères ; le Worker rejette les e-mails et suites de chiffres et ne journalise pas le corps des requêtes.

## Données et sécurité

- Pas de compte, d'identifiant nominatif ou de suivi analytique dans le pilote.
- Sauvegarde de la progression et de la réflexion sur `localStorage` ; effaçable par redémarrage.
- Seule la réplique volontairement soumise à l'IA est envoyée à Cloudflare.
- Validation de longueur, d'origine CORS et de scène au Worker ; pas de secret côté Vite.
- En production, activer une **limitation de débit Cloudflare** et surveiller le quota Workers AI pour empêcher l'abus : la restriction CORS seule n'est pas une protection anti-bot.
- La sortie IA est traitée comme une proposition et reste dans une réplique : pas de HTML arbitraire, pas d'exécution de code, pas de diagnostic émotionnel.

## Installation et versionnement

`vite-plugin-pwa` génère le manifeste et le service worker avec ressources précachées. Sur Safari iOS, la PWA nécessite la publication sur HTTPS puis « Partager → Sur l'écran d'accueil ». Une première visite connectée doit précéder l'usage hors ligne. Chaque version met à jour les assets du build ; ne pas cacher de secrets dans le répertoire `public`.

## Tests et QA

`npm test` teste chaque branche du graphe ; `npm run build` réalise le contrôle TypeScript et le build. Pour le navigateur, tester catalogue, filtre, début de partie, choix, neuf fins, retour, mode son, petits et grands écrans, sans JS, et mode hors connexion après installation ; enregistrer les captures et les résultats dans le suivi de version.
