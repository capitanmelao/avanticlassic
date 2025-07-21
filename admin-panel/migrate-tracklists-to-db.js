const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hardcoded tracklist data from the frontend
const hardcodedTracklists = {
  "1": `1. Fire Dance / Gypsy Bolero / Cickom Paraphrase (J. Suha Balogh) - 09:01
2. Papa Can You Hear Me (M. Legrand) - 06:18
3. Ciflico (Got a Match) (C. Corea) - 06:54
4. Konfetki Baranotchki (Trad.) - 04:11
5. Wherever My Roads (S. Jaroka) - 05:11
6. Divertimento (L. Weiner) - 05:59
7. Que reste-t-il de nos amours ? (C. Trenet) - 05:50
8. Intro (R. Lakatos) - 04:04
9. Sakura (Trad.) - 03:07
10. Django (J. Lewis) - 06:35
11. Memory of Bihari (I. Csàmpai) / Hejre Kati (J. Hubay) - 07:02
12. Nocturne of June 11 (K. Csèki) - 03:47`,

  "2": `Sergei Prokofiev (1891 – 1953)
Symphony No. 1 in D, Op. 25 'Classical' (Transcription by Rikuya Terashima)
1. Allegro - 03:56
2. Larghetto - 03:40
3. Gavotta : Non Troppo allegro - 01:17
4. Finale : Molto vivace - 03:54

Piano Sonata N. 7 in B Flat Major, Op 83
Martha Argerich, piano I / Polina Leschenko, piano II
5. Allegro Inquieto - 07:30
6. Andante Caloroso - 05:05
7. Allegro Inquieto - 03:07

Sonata for Cello and Piano in C Major, Op. 119
Christian Poltera, cello / Polina Leschenko, piano
8. Andante Grave - 10:01
9. Moderato - 04:16
10. Allegro ma non troppo - 07:21

Bonus:
Tchaikovsky - Melodie (from 'Souvenir d'un lieu cher', Op. 42) - 03:12
Prokofiev - March from The Love for Three Oranges, Op 33 ter - 01:15
Rachmaninov - Vocalise, Op. 34/14 - 05:43`,

  "3": `Robert Schumann (1810 – 1856)
Fantasie in C-Dur, op.17
Fantasy in C, op.17
Fantasie en do, op.17
1. Durchaus fantastisch und leidenschaftlich vorzutragen - Im Legenden-Ton - 13:47
2. Mäßig. Durchaus energisch - Etwas langsamer – Viel bewegter - 07:30
3. Langsam getragen. Durchweg leise zu halten - Etwas bewegter - 12:51

Franz Liszt (1811-1886)
Sonate für Klavier h-Moll, S 178
Piano Sonata in B minor, S 178
Sonate pour Piano en si mineur, S 178
4. Lento assai - Allegro energico – Grandioso - Cantando espressivo - Pesante - Recitativo - 13:18
5. Andante sostenuto - Allegro energico - Più mosso - Cantando espressivo senza rallentare - 08:59
6. Stretta quasi Presto - Presto - Prestissimo - Andante sostenuto - Allegro moderato - Lento assai - 11:59`,

  "4": `Robert Schumann (1810 – 1856)
Fantasiestücke, op. 73
Fantasy pieces, op. 73
Pieces de fantaise, op. 73
1. I Zart und mit Ausdruck - 02:58
2. II Lebhaft, leicht - 03:19
3. III Rasch und mit Feuer - 03:48

Sonate für Violine und Klavier in a moll, op. 105
Sonata for Violin and Piano in A flat, op. 105
Sonate pour violon et piano en la mineur, op. 105
4. I Mit leidenschaftlichem Ausdruck - 07:04
5. II Allegretto - 03:59
6. III Lebhaft - 04:20

Sonate für Violine und Klavier in d moll, op. 121
Sonata for Violin and Piano in D flat, op. 121
Sonate pour violon et piano en ré mineur, op. 121
7. I Ziemlich langsam - 12:30
8. II Sehr lebhaft - 03:51
9. III Leise, einfach - 05:39
10. IV Bewegt - 08:27`,

  "5": `1. Klezmer Suite No.1 (Javori/Lakatos) - 03:07
2. Yiddishe Mame (Yellen/Pollack) - 07:23
3. Glick (Fuld) - 05:22
4. A-10450 (Lakatos) - 04:16
5. Neshumele (Trad.) - 04:39
6. Papirossen Suite (Yablekon) - 05:29
7. Klezmer Suite No.2 (Javori/Lakatos) - 05:37
8. Empty Pictures (Lakatos) - 03:29
9. Ani Maamin (Trad.) - 04:31
10. Dizzy Fingers (Lakatos) - 04:26
11. Romania (Lebedeff) - 03:50
12. Hatikvah (Erez) - 05:10
13. Budapest (Trad.) - 02:38
14. Yiddishe Hassene (Lebedeff) - 06:41
15. Klezmer Csardas (Lakatos) - 04:03`,

  "37": `Carlos Gardel (1890-1935)
1. Volver (Argentina) - 06:03

Gerardo Matos Rodriguez (1897-1948)
2. La Cumparsita (Uruguay) - 05:40

Izaak Dunajewski (1900-1955)
3. Sierdce (Russia) - 05:49

Astor Piazzolla (1921-1992)
4. Chiquilin de Bachin (Argentina) - 07:39

Jacob Gade (1879-1963)
5. Jalousie (Danemark - Gypsy) - 03:24

Despina Olympiou (b. 1975)
6. Vale Mousiki (Greece) - 06:12

Oskar Strok (1893-1975)
7. Czornyje Glaza (Russia) - 08:37

Astor Piazzolla (1921-1992)
8. Oblivion (Argentina) - 05:17

Unto Mononen (1930-1968)
9. Satuma (Dreamland) (Finland) - 07:05

Anon.
10. Turkish Tango (Turkye) - 05:52

Dirk Van Esbroeck (1946-2007) & Juan Masondo (b. 1944)
11. Rookgordijnen (Belgium / Flanders) - 04:28

Aleksander Olshanetsky (1892-1946)
12. Jewish Tango - 09:27

Jerzy Petersburski (1895-1979)
13. This is the last Sunday (Poland) - 04:11

Roby Lakatos, violin
& Gang Tango
Grzegorz Lalek, violin & mandoline
Piotr Kopietz, bandoneon
Marcin Olak, guitar
Miroslaw Feldgebel, piano
Sebastian Wypych, double bass
& The New Vibes String Quartet
Anna Wandtke, 1st violin
Malgorzata Wójcik, 2nd violin
Michal Styczynski, viola
Tomasz Blaszczak, cello
Sebastian Wypych : conductor, artistic director & founder`
};

async function migrateTracklistsToDatabase() {
  console.log('🎵 MIGRATING HARDCODED TRACKLISTS TO DATABASE\n');
  
  try {
    // First, check current tracklist status
    console.log('1. CHECKING CURRENT TRACKLIST STATUS:');
    const { data: existingTranslations, error: fetchError } = await supabase
      .from('release_translations')
      .select('release_id, language, tracklist')
      .eq('language', 'en'); // Check English tracklists first
      
    if (fetchError) {
      console.error('❌ Error fetching existing tracklists:', fetchError);
      return;
    }
    
    // Count existing tracklists
    const releasesWithTracklists = existingTranslations.filter(t => t.tracklist && t.tracklist.trim().length > 0);
    console.log(`  📊 Releases with existing tracklists: ${releasesWithTracklists.length}/${existingTranslations.length}`);
    
    // Show which releases have tracklists
    console.log('\n2. RELEASES WITH EXISTING TRACKLISTS:');
    releasesWithTracklists.forEach(t => {
      console.log(`  ✅ Release ${t.release_id}: ${t.tracklist.split('\n')[0]}...`);
    });
    
    // Show which releases are missing tracklists but have hardcoded data
    console.log('\n3. HARDCODED TRACKLISTS AVAILABLE FOR MIGRATION:');
    const releasesWithoutTracklists = existingTranslations.filter(t => !t.tracklist || t.tracklist.trim().length === 0);
    const migratable = releasesWithoutTracklists.filter(t => hardcodedTracklists[t.release_id.toString()]);
    
    console.log(`  📊 Releases missing tracklists: ${releasesWithoutTracklists.length}`);
    console.log(`  📊 Hardcoded tracklists available: ${Object.keys(hardcodedTracklists).length}`);
    console.log(`  📊 Can migrate: ${migratable.length}`);
    
    if (migratable.length > 0) {
      console.log('\n4. MIGRATING TRACKLISTS:');
      
      for (const translation of migratable) {
        const releaseId = translation.release_id;
        const tracklist = hardcodedTracklists[releaseId.toString()];
        
        if (tracklist) {
          console.log(`  🔄 Migrating tracklist for release ${releaseId}...`);
          
          const { error: updateError } = await supabase
            .from('release_translations')
            .update({ tracklist: tracklist })
            .eq('release_id', releaseId)
            .eq('language', 'en');
            
          if (updateError) {
            console.error(`  ❌ Failed to update release ${releaseId}:`, updateError);
          } else {
            console.log(`  ✅ Successfully migrated tracklist for release ${releaseId}`);
          }
        }
      }
      
      console.log('\n5. MIGRATION COMPLETE!');
      console.log('   You can now edit tracklists through the admin panel.');
      console.log('   The tracklists will appear on the website instead of hardcoded data.');
    } else {
      console.log('\n✅ No tracklists need migration - all are already in database!');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the migration
migrateTracklistsToDatabase();