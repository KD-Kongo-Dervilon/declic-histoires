# DÉCLIC V6 — Refonte éditoriale et boutique

## Intention

- Une seule identité visuelle : marine, ivoire et doré, image narrative non incrustée d’UI.
- Catalogue de six histoires jouables et progression par fin (9 par épisode).
- Sur grand écran : histoire principale + bibliothèque latérale. Sur mobile : lecture compacte, cartes en lignes et navigation fixe accessible.
- Six scènes illustrées distinctement cadrées ; les épisodes 2 et 4 reprennent pour le moment deux cadrages d’une même scène dramatique, une illustration propre à l’épisode 2 demeure recommandée.
- Bibliothèque Louis, Ethan (anglais), Où est maman ?, Brindétoile.

## Provenance et liens

La couverture de Louis vient du PDF original fourni par l’autrice, et celle de *Où est maman ?* de sa capture Amazon. Les liens Amazon sont ceux communiqués par l’autrice (non issus d’un service d’affiliation). La couverture anglaise Ethan n’ayant pas été fournie, le visuel est explicitement présenté comme concept. Brindétoile n’a pas de lien commercial.

## Parcours de découverte et achat

Après un débriefing, une recommandation contextuelle renvoie à une fiche livre. Une scène **originale d’introduction inspirée du thème du livre**, présentée explicitement comme telle, invite à un choix fictif. Le bouton Amazon conduit au lien communiqué pour le livre ; aucune promesse d’achat immédiat, de disponibilité ou d’édition n’est inférée.

## Technique / QA

Vite + React + TypeScript, PWA. Les liens doivent être testés manuellement sur appareils physiques ; les essais Chromium CI ne garantissent pas Safari. Cloudflare Workers AI reste optionnel, non actif tant qu’il n’est pas configuré.
