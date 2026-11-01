# V8 — Accueil de référence et verrouillage saisonnier

- Objectif : reprendre la composition **Accueil / Bibliothèque à droite / Six histoires en bas / Mon parcours à droite** de la référence visuelle fournie.
- La navigation **Accueil, Catalogue, Mes histoires, Bibliothèque DÉCLIC** ne présente aucun profil fictif.
- La galerie propose six couvertures adaptées. Les liens des trois livres publiés sont conservés.
- Déblocage : un nouvel utilisateur ne dispose que de l’épisode 1. Une fin réellement atteinte du 1 rend le 2 jouable, et ainsi de suite. Le seul champ `completed` de l’ancien stockage ne peut plus ouvrir tous les épisodes.
- Les progrès précédemment légitimement acquis ne sont pas effacés. L’utilisateur peut cliquer sur **Recommencer la saison** (avec confirmation) pour repartir de zéro.
- Les tests `tests/progression-locks.test.mjs` couvrent les données neuves, anciennes, les fins invalides et le passage à l’épisode 2.
- Sur mobile, l’interface est reconstruite sans débordement horizontal et conserve les images intégrales (`contain`).
