/* Données uniquement : ajouter un épisode ne demande pas de modifier l'interface. */
const EPISODE = {
  id:'ce-qu-on-na-pas-dit', title:'Ce qu’on n’a pas dit', eyebrow:'ÉPISODE 01 · L’AMITIÉ',
  headline:'Il y a des silences qui font du bruit.',
  summary:'Léa attendait ce moment depuis des semaines. Noa a pris une décision sans elle. Il ne sait pas encore à quel point ça l’a blessée.',
  characters:{lea:'LÉA',noa:'NOA'},
  intro:{speaker:'LÉA · PENSÉE',line:'On devait y aller ensemble.',detail:'La sonnerie vient de retentir. Noa t’annonce qu’il s’est inscrit à l’atelier avec d’autres amis. Tu comprends qu’il ne t’a même pas demandé ton avis.'},
  start:'first',
  nodes:{
    first:{type:'choice',chapter:'01 · LE PREMIER MOT',speaker:'LÉA · À TOI DE JOUER',line:'Tu trouves enfin les mots.',text:'Tu te sens mise de côté. Comment vas-tu commencer cette conversation ?',choices:[
      {id:'express',label:'Dire ce que tu ressens',text:'« Ça m’a blessée que tu décides sans m’en parler. »',next:'response-express'},
      {id:'hide',label:'Faire comme si de rien n’était',text:'« T’inquiète. C’est pas grave. »',next:'response-hide'},
      {id:'ask',label:'Essayer de comprendre',text:'« Pourquoi tu ne m’en as pas parlé avant ? »',next:'response-ask'}]},
    'response-express':{type:'dialogue',chapter:'02 · SA RÉACTION',speaker:'NOA',line:'« Je voulais pas te faire de mal… »',text:'Il baisse les yeux. Sa voix est plus douce, mais il ne sait pas comment répondre.',next:'second-express',emotion:'Tu remarques qu’il est embarrassé. Et toi, tu es encore déçue.'},
    'response-hide':{type:'dialogue',chapter:'02 · LE NON-DIT',speaker:'NOA',line:'« Tu dis ça, mais tu m’évites depuis tout à l’heure. »',text:'Tu as essayé de cacher ta déception. Noa sent malgré tout que quelque chose ne va pas.',next:'second-hide',emotion:'Tu peux choisir de parler maintenant, plus tard, ou de prendre du recul.'},
    'response-ask':{type:'dialogue',chapter:'02 · UN MALENTENDU',speaker:'NOA',line:'« Je croyais que ça ne t’intéressait plus. »',text:'Tu découvres qu’il s’est fait une idée sans vérifier auprès de toi.',next:'second-ask',emotion:'Son intention était peut-être différente de l’effet de son geste.'},
    'second-express':{type:'choice',chapter:'03 · CE QUE TU EN FAIS',speaker:'LÉA · À TOI DE JOUER',line:'Il attend ta réponse.',text:'Tu as exprimé ton ressenti. Comment poursuivre ?',choices:[
      {id:'clarify',label:'Clarifier sans accuser',text:'« J’aurais juste aimé qu’on en parle avant. »',next:'ending-clarify'},
      {id:'attack',label:'Laisser sortir la colère',text:'« En fait, tu t’en fiches complètement de moi ! »',next:'ending-attack'},
      {id:'boundary',label:'Poser une limite',text:'« J’ai besoin d’un moment. On pourra en reparler. »',next:'ending-boundary'}]},
    'second-hide':{type:'choice',chapter:'03 · CE QUE TU EN FAIS',speaker:'LÉA · À TOI DE JOUER',line:'Noa attend, inquiet.',text:'Quel chemin te ressemble le plus ?',choices:[
      {id:'open',label:'Revenir sur tes mots',text:'« En fait… si. Ça m’a fait quelque chose. »',next:'ending-open'},
      {id:'mask',label:'Maintenir le silence',text:'« Non, vraiment. On passe à autre chose. »',next:'ending-mask'},
      {id:'pause',label:'Différer la discussion',text:'« J’ai besoin d’un peu de temps pour en parler. »',next:'ending-pause'}]},
    'second-ask':{type:'choice',chapter:'03 · CE QUE TU EN FAIS',speaker:'LÉA · À TOI DE JOUER',line:'Un doute s’installe.',text:'Comment réagis-tu à l’explication de Noa ?',choices:[
      {id:'curious',label:'Vérifier le malentendu',text:'« Qu’est-ce qui t’a fait penser ça ? »',next:'ending-curious'},
      {id:'doubt',label:'Contester son explication',text:'« Ça ressemble plutôt à une excuse. »',next:'ending-doubt'},
      {id:'repair',label:'Imaginer une autre suite',text:'« On peut trouver autre chose à faire ensemble ? »',next:'ending-repair'}]},
    'ending-clarify':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« J’aurais dû te demander. »',text:'Noa reconnaît qu’il aurait pu t’inclure. Vous n’êtes pas d’accord sur tout, mais vous pouvez en parler.',insight:'Dire ce que l’on ressent n’oblige pas l’autre à penser comme nous. Cela ouvre parfois le dialogue.',prompt:'Comment pourrais-tu dire ce qui te blesse sans accuser ?'},
    'ending-attack':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« Mais tu ne m’écoutes même pas ! »',text:'Il se referme. Vos mots deviennent plus forts que ce que vous essayez de vous dire.',insight:'La colère est légitime ; certaines formulations peuvent toutefois rendre l’échange plus difficile.',prompt:'Comment reformuler ta phrase sans effacer ce que tu ressens ?'},
    'ending-boundary':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'LÉA · PENSÉE',line:'Pas maintenant. Mais pas jamais.',text:'Tu t’éloignes quelques minutes. Tu as besoin de temps avant de reprendre cette conversation.',insight:'Faire une pause peut protéger une relation lorsqu’on annonce clairement qu’on souhaite reparler.',prompt:'Comment indiquer que tu as besoin d’une pause ?'},
    'ending-open':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« Merci de me le dire. »',text:'Tu trouves le courage de reconnaître ta blessure. Noa commence à comprendre.',insight:'On peut revenir sur ses premières paroles. Il n’est pas trop tard pour être sincère.',prompt:'Qu’est-ce qui peut t’aider à changer d’avis dans une discussion ?'},
    'ending-mask':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'LÉA · PENSÉE',line:'Il n’a rien compris. Et je n’ai rien dit.',text:'La conversation se termine. Le malaise reste là, sans que personne sache vraiment pourquoi.',insight:'Se taire peut protéger sur le moment, mais aussi prolonger un malentendu.',prompt:'Quand préfères-tu te taire ? Et quand est-ce utile de parler ?'},
    'ending-pause':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« D’accord. On se voit demain ? »',text:'Tu choisis un moment plus calme pour reprendre votre conversation.',insight:'Reporter une discussion est parfois plus aidant que se forcer à parler tout de suite.',prompt:'Comment choisir un bon moment pour une discussion difficile ?'},
    'ending-curious':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« Tu avais dit que tu étais fatiguée… »',text:'Vous réalisez qu’un détail a été mal interprété. Le dialogue devient plus facile.',insight:'Poser une question permet parfois de découvrir les hypothèses de l’autre.',prompt:'Quelle question pourrait éclaircir une situation ambiguë ?'},
    'ending-doubt':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« Je te dis ce que je pensais… »',text:'Noa a le sentiment de ne pas être cru. Tu as toujours besoin d’explications.',insight:'Douter n’est pas interdit. On peut toutefois exprimer son doute avec curiosité plutôt qu’avec un verdict.',prompt:'Comment demander une explication supplémentaire sans traiter l’autre de menteur ?'},
    'ending-repair':{type:'ending',chapter:'04 · UNE SUITE POSSIBLE',speaker:'NOA',line:'« Oui… mais parlons aussi de ce qui s’est passé. »',text:'Vous imaginez une autre activité ensemble et prenez le temps de revenir sur la déception.',insight:'Proposer une réparation peut aider, à condition de ne pas ignorer le problème initial.',prompt:'Qu’est-ce qu’une réparation juste pour les deux personnes ?'}
  }
};
