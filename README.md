# DÉCLIC — Ce qu'on n'a pas dit

**PWA narrative interactive (épisode pilote)** destinée à susciter des échanges sur l'amitié, les émotions et les décisions. L'application est en français, mobile-first, utilisable sans compte, et consultable hors connexion *après mise en cache lors d'une première visite sur HTTPS*.

## Fonctionnalités

- Une histoire interactive, **deux décisions**, **neuf dénouements**.
- Illustration originale, dialogues scénarisés, interface adaptée au téléphone.
- Ambiance sonore facultative, bilan personnel imprimable, sauvegarde locale.
- Manifeste PWA, icônes, service worker, ressources locales.

## Essayer en local

```bash
cd DEClic_Release
python3 -m http.server 8765
```

Ouvrir `http://localhost:8765`. Ne pas lancer `index.html` via `file://` : les règles des navigateurs et de la PWA diffèrent.

## Tests

```bash
node tests/test_engine.cjs
python3 tests/test_files.py
```

Pour l'assurance qualité visuelle et les tests sur vrai iPhone, voir `docs/DEPLOIEMENT.md`.

## Déployer

Le projet est **statique** : publier toute l'arborescence à la racine de Vercel, en mode *Other* / sans framework. Voir `docs/DEPLOIEMENT.md` pour le contrôle sur URL HTTPS, le mode hors connexion et l'installation iOS.

## Maintenir

Lire [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) pour comprendre les responsabilités des modules et la manière de faire évoluer les épisodes.

## Attention pédagogique

Les scènes sont fictives et servent de support à la discussion. Il n'existe pas de "bonne réponse" universelle et l'application ne fournit ni score, ni diagnostic, ni évaluation clinique. Tester auprès de professionnels et des publics concernés avant tout usage commercial ou institutionnel.

## Statut

**Prototype pilote** : doublages et synchronisation labiale non inclus. Pas de données envoyées à un serveur. La PWA ne sera installable qu'une fois publiée en HTTPS.
