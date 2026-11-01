# Déployer DÉCLIC : Vercel + Cloudflare Workers AI

## 1. Frontend (fonctionne sans IA)

Prérequis : Node 22.12+ (ou version LTS prise en charge par Vite), npm.

```bash
npm install
npm test
npm run build
npm run preview
```

Sur Vercel : framework **Vite**, dossier racine de ce dépôt, build `npm run build`, sortie `dist`. Le projet actuel à remplacer **après test** est `declic-histoires` ; URL de production : https://declic-histoires.vercel.app/.

## 2. Worker Cloudflare (activation de l'IA — facultatif)

Ce Worker **n'est pas déployé** sans connexion à un compte Cloudflare. L'application reste jouable.

```bash
cd workers/ai
npm install
npx wrangler login
npm run deploy
```

Le compte Cloudflare doit avoir accès aux Workers AI. Le fichier `wrangler.toml` configure `AI` et `ALLOWED_ORIGIN`. Vérifier le domaine exact, puis récupérer l'URL HTTPS `https://declic-narrative-ai.<compte>.workers.dev` créée par Cloudflare. NE PAS l'inventer.

Dans les variables d'environnement **Vercel** : `VITE_DEClic_AI_URL=<URL https du Worker>` ; redéployer le frontend (Vite incorpore les variables publiques au build). Aucune clé secrète à mettre dans `VITE_`.

Tester `GET /health` et `POST /adapt`. Avec les limites Cloudflare réelles en vigueur, activer des contrôles anti-abus et une limitation de débit **avant** l'ouverture publique de l'IA. Le quota gratuit peut être épuisé.

## 3. Installation iPhone/iPad

Ouvrir l'adresse HTTPS dans Safari. Bouton **Partager** → **Ajouter à l'écran d'accueil** (libellé peut varier) → Ajouter. Revenir après une première navigation connectée et tester en mode avion. Les fichiers statiques se mettent en cache ; l'IA, qui requiert Internet, revient automatiquement au mode scénarisé.

## 4. Prérequis qualité avant diffusion professionnelle

Vérifier iPhone Safari réel, tablette paysage, Android Chrome, Chrome desktop ; 9 fins ; design sans image rognée dans le lecteur ; clavier et VoiceOver ; contraste ; réactions crédibles relues ; mode son. Faire relire le contenu par un éducateur et des adolescents pour s'assurer de l'accessibilité, sans utiliser l'histoire pour mesurer un état clinique.
