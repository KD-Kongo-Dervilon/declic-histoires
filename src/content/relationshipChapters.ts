import type {Episode, NarrativeEffects} from '../types';

type Branch = {
  id: string;
  title: string;
  words: string;
  scene: string;
  text: string;
  later: string;
  effects: NarrativeEffects;
};
type Chapter = {
  character: string;
  name: string;
  title: string;
  setup: string;
  branches: [Branch, Branch];
  willing: string;
  guarded: string;
  nextQuestion: string;
};

const chapters: Record<string, Chapter> = {
  invisible: {
    character: 'lina', name: 'Lina', title: 'La sortie se prépare encore',
    setup: 'Le téléphone de Lina vibre sur la table. Dans le groupe, quelqu’un demande combien de places réserver pour samedi. Lina regarde Maya. « Je peux te rajouter maintenant. » Maya aimerait venir. Elle aurait aussi voulu recevoir cette question avant que tout soit décidé.',
    branches: [
      {
        id: 'maya-place', title: 'Accepter une place et parler au groupe',
        words: '« Ajoute-moi. Mais j’aimerais qu’on en parle tous ensemble. »',
        scene: 'Une chaise tournée vers les autres',
        text: 'Lina ajoute son prénom. Maya tourne sa chaise et demande comment la sortie s’est organisée. Un garçon dit qu’il pensait qu’elle travaillait samedi. Une autre répond qu’elle avait simplement oublié de demander. Maya doit entendre ces deux réponses devant tout le monde. Au moins, personne ne pourra dire qu’elle n’a rien dit.',
        later: 'Le samedi reste inscrit dans l’agenda de Maya. Le groupe lui a gardé une place. Elle sait aussi qu’elle devra y retrouver ceux devant qui elle a parlé de sa solitude.',
        effects: {relationships: {lina: 1}, flags: ['maya-sortie']},
      },
      {
        id: 'maya-dejeuner', title: 'Proposer d’abord un déjeuner à deux',
        words: '« Pour samedi, je vais réfléchir. Est-ce qu’on peut manger ensemble demain ? »',
        scene: 'Un rendez-vous plus petit',
        text: 'Lina accepte et met son téléphone de côté. Maya lui dit qu’elle veut un moment où personne ne les interrompra. Dans le groupe, le nombre de places est confirmé sans elle. Maya le voit apparaître sur l’écran. Elle a choisi une conversation plus calme, et la sortie continue de se préparer ailleurs.',
        later: 'Lina a gardé le lendemain midi pour Maya. Les photos de samedi apparaîtront peut-être dans le groupe. Maya aura une conversation à elle, mais elle n’aura pas vécu cette journée avec les autres.',
        effects: {relationships: {lina: 2}, flags: ['maya-dejeuner']},
      },
    ],
    willing: 'Lina range le téléphone dans son sac. « Il y a peut-être d’autres fois où on a fait ça sans te demander. » Maya se souvient d’une sortie au cinéma. Elle la raconte, et Lina la laisse finir.',
    guarded: 'Lina garde un œil sur le téléphone. « Je pensais vraiment que tu ne voulais plus venir avec nous. » Maya entend qu’elles ont chacune attendu un signe de l’autre. Elle choisit ce qu’elle veut ajouter maintenant.',
    nextQuestion: 'Maya a obtenu un premier rendez-vous ou une place dans la sortie. Il reste à dire ce qu’elle attend de leur amitié. Comment veut-elle poursuivre ?',
  },
  'juste-pour-rire': {
    character: 'sarah', name: 'Sarah', title: 'Le téléphone tendu',
    setup: 'Sarah ouvre le groupe. La vidéo est toujours là. Elle propose de la retirer, mais plusieurs personnes l’ont déjà enregistrée. Nolan pourrait lui laisser envoyer la demande de suppression. Ou prendre la parole lui-même, devant ceux qui ont ri.',
    branches: [
      {
        id: 'nolan-sarah', title: 'Laisser Sarah demander le retrait',
        words: '« C’est toi qui l’as publiée. Dis-leur que tu veux la retirer. »',
        scene: 'Elle écrit sous son propre nom',
        text: 'Sarah tape une phrase, l’efface, puis écrit qu’elle a partagé la vidéo sans demander à Nolan. Elle lui montre le message avant de l’envoyer. Nolan acquiesce. Une réponse arrive : « Il le prend mal ? » Sarah repose le téléphone. Cette question-là, elle devra aussi choisir comment y répondre.',
        later: 'La demande de suppression porte le nom de Sarah. Nolan a pu rester à l’écart de la discussion. Il attend encore de voir comment elle répondra à ceux qui continuent de rire.',
        effects: {relationships: {sarah: 1}, flags: ['sarah-parle']},
      },
      {
        id: 'nolan-parole', title: 'Dire lui-même ce qu’il demande',
        words: '« Je vais leur écrire. Reste avec moi pendant que je le fais. »',
        scene: 'Un message sans sourire',
        text: 'Nolan écrit qu’il veut que la vidéo soit supprimée. Il relit le message en cherchant machinalement une blague pour adoucir la dernière phrase. Puis il l’envoie tel quel. Sarah reste près de lui. Un camarade s’excuse, un autre quitte la conversation. Son téléphone devient très silencieux.',
        later: 'Le message de Nolan est resté visible dans le groupe. Certains camarades lui ont répondu directement. Il a trouvé ses mots, et il devra aussi croiser leurs regards au prochain cours.',
        effects: {relationships: {sarah: 0}, flags: ['nolan-parle']},
      },
    ],
    willing: 'Sarah demande à Nolan si d’autres moments l’avaient gêné avant la vidéo. Il hésite, puis lui raconte la répétition de la semaine précédente. Elle se rappelle la scène. Cette fois, elle ne cherche pas tout de suite à expliquer pourquoi elle avait ri.',
    guarded: 'Sarah commence par dire qu’elle voulait le faire rire aussi. Nolan regarde le message de suppression. Il lui rappelle que, pour l’instant, il veut surtout savoir qui garde encore la vidéo. Elle referme la conversation sans discuter.',
    nextQuestion: 'Une demande de retrait a été envoyée. Sarah attend de savoir ce que Nolan souhaite pour la suite. Que lui répond-il ?',
  },
  'dire-non': {
    character: 'adam', name: 'Adam', title: 'Quelqu’un détourne les yeux',
    setup: 'À l’autre bout du canapé, Tom a cessé de rire. Quand Adam se retourne, il fait semblant de chercher quelque chose dans son sac. Jules l’a vu. Il peut aller lui parler à voix basse, ou lui demander devant tout le monde ce qu’il pense du défi.',
    branches: [
      {
        id: 'jules-apart', title: 'Rejoindre Tom à l’écart',
        words: '« Tu veux qu’on sorte prendre l’air une minute ? »',
        scene: 'Près de la porte',
        text: 'Tom suit Jules jusqu’à l’entrée. Il avoue qu’il n’a pas envie de filmer non plus. « Mais ne dis pas que je t’ai dit ça. » Jules retrouve la même peur dans une autre voix. Quand ils reviennent, Adam leur demande pourquoi ils sont partis. Tom regarde Jules avant de répondre.',
        later: 'Tom envoie un message à Jules après la soirée. Il le remercie de lui avoir proposé de sortir. Devant le groupe, il n’a pourtant toujours pas dit ce qu’il pensait.',
        effects: {relationships: {adam: -1, tom: 2}, flags: ['tom-prive']},
      },
      {
        id: 'jules-groupe', title: 'Demander l’avis de Tom devant les autres',
        words: '« Tom, toi, tu as envie de le faire ? »',
        scene: 'Un silence partagé',
        text: 'Tous les regards quittent Jules. Tom reste un instant immobile, puis dit qu’il préférerait un autre jeu. Une fille approuve depuis la table. Adam serre le téléphone dans sa main. Tom croise le regard de Jules : il a parlé, mais Jules ne lui avait pas demandé s’il voulait être au centre de la pièce.',
        later: 'Deux personnes ont dit tout haut qu’elles préféraient changer de jeu. Tom a aidé Jules à desserrer la pression. En partant, il lui a demandé de le prévenir avant de le mettre à nouveau devant tout le monde.',
        effects: {relationships: {adam: -1, tom: -1}, flags: ['tom-public']},
      },
    ],
    willing: 'Adam baisse un peu la voix. « J’avais dit aux autres que tu serais partant. » Jules comprend pourquoi il insiste depuis leur arrivée. Il peut lui répondre sans promettre de jouer ce rôle-là.',
    guarded: 'Adam demande si Jules est venu pour passer la soirée avec eux ou pour discuter chaque idée. Jules entend les autres remuer derrière lui. Il doit lui répondre devant ce petit public, même s’il aurait préféré une conversation à deux.',
    nextQuestion: 'Jules sait maintenant qu’il est possible de chercher du soutien. Adam attend encore sa réponse au défi. Que choisit-il ?',
  },
  'un-pas-vers-toi': {
    character: 'yasmine', name: 'Yasmine', title: 'Des mots, ou une voix',
    setup: 'Yasmine lui demande si elles peuvent parler cinq minutes. Ana commence une longue réponse, puis s’arrête. À l’écrit, elle peut choisir chaque mot. Au téléphone, elle entendrait enfin ce que les messages ne lui donnent pas.',
    branches: [
      {
        id: 'ana-message', title: 'Continuer par messages',
        words: '« Je préfère écrire pour le moment. Laisse-moi le temps de répondre. »',
        scene: 'La phrase effacée',
        text: 'Ana écrit qu’elle avait eu honte pendant leur dispute. Elle hésite devant ce mot, le remplace par « mal », puis remet « honte ». Yasmine répond qu’elle ne l’avait pas compris. Ana peut relire cette réponse autant de fois qu’elle le veut. Elle ne sait pas dans quelle voix Yasmine l’aurait dite.',
        later: 'Le message d’Ana reste dans leur conversation. Elle pourra le relire si elles comprennent à nouveau les choses différemment. Elle a aussi envie qu’un jour elles puissent se dire cela sans écran.',
        effects: {relationships: {yasmine: 1}, flags: ['ana-ecrit']},
      },
      {
        id: 'ana-appel', title: 'Accepter un appel de cinq minutes',
        words: '« D’accord. Mais si je m’arrête, tu me laisses reprendre plus tard. »',
        scene: 'Le bruit de la cuisine',
        text: 'La voix de Yasmine arrive au milieu d’un bruit de vaisselle. Elle s’éloigne et ferme une porte. Ana reconnaît ce petit silence avant qu’elle parle. Quand Yasmine commence à raconter la dispute, Ana l’interrompt malgré elle. Elles parlent en même temps, puis s’arrêtent. Il reste trois minutes.',
        later: 'L’appel a duré un peu plus de cinq minutes. Ana se souvient d’une hésitation dans la voix de Yasmine. Aucune des deux ne pourrait répéter mot pour mot ce qu’elles se sont dit.',
        effects: {relationships: {yasmine: 0}, flags: ['ana-appelle']},
      },
    ],
    willing: 'Yasmine lui dit qu’elle a plusieurs fois préparé un message pendant les trois semaines de silence. Ana lui demande ce qui l’a retenue. La réponse arrive doucement : « J’avais peur que tu ne répondes jamais. »',
    guarded: 'Yasmine revient à un détail de la dispute. Ana sent l’ancienne conversation prête à recommencer. Elle lui demande de ralentir. Cette fois, Yasmine s’arrête assez longtemps pour qu’Ana termine sa phrase.',
    nextQuestion: 'Elles ont trouvé une façon de se parler pour aujourd’hui. Quelle place Ana veut-elle donner à la suite ?',
  },
};

export function addRelationshipChapter(episode: Episode): Episode {
  const chapter = chapters[episode.id];
  if (!chapter) return episode;
  const nodes = {...episode.nodes};
  const first = nodes['premier-choix'];
  nodes[first.id] = {...first, choices: first.choices!.map(item => ({
    ...item, effects: {relationships: {[chapter.character]: item.id === 'eviter' ? -1 : 1}},
  }))};
  for (const id of ['v7-response-depth','reponse-1','reponse-2']) {
    nodes[id] = {...nodes[id], next:'relation-contretemps'};
  }
  nodes['relation-contretemps'] = {
    id:'relation-contretemps', kind:'decision', phase:'02', eyebrow:episode.title,
    title:chapter.title, text:chapter.setup,
    choices:chapter.branches.map((branch,index)=>({
      id:branch.id, title:branch.title, words:branch.words, next:branch.id+'-scene',
      intention:index===0?'ask':'express', effects:branch.effects,
      impact:{relation:0,tension:0,expression:0},
    })),
  };
  for (const branch of chapter.branches) {
    nodes[branch.id+'-scene'] = {
      id:branch.id+'-scene', kind:'scene', phase:'02', eyebrow:episode.title,
      title:branch.scene, text:branch.text, next:'relation-retour',
    };
  }
  nodes['relation-retour'] = {
    id:'relation-retour', kind:'scene', phase:'03', eyebrow:episode.title,
    title:'Ce qui peut se dire maintenant', text:chapter.guarded,
    variations:[{when:{relationship:{character:chapter.character,atLeast:1}},text:chapter.willing}],
    next:'second-0', nextByChoice:{exprimer:'second-0',eviter:'second-1',questionner:'second-2'},
  };
  for (const id of ['second-0','second-1','second-2']) {
    nodes[id] = {...nodes[id],text:chapter.nextQuestion};
  }
  for (const [id,node] of Object.entries(nodes)) {
    if (node.kind !== 'ending') continue;
    nodes[id] = {...node, variations:chapter.branches.map(branch=>({
      when:{flags:branch.effects.flags}, afterword:branch.later,
    }))};
  }
  return {...episode,nodes,characters:{[chapter.character]:chapter.name},duration:'15–25 minutes'};
}
