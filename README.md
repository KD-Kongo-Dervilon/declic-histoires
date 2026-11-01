# DÉCLIC — Histoires à vivre

> **Une histoire que tu ne regardes pas seulement : tu la vis.**

DÉCLIC est une PWA narrative francophone : incarnation de Léa, conversation difficile avec Noa, émotions, décisions divergentes, conséquences et changement de point de vue. Le projet est au stade **pilote**, sans prétention clinique et sans fonctionnalités payantes.

**Production actuelle (version précédente, le temps de valider cette V4) :** https://declic-histoires.vercel.app/

## Contenu de cette version

- Épisode « Ce qu'on n'a pas dit » : 3 scènes de contexte, 2 décisions, 9 fins originales.
- Catalogue filtrable par émotions, avec 1 épisode jouable et 5 futurs épisodes clairement identifiés.
- Narration cinématographique, illustration 16:9 sans typographie incrustée, son d'ambiance original facultatif.
- Débriefing, choix émotionnel explicite, prise de perspective, réflexion stockée localement.
- Réponse libre et IA Cloudflare facultative avec repli local sans abonnement.
- PWA hors ligne après chargement HTTPS : manifeste, icônes, service worker.
- Architecture React + TypeScript strict + Vite ; Worker Cloudflare isolé.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:5173 ; pour tester le build :

```bash
npm test
npm run build
npm run preview
```

## Architecture et documentation

- [Vision produit et parcours utilisateur](docs/VISION_PRODUIT.md)
- [Architecture, contrat IA, sécurité, gestion des épisodes](docs/ARCHITECTURE.md)
- [Déploiement Vercel et Cloudflare / Installation mobile](docs/DEPLOIEMENT.md)
- [Checklist de validation](docs/QUALITE.md)

## Limites honnêtes

Il n'y a **pas encore de Worker IA actif** : il nécessite la connexion à un compte Cloudflare, ses ressources et ses quotas. Quand il n'est pas configuré, les décisions et neuf fins fonctionnent totalement hors ligne. Les bruitages sont des ambiances originales de synthèse, pas des voix doublées ni des animations labiales. Le catalogue contient cinq concepts non encore produits.

Ne pas considérer ce pilote comme validé par des professionnels ou prêt à être vendu sans test utilisateur.
