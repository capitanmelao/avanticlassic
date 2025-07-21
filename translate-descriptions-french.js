const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Proper French translations of the specific English descriptions
const frenchDescriptions = {
  1: "Fire Dance de Roby Lakatos & Ensemble est un mélange explosif de musique gitane authentique combinant des thèmes du monde entier. Selon Roby lui-même, c'est sa plus grande œuvre à ce jour.<br><br>Avec un panache superbe, Roby et son Ensemble nous offrent certains de leurs plus beaux et électrisants travaux. Roby est soutenu par son groupe légendaire : Lászlo Bóni, le second violon du groupe, Ernest Bangó, le célèbre joueur de cymbalum, Attila Rontó le guitariste et Oszkár Németh le bassiste. Ensemble, ils livrent leur enregistrement le plus parfait jamais gravé sur disque. Le programme, l'énergie et la virtuosité toujours époustouflante sont vraiment uniques.",

  2: "Polina Leschenko a créé un programme unique mettant principalement en vedette les œuvres de Prokofiev. Couvrant l'intégralité de son corpus, il commence par une interprétation palpitante de la Symphonie Classique de Prokofiev dans une transcription inédite pour deux pianos (par Rikuya Terashima). Polina est rejointe pour cette performance unique par la mondialement reconnue Martha Argerich. La 7e Sonate de Prokofiev, l'une des pièces les plus émouvantes et virtuoses du répertoire du compositeur, suit. L'interprétation de Polina deviendra sûrement une référence dans la discographie de cette œuvre. La Sonate pour violoncelle qui suit est une célébration de l'amitié de Polina avec le violoncelliste suisse de plus en plus connu Christian Poltera. Ensemble, ils donnent une performance noble, inspirante et délicate de cette œuvre. Le programme se termine par trois courtes pièces virtuoses enregistrées avec Roby Lakatos : la Marche de Prokofiev de 'l'Amour des Trois Oranges' ; la Mélodie de Tchaïkovsky (de 'Souvenir d'un Lieu Cher') ; et la Vocalise de Rachmaninov, dans un nouvel arrangement de Roby Lakatos.",

  3: "Pedro Burmester est un pianiste portugais inspirant qui a contribué à la célèbre 'Casa de Música' de Porto (Portugal). L'enregistrement présente la Sonate en si mineur de Liszt et la Fantaisie en do majeur Op. 17 de Schumann et a été achevé en février 2005.<br><br>Depuis son premier récital à l'âge de dix ans, Pedro Burmester a remporté de nombreux prix nationaux et internationaux et a fait des tournées dans le monde entier. Il a joué avec de nombreux orchestres renommés (tels que l'Orchestre National de l'Opéra de Belgique, la Northern Synfonia d'Angleterre, le Nederlands Kamerorkest, l'Orchestre Gulbenkian, l'Orchestre Philharmonique de Rotterdam, et l'Orchestre de Chambre Australien pour n'en citer que quelques-uns). Pedro a été invité par Sir Georg Solti à interpréter le Concerto n°5 de Beethoven avec l'Orchestre Symphonique de Londres au concert d'ouverture de « Lisbonne, Capitale Culturelle de l'Europe '94 ».",

  4: "Dora Schwarzberg est l'une des violonistes les plus inspirées, exigeantes et personnelles de son époque. Son jeu est inégalé. Elle enseigne à l'École Supérieure de Musique de Vienne et a formé plus de 100 violonistes, dont beaucoup sont maintenant lauréats de prix internationaux et/ou 'konzertmeister' d'orchestres internationaux. Elle est fréquemment invitée à Verbier et Lugano et joue souvent avec d'autres virtuoses, notamment Martha Argerich.<br><br>Polina Leschenko, âgée de 23 ans lors de l'enregistrement de ce programme, a joué entre autres à La Roque d'Anthéron (France), au Festival de Lugano, et au Beppu Meeting Point.",

  5: "Ce projet luxueux est une fusion du style gitan Lakatos très populaire avec un répertoire yiddish et klezmer.<br><br>Avec le soutien de la chanteuse yiddish de renommée mondiale Myriam Fuks, l'accordéoniste italien Aldo Granato et le célèbre Orchestre de Chambre Franz Liszt, cette production de luxe ravira à la fois les fans de Roby et de la musique yiddish klezmer.<br><br>Un hommage unique à certains des airs les plus inspirants de l'histoire musicale occidentale avec une sensation très moderne et avec des arrangements contenant des éléments de Tango, Funk, Jazz et Valse. C'est un voyage musical extrêmement rafraîchissant et original.",

  6: "Avanticlassic est extrêmement fier de publier ce nouvel album mettant en vedette les artistes de renommée mondiale Martha Argerich (piano) et Dora Schwarzberg (violon). Avec ce disque, Dora et Martha célèbrent leur amitié unique. Pendant des années, les deux artistes ont joué ensemble à travers le monde, ayant des rencontres musicales annuelles que ce soit en tournée ou au festival de Martha à Lugano. C'est la première fois, cependant, qu'elles entrent en studio ensemble.<br><br>L'enregistrement, des sonates de Franck et Debussy et des Fantasiestücke de Schumann, a eu lieu à Bruxelles en décembre 2005. La compréhension musicale des artistes est unique et cet enregistrement peut surprendre de nombreux auditeurs. Leur approche est toujours inspirée mais aussi profondément personnelle et le résultat constituera, sans aucun doute, une nouvelle référence dans l'histoire des trois œuvres. Les deux artistes se sont beaucoup données pour s'assurer que cet enregistrement soit un moment musical unique sans comparaison, et elles sont extrêmement fières du résultat.<br><br>De plus, c'est seulement la deuxième fois que Martha Argerich est enregistrée en son surround 5.1 pour SACD (par l'ingénieur du son multi-récompensé Hugues Deschaux) et c'est son premier enregistrement studio pour un label non-majeur.<br><br>La couverture de cet album est 'Internal Space' par l'artiste américain célèbre George Condo, inspiré par les performances de cet enregistrement.",

  7: "Pour la première fois, Polina Leschenko enregistre des chevaux de bataille du répertoire classique. Avec la Sonate en si mineur de Liszt ; la Transcription de la Chaconne (J.S. Bach) de Busoni ; la Valse de Faust (Gounod/Liszt) ; et un merveilleux Prélude et fugue en la mineur (J.S. Bach/Liszt), Polina, à seulement 25 ans, présente un programme vraiment palpitant.<br><br>La virtuosité de Polina est à nouveau affichée à son meilleur. Sa vision des œuvres provoquera sans aucun doute de nombreuses réactions. Polina Leschenko n'est pas une artiste consensuelle. Elle est une voix hautement individuelle parmi les plus grands pianistes d'aujourd'hui.<br><br>Pour ceux qui considèrent l'art de l'interprétation comme une quête d'une vérité musicale qui n'est pas figée mais, au contraire, est un domaine d'imagination, de respect et surtout un moyen inégalé de communiquer les sentiments les plus profonds, ce disque est incontournable.<br><br>Son implication incroyable dans ces œuvres, sa connaissance absolue du contrepoint, sa maîtrise musicale totale, ses vrais moments poétiques ainsi que ses furies ne laisseront certainement personne indifférent.",

  8: "Adriel Gomez-Mansur est encore inconnu de la plupart des gens. Cependant, les apparitions de ce prodige de 17 ans à Lugano (Suisse) et Beppu (Japon) ont déjà créé une énorme anticipation et excitation autour de ce garçon timide.<br><br>Découvert et protégé par Martha Argerich, cet étonnant poète du piano a enregistré ce premier récital en mai 2006 pour avanticlassic. Ce premier projet comprend des œuvres de Schubert, Rachmaninov, Chopin et Liszt.<br><br>Adriel Gomez-Mansur sera certainement une révélation pour de nombreux auditeurs car il combine une sensibilité profondément poétique avec une technique étonnante.<br><br>La couverture de cet album est 'Birthmark' par le peintre belge Cris Brodhal.",

  9: "Cette nouvelle sortie d'avanticlassic présente les frère et sœur Karin Lechner et Sergio Tiempo dans un récital extraordinaire de musique française célèbre pour duo de pianos ou deux pianos.<br><br>Karin et Sergio sont deux des meilleurs solistes de leur génération. Leurs carrières de solistes acclamées ne les ont pas empêchés de garder une place pour le duo de piano. C'est toujours un moment musical fort quand frère et sœur unissent leurs forces pour nous offrir un moment de musique vraiment virtuose mais aussi hautement inspiré.<br><br>Leur premier album pour avanticlassic se concentre sur l'une des périodes musicales les plus intéressantes de l'histoire de France : La Belle Époque. Avec Scaramouche de Darius Milhaud, Daphnis et Chloé de Maurice Ravel, Dolly de Gabriel Fauré, deux Nocturnes de Debussy et une envoûtante Valse de Maurice Ravel, ils ont choisi un programme inspiré affichant l'intimité, la magie, mais aussi les concepts musicaux fascinants émanant de cette ère culturellement riche.<br><br>Cette édition comprend également un DVD exclusif présentant Insights of a Duo, réalisé par Joachim Thôme (www.lesproductionsduverger.be) plus Night Recordings, un documentaire sur Karin Lechner et Sergio Tiempo.",

  10: "La dernière sortie de Roby Lakatos pour avantijazz est un projet entièrement Jazz. Avec des invités prestigieux incluant le légendaire violoniste manouche français Stéphane Grappelli, la superstar violoniste russe Vadim Repin, le trompettiste de jazz américain culte Randy Brecker, le saxophoniste hongrois de renommée mondiale Tony Lakatos et le maître du Jazz français Marc Fosset, Roby Lakatos with Musical Friends est un voyage unique au cœur du Jazzland.<br><br>Roby Lakatos a toujours été célèbre pour son incroyable capacité à improviser dans tous les styles possibles. Curieux de nombreux répertoires musicaux, Roby joue du jazz depuis l'enfance. Après de nombreuses expériences avec des maîtres établis, il a décidé de produire un album entièrement dédié au Jazz et de choisir les standards les plus incroyables : Du Blue Rondo á la Turk de Dave Brubeck au Four de Miles Davis, en passant par Donna Lee de Charlie Parker et le 24e Caprice de Paganini, cet album est une opportunité extraordinaire de découvrir son talent illimité dans un genre musical si cher à son cœur.<br><br>Pour Roby Lakatos, jouer du jazz c'est avant tout partager et vous découvrirez à quel point il est merveilleux de partager des sets musicaux avec le casting d'invités le plus incroyable.<br><br>Cette version comprend un 2e CD avec 3 pistes bonus (24 minutes) jamais sorties auparavant."
};

async function updateFrenchDescriptions() {
  console.log('🇫🇷 UPDATING FRENCH DESCRIPTIONS\\n');
  
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
    
    console.log(`\\n🎉 FRENCH TRANSLATIONS COMPLETE!`);
    console.log(`  • French descriptions updated: ${descriptionsUpdated}`);
    console.log(`  • Remaining: ${37 - descriptionsUpdated} releases need French translation`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateFrenchDescriptions();