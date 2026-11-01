# DÉCLIC V5 — Vision et fonctionnement du produit

## Promesse
Des histoires à vivre, et non des questionnaires. L'adolescent incarne un personnage, comprend une relation avant le conflit, choisit ses paroles, observe une réaction, prend une seconde décision, puis découvre une conséquence.

## Catalogue et progression
Six épisodes ordonnés. Chaque épisode possède trois scènes de contexte, une première décision à trois choix, trois réactions conditionnelles, une seconde décision à trois choix et neuf fins distinctes. Total théorique : 54 fins. Le premier épisode est libre ; terminer une fin de l'épisode N débloque l'épisode N+1. Les fins découvertes sont enregistrées dans localStorage et dédupliquées par ID. Rejouer une même fin ne donne pas de découverte supplémentaire. Le déblocage n'exige jamais de trouver les neuf fins.

## Architecture
- `src/content/episode01.ts` + `src/content/episodes.ts` : données et scénarios.
- `src/engine/story.ts` : navigation déterministe, sans effet de bord.
- `src/engine/progress.ts` : fins et déblocage par collection.
- `src/engine/storage.ts` : sauvegarde locale de chaque épisode.
- `src/App.tsx` : UI mobile/tablette/ordinateur.
- `src/services/ai.ts` : adaptation facultative et fallback local.
- `workers/ai/` : Worker Cloudflare IA (non déployé, configuration externe requise).
- `public/assets/` : images et sons présents localement, prévus pour le précache PWA.

## Intégration d'IA
La version jouable fonctionne sans IA. Quand un endpoint HTTPS Cloudflare est configuré, les mots libres du joueur sont interprétés dans l'une de trois intentions autorisées (`express`, `avoid`, `ask`), et le personnage réagit avec une courte réplique contextualisée. **L'IA ne décide pas des identifiants de scène et ne réécrit pas le graphe** : l'état émotionnel et les fins restent déterministes et testables. Cette précaution évite la perte de cohérence et les comportements hors sujet.

Le service Worker devra être déployé sur un compte Cloudflare avec binding Workers AI ; ajouter `VITE_DEClic_AI_URL` dans Vercel après configuration CORS et contrôles de quota. Ne jamais envoyer de clés dans le frontend. Les réponses libres doivent rester fictives, limitées à 220 caractères, sans données personnelles, et peuvent être transmises au fournisseur Cloudflare seulement si le service est activé.

## Bibliothèque
Les trois références `Les Graines — Ethan`, `Brindétoile` et `Maman, où es-tu ?` sont des pistes de découverte, **pas des fiches Amazon vérifiées**. N'afficher aucun bouton d'achat fictif. Ajouter une URL Amazon directe uniquement après vérification de l'identité du livre, de l'auteur et de sa disponibilité. Des liens non vérifiés nuisent à la confiance des utilisateurs.

## Direction artistique
Épisode 1 : illustration révisée pour remplacer les mains défectueuses. Épisodes 2 à 6 : visuels de catalogue créés à partir d'éléments d'une maquette artistique interne ; ce sont des **prototypes de couvertures indépendants**, non des illustrations originales pleine définition. Ils doivent être remplacés par cinq illustrations haute définition avant commercialisation.

## Accessibilité et audio
Son désactivé initialement (pas de lecture automatique invasive). Lecture sur action volontaire, bouton d'arrêt, aucune musique obligatoire. Mobile : scène visuelle compacte, texte et choix prioritaires, grosses zones interactives, navigation basse. Respect de `prefers-reduced-motion`. Les émotions proposées ne constituent jamais des diagnostics.

## Limites de la V5
Pas de comptes ni de synchronisation multi-appareils ; perte de progression si localStorage est effacé. Pas de sauvegarde côté serveur. Les cinq épisodes nouvellement écrits nécessitent relecture éditoriale et validation d'usage par des professionnels et des adolescents. Les covers temporaires ne doivent pas être présentées comme un matériel commercial final. Le Worker Cloudflare est préparé mais ne peut pas être activé sans une connexion autorisée et un compte utilisateur.
