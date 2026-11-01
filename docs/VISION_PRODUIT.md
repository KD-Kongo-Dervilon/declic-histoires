# Vision produit — DÉCLIC : Histoires à vivre

## Promesse

« Une histoire que tu ne regardes pas seulement : tu la vis. » DÉCLIC est une **PWA narrative francophone** autour des émotions, de l'empathie et des conséquences. Public initial : adolescents 12–18 ans accompagnés ou autonomes, familles, éducateurs et enseignants spécialisés.

## Positionnement

- **Ce que nous ne sommes pas :** un quiz de personnalité, un diagnostic, un chatbot thérapeutique, une succession de questions à bonnes réponses.
- **Ce que nous offrons :** de l'attachement à des personnages récurrents, des souvenirs et motivations établies avant les choix, plusieurs conséquences possibles, puis un changement de perspective.
- **Différenciation recherchée :** qualité de l'écriture et des scènes, cohérence du monde, libre choix dans un cadre narratif solide, ressources de débriefing et validation terrain. La seule présence d'IA n'est pas un avantage durable.

## Parcours utilisateur

1. **Explorer :** sélectionner un épisode par émotion. Un seul épisode est actuellement jouable ; les cinq autres sont explicitement « en préparation ».
2. **Entrer dans la vie des personnages :** scène de souvenir → message déclencheur → rencontre → première décision. L'utilisateur comprend pourquoi cette relation compte.
3. **Ressentir :** choisir son émotion ressentie (déclaration personnelle, pas déduction automatique), écouter l'ambiance s'il le souhaite.
4. **Décider :** trois répliques scénarisées. Au premier choix, écrire librement une phrase ; si l'IA n'est pas active, le parcours fonctionne localement.
5. **Vivre la conséquence :** les trois premières options ouvrent trois scènes de réaction différentes ; chacune propose trois seconds choix distincts → **neuf fins**.
6. **Voir autrement :** découvrir une hypothèse sur le point de vue de Noa ; comprendre n'est pas excuser.
7. **Faire le point :** visualiser ses décisions, écrire sa réflexion sur l'appareil, rejouer un autre chemin, imprimer.

## Épisodes du catalogue (roadmap, non disponibles)

1. « Ce qu'on n'a pas dit » — Blessure, confiance — **jouable**.
2. « Le message de trop » — Colère, honte — conception.
3. « Invisible dans le groupe » — Solitude, tristesse — conception.
4. « C'était pour rire » — Honte, colère — conception.
5. « Le courage de dire non » — Pression, confiance — conception.
6. « Un pas vers toi » — Tristesse, confiance — conception.

## Expérience audio et visuelle

- Référence : illustration originale cinématographique 16:9 sans texte incrusté.
- Sur petit écran de jeu, l'image **reste entièrement visible** (`object-fit: contain`) ; un fond flou et une vignette remplissent le cadre. Cela évite de couper l'un des deux personnages. Sur la couverture de catalogue, `background-size: cover` est autorisé avec cadrage contrôlé.
- Ambiance originale à faible volume (souffle diffus) et feedback de choix ; contrôle explicite, pas d'autoplay, aucun dialogue prétendument doublé.
- Respect du mode `prefers-reduced-motion`, boutons tactiles, contrastes et tailles lisibles.

## Monétisation à valider (pas de ventes avérées)

- Épisode pilote ouvert, démonstration utilisable gratuitement.
- Offre professionnelle possible : bibliothèque enrichie, fiches d'animation, groupes et licences d'établissement. À tester auprès d'éducateurs avant d'établir les prix.
- Éviter les abonnements et les promesses cliniques avant preuve d'utilité et d'usage.

## Critères de livraison

Zéro écran noir ; héros visible en entier sur tablette ; 9/9 chemins distincts ; utilisation sans compte ; sauvegarde locale ; PWA installable en HTTPS ; éléments indisponibles non cliquables ; IA coupée = jeu entièrement jouable ; tests moteur et accès aux médias ; vérification sur vrai Safari iOS à prévoir avant diffusion commerciale.
