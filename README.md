# DÉCLIC V5 — Histoires à vivre

PWA narrative interactive accessible sur téléphone, tablette et ordinateur.

- 6 épisodes (chacun 3 scènes d'introduction, 2 décisions et **9 fins**) ; 54 fins à explorer.
- Les épisodes se débloquent **un par un après avoir terminé une fin** de l'épisode précédent.
- Compteur de fins inédites par épisode + compteur général ; stockage local.
- Visuels distincts pour le catalogue (recadrages conceptuels à remplacer avant une commercialisation), lecture mobile compacte.
- Audio d'ambiance facultatif, sans lecture automatique.
- Réponses écrites libres avec adaptation locale et Worker Cloudflare IA facultatif.
- Romans/univers externes présentés sans faux lien Amazon.

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

## Tableau de bord premium et bibliothèque (édition novembre 2026)

L'accueil associe une scène cinématographique, un catalogue de six histoires et une bibliothèque de trois ouvrages avec leurs vraies couvertures et les liens Amazon communiqués par l'autrice. La mise en page est adaptée aux ordinateurs, tablettes et mobiles. Les recommandations d'ouvrages apparaissent après le débrief, sans interrompre l'expérience de jeu.

Consultez [`docs/UI_BIBLIOTHEQUE_V6.md`](docs/UI_BIBLIOTHEQUE_V6.md) pour les règles de contenu, les liens, les mécanismes de progression et le protocole de vérification.
