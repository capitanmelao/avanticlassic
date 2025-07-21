const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Complete tracklist data extracted from the frontend fallback data
const completeTracklists = {
  "6": `César Franck (1822 - 1890)
Sonata for Violin and Piano in A major
1. I Allegretto ben moderato - 06:54
2. II Allegro- Quasi lento- Tempo 1 (Allegro) - 08:38
3. III Recitativo - Fantasia (Ben moderato - Largamente - Molto lento) - 07:08
4. IV Allegretto poco mosso - 06:29

Claude Debussy (1862 - 1918)
Sonata for Violin and Piano in G minor
5. I Allegro vivo - 05:03
6. II Intermède (Fantasque et léger) - 04:34
7. III Finale (Très animé) - 04:29

Robert Schumann (1810 – 1856)
Fantasiestücke, op. 73
8. I Zart und mit Ausdruck - 03:30
9. II Lebhaft, leicht - 03:21
10. III Rasch und mit Feuer - 03:56`,

  "7": `Franz Liszt (1811 – 1886)
1. Prelude und - 03:01
2. Fugue a­moll, Prelude & Fugue in A minor, Prélude et fugue en La Mineur (Transkription nach/ transcription after/d'après J.S. Bach), S. 462 - 04:37

Feruccio Busoni (1866 – 1925)
3. Chaconne, (Transkription nach/ transcription after/d'après J.S. Bach) - 13:09

Franz Liszt (1811 – 1886)
4. Valse de l'opéra Faust, (Transkription nach/ transcription after/d'après Charles Gounod), S. 407 - 09:18

Sonate für Klavier h­-Moll, S. 178
Piano Sonata in B minor, S. 178
Sonate pour Piano en si mineur, S. 178
5. Lento assai Allegro energico Grandioso Recitativo - 11:15
6. Andante sostenuto - 06:09
7. Allegro energico Andante sostenuto Lento assai - 09:09`,

  "8": `Franz Liszt (1811 – 1886)
1. Consolation n. 3 (S. 172 III) - 04:24
2. Prelude based on a theme from Bach's Cantata
Prélude basé sur un thème de la cantate de Bach
Präludium nach einem Thema aus Bach's Kantate
BWV 12 "Weinen, Klagen, Sorgen, Zagen" (S. 179) - 06:01

Frédéric Chopin (1810 ­ 1849)
3. Mazurka Op. 33 n.4 in B minor/ en si mineur/ B­moll - 05:16

Franz Schubert (1797 ­ 1828)
4. Impromptu Op. 90 (D. 899) n.2 in E flat major/ en mi bémol majeur/ Es­Dur - 04:56
5. Impromptu Op. 90 (D. 899) n.3 in G flat major/ en sol bémol majeur/ Ges­Dur - 07:09
6. Impromptu Op. 90 (D. 899) n.4 in A flat major/ en la bémol majeur/ As­Dur - 08:09

Robert Schumann (1810 – 1856)
7. Novelette Op. 21 n. 1 in F/ en fa/ F­dur - 06:01
8. Traumereï (aus/from/de Kinderszenen, Op. 15) - 02:52

Sergeï Rachmaninov (1873 ­ 1943)
9. Prelude Op. 32 n. 5 in G/ en sol majeur/ G - 03:00
10. Prelude Op. 32 n. 10 in B minor/ en si mineur/ H­moll - 06:35
11. Prelude Op. 32 n. 12 in G sharp minor/ en sol dièse mineur/ Gis­moll - 03:00
12. Prelude Op. 23 n. 5 in G minor/ en sol mineur/ G­moll - 04:13

Alexander Scriabin (1872 – 1915)
13. Etude Op. 8 n. 1 in D sharp minor/ en ré dièse mineur/ Dis­moll - 02:03
14. Etude Op. 2 n. 1 in C sharp minor/ en do dièse mineur/ Cis­moll - 03:12`,

  "9": `Darius Milhaud (1892-1974)
Scaramouche, suite pour deux pianos Op. 165 B.
Suite for two pianos Op. 165 B.
1. Vif - 02:50
2. Modéré - 03:59
3. Braziliera - 02:22

Maurice Ravel (1875-1937)
Daphnis et Chloé, deuxième suite - transcription pour deux pianos par Lucien Garban (1877-1959)
Second suite, transcription for two pianos by Lucien Garban (1877-1959)
4. Lever du Jour: Lent - 05:38
5. Pantomime: Lent – Très lent - Vif – Très lent - 06:11
6. Danse Générale: Lent - Animé - 03:31

Gabriel Fauré (1845-1924)
Dolly, suite pour piano à 4 mains Op. 56 suite for piano, 4 hands Op. 56
7. Berceuse - 02:49
8. Mi-a-ou - 01:53
9. Le jardin de Dolly - 02:51
10. Kitty-valse - 02:33
11. Tendresse - 03:50
12. Le pas espagnol - 02:09

Claude Debussy (1862-1918)
Nocturnes - transcription pour deux pianos, quatre mains par Maurice Ravel
Transcription for two pianos, four hands by Maurice Ravel
13. Nuages - 05:33
14. Fêtes - 06:07

15. Maurice Ravel - 12:20
La Valse, poème chorégraphique pour orchestre - transcription pour deux pianos, quatre mains par l'auteur
Choreographic poem for orchestra, transcription for two pianos, four hands by the composer

Bonus DVD: Insights of a duo/Night Recordings, includes interviews of the artists plus three exclusive clips:
Witold Lutoslawski (1913-1994): Paganini Variations for Two Pianos
Antonín Dvorák (1841-1904): Slavonic Dance No.2 in E minor Op. 72 B145
Ástor Piazzolla (1921-1992): La Muerte Del Ángel – arranged by Pablo Ziegler (1944- )`,

  "10": `1. 24 Capricio - Nicolo Paganini - 07:23
Guest: Vadim Repin, violin
2. Blue Rondo á la Turk - Dave Brubeck - 08:46
Guest: Stéphane Grappelli, violin
3. Cherokee - Ray Noble - 05:57
Guest: Randy Brecker, trumpet
4. XXL Blues - Kálman Csèki & Roby Lakatos - 10:10
Guest: Tony Lakatos, tenor sax
5. Spring of Dream - Misi Lakatos - 08:17
Guest: Stéphane Grappelli, violin
6. Paris Groove - Michael Urbaniak - 11:11
Guest: Randy Brecker, trumpet
7. Four - Miles Davis - 07:31
Guest: Tony Lakatos, tenor sax
8. Duke Jordan: Jordu - 05:10
Guest: Marc Fosset, guitar
9. Season Of The Rain - Elek Bacsik - 07:11
10. Donna Lee - Charlie Parker - 04:55

BONUS CD Previously Unreleased Tracks
1. Pictures of Hungary, part one - Traditional - 09:34
2. Pictures of Hungary, part two - Traditional - 05:25
3. Donna Lee - Charlie Parker [alternate ending] - 04:42
4. Marcabol - Kálmàn Csèki - 09:49`,

  "11": `1. Yosl Koltiar / Henekh Kon - A Nigendl In Yddish - 04:06
2. Aaron Lebedeff - Roumania - 02:45
3. Mordechaï Gebirtig - Margaritkelech - 03:25
4. Aaron Lebedeff - Yddish - 02:42
5. Herman Yablokov - Papierossen - 04:43
6. Trad. - Fin A Shtein Geboirn - 02:42
7. Alexander Olshanetzky / Jacob Jacobs - Belz - 04:55
8. Mordechaï Gebirtig - Yankele - 03:29
9. Aaron Lebedeff - Far Nile, Nouch Nile - 03:09
10. Jack Yellen / Lou Pollack - A Yddishe Mame - 04:56
11. David Meyerovitz - Vous Is Gevein Is Gevein - 03:15
12. Aaron Lebedeff - Ich Bin A Fartiker - 02:08
13. Benzion Witler - Mein Meidele - 02:35
14. Aaron Lebedeff - N'y Platch Mama - 02:47
15. Aaron Lebedeff - What Can You Machen Sis Amerika - 03:29
16. Aaron Lebedeff - Giter Brider Itzik - 02:18
17. Aaron Lebedeff - Leibdich, Freilech - 03:38
18. Aaron Lebedeff - Hudl Mit'n Strudl - 02:26

Bonus
19. George Ulmer - Schmile - previously unreleased – in French/en Français/In Französich - 03:28
20. Trad. - Neshumele (from the album Klezmer Karma) - 04:39`,

  "12": `J.S. Bach (1685-1750)
Goldberg-Variationen - Goldberg Variations – Variations Goldberg BWV. 988

1. Aria - 02:29
2. Variatio 1 a 1 clav. - 01:25
3. 1 clav. - 00:57
4. Variatio 3 Canone all'unisono - 00:54
5. Variatio 4 a 1 clav. - 00:45
6. Variatio 5 a 1 ovvero 2 clav. - 00:39
7. Variatio 6 Canone alla Seconda - 00:50
8. Variatio 7 a 1 ovvero 2 clav. - 01:45
9. Variatio 8 a 2 clav. - 00:52
10. Variatio 9 Canone alla Terza a 1 clav. - 01:36
11. Variatio 10 Fughetta a 1 clav. - 00:48
12. Variatio 11 a 2 clav. - 01:03
13. Variatio 12 Canone alla Quarta in moto contrario - 01:35
14. Variatio 13 a 2 clav. - 02:50
15. Variatio 14 a 2 clav. - 01:04
16. Variatio 15 Canone a la Quinta in moto contrario a 1 clav., Andante - 02:32
17. Variatio 16 Ouverture a 1 clav. - 01:16
18. Variatio 17 a 2 clav - 00:55
19. Variatio 18 Canone alla Sesta a 1 clav. - 01:13
20. Variatio 19 a 1 clav. - 01:26
21. Variatio 20 a 2 clav. - 00:52
22. Variatio 21 Canone alla Settima - 02:14
23. Variatio 22 Alla breve a 1 clav. - 01:14
24. Variatio 23 a 2 clav. - 01:35
25. Variatio 24 Canone all'Ottava a 1 clav. - 01:25
26. Variatio 25 a 2 clav. - 04:20
27. Variatio 26 a 2 clav. - 00:54
28. Variatio 27 Canone alla Nona - 01:32
29. Variatio 28 a 2 clav. - 01:08
30. Variatio 29 a 1 ovvero 2 clav. - 01:32
31. Variatio 30 Quodlibet a 1 clav. - 02:04
32. Aria - 03:01`,

  "13": `Franz Liszt (1811-1886)
Totentanz: Paraphrase über Dies irae S.126
Dance of the Dead : Paraphrase on Dies irae S.126
Danse Macabre : Paraphrase sur Dies Irae S.126
1. Andante - Allegro - Allegro moderato (Var. I & II) - Molto vivace (Var. III) - Lento (Var. IV) - Vivace (Var. V) - Sempre allegro (ma non troppo) - Un poco meno allegro - Presto - Allegro animato. Tre Sonetti del Petrarca (Années de Pèlerinage, Book II/4-6) S.161/4-6 - 14:24

Three Petrarch Sonnets, for piano
Drei Petrarca-Sonette, für Klavier
Trois Sonnets de Petrarque, pour piano
2. Sonetto 47 del Petrarca (Preludio con moto — Sempre mosso con intimo sentiment) - 05:51
3. Sonetto 104 del Petrarca (Agitato assai — Adagio) - 05:57
4. Sonetto 123 del Petrarca (Agitato assai — Sempre lento — Più lento — [Tempo iniziale]) - 06:11

Piotr Illitch Tchaïkovsky (1840-1893)
Piano Concerto No 1 in B-flat minor, Op 23
Klavierkonzert N. 1 op. 23 in b-Moll
Concerto pour piano n. 1 en si bémol mineur, op. 23
5. Allegro non troppo e molto maestoso - 06:59
6. Andantino semplice - 07:04
7. Allegro con fuoco - 07:04`,

  "14": `1. Astor Piazzolla (1921 – 1992) - Michelangelo '70 (arr. Féderico Jusid) - 03:10
2. Astor Piazzolla - Revirado (arr. Pablo Ziegler) - 03:27
3. Pablo Ziegler (1944) - El Empedrado - 05:49
4. Pablo Ziegler - Sandunga - 04:13
5. Pablo Ziegler - Asflato - 05:17
6.-9. Féderico Jusid (1973) - Tango Rhapsody for 2 pianos and orchestra : concertante-theatrical piece dedicated to Ms Karin Lechner and Mr Sergio Tiempo Asflato - 18:44
10. Pablo Ziegler - Milongueta - 07:57
11. Astor Piazzolla - La Muerte Del Angel (arr. Pablo Ziegler) - 03:23
12. Astor Piazzolla - Adios Nonino (arr. Pablo Ziegler) - 08:30
13. Féderico Jusid - Emilio Kauderer (1950) - The Secret in Their Eyes (arr. Féderico Jusid), theme from the movie 'El secreto de sus ojos' - 03:35`,

  "15": `1. Mischa Levitzki (1898-1941) - Valse 'Amour', op. 2 - 01:46
2. Arabesque Valsante, op. 6 - Valse 'Amour', op. 2 - 03:16
3.-05 Sergei Rachmaninov (1873-1943) - Piano Sonata no. 2, op. 36 -Horowitz version- - 21:00
6.-13 Nikolai Medtner (1879-1951) - Forgotten Melodies Cycle 1, op. 38 - 35:08`,

  "16": `Max Bruch (1838-1920)
Violin Concerto No. 1 in G minor op. 26
Violinkonzert in g-Moll, Op. 26
Concerto pour violon en sol mineur op. 26
1. Vorspiel, Allegro moderato - 07:56
2. Adagio - 08:14
3. Finale, Allegro energico - 07:22

4. Ludwig van Beethoven (1770-1827) - Romance for Violin and Orchestra No. 1 in G major op. 40
Violinromanze Nr. 1 G-Dur, Op. 40
Romance pour violon et orchestre no 1 en sol majeur, op. 40 - 07:13

Felix Mendelssohn Bartholdy (1809-1847)
Violin Concerto in E minor op. 64
Violinkonzert e-Moll, Op. 64
Concerto pour violon en mi mineur, opus 64
5. Allegro molto appassionato - 12:50
6. Andante - 08:07
7. Allegretto non troppo - Allegro molto vivace - 06:19

8. Ludwig van Beethoven (1770-1827) - Romance for Violin and Orchestra No. 2 in F major op. 50
Violinromanze Nr. 2 F-Dur, Op. 50
Romance pour violon et orchestre no 2 en fa majeur, op. 50 - 08:27`,

  "17": `Georg Friedrich Haendel (1685-1759): Suite in B-flat major, HWV 434
Suite B-Dur, HWV 434
Suite en si bémol majeur, HWV 434
1. I. Prelude - 03:31
2. II. Aria con Variazioni (5) - 02:51
3. III. Menuet - 02:36

Johannes Brahms (1833-1897): Variations and Fugue on a Theme by Handel, Op. 24
Variationen und Fuge über ein Thema von Händel, Op. 24
Variations et fugue sur un thème de Haendel, op. 24
4. Theme. Aria - 00:39
5. Variation I - 00:38
6. Variation II - 00:40
7. Variation III - 00:33
8. Variation IV - 00:37
9. Variation V - 00:38
10. Variation VI - 00:52
11. Variation VII - 00:45
12. Variation VIII - 00:28
13. Variation IX - 00:37
14. Variation X - 01:18
15. Variation XI - 00:29
16. Variation XII - 00:40
17. Variation XIII - 00:42
18. Variation XIV - 01:40
19. Variation XV - 00:29
20. Variation XVI - 00:34
21. Variation XVII - 00:30
22. Variation XVIII - 00:34
23. Variation XIX - 00:45
24. Variation XX - 01:24
25. Variation XXI - 01:06
26. Variation XXII - 00:57
27. Variation XXIII - 00:30
28. Variation XXIV - 00:28
29. Variation XXV - 00:30
30. Fugua-Moderato - 05:15

Johann Sebastian Bach (1685-1750): Partita No. 1 in B flat, BWV 825
Partita N. 1/n. 1, BWV 825
31. I. Prelude - 01:56
32. II. Allemande - 02:15
33. III. Courante - 02:06
34. IV. Sarabande - 03:44
35. V. Menuett I - II - 02:10
36. VI. Gigue - 01:37

Johann Sebastian Bach: Fantasy and Fugue in G minor BWV 542, transcribed for piano by Franz Liszt, SW 463 R 120
Fantasie und Fuge in G-moll für orgel BWV 542, für piano gesetzt von Franz Liszt, R 120 SW 463
Fantaisie & Fugue en sol mineur pour orgue BWV 542, transcrite pour le piano par Franz Liszt, R 120 SW 463
37. I. Prelude - 05:09
38. II. Fugue - 05:19

39. Franz Liszt (1811-1886): Vallée D'Obermann SW 156 R 8, from/aus/de Les Années de Pèlerinage (première année, Suisse) - 13:39`,

  "18": `CD 1
1. New Alliance (Roby Lakatos) - 07:14
2. Valse Triste (Ferenc Vecsey) - 04:02
3. Polyushka Polye (O field, my field, Plaine, ma plaine -Trad.) - 05:13
4. Oblivion (Ástor Piazzolla) - 08:19
5. Stari Waltz (Isaak Osipovich Dunayevsky) – Csárdás Lunatique (George Boulanger) - 07:59
6. Ne Na Na Na (Vaya Con Dios) - 03:53
7. The Flight Of The Bumbeblee (Nikolaï Rimsky-Korsakov) - 04:42
8. Chiquilin De Bachin (Ástor Piazzolla) - 06:13
9. Dorogoi Dlinnoyu (Those Were the Days, Le temps des fleurs, Den langen Weg entlang - Boris Fomin) - 04:08
10. Du Schwarzer Zigeuner (Karel Vacek) - 03:48
11. SK Paraphrase (Roby Lakatos) - 08:46
12. L'Alouette (The Lark : 'contemporary sonata version' - Grigoras Dinicu) - 12:50

CD 2
1. Hungarian Dance no 5 (Johannes Brahms) - 04:05
2. Fire Dance (J. Suha Balogh) - 09:51
3. Honeysuckle Rose (Fats Waller) - 08:43
4. Two Guitars (Deux Guitares - Trad.) - 07:21
5. Papa Can You Hear Me (Michel Legrand) - 05:11
6. Ochi Chornyje (Black Eyes, Les Yeux Noirs, Schwarzen Augen - Trad.) - 04:49
7. Csárdás (Vittorio Monti) - 05:33
8. Hora Di Marrakchi (A Night in Marrakech - Roby Lakatos) - 04:11
9. Cuenta Conmigo (Luis Salinas) - 05:44`,

  "19": `1. Manuel de Falla (1876-1946) - Spanish Dance from la Vida Breve – Arr. Fritz Kreisler - 03:37
2. Lensky's Aria from Eugen Onegin – Arr. Leopold Auer - 06:05
3. Gaetano Donizetti (1797-1848) - Una Furtiva Lagrima from l'Elisir d'Amore – Arr. Philippe Quint - 04:10
4. Christoph Willibald Gluck (1714-1787) - Melodie from Orphée et Eurydice - Arr. Fritz Kreisler - 03:57
5. Gioacchino Rossini (1792-1868) - Paraphrase on Largo al factotum from Il barbiere di Siviglia – Arr. Mario Castelnuovo-Tedesco - 05:51
6. Richard Strauss (1864-1949) - Morgen, Op. 27/4 - Arr. Mischa Maisky - 03:06
7. George Gershwin (1898-1937) - Porgy and Bess Suite - Arr. Jascha Heifetz
Summertime - A Woman is a Sometime Thing - 04:39
8. My Man's Gone Now - 02:52
9. Bess You Is My Woman Now - 03:36
10. It Ain't Necessarily So - 04:25
11. Camille Saint Saëns (1835-1921) - Cantabile from Samson et Dalila - 03:32
12. Engelbert Humperdink (1854-1921) - Evening Prayer from Hänsel und Gretel – Arr. Philippe Quint - 03:43

Bonus:
13. Joseph Joachim Raff (1822-1882) - Cavatina Op 85, N. 3 - 05:06`,

  "20": `1. Vi Ahin Zol Ikh Geyn (S. Korn-Teuer aka Igor S. Korntayer /O. Strokh)
Guest : Evgeny Kissin (piano)
2. Far Dir Mayne Tayer Hanele aka Klezmer Csardas from Klezmer Karma (R. Lakatos/M. Fuks)
Guest : Alissa Margulis (violin), Nathan Braude (alto), Polina Leschenko (piano)
3. Malkele, Schloimele (J. Rumshinsky)
Guest : Sarina Cohn (vocal), Philip Catherine (guitar), Oscar Németh (bass)
4. Deim Fidele (B. Witler)
Guest : Lola Fuks (vocal), Michael Guttman (violin)
5. Yetz Darf Men Leiben (B. Witler)
Guest : Paul Ambach (vocal) (piano)
6. Greene Bletter (M. Oiysher)
Guest : Roby Lakatos (violin)
7. Die Saposhkeler' (D. Meyerowitz)
8. Pintele Yid (L. Gilrot/A. Perlmutter-H. Wohl)
Guest : Zahava Seewald (vocal)
9. Als In Einem Is Nicht Dou Ba Keiner (B. Witler)
10. Dous Gezang Fin Mayne Hartz (B. Witler)
Guest : Myriam Lakatos (vocal)
11. Schlemazel (B. Witler)
Guest : Edouard Baer (vocal)
12. Nem Der Nisht Tsim Hartz (B. Witler)
13. Hit Oup Dous Bisele Koyer' (B. Witler)
Guest : Michel Jonasz (vocal)
14. Schmiele (G. Ulmer)
Guest : Mona Miodezky (vocal), Roby Lakatos (violin)
15. Ziben Gite Youren (D. Meyerowitz)
16. Bublitchki (Beygeleich) (Trad.)
Guest : Alexander Gurning (piano)
17. Ver Bin Ikh? (B. Witler)
Guest : Mischa Maisky (cello), Lily Maisky (piano)
18. Der Rebe Menachem (A. Gurning/M. Fuks-M. Rubinstein)
Guest : Martha Argerich (piano)`,

  "21": `Piotr Illitch Tchaikovsky (1840–1893)
Violin Concerto in D major, Op. 35
Violinkonzert D-Dur op. 35
Concerto pour violon en ré majeur, op. 35
1. I. Allegro moderato - 19:02
2. II. Canzonetta. Andante - 06:32
3. III. Finale. Allegro vivacissimo (Cadenza Piotr Illitch Tchaikovsky) - 10:35
4. Finale. Allegro vivacissimo (Cadenza Leopold Auer) - 09:51

Sofia Philharmonic Orchestra
Martin Panteleev

Anton Stepanovich Arensky (1861-1906)
String Quartet No. 2 in A minor, Op. 35, for violin, viola and two cellos
Streichquartett Nr.2 a-Moll op.35 für Violine, Viola und 2 Violoncelli
Quatuor à cordes n° 2 en la mineur, Op. 35, pour violon, alto et deux violoncelles
5. I. Moderato - 10:59
6. II. Variations sur un thème de P. Tchaikovski. Moderato - 13:32
7. III. Finale. Andante sostenuto - 04:25

Lily Francis, alto
Claudio Bohórquez, cello 1
Nicolas Altstaedt, cello 2`,

  "22": `Kálmán Cséki (1962)
Alpha
1. Genesis
2. Noah
3. Abraham
4. Golgotha

Antonio Vivaldi (1678 – 1741)
Le quattro stagioni (The four seasons)
Concerto No. 1 in E major, Op. 8, RV 269, "La primavera" (Spring)
5. Allegro
6. Largo e pianissimo sempre
7. Allegro pastorale

Concerto No. 2 in G minor, Op. 8, RV 315, "L'estate" (Summer)
8. Allegro non molto
9. Adagio e piano – Presto e forte
10. Presto

11. Concerto No. 3 in F major, Op. 8, RV 293, "L'autunno" (Autumn)
Allegro
12. Adagio molto
13. Allegro

Concerto No. 4 in F minor, Op. 8, RV 297, "L'inverno" (Winter)
14. Allegro non molto
15. Largo
16. Allegro

Kálmán Cséki (1962)
Omega
17. Apocalypse
18. Armageddon

19. Ilia II of Georgia (1933) - Ave Maria`
};

async function migrateAllTracklists() {
  console.log('🎵 MIGRATING ALL REMAINING HARDCODED TRACKLISTS TO DATABASE\n');
  
  try {
    // Check current status
    console.log('1. CHECKING CURRENT STATUS:');
    const { data: currentTranslations, error: fetchError } = await supabase
      .from('release_translations')
      .select('release_id, language, tracklist')
      .eq('language', 'en');
      
    if (fetchError) {
      console.error('❌ Error fetching current status:', fetchError);
      return;
    }
    
    const releasesWithTracklists = currentTranslations.filter(t => t.tracklist && t.tracklist.trim().length > 0);
    const releasesWithoutTracklists = currentTranslations.filter(t => !t.tracklist || t.tracklist.trim().length === 0);
    
    console.log(`  📊 Total releases: ${currentTranslations.length}`);
    console.log(`  📊 Releases with tracklists: ${releasesWithTracklists.length}`);
    console.log(`  📊 Releases missing tracklists: ${releasesWithoutTracklists.length}`);
    console.log(`  📊 New tracklists available: ${Object.keys(completeTracklists).length}`);
    
    // Migrate new tracklists
    let migratedCount = 0;
    console.log('\n2. MIGRATING NEW TRACKLISTS:');
    
    for (const [releaseId, tracklist] of Object.entries(completeTracklists)) {
      const existingTranslation = currentTranslations.find(t => t.release_id.toString() === releaseId);
      
      if (existingTranslation && (!existingTranslation.tracklist || existingTranslation.tracklist.trim().length === 0)) {
        console.log(`  🔄 Migrating tracklist for release ${releaseId}...`);
        
        const { error: updateError } = await supabase
          .from('release_translations')
          .update({ tracklist: tracklist })
          .eq('release_id', parseInt(releaseId))
          .eq('language', 'en');
          
        if (updateError) {
          console.error(`  ❌ Failed to update release ${releaseId}:`, updateError);
        } else {
          console.log(`  ✅ Successfully migrated tracklist for release ${releaseId}`);
          migratedCount++;
        }
      } else if (existingTranslation && existingTranslation.tracklist && existingTranslation.tracklist.trim().length > 0) {
        console.log(`  ⏭️ Release ${releaseId} already has a tracklist - skipping`);
      } else {
        console.log(`  ⚠️ Release ${releaseId} not found in database - skipping`);
      }
    }
    
    console.log('\n3. MIGRATION SUMMARY:');
    console.log(`  ✅ Successfully migrated: ${migratedCount} tracklists`);
    console.log(`  📊 Total releases with tracklists now: ${releasesWithTracklists.length + migratedCount}/${currentTranslations.length}`);
    
    if (migratedCount > 0) {
      console.log('\n🎉 MIGRATION COMPLETE!');
      console.log('  • Tracklists are now stored in the database');
      console.log('  • You can edit them through the admin panel');
      console.log('  • The website will show database tracklists instead of hardcoded ones');
      console.log('  • Admin panel tracklist fields will now display the migrated content');
    } else {
      console.log('\n✅ ALL TRACKLISTS ALREADY MIGRATED!');
      console.log('  No new tracklists needed migration.');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the migration
migrateAllTracklists();