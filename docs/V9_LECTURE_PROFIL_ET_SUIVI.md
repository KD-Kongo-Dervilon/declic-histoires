# DÉCLIC V9 — véritable lecture interactive et espace personnel

## Objectif

Passer de « quelques choix dans une situation » à un roman interactif : contexte, moments quotidiens, trois décisions, branches vécues, neuf dénouements, suivi et relecture.

## Épisode pilote approfondi

Fichier : `src/content/episode01Novel.ts`. Extension déclarative du premier épisode sans changer les identifiants des neuf fins précédentes.

Chaque partie traverse des chapitres sur Léa et Noa (carnet partagé, fatigue et obligations familiales, publication de la photo, suppositions, décision avant la rencontre, conversation et réactions, conséquences et épilogue). La première décision ouvre trois scènes distinctes, la deuxième trois réactions suivies de scènes distinctes, la troisième neuf épilogues distincts. Le compteur demeure **9 fins**, même si les parcours possibles sont plus nombreux. Les événements ne sont pas rendus par un modèle IA générique : les effets et les dialogues sont scénarisés et vérifiables. L'IA Cloudflare reste facultative et ne doit jamais être revendiquée comme active si la liaison n'est pas configurée.

La durée affichée (15–20 minutes) est une indication de lecture, non une mesure automatique.

## Progression, émotions, journal et apprentissages

- `src/engine/progress.ts` : déblocage seulement après une fin réelle, enregistrement des parcours terminés, historique des réponses, émotions auto-déclarées, export JSON.
- `src/features/Insights.tsx` : Mes émotions, Mon parcours, Débrief & apprentissages, aperçu des fins, Profil local et Paramètres.
- Une émotion est enregistrée **uniquement si le lecteur la choisit**. Ne pas prétendre inférer un état psychologique.
- Le débrief prend ses éléments de la fin réellement atteinte (conséquence, perspective et enseignement), pas une phrase unique pour tous.
- Les fins non vécues sont masquées : le lecteur ne voit que leur numéro, sans spoiler.
- Le pseudonyme et les préférences (taille, animations, contraste) restent localement dans le navigateur.
- Les 60 derniers parcours sont conservés localement ; la progression peut être réinitialisée après confirmation.

## Architecture

Les données sont découplées : contenus des scènes et des choix sous `content/`, calculs purs du moteur sous `engine/`, fonctionnalités de l'espace personnel dans `features/`, mise en page sous `styles/`. Les médias restent sous `public/assets` et sont mis en cache par la PWA. Aucun compte, tracker comportemental ni serveur distant n'est nécessaire pour l'historique personnel.

## Test de non-régression

`npm test` (Node 22+), `npm run build` (TypeScript + Vite), puis contrôle manuel/Playwright : 320px/390px/1024px/1440px, profil, choix, émotions déclarées, fins, déblocage, export JSON, modes de lecture, audio et mode hors ligne.

## Limites

L'épisode 1 est plus développé, mais ce n'est pas un roman de 169 pages. Les épisodes 2 à 6 restent plus courts et nécessitent le même travail éditorial chapitre par chapitre. Les tests automatisés n'équivalent pas à une évaluation pédagogique ou à un test sur appareil iOS réel.
