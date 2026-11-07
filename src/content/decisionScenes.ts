type DecisionScenes = {
  before: string;
  reactions: [string, string, string];
};

// Each reaction follows the corresponding spoken choice in the episode draft.
export const decisionScenes: Record<string, DecisionScenes> = {
  'le-message-de-trop': {
    before: 'Sami écrit « Je voulais juste… » puis efface ces trois mots. Inès est toujours en ligne. Pour une fois, il aimerait pouvoir lui répondre sans que le reste de la classe s’en mêle.',
    reactions: [
      'Sous ses excuses, Sami voit apparaître une photo. C’est sa capture, recadrée par quelqu’un d’autre. Cette version-là, il ne peut même pas la supprimer.',
      'Les trois points disparaissent. Une minute après, Inès lui renvoie son propre « ça va finir par passer ». Le lire de sa main à elle lui fait un drôle d’effet.',
      'Inès commence par un détail auquel il n’avait pas pensé. Ce matin, quelqu’un lui a demandé des nouvelles de sa famille. Elle n’avait jamais parlé à ce garçon.',
    ],
  },
  invisible: {
    before: 'Lina tire la chaise à côté d’elle avec le pied. Le geste de tous les midis. Maya tient encore son plateau à deux mains. Cette fois, elle attend que Lina lève les yeux.',
    reactions: [
      'Lina cesse de faire tourner sa fourchette. Elle commence un « Mais tu… », puis se reprend. Maya est toujours debout devant la chaise qu’on lui a gardée.',
      'Maya prend son plateau. Derrière elle, les conversations reprennent. Une chaise racle le sol et Lina la rejoint près du bac à couverts.',
      'Lina ouvre la conversation où la sortie s’est décidée. Elle tend le téléphone à Maya, puis voit ce que Maya voit : son prénom n’apparaît nulle part.',
    ],
  },
  'juste-pour-rire': {
    before: 'Sarah approche, le pouce encore posé sur son écran. Nolan entend un rire derrière la porte. Il aimerait pouvoir entrer en classe sans avoir à rire de sa propre chute une deuxième fois.',
    reactions: [
      'Sarah baisse son téléphone. Nolan peut enfin la regarder sans voir, entre eux, son propre visage arrêté sur l’image.',
      'Nolan hausse les épaules comme il le fait sur scène. Cette fois, Sarah ne rit pas. Elle attend la suite, et le sourire qu’il tenait lui échappe.',
      'Sarah cherche le nom de la personne qui lui a envoyé la vidéo. Nolan voit défiler toute une liste. Sa question à lui portait sur un seul geste : le sien.',
    ],
  },
  'dire-non': {
    before: 'Adam lui tend son téléphone, caméra ouverte. Dans le reflet, Jules voit le garçon qu’on veut filmer. Il est occupé à défaire un nœud dans son lacet. Il n’a rien remarqué.',
    reactions: [
      'Jules garde les mains dans les poches. Adam reste le bras tendu une seconde de trop. Quelqu’un au fond demande ce qu’ils attendent.',
      'Jules prend le téléphone et cadre le sol. Sur l’écran, il n’y a que leurs chaussures. Adam se penche pour voir pourquoi rien ne se passe.',
      'Adam tourne la tête vers les autres avant de répondre. Jules baisse la voix. Il aimerait entendre ce que son ami dirait si personne ne les regardait.',
    ],
  },
  'un-pas-vers-toi': {
    before: 'Ana ouvre leur conversation. Au-dessus du message de Yasmine, il y a encore une photo floue de leurs baskets dans le bus. Elle avait oublié cette journée. Son doigt s’arrête sur le clavier.',
    reactions: [
      'Le message de Yasmine arrive en deux morceaux. D’abord « moi aussi ». Puis, assez longtemps après pour qu’Ana ait posé son téléphone, une deuxième phrase.',
      'Ana s’attend à une avalanche de questions. Il n’en vient aucune. Yasmine lui répond en une ligne, et pour une fois Ana peut laisser son téléphone sur la table.',
      'Yasmine ressort une phrase de leur dispute. Ana se rappelle l’avoir dite dans la cour, assez fort pour que les autres entendent. Elle ignorait que cette phrase-là était restée.',
    ],
  },
};
