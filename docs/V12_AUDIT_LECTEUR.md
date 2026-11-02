# DÉCLIC — audit utilisateur et révisions du lecteur

## Résultats de l'audit réel (trois parcours, iPhone simulé)

- 20–21 pages par parcours, cinq décisions, neuf fins disponibles.
- Les mêmes six illustrations étaient réaffichées arbitrairement d'une page à l'autre. Leur séquencement a été corrigé : un visuel correspond à un événement (atelier, maison, photo, banc, conversation, rupture), sans alternance aléatoire.
- Les conséquences des choix antérieurs n'étaient pas rappelées au dénouement. Un rappel dépendant des décisions du lundi est désormais affiché en fin d'histoire. Ce rappel est déterministe et ne représente pas une génération d'IA.
- La découverte du livre Louis proposait des dénouements inventés et une lecture trop longue. Elle est remplacée par une bande-annonce narrative courte, fidèle aux scènes et personnages du début du roman fourni par l'autrice, avec lien Amazon seulement en fin de découverte.

## Blocage important : IA Cloudflare

La branche possède un Worker Cloudflare avec routage `/narrate` et `/adapt`, mais le projet Vercel ne dispose d'aucune variable `VITE_DEClic_AI_URL`. Aucune connexion Cloudflare gérable depuis les intégrations actuelles n'a été identifiée. La génération en direct reste donc inactive. Ne jamais présenter le mode déterministe comme une IA cloud activée.

## Dette produit à résoudre avant commercialisation

- Ajouter de vrais visuels propres à chaque moment de chaque épisode (pas six recadrages d'une planche).
- Mettre en scène des enjeux plus importants et des chemins réellement différents, pas seulement des répliques ou des fins.
- Tester l'expérience avec de vrais lecteurs sans leur fournir le contexte.
- Activer le Worker avec un compte Cloudflare possédant les droits et configurer l'URL, les limites de coûts et la confidentialité.
