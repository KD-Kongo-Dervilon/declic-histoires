# Déploiement DÉCLIC V5

## Architecture et build

- Frontend : React 19, TypeScript, Vite 8, PWA Workbox.
- Hébergement du frontend : Vercel (build `npm run build`, sortie `dist`, framework Vite).
- Dépôt GitHub : `KD-Kongo-Dervilon/declic-histoires`.
- Les épisodes, médias et fichiers PWA sont regroupés dans la même origine HTTPS pour le cache hors ligne.

## Commandes de validation

```bash
npm ci
npm test
npm run build
```

Les tests des histoires vérifient 6 graphes indépendants, 9 fins atteignables par épisode, 54 fins en tout, et le déblocage strict d'un seul nouvel épisode après une première fin.

## PWA sur iPhone

Ouvrir le site publié en HTTPS dans Safari > Partager > Ajouter à l'écran d'accueil. Le service worker doit être actif et avoir rempli le cache au cours d'une première visite connectée. Tester réellement hors ligne sur iPhone avant de communiquer la fonctionnalité comme certifiée iOS.

## IA Cloudflare, facultative et non active par défaut

Dans `workers/ai`, déployer le Worker sur un compte Cloudflare autorisé, créer le binding `AI`, configurer `ALLOWED_ORIGIN` avec l'URL frontend exacte et définir `AI_MODEL`. Ajouter dans Vercel `VITE_DEClic_AI_URL=https://<worker-domaine>` puis reconstruire le frontend. Ne jamais transmettre de secret au navigateur, ni demander des données identifiantes à un mineur. Le texte libre ne doit pas dépasser 220 caractères. Sans Worker, la décision adaptative utilise une interprétation locale scénarisée.

## GitHub → Vercel

La publication a été faite à partir de la source Git. Si le projet Vercel existant n'est pas lié à GitHub en mode Auto-Deploy, une nouvelle mise à jour GitHub n'actualisera pas seule la production : vérifier le Git Integration du projet ou effectuer un déploiement GitSource explicite. Ne pas créer d'URLs d'achat non vérifiées.

## Avant vente

Les couvertures des épisodes 2 à 6 et les visuels des livres sont des extraits de maquettes graphiques et nécessitent des illustrations finales autonomes. Les dialogues et le design doivent être testés avec des éducateurs et des adolescents. Le mode Cloudflare IA nécessite un contrôle du coût, des réponses et des données personnelles avant activation.
