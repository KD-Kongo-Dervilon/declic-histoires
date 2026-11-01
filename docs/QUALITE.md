# Contrôle qualité avant mise en production

## Fonctionnel

- [ ] `npm test` : graphe valide, 9 fins accessibles, aucun noeud orphelin
- [ ] `npm run build` : TypeScript strict et build Vite réussis
- [ ] Catalogue : filtres opérationnels, un seul épisode jouable, autres épisodes non cliquables
- [ ] Avant les décisions : trois scènes de contexte et dialogue différencié
- [ ] Choix : chaque clic mène au bon dialogue et à une suite distincte
- [ ] Débrief : parcours, perspective et note locale ; retour catalogue et rejouer
- [ ] Réponse libre : mode local cohérent sans Cloudflare, contrôle input

## Visuel et accessible

- [ ] iPhone Safari et iPad paysage : image ENTIEREMENT visible dans le lecteur
- [ ] La couverture catalogue utilise cover ; aucun visage coupé par le texte
- [ ] Test clavier, focus, VoiceOver, 320/390/768/1024/1440 px
- [ ] Contrastes et préfèrences de réduction d'animation
- [ ] Aucune image cassée / écran noir / script bloqué

## PWA et audio

- [ ] Production HTTPS ; manifeste et icônes chargent correctement
- [ ] Installation réelle sur écran d'accueil iOS
- [ ] Hors ligne après première visite : épisode jouable ; IA en repli local
- [ ] Son activé uniquement sur action utilisateur ; contrôle muet

## Métier

- [ ] Relecture éditoriale et pédagogique par un professionnel du public cible
- [ ] Tests réels avec adolescents consentants et accompagnement approprié
- [ ] Informations de confidentialité vérifiées avant intégration IA
- [ ] Contrôle des quotas et limitation de débit Cloudflare avant activation publique

Le fait qu'une case de cette liste existe ne signifie pas qu'elle a été validée. Documenter les captures et la date de chaque test avant tout passage en production.
