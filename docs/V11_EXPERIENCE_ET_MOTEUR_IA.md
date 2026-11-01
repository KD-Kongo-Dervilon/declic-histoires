# DÉCLIC V11 — Lecteur cinématographique et moteur narratif

## Promesse et UX — le contrat de l'écran

L'expérience débute sur **une décision immédiatement jouable**, après trois phrases contextualisant la scène. Pas de pavé d'introduction. Les détails qui attachent le lecteur aux personnages apparaissent après, à mesure que ses décisions les rendent significatifs.

- Sur tablette/ordinateur : **image intégrale à gauche**, page courte à droite, commande de progression explicite. Aucun recadrage destructeur. Un léger effet de feuille qui tourne accompagne l'avance.
- Sur téléphone : **illustration panoramique entière au-dessus**, texte en peu de lignes, choix visibles juste sous le passage. Commandes d'au moins 44 px et aucune barre fixe devant les boutons.
- Les scènes longues sont automatiquement réparties en pages de 1 à 4 phrases; les textes originaux ne sont pas supprimés.
- Une scène change visuellement lors des avances, par l'alternance de six cadrages narratifs : photo, maison, souvenir, hésitation, approche, conversation. Les images restent cohérentes avec les personnages.
- Les paramètres de réduction des mouvements suppriment l'effet de page. Le son reste volontaire et contrôlable dans Paramètres.

## Arc narratif et décisions

Le premier choix (répondre à Noa, demander à Camille, ou se taire) intervient **au premier écran**. Le carnet bleu constitue une nouvelle décision quelques pages plus loin. Cette seconde décision réapparaît **après la rencontre au banc**, donc elle affecte à la fois la scène immédiate et une scène plus tardive. La fatigue, l'atelier et les neuf conclusions sont conservés; les fins ne sont accessibles qu'après une vraie décision de parcours et une fin enregistrée.

## IA — quand Cloudflare est configuré

Service Worker dans `workers/ai/src/index.ts` : binding `AI` de Cloudflare Workers AI, route `POST /narrate`. Le front ne possède **aucun secret d'IA**. La route reçoit une scène canonique et **au maximum 10 décisions fictives**, ainsi que des variables de relation/tension/expression bornées, puis génère une micro-scène tenant compte du vécu. Réponse JSON validée : `text`, `dialogue?`, `consequence?`.

L'IA n'est **pas configurée** sur l'URL officielle tant qu'un Worker Cloudflare n'est pas déployé et que `VITE_DEClic_AI_URL` n'est pas renseigné dans Vercel. Dans ce cas, la **trame écrite** prend le relais et l'app reste jouable hors ligne, sans se présenter comme une IA active. Le Worker ne peut pas choisir de nouveaux identifiants de scènes ou déverrouiller des histoires : les choix valides et leurs fins sont contrôlés par le moteur local. Ce garde-fou est intentionnel pour garantir la continuité, l'accessibilité et la sûreté des récits.

**Limite importante :** la route IA génère et personnalise du contenu *au fil de l'histoire*, mais n'est pas une génération illimitée d'univers autonomes. De nouvelles intrigues et conclusions doivent être publiées comme de nouveaux épisodes. L'IA ne pose aucun diagnostic ni ne déduit la psychologie réelle du lecteur.

### Déploiement Cloudflare (action sur le compte Cloudflare)

1. Dans Cloudflare, connecter le compte et ouvrir `workers/ai`.
2. Installer Wrangler depuis ce dossier ; exécuter `wrangler login` et `wrangler deploy`.
3. Tester l'URL du Worker via `/health` puis la route `/narrate` depuis le domaine officiel.
4. Déclarer **uniquement l'URL publique HTTPS** dans la variable de projet Vercel `VITE_DEClic_AI_URL` et reconstruire la PWA. Ne jamais renseigner une clé API dans une variable Vite destinée au client.
5. Activer les contrôles de rate limiting/WAF Cloudflare avant un lancement grand public, et vérifier la consommation de neurones depuis le tableau de bord.

Les limites, modèles et tarifs doivent être revérifiés au déploiement dans la documentation Cloudflare : https://developers.cloudflare.com/workers-ai/platform/pricing/ . La documentation de binding : https://developers.cloudflare.com/workers-ai/configuration/bindings/ .

## Suivi et tests

- La progression est stockée localement; aucune migration destructive n'est introduite.
- Les 9 fins et l'ouverture de l'épisode suivant sont contrôlées par le moteur et ses tests de graphe.
- Contrôler le premier choix, l'effet de page, le chargement des six images, le mobile 320/390 px, la tablette 1024 px, le desktop 1440 px, les 9 fins, la lecture sans réseau et le chemin de repli si l'IA échoue.
