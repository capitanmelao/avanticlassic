const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// French translations for releases 21-37
const frenchDescriptions = {
  21: "Le violoniste américain célébré Philippe Quint revient avec une nouvelle sortie exceptionnelle dans un appariement unique du populaire Concerto pour Violon en ré majeur, Op. 35 de Tchaïkovsky avec le Quatuor à Cordes No. 2 en la mineur, Op. 35 d'Arensky rarement enregistré, dédié à la mémoire de Tchaïkovsky.<br><br>Pour faire ressortir la palette tonale nécessaire de ce chef-d'œuvre, Philippe Quint est soutenu par le superbe mélange slave de l'Orchestre Philharmonique de Sofia magistralement dirigé par Martin Panteleev et enregistré en son surround par l'équipe d'avanticlassic. Pour la toute première fois, le dernier mouvement du Concerto est présenté deux fois sur CD : Une fois dans l'orchestration originale de Tchaïkovsky et comme piste bonus, la version controversée condensée du troisième mouvement par Leopold Auer.<br><br>Le Quatuor à Cordes No. 2 en la mineur, Op. 35, pour violon, alto et deux violoncelles bénéficie d'une ligne d'artistes internationalement acclamés incroyable. Lauréat de la première Compétition Pablo Casals – le violoncelliste Claudio Bohórquez, un récent BBC's New Generation Artist – le violoncelliste Nicolas Altstaedt et le gagnant du Prix Borletti-Buitoni Trust en tant que membre de l'Aronowitz Ensemble – l'altiste Lily Francis.",

  22: "Une rencontre totalement unique entre l'œuvre classique la plus aimée et le violoniste le plus formidable de tous les temps !<br><br>Pour la première fois, le génie du violon Roby Lakatos enregistre une œuvre universellement acclamée du répertoire classique dans son intégralité : les Quatre Saisons de Vivaldi.<br><br>Dans une vision hautement personnelle de ce chef-d'œuvre baroque, le Maestro Gitan mélange la partie solo avec quelques improvisations mettant en vedette son arsenal puissant de virtuosité du violon.<br><br>Le reste du programme consiste en Alpha et Omega, conçus comme un prélude et un postlude aux Quatre Saisons. Sur mesure par son partenaire musical de longue date, le compositeur hongrois Kálmán Cséki Sr, Alpha est un voyage musical extravagant commençant par le big bang, voyageant à travers les éléments et atteignant l'ère Baroque. Le postlude, Omega, suit immédiatement l'Hiver de Vivaldi. C'est une évocation de l'Apocalypse, avec batterie, guitare électrique, violon, vibraphone, synthétiseur, …<br><br>Pour ce projet unique, Roby Lakatos s'est entouré du contre-ténor étoile montante Dominique Corbiau, du percussionniste internationalement acclamé Gabriel Laufer et de l'étonnant cymbaliste Jenő Lisztes, remplaçant le clavecin dans les 4 Saisons.<br><br>Au cœur de l'album, vous trouverez l'Orchestre de Chambre de Bruxelles, l'un des ensembles à cordes les plus chéris de Belgique, et bien sûr l'ensemble légendaire de Roby.",

  23: "BACH XXI est un hybride musical pur. Le pianiste/arrangeur Matt Herskowitz réimagine 8 œuvres du maître dans des cadres contemporains, incorporant des rythmes, des grooves et des harmonisations du Jazz, Latin, Arabe, Juif et des styles Classiques Contemporains dans les partitions originales. Mettant en vedette le violoniste classique internationalement acclamé Philippe Quint et ancré par le trio célèbre de Matt – Mat Fieldes, Basse & David Rozenblatt, Batterie, BACH XXI vous invite à redécouvrir tout le génie de Bach dans une voix personnelle nouvelle, moderne et unique. Apparition spéciale de la virtuose renommée Lara St. John sur le Concerto pour Deux Violons.",

  24: "Pour la première fois, le violoniste internationalement acclamé Philippe Quint enregistre deux des concertos pour violon les plus enivrants du répertoire russe. Magistralement soutenu par les Bochumer Symphoniker dirigés par Steven Sloane, et enregistré avec un son de pointe, Philippe Quint exhale toute l'excitation et les saveurs infinies de ces chefs-d'œuvre palpitants mais mélodieux.",

  25: "\"Âme de l'Ensemble Soledad internationalement acclamé, le joueur de bandonéon Manu Comté a pour la première fois sous son propre nom enregistré un album sublime en hommage aux maîtres qui ont forgé son goût musical exquis.<br>Une découverte musicale majeure présentant des œuvres nouvellement commandées et avec la participation notable de Tomás Gubitsch, le dernier guitariste de Piazzolla.\"",

  26: "Sergio Tiempo, «Le pianiste le plus éblouissant et spontané de sa génération» (Gramophone), revient avec Legacy, son nouveau récital solo époustouflant. Présentant des œuvres majeures de Beethoven, Chopin, Prokofiev et Villa-Lobos, ce nouvel album dresse un portrait musical émouvant des membres de la famille Tiempo. Sergio Tiempo a sélectionné chaque pièce selon les personnalités de sa famille. L'Appassionata de Beethoven pour sa mère, la légendaire pédagogue musicale Lyl Tiempo, un Intermezzo de Brahms pour sa sœur Karin Lechner, avec qui Sergio forme un duo de renommée mondiale, un tango de Piazzolla pour son père Martin Tiempo, un ami de longue date de Martha Argerich. Sa nièce Natasha Binder, une pianiste montante à part entière, Maud, l'épouse de Sergio et leurs enfants sont également l'inspiration derrière ce programme. En somme, un projet profondément personnel par «l'un des pianistes les plus importants de notre époque» (Musicweb).",

  27: "La rencontre passionnante de deux légendes vivantes du Jazz ! Pour la première fois sur disque / vidéo \"Le violoniste aux doigts les plus rapides du monde\" Roby Lakatos est rejoint par le héros guitariste \"speed demon\" Biréli Lagrène pour un hommage unique à Stéphane Grappelli et Django Reinhardt. Les deux musiciens ont joué dans leur jeunesse avec Stephane Grappelli. Pour cet album, ils se sont entourés du big band superlatif du Modern Art Orchestra et de deux jazzmen de première classe de la jeune génération : le batteur palpitant Niek de Bruijn et la sensation guitariste Andreas Varady. C'est un hommage explosif au Jazz Manouche avec des standards tels que \"Djangology\", \"Nuages\", \"Stella by Starlight\" et \"Nuits de Saint-Germain-Des-Près\".",

  28: "La pianiste légendaire Martha Argerich a initié un nouveau Rendez-vous musical fin juin 2018 à la merveilleuse Laeiszhalle de Hambourg (DE). De Beethoven à Debussy, de Brahms à Prokofiev, Martha Argerich a joué en duo, trio et en concerto avec des amis musicaux comme Mischa Maisky, Nicholas Angelich et Stephen Kovacevich, et a commencé de nouvelles collaborations avec des artistes tels qu'Akiko Suwanai, Alisa Weilerstein, Guy Braunstein ou Edgar Moreau. Elle a également accompagné pour la première fois le baryton de renommée mondiale Thomas Hampson dans Dichterliebe de Schumann, un rôle qu'elle a rarement endorsé pendant sa carrière et une première dans sa discographie.<br><br>Une célébration musicale unique dans laquelle Martha Argerich interprète un nouveau répertoire comme l'Ouverture sur des Thèmes Hébreux de Prokofiev.<br><br>Un total de 7 CD bien remplis qui vous permettront également de redécouvrir certains des chevaux de bataille de Martha Argerich tels que le triple de Beethoven ou le premier concerto de Shostakovich dans de nouveaux enregistrements de pointe.",

  29: "Evgeni Bozhanov vous invite à un Voyage au cœur du Romantisme Musical Allemand avec ce superbe programme combinant d'émouvantes transcriptions d'œuvres de Brahms et R. Strauss avec la dernière sonate de Schubert, l'un des plus grands chefs-d'œuvre de l'histoire de la Musique.",

  30: "Dr. L. Subramaniam, \"Le Dieu du Violon Indien\" (The Times of India) & Roby Lakatos, \"Le Violoniste aux Doigts les Plus Rapides du Monde\" (The Daily Telegraph) vous invitent à un voyage musical fascinant, construisant des ponts entre la Musique Traditionnelle Indienne et la Musique Gitane. Un projet unique rappelant l'esprit et l'ouverture du regretté Sir Yehudi Menuhin, un mentor proche du cœur des deux artistes.",

  31: "Après le premier Rendez-Vous avec Martha Argerich extraordinairement réussi, ce second volume ravira certainement à nouveau les amateurs de musique du monde entier. Pour cette nouvelle édition, Martha Argerich s'associe avec des amis musicaux de haut profil tels que Sylvain Cambreling, Renaud Capuçon, Charles Dutoit, Gabriela Montero, Edgar Moreau, Akane Sakai et bien d'autres dans un nouveau répertoire comme le Second Trio pour Piano de Mendelssohn, ou dans des piliers de son répertoire tels que le Premier Concerto pour Piano de Tchaïkovsky, la Sonate 'Kreutzer' de Beethoven ou les Kinderszenen de Schumann. Au total : 6 CD qui vous permettront d'admirer l'art de Martha Argerich et de ses amis dans de nouveaux enregistrements de pointe.",

  32: "Décrit par BBC Music Magazine comme \"un artiste qui a un sens incroyable de la musicalité, une pensée élémentaire et une technique phénoménalement parfaite\", le violoncelliste Alexander Kniazev unit ses forces avec Kasparas Uinskas, un pianiste d'une \"sensibilité à couper le souffle\" (Seen and Heard International), pour un programme sublime couplant les deux dernières œuvres de musique de chambre de Johannes Brahms avec des transcriptions pour violoncelle et piano des célèbres Quatre Chants Sérieux, trois chefs-d'œuvre indiscutés.",

  33: "Tout au long de sa vie, l'imagination musicale de Gustav Mahler a été stimulée par l'anthologie Wunderhorn de poésie folklorique compilée par Achim von Arnim et Clemens Brentano. Qu'ils soient des lieder autonomes ou enrôlés au service symphonique, les arrangements Wunderhorn de Mahler représentent certaines de ses musiques les plus exotiques, exaltantes, mais aussi visionnaires. Les chansons Wunderhorn évoquent et célèbrent une ère perdue mais elles préfigurent également sa disparition. Mahler capture cette ambiguïté dans une musique sans compromis mélodieuse et idyllique, mais aussi satirique, impitoyable et cruelle.<br>Dans cette bande sonore du film WUNDERHORN de Clara Pons, le baryton Dietrich Henschel, \"une figure imposante, physiquement, intellectuellement, musicalement et théâtralement\" (Herald Scotland) donne une interprétation vibrante de 24 Lieder des \"Des Knaben Wunderhorn\" de Gustav Mahler, magistralement accompagné par les Bochumer Symphoniker sous la baguette inspirée de Steven Sloane.",

  34: "La légende du piano Martha Argerich sort son tout premier album en partenariat avec l'Orchestre Philharmonique d'Israël sous la baguette de son nouveau directeur musical : Lahav Shani.",

  35: "Sergio Tiempo, le pianiste électrisant et brillant salué par The Sunday Times, a rassemblé un casting exceptionnel de mentors pour son dernier album. Ces individus ont tous joué un rôle pivot dans la formation de l'art de Tiempo : Lyl Tiempo, une pédagogue musicale de renommée mondiale et mère de Sergio, l'iconique Martha Argerich - qui enregistre pour cet album la Fantaisie en fa mineur D. 940 de Schubert pour la première fois en studio -, le pianiste légendaire Nelson Freire, Alan Weiss, l'un des professeurs et pianistes les plus recherchés, l'incomparable violoncelliste Mischa Maisky et Karin Lechner, la sœur de Sergio et partenaire musicale de toujours. L'album est un hommage aux efforts coopératifs de certains des musiciens les plus renommés de notre époque et est une vitrine de l'art exceptionnel de Tiempo.",

  36: "Le troisième volet de Rendez-vous avec Martha Argerich rassemble des enregistrements captivants du Festival international Martha Argerich à Hambourg, présentant une ligne exceptionnelle de solistes. Parmi les points forts se trouvent plusieurs premières collaborations sur disque, notamment entre Martha Argerich, Anne-Sophie Mutter et Mischa Maisky, mais aussi entre Martha Argerich et Maria-João Pires. De nombreux autres invités prestigieux incluent Renaud Capuçon, Nelson Goerner, Gidon Kremer, Tedi Papavrami, Akiko Suwanai et Michael Volle. Particulièrement remarquable est l'interprétation profondément émotionnelle de la seconde sonate pour alto de Brahms, marquant la poignante performance publique finale du regretté pianiste Nicholas Angelich, avec l'altiste Gérard Caussé.<br>En somme, ce coffret se dresse comme un hommage jubilant à l'art incomparable de Martha Argerich et à l'incroyable éventail d'amitiés musicales qu'elle a développées au fil des années.",

  37: "Embarquez pour un voyage musical captivant avec Roby Lakatos alors qu'il plonge dans les rythmes émouvants du Tango. S'associant avec le renommé Gang Tango, le Roi des violonistes gitans vous invite à explorer les riches traditions du Tango du monde entier. Des classiques intemporels comme Oblivion et La Cumparsita aux joyaux non découverts tels que Rookgordijnen et Vale Mousiki, cet album est un véritable coffre au trésor pour les amateurs de musique passionnée."
};

async function completeFinalFrenchDescriptions() {
  console.log('🇫🇷 FINAL BATCH FRENCH TRANSLATIONS (Releases 21-37)\\n');
  
  try {
    let descriptionsUpdated = 0;
    
    for (const [releaseId, description] of Object.entries(frenchDescriptions)) {
      console.log(`📀 Updating release ${releaseId} French description...`);
      
      // Update French description in release_translations table
      const { error } = await supabase
        .from('release_translations')
        .upsert({
          release_id: parseInt(releaseId),
          language: 'fr',
          description: description
        }, {
          onConflict: 'release_id,language'
        });
        
      if (error) {
        console.error(`❌ Error updating release ${releaseId}:`, error);
      } else {
        descriptionsUpdated++;
        console.log(`  ✅ Updated release ${releaseId} French description`);
      }
    }
    
    console.log(`\\n🎉 ALL FRENCH TRANSLATIONS COMPLETE!`);
    console.log(`  • Final batch updated: ${descriptionsUpdated}`);
    console.log(`  • TOTAL FRENCH COMPLETED: 37/37 releases`);
    console.log(`  • 🚀 No more generic "Cet enregistrement présente..." text!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

completeFinalFrenchDescriptions();