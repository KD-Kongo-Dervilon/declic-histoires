import type {Episode,NarrativeNode,Choice} from '../types';

/** Épisode 01 : continuité chronologique garantie, dialogues et conséquences vérifiables.
 * L'ordre est lundi (atelier) → lundi soir (maison) → mardi 16 h 42 (photo après la séance) → mercredi matin (banc) → conséquences. */
const C=(id:string,title:string,words:string,next:string,intention:Choice['intention'],r:number,t:number,e:number):Choice=>({id,title,words,next,intention,impact:{relation:r,tension:t,expression:e}});
const S=(id:string,chapter:string,title:string,text:string,next:string,opts:Partial<NarrativeNode>={}):NarrativeNode=>({id,kind:'scene',phase:chapter,eyebrow:`CHAPITRE ${chapter} · CE QU’ON N’A PAS DIT`,title,text,next,...opts});
const D=(id:string,chapter:string,title:string,text:string,choices:Choice[]):NarrativeNode=>({id,kind:'decision',phase:chapter,eyebrow:`CHAPITRE ${chapter} · À TOI DE CHOISIR`,title,text,choices});
const E=(id:string,title:string,text:string,perspective:string,takeaway:string):NarrativeNode=>({id,kind:'ending',phase:'05',eyebrow:'UNE FIN POSSIBLE',title,text,perspective,takeaway});

export function expandEpisode01(ep:Episode):Episode {
 if(ep.id!=='ce-qu-on-na-pas-dit')return ep;
 const n:Record<string,NarrativeNode>={};
 // ACTE I — Ce que cette amitié signifie, avant l'incident.
 n['ouverture']=S('ouverture','01','Le lundi où tout allait encore bien',
  'Léa et Noa sont amis depuis trois ans. Chaque lundi, ils se retrouvent à l’atelier de dessin du collège. Ils inventent ensemble une ville imaginaire dans un carnet bleu. Aujourd’hui, Noa a écrit sur la dernière page : « Mercredi, on imagine la suite ? »','choix-atelier',
  {speaker:'NOA',dialogue:'« Cette fois, on construit la grande bibliothèque de notre ville. Tu viens mercredi ? »'});
 n['choix-atelier']=D('choix-atelier','01','Tu lui réponds quoi ?',
  'Léa aimerait venir. Mais elle sait déjà que la semaine sera difficile chez elle.',[
   C('atelier-promettre','Promettre de venir','« Bien sûr ! On finit notre ville mercredi. »','atelier-suite-promettre','express',1,0,1),
   C('atelier-prevenir','Prévenir qu’elle est épuisée','« Je vais essayer, mais j’ai beaucoup à faire chez moi. »','atelier-suite-prevenir','ask',1,-1,2),
   C('atelier-esquiver','Éviter de s’engager','« On verra. »','atelier-suite-esquiver','avoid',-1,1,-1)
  ]);
 n['atelier-suite-promettre']=S('atelier-suite-promettre','01','Une promesse trop rapide',
  'Noa sourit et dessine une petite étoile à côté de mercredi. Léa sourit aussi. Elle n’a pas menti : elle veut vraiment être là. Elle n’a simplement pas encore vérifié si elle le pourra.','soir-maison');
 n['atelier-suite-prevenir']=S('atelier-suite-prevenir','01','Une phrase qu’il entend à moitié',
  'Noa relève les yeux. « Tu me diras », répond-il. Il paraît détendu, comme si rien ne pouvait menacer leur rituel. Léa aimerait être aussi sûre que lui.','soir-maison');
 n['atelier-suite-esquiver']=S('atelier-suite-esquiver','01','La réponse qui reste en suspens',
  '« On verra », répète Noa. Il ferme le carnet sans insister. Léa remarque qu’il est un peu déçu, mais la sonnerie retentit avant qu’elle trouve quoi ajouter.','soir-maison');
 n['soir-maison']=S('soir-maison','02','Le lundi soir, à la maison',
  'À 19 h 40, Léa aide son petit frère à finir ses devoirs. Leur mère termine tard. La soupe chauffe et ses propres exercices attendent encore. Le téléphone s’allume : Noa demande si elle sera là mercredi.','choix-soir',
  {speaker:'PETIT FRÈRE',dialogue:'« Léa, tu peux m’aider encore une minute ? »'});
 n['choix-soir']=D('choix-soir','02','Léa aimerait être comprise',
  'Elle a envie de dire qu’elle est fatiguée. Mais parler de sa journée lui semble presque aussi difficile que la terminer.',[
   C('soir-clair','Expliquer ce qui se passe','« J’aimerais venir, mais je garde mon frère le soir. Je suis épuisée. »','soir-suite-clair','express',2,-1,2),
   C('soir-vague','Répondre sans expliquer','« Je suis crevée cette semaine. J’ai besoin de souffler. »','soir-suite-vague','pause',0,1,0),
   C('soir-muet','Attendre pour répondre','Tu poses le téléphone et retournes aider ton frère.','soir-suite-muet','avoid',-1,1,-1)
  ]);
 n['soir-suite-clair']=S('soir-suite-clair','02','Il propose son aide',
  'Noa répond : « Je peux te garder les feuilles de l’atelier, et on se voit quand tu peux. » Léa se sent un peu moins seule. Elle ne sait pas encore qu’une inscription aura lieu le lendemain.','mardi-photo');
 n['soir-suite-vague']=S('soir-suite-vague','02','Un cœur qui ne répond pas à tout',
  'Noa répond avec un cœur, puis : « D’accord, repose-toi. » Léa pense qu’il a compris qu’elle veut juste faire une pause. De son côté, Noa pense qu’elle ne souhaite pas venir cette semaine.','mardi-photo');
 n['soir-suite-muet']=S('soir-suite-muet','02','Le message non lu',
  'Noa attend, puis écrit : « Pas de souci si tu veux souffler. » Léa ne voit cette phrase que tard dans la soirée. Elle décide de répondre le matin, quand elle aura plus d’énergie.','mardi-photo');
 // ACTE II — Le fait observable, puis le choix du joueur : pas de conclusion hâtive.
 n['mardi-photo']=S('mardi-photo','03','Mardi, 16 h 42',
  'À la sortie des cours, Léa découvre la photo de la séance supplémentaire du mardi. Noa pose avec quatre élèves. Sur la table, elle reconnaît le carton de crayons qu’ils avaient préparé ensemble. Noa a même apporté leur carnet bleu. Personne ne l’a prévenue. Son téléphone vibre : « On se parle au banc demain matin ? »','choix-photo',
  {speaker:'LÉA · PENSÉE',dialogue:'« Il y est allé sans me le dire… pourquoi ? »'});
 n['choix-photo']=D('choix-photo','03','Ton téléphone attend une réponse',
  'Léa a mal. Elle ne sait pas encore si Noa l’a remplacée ou s’il y a une autre explication. Que fais-tu ?',[
   C('photo-direct','Demander directement à Noa','« J’ai vu la photo. Je suis surprise. On peut en parler au banc ? »','photo-suite-direct','express',2,-1,2),
   C('photo-camille','Demander à Camille','Tu veux savoir de quoi il s’agit avant de voir Noa.','photo-suite-camille','ask',0,0,1),
   C('photo-ignore','Ne pas répondre','Tu ranges ton téléphone et files en cours.','photo-suite-ignore','avoid',-1,2,-1)
  ]);
 n['photo-suite-direct']=S('photo-suite-direct','03','La réponse de Noa',
  'Noa répond aussitôt : « Oui. Je voulais justement te raconter. » Léa n’a pas la réponse, mais elle sait désormais qu’il accepte la conversation. Elle attend la pause avec un nœud dans le ventre.','banc-arrivee');
 n['photo-suite-camille']=S('photo-suite-camille','03','Ce que Camille sait vraiment',
  'Camille explique : « Le professeur a ajouté une séance mardi. Noa était libre, alors il a aidé. Je ne sais pas pourquoi il ne t’a pas écrit. » Léa comprend qu’elle a un fait, mais toujours pas ses intentions.','banc-arrivee');
 n['photo-suite-ignore']=S('photo-suite-ignore','03','Un silence qui inquiète',
  'Noa envoie un deuxième message : « Tout va bien ? » Léa le laisse sans réponse. Cela lui donne quelques minutes de répit, mais Noa arrivera au banc sans comprendre son silence.','banc-arrivee');
 // Reactions to earlier choices at the *same* rendezvous.
 n['banc-arrivee']=S('banc-arrivee','04','Mercredi matin, au banc',
  'La cour se remplit peu à peu. Noa attend près du banc où ils relisent d’habitude leur carnet. Il tient une feuille de l’atelier. Léa s’arrête à deux pas. La veille, ils ne s’étaient pas parlé depuis la photographie. Maintenant, aucun des deux ne peut faire semblant.','banc-echo',
  {nextByChoice:{'photo-direct':'echo-direct','photo-camille':'echo-camille','photo-ignore':'echo-ignore'}});
 n['banc-echo']=S('banc-echo','04','Une seconde de trop',
  'Léa respire. Le garçon devant elle est toujours son ami. Cela ne rend pas sa déception moins réelle.','choix-banc',
  {nextByChoice:{'atelier-promettre':'banc-promesse','atelier-prevenir':'banc-prevenu','atelier-esquiver':'banc-flou'}});
 n['banc-promesse']=S('banc-promesse','04','Une promesse restée en tête',
  '« Lundi, tu m’avais dit oui pour mercredi », rappelle Noa. Léa se souvient qu’elle avait répondu trop vite. Cela explique sa confusion, mais pas pourquoi il ne l’a pas prévenue de la séance de mardi.','banc-contexte');
 n['banc-prevenu']=S('banc-prevenu','04','Il se rappelle ton avertissement',
  '« Tu m’avais dit que tu étais épuisée », rappelle Noa. Léa constate qu’il l’avait écoutée au moins un peu. Mais il n’avait pas vérifié si elle souhaitait manquer cette séance supplémentaire.','banc-contexte');
 n['banc-flou']=S('banc-flou','04','La phrase qu’il n’avait pas comprise',
  '« Lundi, tu m’as dit on verra. J’ai cru que tu n’étais plus motivée », explique Noa. Léa se souvient de sa réponse hésitante. Elle n’avait pas voulu renoncer au projet, mais Noa n’avait pas posé la question.','banc-contexte');
 n['echo-direct']=S('echo-direct','04','Il sait que tu as des questions',
  'Noa ne sourit pas comme d’habitude. « J’ai vu ton message, dit-il. Je n’aurais pas dû te laisser découvrir la photo comme ça. » Léa remarque qu’il ne cherche pas à faire diversion.','banc-echo');
 n['echo-camille']=S('echo-camille','04','La feuille qu’il apporte',
  'Noa montre la feuille. « Le prof m’a proposé de venir mardi en renfort. Je voulais t’expliquer. » Léa repense à ce que Camille a dit. Les informations concordent, mais il reste à parler de leur promesse.','banc-echo');
 n['echo-ignore']=S('echo-ignore','04','Noa a peur de l’avoir blessée',
  '« Tu ne répondais plus, dit Noa. J’ai cru que tu m’en voulais. » Léa entend de l’inquiétude dans sa voix. Leur conversation commence moins facilement, parce que chacun a passé la matinée à imaginer ce que pensait l’autre.','banc-echo');
 n['banc-contexte']=S('banc-contexte','04','Ce que le message de lundi a changé',
  'Léa demande pourquoi le carnet était sur la photo. Noa n’a pas réagi de la même façon selon ce qu’elle lui avait écrit lundi soir.','choix-banc',
  {nextByChoice:{'soir-clair':'banc-veille-clair','soir-vague':'banc-veille-vague','soir-muet':'banc-veille-muet'}});
 n['banc-veille-clair']=S('banc-veille-clair','04','Une attention, puis un oubli',
  '« Tu m’avais dit que tu aidais ton frère, répond Noa. J’avais pris les feuilles pour que tu ne rates rien. Le professeur m’a demandé de montrer notre dessin. J’ai dit oui sans t’en parler. » Il ouvre la pochette : il y a marqué leurs deux prénoms. Léa est soulagée qu’il ne l’ait pas effacée du projet, mais il a quand même utilisé leur travail sans demander.','choix-banc');
 n['banc-veille-vague']=S('banc-veille-vague','04','Un malentendu qui a fait boule de neige',
  '« Tu m’avais dit que tu avais besoin de souffler, répond Noa. J’ai cru que tu ne voulais plus participer cette semaine. Alors j’ai apporté notre carnet pour que le groupe avance. » Léa aperçoit son dessin dans la pochette. Noa a cru l’aider, mais une décision prise pour deux a été prise par un seul. Elle cherche comment le lui dire.','choix-banc');
 n['banc-veille-muet']=S('banc-veille-muet','04','Quelqu’un d’autre a tenu le crayon',
  '« Tu ne répondais pas, dit Noa. Le professeur avait besoin d’aide mardi. J’ai demandé à Camille de terminer la page qu’on avait commencée. » Il montre le dessin : une nouvelle fenêtre s’ouvre dans leur ville imaginaire, dessinée par quelqu’un d’autre. Léa sent la colère monter. Noa regarde la page à son tour. Il comprend soudain pourquoi ce n’était pas un détail.','choix-banc');
 n['choix-banc']=D('choix-banc','04','La conversation peut commencer',
  'Le professeur avait invité Noa à une séance de renfort. Noa raconte ce qu’il a cru comprendre lundi et pourquoi il a utilisé leur carnet sans prévenir Léa. Il ne l’a peut-être pas voulu, mais sa décision l’a blessée. Que lui répond-elle ?',[
   C('banc-dire','Dire ce qui l’a blessée','« Je n’ai pas voulu arrêter notre projet. Ça m’a fait mal de l’apprendre par une photo. »','reaction-dire','express',2,-1,2),
   C('banc-cacher','Faire comme si ça allait','« Ce n’est pas grave, oublie. »','reaction-cacher','avoid',-1,1,-2),
   C('banc-demander','Lui demander comment il a compris','« Qu’est-ce qui t’a fait penser que je voulais arrêter ? »','reaction-demander','ask',2,-1,1)
  ]);
 n['reaction-dire']=S('reaction-dire','04','Il comprend enfin ce qu’elle a vécu',
  'Noa baisse les yeux. « Tu as raison, j’aurais dû demander. » Léa voit qu’il est désolé. Pourtant, une excuse ne suffit pas à effacer les jours où elle s’est sentie exclue.','choix-fin-dire',
  {speaker:'NOA',dialogue:'« Je voulais te laisser souffler, pas t’écarter. »'});
 n['reaction-cacher']=S('reaction-cacher','04','Le sourire qui sonne faux',
  '« Tu dis ça, mais tu as l’air triste », répond Noa. Il serre la feuille dans ses mains. Léa aurait voulu éviter une scène, mais elle voit maintenant qu’ils repartiraient sans se comprendre.','choix-fin-cacher',
  {speaker:'NOA',dialogue:'« Si quelque chose te blesse, je préfère que tu me le dises. »'});
 n['reaction-demander']=S('reaction-demander','04','Deux versions de la même semaine',
  'Noa ressort son téléphone. Ensemble, ils relisent ce qu’ils se sont vraiment écrit lundi soir, sans inventer les mots de l’autre. Ils découvrent à quel moment leur compréhension a commencé à diverger.','choix-fin-demander',
  {speaker:'NOA',dialogue:'« Je croyais t’aider. Mais j’ai décidé à ta place. »'});
 n['choix-fin-dire']=D('choix-fin-dire','04','Qu’est-ce que Léa veut maintenant ?',
  'Noa semble prêt à écouter. Léa peut poser un besoin, laisser la colère parler ou prendre une pause.',[
   C('finchoix-clarifier','Dire ce dont elle a besoin','« La prochaine fois, demande-moi avant de décider pour nous deux. »','fin-clarifier','express',2,-1,2),
   C('finchoix-attaquer','L’accuser de l’avoir remplacée','« Tu t’en fiches de moi, de toute façon ! »','fin-attaquer','attack',-2,3,1),
   C('finchoix-pause','Demander du temps','« J’ai encore mal. On peut se reparler demain ? »','fin-pause','pause',1,-1,1)
  ]);
 n['choix-fin-cacher']=D('choix-fin-cacher','04','Le silence devient lourd',
  'Léa peut revenir sur sa première réponse, maintenir le silence ou proposer un moment plus calme.',[
   C('finchoix-oser','Revenir sur ses mots','« En fait, ce n’est pas rien. »','fin-oser','express',2,-1,2),
   C('finchoix-cacher','Faire semblant jusqu’au bout','« Vraiment, ça va. »','fin-cacher','avoid',-2,1,-2),
   C('finchoix-plus-tard','Fixer un autre rendez-vous','« Pas ici. Demain après les cours ? »','fin-plus-tard','pause',1,-1,1)
  ]);
 n['choix-fin-demander']=D('choix-fin-demander','04','Il manque encore quelque chose',
  'Léa comprend mieux son intention. Reste à savoir comment elle veut avancer.',[
   C('finchoix-curiosite','Éclaircir le malentendu','« On pourrait se demander la prochaine fois, plutôt que deviner ? »','fin-curiosite','ask',2,-1,2),
   C('finchoix-soupcon','Mettre son explication en doute','« Comment je peux savoir que tu dis vrai ? »','fin-soupcon','attack',-1,2,0),
   C('finchoix-reparer','Proposer une nouvelle règle','« On reprend le carnet et on décide à deux ? »','fin-reparer','repair',2,-1,2)
  ]);
 // All nine conclusions reflect a different choice and a concrete after-effect.
 n['fin-clarifier']=E('fin-clarifier','Une place pour chacun',
  'Le mercredi suivant, Noa attend Léa devant l’atelier. Il lui montre les dessins de mardi et lui demande ce qu’elle veut faire de leur ville imaginaire. Léa choisit de venir une heure. Elle ne se sent pas encore tout à fait rassurée, mais cette fois, la décision lui appartient.',
  'Noa a compris que vouloir protéger Léa ne lui donnait pas le droit de choisir à sa place.','Une demande précise permet de réparer davantage qu’un pardon lancé trop vite.');
 n['fin-attaquer']=E('fin-attaquer','Des mots qui restent',
  'Noa se redresse. « Ce n’est pas juste », répond-il. Il s’éloigne avant la sonnerie. Le soir, Léa regarde leur carnet sans l’ouvrir. Elle a toujours le droit d’être blessée. Mais elle se demande si son accusation parlait de ce que Noa avait fait, ou de ce qu’elle craignait de perdre.',
  'Noa a entendu une condamnation de son amitié plutôt qu’une demande de réparation.','La colère peut être légitime sans que toutes les paroles prononcées sous son effet soient justes.');
 n['fin-pause']=E('fin-pause','Demain, pas maintenant',
  'Léa quitte le banc. Noa ne la retient pas. Le soir, il lui envoie : « Demain, si tu veux. » Elle répond qu’elle sera là. Rien n’est réparé encore, mais ils ont choisi de ne pas se parler sous la pression.',
  'Noa accepte qu’une conversation importante ait besoin de temps.','Une pause claire peut protéger la relation plutôt que la rompre.');
 n['fin-oser']=E('fin-oser','Le courage de revenir',
  '« En fait, si, ça me fait quelque chose », murmure Léa. Noa s’assied près d’elle. Elle raconte les soirs difficiles à la maison et la photo découverte au réveil. Il écoute. À la sonnerie, ils n’ont pas tout réglé, mais ils marchent ensemble vers le bâtiment.',
  'Noa avait perçu une contradiction entre les paroles et le visage de Léa ; elle lui donne enfin une explication.','On peut corriger une première réponse et oser dire ce qui compte.');
 n['fin-cacher']=E('fin-cacher','La place vide',
  'Ils se séparent en promettant de s’écrire. Aucun n’envoie de message. Le mercredi suivant, Léa passe devant la salle de l’atelier sans entrer. Elle voit le carnet bleu dépasser de son sac. Garder le silence lui a évité un moment difficile, mais pas la solitude.',
  'Noa respecte la parole de Léa tout en sentant qu’il lui manque une partie de l’histoire.','Ne rien dire est aussi un choix, parfois avec des conséquences différées.');
 n['fin-plus-tard']=E('fin-plus-tard','Une conversation sans public',
  'Le lendemain, Léa retrouve Noa à la médiathèque. Elle lui dit que son silence de la veille ne signifiait pas qu’elle avait pardonné. Lui pose la feuille du nouvel atelier sur la table. Ils parlent doucement, sans la cour autour d’eux. Léa repart avec quelques réponses et une proposition qu’elle est libre d’accepter.',
  'Noa comprend que choisir un meilleur moment ne revient pas à ignorer la blessure.','Dire quand on reparlera est plus clair que laisser l’autre dans le doute.');
 n['fin-curiosite']=E('fin-curiosite','Une phrase, deux sens',
  'Léa et Noa relisent le message du lundi. Ils avaient compris deux choses différentes. « La prochaine fois, on demande ? » propose Léa. Il acquiesce. Le mercredi, ils reprennent leur dessin en commençant par se demander ce que chacun veut faire.',
  'Noa comprend que son interprétation ne valait pas une réponse explicite de son amie.','Une question peut corriger une supposition sans effacer la déception.');
 n['fin-soupcon']=E('fin-soupcon','La confiance à reconstruire',
  'Noa montre les messages du professeur. Léa n’est toujours pas sûre de pouvoir lui faire confiance. Elle accepte pourtant de dire ce qui l’aiderait : être prévenue, choisir ensemble, voir des actes. Ils ne se retrouvent pas mercredi. La suite dépendra de ce qu’ils feront, pas de ce qu’ils promettent.',
  'Noa se sent mis en cause mais réalise qu’il devra montrer qu’il sait consulter Léa.','Demander des comportements concrets aide davantage qu’exiger une preuve impossible.');
 n['fin-reparer']=E('fin-reparer','Une nouvelle page',
  'Noa sort le carnet bleu. Léa relit les dernières lignes. Ils écrivent une règle en première page : « On peut faire une pause. On ne décide pas à la place de l’autre. » Puis ils imaginent ensemble une nouvelle porte pour leur ville.',
  'Noa retrouve une façon de construire avec Léa, sans prétendre que la peine a disparu.','Une réparation réelle change les habitudes, pas seulement les mots.');
 return {...ep,age:'12–18 ans',duration:'12–18 minutes',start:'ouverture',nodes:n};
}
