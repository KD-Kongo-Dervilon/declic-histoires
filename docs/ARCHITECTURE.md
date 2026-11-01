# Architecture technique

## Vue d'ensemble

DÉCLIC est une **PWA statique**, sans serveur métier, sans collecte de données et sans dépendance npm d'exécution.

- `index.html` est l'entrée du navigateur.
- `src/content/episode01.js` contient le **graphe narratif**. Chaque nœud est de type `choice`, `dialogue` ou `ending`.
- `src/core/engine.js` est le moteur déterministe ; il valide les destinations des branches et gère l'état.
- `src/core/storage.js` persiste localement les choix et réponses via `localStorage` (pas de synchronisation).
- `src/core/audio.js` produit une ambiance facultative et très discrète via Web Audio.
- `src/ui/app.js` monte l'interface et transmet les actions au moteur.
- `src/styles/main.css` contient les styles responsive et impression.
- `sw.js` précache l'application. `manifest.webmanifest` fournit les métadonnées d'installation.
- `assets/` conserve les images et icônes (aucun chargement externe).

## Cycle utilisateur

1. La page charge les scripts dans l'ordre, puis `mountApp` instancie le moteur.
2. L'état local est restauré si cohérent ; autrement l'écran d'accueil est affiché.
3. `start()` affiche la première situation ; `choose(id)` suit une branche ; `next()` passe au dialogue suivant.
4. Une fin débloque le bilan ; la réflexion reste enregistrée sur l'appareil.
5. Le service worker met en cache les ressources pour les visites ultérieures hors ligne.

## Ajouter un épisode

Pour l'instant, le jeu est volontairement **mono-épisode**. Ajouter un deuxième épisode implique de fournir un nouvel objet avec la même structure que `EPISODE`, d'ajouter un sélecteur d'épisodes et de séparer les clés de stockage par ID. Ne pas affirmer qu'il suffit de glisser-déposer un fichier : l'interface de sélection n'est pas encore implémentée.

## Contrôle qualité

- `node tests/test_engine.cjs` : neuf branches, accès à la réflexion, rejet d'état invalide.
- `python3 tests/test_files.py` : manifeste, icônes, fichiers du cache et configuration Vercel.
- Vérifier les interactions avec Safari iOS après mise en ligne ; Chromium ne remplace pas ce test.

## Confidentialité & limites

L'application ne contient aucun outil analytique, compte ni API. Le stockage local peut être effacé par le navigateur. Pas de diagnostic, score clinique ni promesse d'efficacité pédagogique validée. Le service worker peut présenter une ancienne version jusqu'à activation du nouveau cache ; incrémenter `VERSION` lors de chaque publication.
