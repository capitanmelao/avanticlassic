import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ExternalLink } from "lucide-react"

interface Release {
  id: string
  title: string
  artists: string
  format: string
  imageUrl: string
  description: string
  url?: string
  tracklist?: string
  shopUrl?: string
  totalTime?: string
}

async function getRelease(id: string) {
  try {
    // Use relative URL to avoid port issues
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : '';
    const res = await fetch(`${baseUrl}/api/releases/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching release:', error)
    return null
  }
}

// Fallback data with complete album information
const fallbackReleases: Release[] = [
  {
    id: "1",
    title: "Fire Dance",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/1.jpeg",
    url: "Fire-Dance-Roby-Lakatos",
    description: "Embark on a captivating musical journey with ROBY LAKATOS as he delves into the soul-stirring rhythms of Fire Dance. The King of Gypsy violinists showcases his unparalleled virtuosity through a collection of passionate pieces that blend traditional and contemporary elements.",
    tracklist: `1. Fire Dance / Gypsy Bolero / Cickom Paraphrase (J. Suha Balogh) - 09:01
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
    shopUrl: "https://shop.avanticlassic.com/products/fire-dance-roby-lakatos-1-cd",
    totalTime: "67:59"
  },
  {
    id: "2", 
    title: "The Prokofiev Project",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/2.jpeg",
    url: "The-Prokofiev-Project-Polina-Leschenko",
    description: "A mesmerizing exploration of Prokofiev's works featuring the exceptional pianist Polina Leschenko. This album showcases her profound musicality and technical brilliance in interpreting some of the most challenging and innovative classical compositions.",
    tracklist: `Sergei Prokofiev (1891 – 1953)
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
    shopUrl: "https://shop.avanticlassic.com/products/the-prokofiev-project-polina-leschenko-1-hybrid-sacd",
    totalTime: "63:19"
  },
  {
    id: "3",
    title: "Recital Schumann • Liszt",
    artists: "Pedro Burmester",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/3.jpeg",
    url: "Recital-Schumann-Liszt-Pedro-Burmester",
    description: "Pedro Burmester's deeply personal recital featuring masterworks by Schumann and Liszt. His interpretations reveal the emotional depth and technical mastery required for these challenging Romantic repertoire pieces.",
    tracklist: `Robert Schumann (1810 – 1856)
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
    shopUrl: "https://shop.avanticlassic.com/products/recital-schumann-liszt-pedro-burmester-1-hybrid-sacd",
    totalTime: "68:24"
  },
  {
    id: "4",
    title: "Schumann: the Violin Sonatas and Fantasiestücke",
    artists: "Dora Schwarzberg, Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/4.jpeg",
    url: "Schumann-the-Violin-Sonatas-and-Fantasiestücke-Dora-Schwarzberg-Polina-Leschenko",
    description: "A stunning collaboration between violinist Dora Schwarzberg and pianist Polina Leschenko exploring Schumann's intimate chamber works. Their musical partnership brings new life to these beloved Romantic compositions.",
    tracklist: `Robert Schumann (1810 – 1856)
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
    shopUrl: "https://shop.avanticlassic.com/products/schumann-the-violin-sonatas-and-fantasiestucke-dora-schwarzberg-polina-leschenoko-1-hybrid-sacd",
    totalTime: "55:55"
  },
  {
    id: "5",
    title: "Klezmer Karma",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/5.jpeg",
    url: "Klezmer-Karma-Roby-Lakatos",
    description: "Roby Lakatos explores the rich traditions of Klezmer music in this passionate and virtuosic recording. Blending traditional melodies with his distinctive gypsy violin style, this album is a celebration of Eastern European musical heritage.",
    tracklist: `1. Klezmer Suite No.1 (Javori/Lakatos) - 03:07
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
    shopUrl: "https://shop.avanticlassic.com/products/klezmer-karma-roby-lakatos-1-cd",
    totalTime: "72:21"
  },
  {
    id: "6",
    title: "Recital Franck • Debussy • Schumann",
    artists: "Dora Schwarzberg, Martha Argerich",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/6.jpeg",
    url: "Recital-Franck-Debussy-Schumann-Dora-Schwarzberg-Martha-Argerich",
    description: "Stunning chamber music collaborations with Martha Argerich, featuring works by Franck, Debussy, and Schumann in intimate and passionate performances.",
    tracklist: `César Franck (1822 - 1890)
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
    shopUrl: "https://shop.avanticlassic.com/products/recital-franck-debussy-schumann-dora-schwarzberg-martha-argerich-1-hybrid-sacd",
    totalTime: "54:06"
  },
  {
    id: "7",
    title: "Liszt Recital",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/7.jpeg",
    url: "Liszt-Recital-Polina-Leschenko",
    description: "Virtuosic interpretations of Liszt's piano masterworks, showcasing Polina Leschenko's technical brilliance and musical insight.",
    tracklist: `Franz Liszt (1811 – 1886)
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
    shopUrl: "https://shop.avanticlassic.com/products/liszt-recital-polina-leschenko-1-hybrid-sacd",
    totalTime: "56:42"
  },
  {
    id: "8",
    title: "Recital",
    artists: "Adriel Gomez-Mansur",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/8.jpeg",
    url: "Recital-Adriel-Gomez-Mansur",
    description: "A vibrant collection of piano recital pieces performed with exceptional artistry and musical sensitivity.",
    tracklist: `Franz Liszt (1811 – 1886)
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
    shopUrl: "https://shop.avanticlassic.com/products/recital-adriel-gomez-mansur-1-hybrid-sacd",
    totalTime: "66:51"
  },
  {
    id: "9",
    title: "La Belle Epoque",
    artists: "Sergio Tiempo, Karin Lechner",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/9.jpeg",
    url: "La Belle Epoque-Sergio-Tiempo-Karin-Lechner",
    description: "A musical journey through the Belle Époque period, featuring exquisite piano four-hands repertoire with bonus DVD content.",
    tracklist: `Darius Milhaud (1892-1974)
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
    shopUrl: "https://shop.avanticlassic.com/products/la-belle-epoque-sergio-tiempo-karin-lechner-1-hybrid-sacd-bonus-dvd",
    totalTime: "64:27"
  },
  {
    id: "10",
    title: "Roby Lakatos with Musical Friends",
    artists: "Roby Lakatos",
    format: "1 CD + 1 Bonus CD",
    imageUrl: "/images/releases/10.jpeg",
    url: "Roby-Lakatos-with-Musical-Friends-Roby-Lakatos",
    description: "Extraordinary collaborations with world-class musicians, featuring jazz, classical, and gypsy fusion with bonus CD.",
    tracklist: `1. 24 Capricio - Nicolo Paganini - 07:23
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
    shopUrl: "https://shop.avanticlassic.com/products/roby-lakatos-with-musical-friends-roby-lakatos-1-cd-1-bonus-cd",
    totalTime: "76:51 + 29:30"
  },
  {
    id: "11",
    title: "Anthology of a Yiddishe Mama",
    artists: "Myriam Fuks",
    format: "1 CD",
    imageUrl: "/images/releases/11.jpeg",
    url: "Anthology-of-a-Yiddishe-Mama-Myriam-Fuks",
    description: "A heartfelt tribute to Yiddish musical traditions, preserving cultural heritage through passionate vocal performances.",
    tracklist: `1. Yosl Koltiar / Henekh Kon - A Nigendl In Yddish - 04:06
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
    shopUrl: "https://shop.avanticlassic.com/products/anthology-of-a-yiddishe-mama-myriam-fuks-1-cd",
    totalTime: "62:14"
  },
  {
    id: "12",
    title: "Goldberg Variations",
    artists: "Alexander Gurning",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/12.jpeg",
    url: "Goldberg-Variations-Alexander-Gurning",
    description: "Bach's Goldberg Variations in masterful interpretation, showcasing both technical precision and musical depth.",
    tracklist: `J.S. Bach (1685-1750)
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
    shopUrl: "https://shop.avanticlassic.com/products/goldberg-variations-alexander-gurning-1-hybrid-sacd",
    totalTime: "48:12"
  },
  {
    id: "13",
    title: "Liszt Totentanz • Tchaikovsky Piano Concerto",
    artists: "Sergio Tiempo",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/13.jpeg",
    url: "Liszt Totentanz-Tchaikovsky-Piano-Concerto-Sergio-Tiempo",
    description: "Powerful interpretations of Romantic piano concertos, featuring Sergio Tiempo's passionate and virtuosic playing.",
    tracklist: `Franz Liszt (1811-1886)
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
    shopUrl: "https://shop.avanticlassic.com/products/liszt-totentanz-tchaikovsky-piano-concerto-sergio-tiempo-1-hybrid-sacd",
    totalTime: "66:21"
  },
  {
    id: "14",
    title: "Tango Rhapsody",
    artists: "Sergio Tiempo, Karin Lechner",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/14.jpeg",
    url: "Tango Rhapsody-Sergio-Tiempo-Karin-Lechner",
    description: "A passionate exploration of tango rhythms and melodies for two pianos, with bonus DVD featuring live performances.",
    tracklist: `1. Astor Piazzolla (1921 – 1992) - Michelangelo '70 (arr. Féderico Jusid) - 03:10
2. Astor Piazzolla - Revirado (arr. Pablo Ziegler) - 03:27
3. Pablo Ziegler (1944) - El Empedrado - 05:49
4. Pablo Ziegler - Sandunga - 04:13
5. Pablo Ziegler - Asflato - 05:17
6.-9. Féderico Jusid (1973) - Tango Rhapsody for 2 pianos and orchestra : concertante-theatrical piece dedicated to Ms Karin Lechner and Mr Sergio Tiempo Asflato - 18:44
10. Pablo Ziegler - Milongueta - 07:57
11. Astor Piazzolla - La Muerte Del Angel (arr. Pablo Ziegler) - 03:23
12. Astor Piazzolla - Adios Nonino (arr. Pablo Ziegler) - 08:30
13. Féderico Jusid - Emilio Kauderer (1950) - The Secret in Their Eyes (arr. Féderico Jusid), theme from the movie 'El secreto de sus ojos' - 03:35`,
    shopUrl: "https://shop.avanticlassic.com/products/tango-rhapsody-sergio-tiempo-karin-lechner-1-hybrid-sacd-bonus-dvd",
    totalTime: "64:05"
  },
  {
    id: "15",
    title: "Forgotten Melodies",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/15.jpeg",
    url: "Forgotten-Melodies-Polina-Leschenko",
    description: "Rediscovering lesser-known piano masterpieces, bringing forgotten gems back to life with sensitive interpretation.",
    tracklist: `1. Mischa Levitzki (1898-1941) - Valse 'Amour', op. 2 - 01:46
2. Arabesque Valsante, op. 6 - Valse 'Amour', op. 2 - 03:16
3.-05 Sergei Rachmaninov (1873-1943) - Piano Sonata no. 2, op. 36 -Horowitz version- - 21:00
6.-13 Nikolai Medtner (1879-1951) - Forgotten Melodies Cycle 1, op. 38 - 35:08`,
    shopUrl: "https://shop.avanticlassic.com/products/forgotten-melodies-polina-leschenko-1-hybrid-sacd",
    totalTime: "61:10"
  },
  {
    id: "16",
    title: "Bruch & Mendelssohn Violin Concertos • Beethoven Romances",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/16.jpeg",
    url: "Bruch&Mendelssohn-Violin-Concertos-Beethoven-Romances-Philippe-Quint",
    description: "Classic violin concertos in brilliant performances, showcasing Philippe Quint's exceptional technique and musicality.",
    tracklist: `Max Bruch (1838-1920)
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
    shopUrl: "https://shop.avanticlassic.com/products/bruch-mendelssohn-violin-concertos-beethoven-romances-philippe-quint-1-hybrid-sacd-bonus-dvd",
    totalTime: "66:23"
  },
  {
    id: "17",
    title: "Recital Haendel • Brahms • Bach • Liszt",
    artists: "Francesco Piemontesi",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/17.jpeg",
    url: "Recital-Haendel-Brahms-Bach-Liszt-Francesco-Piemontesi",
    description: "A masterful journey through Baroque and Romantic piano literature, spanning three centuries of musical evolution.",
    tracklist: `Georg Friedrich Haendel (1685-1759): Suite in B-flat major, HWV 434
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
    shopUrl: "https://shop.avanticlassic.com/products/recital-haendel-brahms-bach-liszt-francesco-piemontesi-1-hybrid-sacd",
    totalTime: "71:16"
  },
  {
    id: "18",
    title: "La Passion",
    artists: "Roby Lakatos",
    format: "2 CD",
    imageUrl: "/images/releases/18.jpeg",
    url: "La Passion-Roby-Lakatos",
    description: "An emotional double album showcasing Lakatos's passionate artistry across diverse musical styles and traditions.",
    tracklist: `CD 1
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
    shopUrl: "https://shop.avanticlassic.com/products/la-passion-roby-lakatos-2-cd",
    totalTime: "132:35"
  },
  {
    id: "19",
    title: "Opera Breve",
    artists: "Philippe Quint, Lily Maisky",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/19.jpeg",
    url: "Opera Breve-Philippe-Quint-Lily-Maisky",
    description: "Opera transcriptions for violin and piano, bringing the drama and beauty of opera to chamber music format.",
    tracklist: `1. Manuel de Falla (1876-1946) - Spanish Dance from la Vida Breve – Arr. Fritz Kreisler - 03:37
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
    shopUrl: "https://shop.avanticlassic.com/products/opera-breve-philippe-quint-lily-maisky-1-hybrid-sacd",
    totalTime: "53:23"
  },
  {
    id: "20",
    title: "Ver Bin Ikh!",
    artists: "Myriam Fuks",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/20.jpeg",
    url: "Ver-Bin-Ikh!-Myriam-Fuks",
    description: "A deeply personal exploration of identity through music, featuring collaborations with renowned artists.",
    tracklist: `1. Vi Ahin Zol Ikh Geyn (S. Korn-Teuer aka Igor S. Korntayer /O. Strokh)
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
    shopUrl: "https://shop.avanticlassic.com/products/ver-bin-ikh-myriam-fuks-1-hybrid-sacd"
  },
  {
    id: "21",
    title: "Tchaikovsky Violin Concerto • Arensky Quintet",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/21.jpeg",
    url: "Tchaikovsky-Violin-Concerto-Arensky-Quintet-Philippe-Quint",
    description: "Masterful performances of Russian chamber and concerto music, highlighting the lyrical beauty of these works.",
    tracklist: `Piotr Illitch Tchaikovsky (1840–1893)
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
    shopUrl: "https://shop.avanticlassic.com/products/tchaikovsky-violin-concerto-arensky-quintet-philippe-quint-1-hybrid-sacd",
    totalTime: "74:56"
  },
  {
    id: "22",
    title: "The Four Seasons",
    artists: "Roby Lakatos",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/22.jpeg",
    url: "The-Four-Seasons-Roby-Lakatos",
    description: "Vivaldi's Four Seasons with contemporary interpretations, blending classical tradition with gypsy virtuosity.",
    tracklist: `Kálmán Cséki (1962)
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

19. Ilia II of Georgia (1933) - Ave Maria`,
    shopUrl: "https://shop.avanticlassic.com/products/the-four-seasons-roby-lakatos-1-hybrid-sacd"
  },
  {
    id: "23",
    title: "Bach XXI",
    artists: "Matt Herskovitz Trio, Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/23.jpeg",
    url: "Bach-XXI-Matt-Herskovitz-Trio-Philippe-Quint",
    description: "Bach's timeless music in contemporary arrangements, bringing new life to eternal masterpieces."
  },
  {
    id: "24",
    title: "Khachaturian & Glazunov Violin Concertos",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/24.jpeg",
    url: "Khachaturian&Glazunov-Violin-Concertos-Philippe-Quint",
    description: "Brilliant performances of 20th-century violin concertos, showcasing the rich harmonic language of these works."
  },
  {
    id: "25",
    title: "Homilia",
    artists: "Manu Comté, B'Strings Quintet",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/25.jpeg",
    url: "Homilia-Manu-Comté-B'Strings-Quintet",
    description: "Contemporary tango compositions featuring bandoneon and strings in innovative arrangements."
  },
  {
    id: "26",
    title: "Legacy",
    artists: "Sergio Tiempo",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/26.jpeg",
    url: "Legacy-Sergio-Tiempo",
    description: "A comprehensive collection spanning classical to contemporary repertoire, showcasing artistic versatility."
  },
  {
    id: "27",
    title: "Tribute to Stephane & Django",
    artists: "Roby Lakatos, Bireli Lagrene",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/27.jpeg",
    url: "Tribute-to-Stephane&Django-Roby-Lakatos&Bireli-Lagrene",
    description: "A masterful tribute to the legendary gypsy jazz duo, featuring virtuosic performances and authentic style."
  },
  {
    id: "28",
    title: "Rendez-vous with Martha Argerich",
    artists: "Martha Argerich",
    format: "7CD",
    imageUrl: "/images/releases/28.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Martha-Argerich",
    description: "An extraordinary 7-CD collection of collaborations with Martha Argerich, spanning chamber music masterpieces."
  },
  {
    id: "29",
    title: "Morgen",
    artists: "Evgeni Bozhanov",
    format: "1 CD",
    imageUrl: "/images/releases/29.jpeg",
    url: "Morgen-Evgeni-Bozhanov",
    description: "Sublime interpretations of Schubert and Brahms, showcasing lyrical beauty and emotional depth."
  },
  {
    id: "30",
    title: "Peacock",
    artists: "Dr L. Subramaniam, Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/30.jpeg",
    url: "Peacock-Dr-L.-Subramaniam-Roby-Lakatos",
    description: "An East-meets-West fusion of Indian classical and gypsy violin, creating a unique musical dialogue."
  },
  {
    id: "31",
    title: "Rendez-vous with Martha Argerich - Volume 2",
    artists: "Martha Argerich",
    format: "6 CD",
    imageUrl: "/images/releases/31.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Volume-2",
    description: "The second volume of chamber music collaborations, continuing the exploration of musical partnerships."
  },
  {
    id: "32",
    title: "Sonatas Op. 120 - Four Serious Songs Op. 121",
    artists: "Alexander Kniazev, Kasparas Uinskas",
    format: "1 CD",
    imageUrl: "/images/releases/32.jpeg",
    url: "Sonatas-Op.-120-Four-Serious-Songs-Op.-121-Alexander-Kniazev-Kasparas-Uinskas",
    description: "Late Brahms masterworks for cello and piano, exploring the composer's final musical thoughts."
  },
  {
    id: "33",
    title: "Wunderhorn",
    artists: "Dietrich Henschel, Bochumer Symphoniker, Steven Sloane",
    format: "2 CD",
    imageUrl: "/images/releases/33.jpeg",
    url: "Wunderhorn-Dietrich-Henschel-Bochumer-Symphoniker-Steven-Sloane",
    description: "Mahler's complete Des Knaben Wunderhorn song cycle, featuring rich orchestral textures and vocal artistry."
  },
  {
    id: "34",
    title: "Martha Argerich plays Beethoven & Ravel",
    artists: "Martha Argerich",
    format: "1 CD",
    imageUrl: "/images/releases/34.jpeg",
    url: "Martha-Argerich-plays-Beethoven&Ravel-IPO-Lahav-Shani",
    description: "Iconic piano concertos with the Israel Philharmonic Orchestra, showcasing Argerich's legendary artistry."
  },
  {
    id: "35",
    title: "HOMMAGE",
    artists: "Sergio Tiempo",
    format: "1 CD",
    imageUrl: "/images/releases/35.jpeg",
    url: "HOMMAGE-Sergio-Tiempo",
    description: "A heartfelt tribute featuring collaborations with great artists, celebrating musical friendships and influences."
  },
  {
    id: "36",
    title: "Rendez-vous with Martha Argerich - Volume 3",
    artists: "Martha Argerich",
    format: "7 CD",
    imageUrl: "/images/releases/36.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Volume-3",
    description: "The third comprehensive volume of chamber music collaborations, completing this remarkable series."
  },
  {
    id: "37",
    title: "World Tangos Odyssey",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/37.jpeg",
    url: "WORLD-TANGOS-ODYSSEY",
    description: "A global journey through tango traditions from around the world, showcasing diverse cultural influences.",
    tracklist: `Carlos Gardel (1890-1935)
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
Sebastian Wypych : conductor, artistic director & founder`,
    shopUrl: "https://shop.avanticlassic.com/products/world-tangos-odyssey-1-cd",
    totalTime: "77:08"
  }
]

export default async function ReleaseDetailPage({ params }: { params: { id: string } }) {
  // Try to get release from API
  let release = await getRelease(params.id)
  
  // If API fails, try to find in fallback data by ID or URL
  if (!release) {
    const decodedId = decodeURIComponent(params.id)
    release = fallbackReleases.find((r) => 
      r.id === params.id || 
      r.url === params.id ||
      r.id === decodedId || 
      r.url === decodedId
    )
  }

  if (!release) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Release Not Found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">The release you are looking for does not exist.</p>
        <Button asChild className="mt-8">
          <Link href="/releases">Back to Releases</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
        >
          <Link href="/releases">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Releases
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1 flex flex-col items-center space-y-4">
          <Image
            src={release.imageUrl || "/placeholder.svg"}
            width={500}
            height={500}
            alt={release.title}
            className="rounded-lg object-cover aspect-square shadow-lg"
            priority
          />
          {/* Artist Links */}
          <ArtistLinks artistsString={release.artists} />
        </div>
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">{release.title}</h1>
          <p className="text-xl text-primary font-semibold">{release.artists}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">{release.format}</p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {release.description}
            </p>
          </div>

          {release.totalTime && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Time: {release.totalTime}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-6">
            <Button asChild variant="outline" size="sm">
              <Link href={`/shop/releases/${release.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Buy
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Spotify
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Apple Music
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tracklist Section */}
      {release.tracklist && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">Tracklist</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
              {release.tracklist}
            </pre>
          </div>
        </div>
      )}

      {/* More from this artist section */}
      <MoreFromArtist currentReleaseId={release.id} artistName={release.artists.split(',')[0].trim()} />
    </div>
  )
}

// Artist Links Component
function ArtistLinks({ artistsString }: { artistsString: string }) {
  // List of Avanticlassic artists with their URLs
  const avanticlassicArtists = [
    { name: "Martha Argerich", url: "Martha-Argerich" },
    { name: "Evgeni Bozhanov", url: "Evgeni-Bozhanov" },
    { name: "Pedro Burmester", url: "Pedro-Burmester" },
    { name: "Manu Comté", url: "Manu-Comté" },
    { name: "Myriam Fuks", url: "Myriam-Fuks" },
    { name: "Adriel Gomez-Mansur", url: "Adriel-Gomez-Mansur" },
    { name: "Adriel Gomez Mansur", url: "Adriel-Gomez-Mansur" },
    { name: "Alexander Gurning", url: "Alexander-Gurning" },
    { name: "Baritone Dietrich Henschel", url: "Baritone-Dietrich-Henschel" },
    { name: "Dietrich Henschel", url: "Baritone-Dietrich-Henschel" },
    { name: "Alexander Kniazev", url: "Alexander-Kniazev" },
    { name: "Roby Lakatos", url: "Roby-Lakatos" },
    { name: "Karin Lechner", url: "Karin-Lechner" },
    { name: "Polina Leschenko", url: "Polina-Leschenko" },
    { name: "Lily Maisky", url: "Lily-Maisky" },
    { name: "Francesco Piemontesi", url: "Francesco-Piemontesi" },
    { name: "Philippe Quint", url: "Philippe-Quint" },
    { name: "Dora Schwarzberg", url: "Dora-Schwarzberg" },
    { name: "Steven Sloane", url: "Steven-Sloane" },
    { name: "Sergio Tiempo", url: "Sergio-Tiempo" },
    { name: "Kasparas Uinskas", url: "Kasparas-Uinskas" }
  ]

  // Parse artist string - handle various separators
  const artists = artistsString.split(/[,&]|\band\b/).map(artist => artist.trim()).filter(artist => artist.length > 0)

  return (
    <div className="text-center space-y-2">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Artists</h3>
      <div className="flex flex-col space-y-1">
        {artists.map((artist, index) => {
          // Check if this artist is part of Avanticlassic roster
          const avantiArtist = avanticlassicArtists.find(a => 
            a.name.toLowerCase() === artist.toLowerCase() ||
            artist.toLowerCase().includes(a.name.toLowerCase()) ||
            a.name.toLowerCase().includes(artist.toLowerCase())
          )

          if (avantiArtist) {
            return (
              <Link 
                key={index}
                href={`/artists/${avantiArtist.url}`}
                className="text-primary hover:text-primary/80 font-medium transition-colors text-sm"
              >
                {artist}
              </Link>
            )
          } else {
            return (
              <span key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                {artist}
              </span>
            )
          }
        })}
      </div>
    </div>
  )
}

function MoreFromArtist({ currentReleaseId, artistName }: { currentReleaseId: string; artistName: string }) {
  // Filter releases by the same artist, excluding the current release
  const artistReleases = fallbackReleases.filter(release => 
    release.artists.includes(artistName) && release.id !== currentReleaseId
  ).slice(0, 4) // Show max 4 related releases

  if (artistReleases.length === 0) {
    return null
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
        More from {artistName}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artistReleases.map((release) => (
          <Link key={release.id} href={`/releases/${release.url || release.id}`} className="block">
            <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105">
              <CardContent className="p-0">
                <Image
                  src={release.imageUrl || "/placeholder.svg"}
                  width={200}
                  height={200}
                  alt={release.title}
                  className="w-full h-auto object-cover aspect-square"
                />
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-xs line-clamp-2 min-h-[2em] text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{release.format}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}