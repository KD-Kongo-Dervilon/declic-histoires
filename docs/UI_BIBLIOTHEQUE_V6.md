# DÉCLIC — interface cinématographique, catalogue et bibliothèque

## Intention

La page d'accueil reprend une organisation éditoriale : scène héro et CTA à gauche, bibliothèque de livres à droite, catalogue de la Saison 1 et panneau de progression immédiatement visibles sur tablette et ordinateur. Sur téléphone, l'affichage est conçu pour le pouce : couverture, accès à l'histoire, progression, cartes d'épisodes défilables et navigation fixe à quatre entrées.

## Bibliothèque — droits et liens

Les couvertures de `book_louis.webp`, `book_ethan.webp` et `book_maman.webp` proviennent respectivement du PDF source fourni par l'autrice, du fichier de couverture en anglais conservé dans sa bibliothèque et de la capture de la couverture du livre « Où est maman ? ». Ce sont les ouvrages réels, et non des maquettes générées pour la promotion de l'application.

- Louis — J'essaie quand même, **français** : https://amzn.eu/d/0j6QdKFd
- Ethan: I Try Anyway, **anglais** : https://amzn.eu/d/094261dL
- Où est maman ?, **français, 3–7 ans** : https://amzn.eu/d/05GInpVx

Ces destinations ont été fournies par l'autrice. Ne jamais remplacer une couverture par un concept inventé ou ajouter une destination Amazon devinée. Pour Brindétoile, ne pas afficher de bouton d'achat sans URL fournie.

## Fin de l'histoire / conversion douce

Le débrief de chaque épisode affiche « Cette histoire t'a touché ? » et une ou deux suggestions de lecture cohérentes avec le thème. Le joueur est informé de l'édition/langue et de l'âge de lecture. La recommandation ne doit pas interrompre une décision ni gêner l'accès à l'épisode suivant.

## Mécanismes préservés

- Six épisodes de la saison 1.
- Un épisode devient jouable après la première fin de l'épisode précédent.
- Neuf fins distinctes par épisode, soit 54 fins dans la collection.
- Sauvegarde de la progression et du journal localement, dans le navigateur.
- PWA installable via HTTPS ; fonctionnement offline après que les ressources aient été mises en cache.
- Sons désactivés par défaut, activables par une interaction explicite.
- IA Cloudflare facultative et **non activée** sans configuration du Worker et des accès nécessaires : ne pas la présenter comme disponible tant que le service n'est pas connecté.

## Architecture de l'interface

Le front reste en React + TypeScript / Vite. `src/content` porte les données d'épisodes ; `src/engine` contient le moteur et la progression ; `src/services/ai.ts` isole le mode adaptatif ; `src/App.tsx` regroupe les vues de navigation ; `src/styles/main.css` contient les styles responsive. Les couvertures livres et les illustrations d'épisodes sont des ressources statiques distinctes dans `public/assets/`.

## Vérifications minimales avant livraison

1. Compiler avec `npm run build`.
2. Parcourir un épisode jusqu'à une fin ; vérifier le déblocage de l'épisode suivant.
3. Vérifier les couvertures et les trois URL Amazon sur la page d'accueil et la bibliothèque.
4. Vérifier l'absence de débordement horizontal à 320, 390, 768, 1024 et 1440 px.
5. Vérifier la navigation mobile, le son et le fonctionnement en mode hors ligne.
6. Ne promouvoir en production qu'après que la prévisualisation soit passée et que son URL réponde.
