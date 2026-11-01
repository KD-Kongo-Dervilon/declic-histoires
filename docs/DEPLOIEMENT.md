# Déploiement et installation

## Publication actuelle

- **Production** : https://declic-histoires.vercel.app/
- **Projet** : `declic-histoires` (équipe Vercel `kdkongodervilons-projects`).
- **Statut** : déploiement de production initial en ligne et ressources HTTP vérifiées.
- **GitHub** : https://github.com/KD-Kongo-Dervilon/declic-histoires (branche `main`).
- **Attention** : Vercel a été initialement déployé à partir de fichiers importés directement. Le dépôt GitHub existe, mais la liaison automatique Git→Vercel n'est pas configurée. Les `git push` ne mettront pas encore le site en ligne automatiquement.

## Publication Vercel

Publier **tout le dossier à la racine du projet** (incluant les sous-dossiers `assets` et `src`). Configuration Vercel : **Other / aucun framework**, **pas de build command**, répertoire de sortie = racine. Le fichier `vercel.json` fournit les en-têtes de cache et le type du manifeste.

Avec Git lié à Vercel, chaque push sur la branche principale déclenche un déploiement. Pour une publication manuelle, transférer le contenu intégral du dossier via la CLI ou les API de déploiement Vercel.

## Contrôles après publication HTTPS

1. Ouvrir l'URL sur mobile et vérifier l'illustration, les scripts et les boutons.
2. Parcourir trois premiers choix distincts et leurs dénouements.
3. Vérifier `/manifest.webmanifest` (200) et `/sw.js` (200).
4. Charger l'application une première fois en ligne ; couper le réseau et la rouvrir (le premier chargement doit être complet pour tester le cache).
5. Sur Safari iPhone : **Partager → Ajouter à l'écran d'accueil**, puis lancer depuis l'icône.
6. Tester le bilan et l'impression ; vérifier que les réponses ne partent à aucun serveur.

## Mise à jour

Incrémenter la version du cache dans `sw.js`, valider le code, publier et recharger l'application. Éviter des noms de fichiers cassés lors du changement d'illustrations. Avant de publier une modification majeure, tester les neuf chemins.

## À propos de l'installation

Une PWA requiert un **site HTTPS** (ou localhost pour les tests). Un simple fichier HTML téléchargé ou un ZIP sur iPhone ne constitue pas une application installable.
