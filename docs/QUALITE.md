# Plan qualité V5

- [x] 6 épisodes, chacun 9 fins distinctes et atteignables (tests déterministes).
- [x] Le premier épisode s'ouvre, les cinq autres restent verrouillés initialement.
- [x] Une fin de l'épisode N déverrouille N+1.
- [x] Rejouer la même fin n'incrémente pas le compteur.
- [x] 390 px, 320 px, 1024 px, 1440 px : parcours 01 → 02 → 03 testé sur Vercel (avant dernier patch graphique).
- [x] Aucun débordement horizontal observé aux quatre résolutions testées.
- [x] 9 tests de code réussis en local sous Node 22.
- [ ] Vérification Safari iOS sur appareil réel.
- [ ] Mode hors ligne validé sur appareil réel après installation.
- [ ] Relecture indépendante et validation pédagogique des épisodes 2 à 6.
- [ ] Cinq couvertures finales originales à produire avant commercialisation.
- [ ] Worker Cloudflare connecté, quotas et confidentialité vérifiés.
- [ ] Pages Amazon des livres confirmées avant l'ajout d'un lien d'achat.

Règle : ne pas marquer « validé » un service qui n'a pas été testé sur le matériel ou le compte concerné.
