import type {Choice, Episode, NarrativeEffects, NarrativeNode, NarrativeVariation} from '../types';

const choice = (
  id: string, title: string, words: string, next: string,
  intention: Choice['intention'], effects: NarrativeEffects
): Choice => ({
  id, title, words, next, intention, effects,
  impact: {relation: 0, tension: 0, expression: 0},
});

const scene = (id: string, title: string, text: string, next: string, extra: Partial<NarrativeNode> = {}): NarrativeNode => ({
  id, title, text, next, kind: 'scene', phase: '02', eyebrow: 'LE MESSAGE DE TROP', ...extra,
});

/** A middle act with three exclusive routes. Existing node and ending IDs survive. */
export function deepenMessage(episode: Episode): Episode {
  if (episode.id !== 'le-message-de-trop') return episode;
  const nodes = {...episode.nodes};
  nodes['reponse-0'] = {...nodes['reponse-0'], title:'Une nouvelle copie'};
  nodes['reponse-2'] = {...nodes['reponse-2'], title:'Elle répond enfin'};
  nodes['v7-response-depth'] = {
    ...nodes['v7-response-depth'],
    text:'Inès lui écrit le prénom de quelqu’un qui lui a posé une question sur sa famille. Sami connaît à peine ce garçon. Il commence à répondre qu’il n’avait pas prévu une telle diffusion, puis efface la phrase. Dans leur conversation, la demande d’Inès attend toujours : « Tu peux faire quelque chose pour que ça s’arrête ? »',
  };
  const first = nodes['premier-choix'];
  nodes[first.id] = {...first, choices: first.choices!.map(item => ({
    ...item,
    effects: {relationships: {ines: item.id === 'eviter' ? -2 : 1}},
  }))};

  // Reconnect after each existing reaction, including the longer expression branch.
  for (const id of ['v7-response-depth', 'reponse-1', 'reponse-2']) {
    nodes[id] = {...nodes[id], next: 'capture-source'};
  }

  nodes['capture-source'] = scene(
    'capture-source', 'Celui qui a transféré',
    'À midi, Sami descend l’escalier derrière le gymnase. Alex l’attend à côté du distributeur en panne. D’habitude, il y a toujours une plaisanterie entre eux. Aujourd’hui, Alex lui montre son écran sans un mot.\n\nSous la capture d’Inès, Sami reconnaît le nom d’un deuxième groupe. Alex a transféré le message à trois personnes. Quelqu’un a ensuite masqué son nom avant de le diffuser plus loin. « C’est moi qui l’ai envoyé là-bas, dit-il. Je pensais que ça resterait entre nous. » Sami reconnaît sa propre excuse.\n\nAlex lui demande de garder son nom pour lui. Au même instant, le téléphone de Sami vibre. Inès demande si la capture circule encore.',
    'capture-secret'
  );
  nodes['capture-secret'] = {
    id: 'capture-secret', kind: 'decision', phase: '02', eyebrow: 'DEVANT LE GYMNASE',
    title: 'Une deuxième confidence', speaker: 'ALEX',
    text: 'Alex a les contacts que Sami cherche. Mais il ne veut pas être désigné devant le groupe. Inès, elle, attend une réponse. Le téléphone reste entre les deux garçons.',
    dialogue: '« Je peux essayer de récupérer les messages. Mais tu dis pas que c’est moi. »',
    choices: [
      choice('source-confronter', 'Demander à Alex d’assumer avec lui',
        '« On a tous les deux participé. Viens, on va lui dire ensemble. »', 'source-face', 'express',
        {relationships: {alex: -1, ines: 1}, flags: ['source-confrontee']}),
      choice('source-proteger', 'Garder son nom et obtenir les contacts',
        '« Je garde ça entre nous. Mais aide-moi à retrouver où la capture est partie. »', 'source-pacte', 'avoid',
        {relationships: {alex: 2, ines: -1}, flags: ['source-protegee']}),
      choice('source-aide', 'Demander de l’aide à la déléguée',
        '« Je ne sais plus comment arrêter ça. Je vais voir Nora, sans lui montrer la confidence. »', 'source-deleguee', 'ask',
        {relationships: {alex: -1, ines: 1}, flags: ['aide-demandee']}),
    ],
  };

  nodes['source-face'] = scene(
    'source-face', 'Alex recule',
    'Alex récupère son téléphone. « Toi, tu l’as envoyée le premier. » Sa voix porte plus qu’il ne le voudrait. Un élève ralentit près de l’escalier. Sami baisse la sienne.\n\nIl peut obtenir le nom du deuxième groupe, peut-être même les destinataires. Ou il peut refuser de chercher avec quelqu’un qui lui demande encore de cacher quelque chose. Alex attend, le téléphone déjà dans sa poche.',
    'source-face-choix'
  );
  nodes['source-face-choix'] = {
    id: 'source-face-choix', kind: 'decision', phase: '02', eyebrow: 'UNE PORTE ÉTROITE',
    title: 'Ce qu’Alex accepte de faire', text: 'La sonnerie va retentir. Alex propose d’écrire aux destinataires pendant le prochain cours. Sami devra attendre avant de savoir s’il l’a fait.',
    choices: [
      choice('face-attendre', 'Lui laisser jusqu’à la fin des cours',
        '« Fais-le. Mais ce soir, je lui raconte ce que je sais. »', 'face-delai', 'pause',
        {relationships: {alex: 2, ines: -1}, flags: ['contacts-accessibles', 'delai-accorde']}),
      choice('face-assumer', 'Refuser le délai et écrire à Inès',
        '« Je lui dis ma part et la tienne. Tu peux encore lui parler toi-même. »', 'face-rupture', 'express',
        {relationships: {alex: -2, ines: 1}, flags: ['source-revelee']}),
    ],
  };
  nodes['face-delai'] = scene(
    'face-delai', 'Le prix de quelques heures',
    'Alex sort enfin le téléphone. Il écrit devant Sami : « Supprimez cette capture. Elle n’aurait pas dû partir. » Une réponse arrive aussitôt, puis une autre. Il transmet les confirmations à Sami.\n\nInès rappelle pendant ce temps. Sami regarde son prénom s’afficher et laisse passer la sonnerie. Il a obtenu quelque chose de concret. Il devra expliquer pourquoi il n’a pas répondu.',
    'message-lendemain'
  );
  nodes['face-rupture'] = scene(
    'face-rupture', 'Deux messages qui se croisent',
    'Sami écrit à Inès ce qu’Alex vient de lui dire. Il commence par rappeler qu’il a lui-même partagé la première capture. Inès répond simplement : « D’accord. »\n\nAlex voit son nom apparaître dans la conversation. Il range son téléphone et remonte l’escalier. Le soir, Sami lui demande les destinataires. Le message est lu. Aucune liste ne suit.',
    'message-lendemain'
  );

  nodes['source-pacte'] = scene(
    'source-pacte', 'Une liste contre un silence',
    'Alex se détend. Il fait défiler les messages, puis s’arrête. Sur une réponse, quelqu’un propose de republier la capture le soir. Sami demande une copie pour garder une trace. Alex hésite : son nom est visible juste au-dessus.\n\nInès avait confié à Sami quelque chose qui devait rester privé. Voici qu’il lui faut conserver un autre échange privé pour comprendre ce qui arrive au premier.',
    'source-pacte-choix'
  );
  nodes['source-pacte-choix'] = {
    id: 'source-pacte-choix', kind: 'decision', phase: '02', eyebrow: 'UNE TRACE',
    title: 'Que garder de cet écran ?', text: 'Sami peut noter les contacts sans conserver la conversation. Ou garder une preuve de la menace de republication, avec le nom d’Alex.',
    choices: [
      choice('pacte-preuve', 'Conserver seulement la menace, avec l’accord d’Alex',
        '« Je garde cette partie pour demander de l’aide si ça repart. Je ne la poste pas. »', 'pacte-trace', 'ask',
        {relationships: {alex: -1, ines: 1}, flags: ['preuve-conservee', 'contacts-accessibles']}),
      choice('pacte-parole', 'Noter les contacts et tenir sa promesse',
        '« Pas de nouvelle capture. On leur écrit directement. »', 'pacte-effacer', 'repair',
        {relationships: {alex: 1}, flags: ['contacts-accessibles', 'aucune-preuve']}),
    ],
  };
  nodes['pacte-trace'] = scene(
    'pacte-trace', 'Une preuve qui reste privée',
    'Alex accepte qu’il conserve les deux lignes où quelqu’un annonce la republication. La confidence d’Inès reste hors du cadre. « Tu me préviens avant de la montrer ? » Sami acquiesce.\n\nIls contactent les destinataires. Deux confirment la suppression. Le troisième ne répond pas. Sami garde le téléphone face contre table pendant le cours, mais chaque vibration lui fait lever les yeux.',
    'message-lendemain'
  );
  nodes['pacte-effacer'] = scene(
    'pacte-effacer', 'La liste sur un coin de feuille',
    'Sami note trois prénoms. Alex lui montre les demandes de suppression qu’il vient d’envoyer, puis efface la conversation de son téléphone. Il a l’air soulagé.\n\nSami replie la feuille. Ils savent à qui ils ont écrit, mais plus exactement qui avait annoncé la republication. Quand Inès demande où ils en sont, Sami répond que deux personnes ont effacé la photo. Il ne promet rien pour la troisième.',
    'message-lendemain'
  );

  nodes['source-deleguee'] = scene(
    'source-deleguee', 'La salle vide',
    'Nora écoute Sami dans une salle laissée ouverte. Il raconte la circulation de la capture en gardant pour lui la confidence d’Inès. Nora ne demande pas à la lire. Elle demande qui veut de l’aide.\n\n« Toi, tu voudrais que ça s’arrête. Je comprends. Mais Inès, elle veut quoi ? » Sami regarde la dernière notification. Il ne lui a pas posé la question. Nora peut l’accompagner auprès de la CPE, ou attendre qu’il ait parlé à Inès.',
    'source-deleguee-choix'
  );
  nodes['source-deleguee-choix'] = {
    id: 'source-deleguee-choix', kind: 'decision', phase: '02', eyebrow: 'CHERCHER DU SOUTIEN',
    title: 'À quel moment faire intervenir quelqu’un ?', text: 'Nora doit repartir en cours. La CPE est encore disponible quelques minutes. Inès n’a pas répondu au dernier message.',
    choices: [
      choice('aide-maintenant', 'Aller voir la CPE avec Nora',
        '« Je lui explique ce qui circule. On gardera le contenu privé. »', 'aide-bureau', 'express',
        {relationships: {ines: -1, alex: -1}, flags: ['adulte-informe']}),
      choice('aide-accord', 'Demander d’abord à Inès',
        '« Je lui propose de venir avec nous. Je veux lui laisser ce choix. »', 'aide-attente', 'pause',
        {relationships: {ines: 1}, flags: ['accord-demande']}),
    ],
  };
  nodes['aide-bureau'] = scene(
    'aide-bureau', 'Le cahier des rendez-vous',
    'La CPE pose son stylo. Sami raconte son geste, puis la transmission à un autre groupe. Elle lui demande de garder les éléments utiles pour un signalement, sans les repartager. Elle propose un entretien à Inès le lendemain.\n\nEn sortant, Sami lui écrit pour la prévenir. Inès répond : « J’aurais voulu que tu me demandes. » Le rendez-vous existe désormais. Inès pourra l’accepter ou le refuser.',
    'message-lendemain'
  );
  nodes['aide-attente'] = scene(
    'aide-attente', 'La réponse du soir',
    'À 18 h 12, Inès répond. Elle accepte de parler à Nora le lendemain, à condition que Sami les laisse d’abord seules. Il relit la dernière phrase. Il voulait aider, et l’aide commence par une place qu’il doit laisser à quelqu’un d’autre.\n\nAlex lui demande ce qu’il a raconté. Sami répond qu’il a parlé de la circulation de la capture. Alex ne renvoie pas la liste des contacts.',
    'message-lendemain'
  );

  nodes['message-lendemain'] = scene(
    'message-lendemain', 'Le lendemain, 8 h 05',
    'Sami reconnaît Inès au bout du couloir. Elle garde son manteau fermé malgré la chaleur. La journée d’hier tient dans son téléphone, et pourtant rien n’est tout à fait à la même place.',
    'couloir-seul',
    {nextWhen: [
      {when: {flags: ['adulte-informe']}, next: 'couloir-bureau'},
      {when: {flags: ['accord-demande']}, next: 'couloir-nora'},
      {when: {flags: ['preuve-conservee']}, next: 'couloir-preuve'},
      {when: {relationship: {character: 'alex', atLeast: 1}}, next: 'couloir-alex'},
    ]}
  );
  nodes['couloir-bureau'] = scene(
    'couloir-bureau', 'La porte du bureau',
    'La CPE vient chercher Inès discrètement. Inès décide d’entrer seule. Sami reste près de la fenêtre avec Nora. Alex les aperçoit et prend l’autre escalier.\n\nÀ la sortie, Inès dit qu’elle a pu demander de l’aide pour le signalement. Elle ajoute qu’elle ne veut plus découvrir les décisions de Sami après coup. Nora les laisse terminer leur échange.',
    'ines-seuil'
  );
  nodes['couloir-nora'] = scene(
    'couloir-nora', 'La place laissée libre',
    'Nora attend devant la salle vide. Inès lui fait signe. Sami commence à les suivre, puis s’arrête. Il avait promis de les laisser seules.\n\nDix minutes passent. Inès revient chercher son sac. « On va voir la CPE ensemble, dit-elle. Nora et moi. » Elle lui demande de rester disponible si elles ont besoin de précisions.',
    'ines-seuil'
  );
  nodes['couloir-preuve'] = scene(
    'couloir-preuve', 'Deux lignes qui comptent',
    'Le troisième destinataire prétend maintenant qu’il n’a jamais parlé de republier la capture. Sami retrouve les deux lignes conservées la veille. Il les montre à Inès sur son propre téléphone, sans les envoyer ailleurs.\n\nInès remarque le prénom d’Alex. Elle demande pourquoi Sami l’avait gardé pour lui. La preuve l’aide à comprendre la menace. Elle lui apprend aussi qu’il lui manquait une partie de l’histoire.',
    'ines-seuil'
  );
  nodes['couloir-alex'] = scene(
    'couloir-alex', 'Quelqu’un l’attend',
    'Alex attend Sami devant le casier. Il a obtenu une dernière confirmation de suppression. Sami veut l’envoyer tout de suite à Inès. Alex lui demande de masquer son nom.\n\nSami s’arrête devant l’écran. Cette demande ressemble beaucoup à celle de la veille. Inès arrive avant qu’il ait décidé. Alex lui dit seulement bonjour, puis attend que Sami parle.',
    'ines-seuil'
  );
  nodes['couloir-seul'] = scene(
    'couloir-seul', 'Un message sans réponse',
    'Le message envoyé à Alex affiche toujours « vu ». Sami n’a ni la liste complète des destinataires ni de confirmation de suppression. Au casier, Alex lui adresse un signe rapide et rejoint d’autres élèves.\n\nInès demande ce qui a été retiré. Sami doit lui répondre qu’il ne sait pas. Il lui explique ce qu’il a essayé, en séparant les demandes envoyées des réponses qu’il a réellement reçues.',
    'ines-seuil'
  );

  nodes['ines-seuil'] = scene(
    'ines-seuil', 'Ce qu’elle garde pour elle',
    'Inès regarde vers la salle de cours. « Je ne veux plus parler au milieu du couloir. » Sami se décale pour la laisser passer. Elle lui demande de lui écrire seulement s’il reçoit une confirmation de suppression.\n\nIl a des choses à expliquer. Elle choisit de ne pas les entendre maintenant.',
    'ines-distance',
    {nextWhen: [{when: {relationship: {character: 'ines', atLeast: 1}}, next: 'ines-ecoute'}]}
  );
  // The gateway carries no dialogue, so only the selected relationship scene is read.
  nodes['ines-seuil'].text = 'Inès attend que les élèves autour d’eux aient rejoint leur salle. Sami s’apprête à lui demander ce qu’elle veut faire maintenant.';
  nodes['ines-ecoute'] = scene(
    'ines-ecoute', 'Une question de plus',
    'Inès reste près du casier. Elle raconte à Sami une question qu’on lui a posée dans le bus, à propos de sa famille. Il ne l’avait pas entendue hier.\n\nElle lui dit ce qu’elle veut faire du groupe pour l’instant. Puis elle attend sa réponse. Lui expliquer tout cela lui coûte encore. Sami garde le téléphone dans sa poche. Il a peur qu’un regard sur l’écran suffise à interrompre ce qu’elle essaie de lui dire.',
    'second-0',
    {nextByChoice: {exprimer: 'second-0', eviter: 'second-1', questionner: 'second-2'}}
  );
  nodes['ines-distance'] = scene(
    'ines-distance', 'Une conversation plus courte',
    'Inès garde la main sur la porte de son casier. « Je veux savoir ce qui a été supprimé. Pour le reste, je préfère en parler à quelqu’un d’autre. »\n\nSami ravale la phrase qu’il avait préparée. Il peut encore agir, mais cette fois Inès ne lui confie pas ce qui lui est arrivé dans le bus. Il devra accepter de ne pas tout savoir pour l’aider.',
    'second-0',
    {nextByChoice: {exprimer: 'second-0', eviter: 'second-1', questionner: 'second-2'}}
  );

  const responses: Record<string, string> = {
    'second-0': 'Inès confirme qu’elle ne veut plus revenir dans le groupe pour l’instant. Sami peut agir sur ce qui circule, lui laisser du temps ou reconnaître sa responsabilité devant les autres.',
    'second-1': 'Sami sait maintenant que la capture ne disparaîtra pas parce qu’il attend. Inès lui a dit ce qu’elle voulait bien entendre aujourd’hui. Que décide-t-il de faire ?',
    'second-2': 'Inès a posé ses limites. Sami peut les reconnaître, lui laisser de la distance ou continuer les demandes de retrait. Quelle suite donne-t-il à cette conversation ?',
  };
  for (const [id, text] of Object.entries(responses)) nodes[id] = {...nodes[id], text};

  const echoes: NarrativeVariation[] = [
    {when: {flags: ['adulte-informe']}, afterword: 'Après les cours, Nora lui confirme que le suivi a commencé. Alex reste distant. Inès sait désormais à qui demander de l’aide, même les jours où elle ne veut pas parler à Sami.'},
    {when: {flags: ['accord-demande']}, afterword: 'Sami croise Nora et Inès devant le bureau. Elles lui disent qu’elles ont obtenu un rendez-vous de suivi. Il ne leur demande pas de lui raconter toute la conversation.'},
    {when: {flags: ['preuve-conservee']}, afterword: 'Les deux lignes conservées restent dans le téléphone de Sami. Il demande à Inès ce qu’elle souhaite en faire. Alex, lui, attend de savoir à qui son nom a été montré.'},
    {when: {relationship: {character: 'alex', atLeast: 1}}, afterword: 'Alex envoie une dernière confirmation à Sami. Ils ont pu agir ensemble. La question de ce que Sami a promis de taire reviendra dans leur prochaine conversation.'},
    {when: {}, afterword: 'Le message à Alex reste sans réponse. Sami sait ce qu’il a dit à Inès, mais il ignore encore jusqu’où la capture a circulé. Leur prochaine rencontre commencera avec cette incertitude.'},
  ];
  for (const [id, node] of Object.entries(nodes)) {
    if (node.kind === 'ending') nodes[id] = {...node, variations: echoes};
  }
  const illustrations = [
    {ids: ['capture-source', 'capture-secret', 'source-face', 'face-choix', 'face-delai', 'face-rupture', 'source-pacte', 'pacte-choix'], image: '/assets/message-source.webp', imageAlt: 'Sami et Alex échangent à l’écart, près du gymnase.'},
    {ids: ['aide-bureau'], image: '/assets/message-bureau.webp', imageAlt: 'Sami et Nora parlent avec la conseillère dans son bureau.'},
    {ids: ['ines-seuil', 'ines-ecoute', 'ines-distance'], image: '/assets/message-couloir.webp', imageAlt: 'Sami et Inès se retrouvent près des casiers du collège.'},
  ];
  for (const illustration of illustrations) {
    for (const id of illustration.ids) {
      if (nodes[id]) nodes[id] = {...nodes[id], image: illustration.image, imageAlt: illustration.imageAlt};
    }
  }
  return {...episode, nodes, characters: {ines: 'Inès', alex: 'Alex'}, duration: '20–30 minutes'};
}
