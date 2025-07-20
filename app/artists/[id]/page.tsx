"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ExternalLink } from "lucide-react"
import { Facebook, Youtube, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Artist {
  id: string
  name: string
  instrument: string
  imageUrl: string
  bio: string
  url?: string
  facebook?: string
  youtube?: string
  website?: string
}

interface Release {
  id: string
  title: string
  artists: string
  format: string
  imageUrl: string
  url?: string
}

async function getArtist(id: string, language: string) {
  try {
    // First try the API for real database data
    const response = await fetch(`/api/artists/${encodeURIComponent(id)}?lang=${language}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error fetching artist from API:', error)
  }
  return null
}

async function getArtistReleases(artistName: string) {
  try {
    const response = await fetch(`/api/releases/by-artist/${encodeURIComponent(artistName)}`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return { releases: data.releases || [] }
    }
  } catch (error) {
    console.error('Error fetching artist releases:', error)
  }
  return { releases: [] }
}

// Complete fallback artist data with proper bios from original multilingual content
const fallbackArtists: Artist[] = [
  {
    id: "1",
    name: "Martha Argerich",
    instrument: "Piano",
    imageUrl: "/images/artists/1-800.jpeg",
    url: "Martha-Argerich",
    bio: "Martha Argerich was born in Argentina and made her debut at the age of five. While still a child she gave recitals in Buenos Aires at the Astral and the Colón before moving to Europe where she studied with Friedrich Gulda, Nikita Magaloff and Michelangeli.<br><br>At the age of sixteen, Argerich won the Geneva International Music Competition and the Busoni Competition. In 1964 she toured Western Europe and Poland before making her London debut in November that year. In 1965 she won the Seventh Warsaw International Chopin Competition and the Polish Radio Prize for her performances of Chopin Waltzes and Mazurkas. As this collection of awards shows, her technical skills are among the most formidable of her generation and her playing is notable for its uninhibited brilliance. It is therefore no surprise that she is considered to be one of the greatest pianists of our time, among such renowned pianists as Michelangeli, Horowitz, and Maurizio Pollini.<br><br>In december 2005 Martha Argerich recorded her first studio album for a non-major studio for avanticlassic.",
    facebook: "https://www.facebook.com/groups/107946371992/"
  },
  {
    id: "2",
    name: "Evgeni Bozhanov",
    instrument: "Piano",
    imageUrl: "/images/artists/2-800.jpeg",
    url: "Evgeni-Bozhanov",
    bio: "Born in 1984, in Bulgaria, Evgeni Bozhanov completed his studies in Essen and Düsseldorf (Germany) with Prof. Boris Bloch and Prof. Georg Friedrich Schenck. His international career launched following top prizes at international competitions including the Sviatoslav Richter International Piano Competition in Moscow, Queen Elisabeth Competition in Brussels, Van Cliburn International Piano Competition in Fort Worth, Texas and International Chopin Competition in Warsaw.<br><br>In the past seasons Evgeni has appeared as a soloist with orchestras including the National Orchestra of Belgium, Philharmonia Orchestra, Royal Liverpool Philharmonic Orchestra, Bavarian Radio Chamber Orchestra, Haydn Orchestra of Bolzano, RAI National Symphony Orchestra, Malmö Symphony Orchestra, Hyogo Performing Arts Centre Orchestra, and Ensemble Wien (soloists of the Vienna Philharmonic), and has presented recitals at the Lille Piano Festival, Festival de La Roque d'Anthéron, Bad Kissingen Summer Festival, Musikverein Vienna, the Suntory Hall, the Philharmonie Berlin, Serate Musicali Milan, the Schubertiade Vilabertan (Spain), the Gulbenkian Foundation Lisbon, amongst others.<br><br>Highlights from recent seasons include concerts with the Royal Liverpool Philharmonic Orchestra, Malmö Symphony, Athens State Orchestra, Chamber Orchestra of the Bavarian Radio, Filarmonica Arturo Toscanini, Haydn Orchestra Bolzano and the Orchestra dell'Accademia Nazionale di Santa Cecilia in Rome. Alongside, Evgeni appeared also at the Flanders Festival Gent, Piano Festival di Brescia Bergamo, and gave further recitals in Munich, Lison, Coimbra, Milano and Palermo. He returned to the Royal Festival Hall, London, with the Philharmonia Orchestra, this time under the baton of Juraj Valcuha and with Yutaka Sado at the Wiener Musikverein. He accomplished his fifth tour to Japan and return to the United States to present concerts with the Houston Symphony Orchestra.",
    facebook: "https://www.facebook.com/Evgeni-Bozhanov-Pianist-1744307882540703/"
  },
  {
    id: "3",
    name: "Pedro Burmester",
    instrument: "Piano",
    imageUrl: "/images/artists/3-800.jpeg",
    url: "Pedro-Burmester",
    bio: "Born in Porto (Portugal) in 1963, Pedro Burmester gave his first recital at the age of ten. He studied for ten years with Helena Costa, and worked with Léon Fleischer and Dmitri Paperno. He also attended the masterclasses of Jörg Demus, Aldo Ciccolini, Karl Engel, Vladimir Ashkenazy, Tatjana Nikolaiewa and Elisabeth Leonskaja.<br><br>In 1983, he won second prize at the International 'Vianna da Mota' piano competition in Lisbon. He was awarded the Jury prize at the 1989 Van Cliburn Competition in the US and has won several Portuguese national piano competitions.<br><br>As well as being regularly invited to perform all over Portugal, he has played in the main festivals in Belgium (Flanders and Wallonie Festival's), France (Roque d'Anthéron), Germany (the Klavierfestival Ruhr and the Sommerliche Musiktage Hitzacker), Italy and the UK (Belfast Festival).<br><br>He has toured in Australia, Japan (with the Metropolitan Orchestra), Latin America, Poland, South Africa and the US and has been invited to perform by the 92nd Y-series and the Frick Collection in New York, the Salle Gaveau and Châtelet in Paris, the Kölner Philharmonie in Cologne, De Doelen in Rotterdam, the Gewandhaus in Leipzig, and the Beethoven-Haus in Bonn, as well as various German radio stations including Radio Bremen and WDR-Köln.<br><br>He has performed with many well-known orchestras including: the Australian Chamber Orchestra; the Belgian National Opera Orchestra; the Rotterdam Philharmonic and the Nederlands Kamerorkest (the Netherlands); the Gulbenkian Orchestra (Portugal) and the Northern Sinfonia (UK), and was invited by Sir Georg Solti to perform Beethoven V with the London Symphony Orchestra at the opening concert of 'Lisbon, Cultural Capital of Europe 1994'.<br><br>Pedro Burmester is also very much at ease in chamber music and has played, amongst others, with Anner Bylsma (cello), Mischa Maisky (cello), Thomas Zehetmair (violin) and the Prazak Quartet.",
    facebook: "https://www.facebook.com/pedroburmester1/"
  },
  {
    id: "4",
    name: "Manu Comté",
    instrument: "Bandoneon",
    imageUrl: "/images/artists/4-800.jpeg",
    url: "Manu-Comte",
    bio: "Manu Comté started learning music at the age of 7 with the accordion of his father. Granted with a higher diploma for accordion and a first price for chamber music at the Royal Academy of Mons (Belgium), both magna cum laude, Manu Comté was also awarded with a first price at the \\\"Lili and Nadia Boulanger\\\" Academy in Paris. He then graduated from the Superior Institute of Music of Namur (Belgium) in musical pedagogy. Prize winner of many contests in Belgium and abroad, Manu Comté continued his studies with professors and pedagogues Jacques Mornet (Auvergne) and Frederic Deschamps (Paris), among others, and followed masterclasses in France and Italy with Richard Galliano.<br><br>Manu Comté devotes a great part of his activity to the practice of the Bandoneon, under the advices of Alfredo Marcucci. Passionate by the work of Astor Piazzolla, he founded in 1995 the Soledad Ensemble (accordion/bandoneon, violin, piano, guitar, double bass), whose fame became rapidly international.<br><br>Today, Manu Comté performs throughout the world (France, Netherlands, Switzerland, Germany, Italy, Spain, Portugal, Denmark, Finland, Scotland, Poland, Russia, Lithuania, Brasil, Japan, Taiwan, the United States, Lebanon, Argentina…) as a member of various ensembles and as soloist in a wide range of repertoires; from Tango Nuevo to contemporary music, from jazz to French songwriting. His musical activities are shared between performances, composition and arrangements for the stage.<br><br>It was at the age of 7 that he began his apprenticeship with his father's accordion. At 14, Manu County discovers the classic accordion. His musical studies at the Royal Conservatory of Music in Mons (Belgium) are rewarded with a Higher Accordion Diploma and a 1st prize in chamber music, both awarded with the highest distinctions and congratulations from the jury. He then obtained a first prize from the city of Paris (France) with the greatest distinction and the congratulations of the jury at the \\\"Lili et Nadia Boulanger\\\" Conservatory (Paris IX). He is also a graduate of the Higher Institute of Music and Pedagogy of Namur (Belgium), music pedagogy section. The composition of original music and the creation of music or arrangements for theater, cinema, …are also part of his musical activity. Manu Comté has won numerous competitions in Belgium (Axion Classics competition, televised competition \\\"young soloists\\\" from RTBF, …) and abroad (competition \\\"young soloists\\\" from European regions, World Trophies accordion in Germany and Italy, …) . It was during the preparation of these competitions that he worked with teachers and pedagogues such as, Jacques Mornet (cnima), Frédéric Deschamps (Paris), … He participated in Jazz Mastersclasses with Richard Galliano in France (1998) and in Italy ( 2007). He also devoted himself to the practice of the bandoneon under the wise advice of Alfredo Marcucci, a famous Argentine bandoneonist.Passionate about the work of Astor Piazzolla, he founded in 1995 \\\"Soledad\\\" (accordion / bandoneon, violin, piano, guitar, double bass), whose renown is today international. Soledad performs on the biggest stages of the world like, the Santory Hall of Tokyo, the festival of La Roque d'Anthéron, the Concertgebouw of Amsterdam, the Palais des festivals in Cannes, the Montreal Jazz festival, the New Morning in Paris, the Miami Chamber Music Festival, the Palais des Congrès de Paris, the Lugano Festival, FLAGEY, BOZAR, … This year Soledad celebrates its 20 years as a trio, a homecoming in an intimate and prestigious guests.Manu Comté has participated in numerous concerts and festivals as a chamber musician and soloist (France, Netherlands, Switzerland, Germany, Italy, Spain, Portugal, Denmark, Finland, Scotland, Poland, Russia, Lithuania, Brazil, Japan, Taiwan, United States , Lebanon, Norway, …), in eclectic repertoires ranging from tango nuevo to contemporary music through jazz and French song. This year Manu Comté will give concerts, notably in Belgium, France, Italy, and for the first time in 2015 in Argentina with Gerardo Jerez Le Cam and the \\\"National Symphonic Orchestra of Argentina\\\", …",
    facebook: "https://www.facebook.com/manu.comte"
  },
  {
    id: "5",
    name: "Myriam Fuks",
    instrument: "Vocals",
    imageUrl: "/images/artists/5-800.jpeg",
    url: "Myriam-Fuks",
    bio: "Myriam Fuks was born in Tel Aviv with Yiddish in her blood. Her mother, Franja Glasman, was an actress in one of Europe's leading Yiddish theatres: the Kaminsky theater of Warsaw. Her uncle was a Yiddish poet and journalist. At the age of 12, Myriam Fuks joined the Yiddish Ykult theatre in Brussels. In 1974, she returned to Israel and became famous thanks to a song contest which was broadcast on national television. By 1984, her fame had spread to New York. Her recordings are acclaimed throughout the world. Myriam sings her love for Yiddish both on television and in the concert halls of Europe. Music is her natural language, and Yiddish is for her the language of emotion, of expressing the joy, the sadness, and the story of the people from a time and place when music and songs were a part of everyday life. Myriam Fuks is also an actress and recently completed filming 'A Secret' directed by Claude Miller, starring the French actors Patrick Bruel, Cecile de France and Julie Depardieu.",
    facebook: "https://www.facebook.com/Myriam-Fuks-344297292180"
  },
  {
    id: "6",
    name: "Adriel Gomez-Mansur",
    instrument: "Piano",
    imageUrl: "/images/artists/6-800.jpeg",
    url: "Adriel-Gomez-Mansur",
    bio: "Born in Buenos Aires, Argentina, in 1989, Adriel began to learn the piano at the age of four. In the following years he became a student of René Tesco, Antonio De Raco, Carmen Scalcione and, currently, Luis Lugo. Nelson Gœrner, Ralph Votapek, Alan Weiss, Andrea Lucchesini, Alexis Golovine, Akiko Ebi, Roberto Urbay and Zenaida Manfugas also give him classes. At the age of seven, Adriel made his first appearances in Argentina's concert halls as well as on television. In 2001 and 2002, he featured in the Martha Argerich Festival in Buenos Aires and, in 2003, the Festival Llao di Bariloche. The same year, he was nominated a 'revelation' in Classical Music category of the Clarín Prize. In 2004, he won a special award from the Argentinean music critics association as well as the first prize at the 7th Concurso Bienal of the Festivales Musicales. In 2005, Martha Argerich invited Adriel to her festival in Lugano and, in 2006, to the Meeting Point in Beppu, Japan.<br><br>André Delacroix of Resmusica (www.resmusica.com) is correct when he write of Adriel's concert at the 25th Festival de la Roque at Anthéron: \\\"He plays the Second, Third and Fourth Impromptu of Schubert, Rachmaninoff's Prelude in G sharp minor, and the Etudes no. 1 and no. 12 of Scriabine. His play is characterized by clarity, finesse and emotion. Lines of great purity, a subtle and elegant phrasing and a technically impressive play win over the audience. With his delicacy, generosity and profound respect for the composition, avoiding all affectation, he makes the notes shine and jingle as they softly disappear into the clear night. A great pianist is born.\\\"<br><br>For his first recording, Adriel has picked some of the pieces he played at that concert. Schubert's three last Impromptus (op. 20), plus four Preludes of Rachmaninoff, two Etudes of Scriabine, two pieces of Liszt and Schumann and one of Chopin: it is a veritable recital of 'encores' that also potentially poses a risk for this young pianist because all great virtuosos have immortalised themselves in this repertoire, and their names remain indelibly associated with this music (one thinks of Rachmaninoff, of course, but also of Paderewski, Horowitz, Rubinstein and so many others). Adriel thus invites comparisons. David against Goliath? It is up to you to judge.<br><br>avanticlassic is proud to present this major revelation to you. Enjoy the music!",
    facebook: "https://www.facebook.com/Adriel-Gomez-Mansur-365569273133"
  },
  {
    id: "7",
    name: "Alexander Gurning",
    instrument: "Piano",
    imageUrl: "/images/artists/7-800.jpeg",
    url: "Alexander-Gurning",
    bio: "Born in Belgium in 1973 to Polish and Indonesian parents, Alexander Gurning studied at the Royal Conservatory of Brussels. After completing his studies, he served for three years as assistant to the world-renowned Russian pianist Evgeny Moguilevsky. Soon after, Alexander moved to Moscow to attend further classes with Lev Naumov (once an assistant of Heinrich Neuhaus) and Victor Merzhanov (a representative of the Goldenweiser School) at the Moscow Conservatory.<br><br>Since then, Alexander Gurning has never stopped touring. He has appeared in world-renowned festivals such as the Progetto Martha Argerich in Lugano, the Schleswig-Holstein Musik Festival, the Festival International de Piano of La Roque d'Anthéron, the Sapporo Music Festival, the International Piano Festival of Obidos, the Saratoga Chamber Music Festival, the Tanglewood Music Festival, and the Verbier Festivals.<br><br>Alexander Gurning has played with the Boston Symphony Orchestra, the Philadelphia Orchestra, the Orchestra della Svizzera Italiana, the Orchestre Philharmonique de Radio France, the Orchestre National de Belgique, the Philharmonic Orchestra of Brussels or the Orchestre de Chambre de Lausanne with conductors such as Myung-Whun Chung, Charles Dutoit, Alexander Rabinovitch-Barakovsky and Christian Zacharias. Recently, Alexander toured Europe performing Bach's Goldberg Variations to great acclaim.<br><br>The recording career of Alexander Gurning started with a 'Choc' award from French magazine Le Monde de la Musique for his very first solo album, in the series 'Martha Argerich Presents', featuring works by Stravinsky and Debussy. His other recording collaborations include frequent appearances with various prestigious musical friends in the annual EMI boxes of live recordings from the Lugano Music Festival. Alexander received another award from French magazine Diapason as pianist of the Talweg trio, together with Sébastien Surel (violin) and Sébastien Walnier (cello), for their Tchaikovsky/Shostakovich album.<br><br>Alexander Gurning is also a founding member of the world-renowned Soledad ensemble specialized in renewing the tradition of Tango. Together with Manu Comté (accordion and bandoneon), Jean-Frédéric Molard (violin), Patrick Schuyer (guitar) and Géry Cambier (bass), Soledad has had a tremendous success with acclaimed albums on the labels Virgin Classics and ENja.<br><br>Alexander's superb classical technique, combined with a musical horizon embracing not only classical music but also jazz, world music and film music, make him one of the most fascinating, revered and accomplished artists of his generation.",
    facebook: "https://www.facebook.com/agurning"
  },
  {
    id: "8",
    name: "Dietrich Henschel",
    instrument: "Baritone",
    imageUrl: "/images/artists/8-800.jpeg",
    url: "Baritone-Dietrich-Henschel",
    bio: "Baritone Dietrich Henschel is a towering figure, physically, intellectually, musically and theatrically. His prowess as an interpreter, by which I mean precisely his ability to get below the surface of a song and right into its soul, is extraordinary. Herald Scotland Baritone Dietrich Henschel captivates audiences as a regular guest at major opera houses, an esteemed interpreter of lieder and oratorios as well as with his multimedia projects. His repertoire stretches from Monteverdi to the avant-garde. Born in Berlin and having grown up in Nuremberg, he made his debut in 1990 at the Munich Biennale for New Music and first became known internationally from 1997, following a period as an ensemble member of the Opera Kiel. At the Deutsche Oper Berlin he took the title role in Hans Werner Henze's Prinz von Homburg, staged by Götz Friedrich, and he made an outstanding lead performance in Busoni's Doktor Faust at the Opéra de Lyon and the Théâtre du Châtelet in Paris, for which he was awarded a Grammy.<br><br>The singer's major roles include Rossini's Figaro, Wolfram in Wagner's Tannhäuser, Monteverdi's Ulisse and Orfeo, Mozart's Don Giovanni, Beckmesser in Wagner's Die Meistersingervon Nürnberg, Alban Berg's Wozzeckand Dr. Schön in Lulu, Golaud in Debussy's Pelléas et Mélisande and Nick Shadow in Stravinsky's The Rake's Progress, with which he makes regular appearances at the major European opera houses. Contemporary composers such as Péter Eötvös, Detlev Glanert, Manfred Trojahn, Unsuk Chin, Peter Ruzicka and José-Maria Sanchez-Verdu have all dedicated leading operatic roles in their operas to the baritone.<br><br>In addition to his operatic work, Dietrich Henschel is committed to the performance of lieder and concert works for voice. In orchestral concerts he has worked with conductors such as Riccardo Chailly, Kent Nagano, Sylvain Cambreling and Semyon Bychkov. His collaborations with John Eliot Gardiner, Philippe Herreweghe, Nikolaus Harnoncourt and Colin Davis is documented on numerous oratorio recordings. Dietrich Henschel has a particular focus on theatrical and multimedia presentations of vocal music. He has performed staged versions of Schubert lieder cycles at La Monnaie, Theater an der Wien, Den Norske Opera Oslo and the Komische Oper Berlin, among others. In the project IRRSAL – Triptychon einer verbotenen Liebe, featuring the orchestral songs of Hugo Wolf, he combined film and live concert; his project featuring songs by Gustav Mahler, WUNDERHORN, was also a collaboration with director Clara Pons, and was developed as a co-production between several European partners including De Doelen, La Monnaie and the BBC Symphony Orchestra London.<br><br>Last season, Dietrich Henschel presented a diverse repertoire, including a performance of Haydn's The Creation with the Tokyo Metropolitan Symphony Orchestra under Kazushi Ono, and a tour with the Orchestre des Champs-Élysées under Philippe Herreweghe with orchestral songs by Hugo Wolf and Gustav Mahler. At the opening concert of the Oxford Lieder Festival he performed Mahler's Lied von der Erde with the Orchestra of the Age of Enlightenment; he subsequently went on to perform at the opening concert of Wien Modern, where he took the part of Jean Charles in Hans Werner Henze's Floß der Medusa under the direction of Cornelius Meister. The new season begins at La Monnaie, where he will take the part of the Speaker in The Magic Flute staged by Romeo Castellucci. He will also reprise the title role in Peter Ruzicka's new opera Benjamin at the State Opera Hamburg. He received critical praise for the world premiere of the work in June 2018: \"Baritone Dietrich Henschel was a credible and direct Benjamin, both in terms of his acting and his immaculate vocal performance (…) a godsend for the production,\" wrote the Spiegel Online. In May 2019 he will play Martin Luther in the world premiere of Bo Holten's opera Schlagt sie tot! in Malmö. Concert engagements take him to the Suntory Hall Tokyo for a performance of Schoenberg's Gurrelieder with the Yomiuri Nippon Symphony Orchestra under Sylvain Cambreling, as well as to the Tonhalle Orchestra Zürich for the world premiere of a piece by Matthias Pintscher under Kent Nagano. At the Philharmonie Berlin he will perform Haydn's The Seasons with the Berlin Radio Symphony Orchestra and Vladimir Jurowski."
  },
  {
    id: "9",
    name: "Alexander Kniazev",
    instrument: "Cello",
    imageUrl: "/images/artists/9-800.jpeg",
    url: "Alexander-Kniazev",
    bio: "One of the most powerful and enigmatic cellists, Alexander Kniazev was born in 1961 in Moscow. He started to study cello at the age of six with Alexander Fedorchenko and graduated from the Moscow Conservatoire in 1986.<br><br>He is a prize-winner of the National Competition (Vilnius, Lithuania), of the Cassado International Competition (Florence, Italy), of the Chamber Music International Competition, in the ensemble with Ekaterina Voskressenskaya (Trapani, Italy), of the Tchaikovsky International Competition (Moscow, Russia), and in the UNISA International Competition (Pretoria, South-Africa).<br><br>He has played with such world-famous conductors as Evgeny Svetlanov, Yuri Temirkanov, Kurt Masur, Mstislav Rostropovich, Vladimir Fedoseev, Mikhail Pletnev, Neeme Jarvi, Yuri Bashmet, Alexander Vedernikov, Pinchas Steinberg, Mark Gorenstein, Stéphane Denève and Charles Dutoit. He has performed with Orchestras such as the London Royal Philharmonic, the BBC Orchestra of London, the Bavarian Radio Symphony Orchestra, the Gothenburg Symphony Orchestra, the Baltimore Symphony Orchestra, the NHK Symphony Orchestra, the Tokyo Symphony, the Wiener Symphoniker, the Resident-Orchestra of the Hague, the Ensemble Orchestral de Paris, the Orchestre National de France, the Theatre Venice Orchestra, the Budapest Festival Orchestra, the State Academic Symphony Orchestra of Russia, the St. Petersburg Philharmonic Orchestra, the Tchaikovsky Symphony Orchestra, the Irish Symphony Orchestra, the Prague Symphony and the Praque Philharmonic Orchestra, the Luxembourg Symphony Orchestra, the Moscow Soloists Orchestra and many others.<br><br>His partners include pianists Evgeny Kissin, Nikolai Lugansky, Boris Berezovsky, Elisabeth Leonskaya, Denis Matsuev, Brigitte Engerer, Mikhail Voskressensky, Kasparas Uinskas, Valery Afanassiev, Plamena Mangova, Khatia Skanavi; violinists Viktor Tretyakov, Vadim Repin, Sergei Krylov, Vladimir Spivakov, Augustin Dumay, Dmitir Makhtin; violist Yuri Bashmet; organists Jean Guillou, Edward Oganessian, the Prazak Quartet, and many others.<br><br>In 1998, 2002 and 2015 Alexander Kniazev was a member of the Jury at the Tchaikovsky International Competition in Moscow.<br><br>Alexander Kniazev has performed in such world-famous halls as the Royal Festival Hall and Wigmore Hall (London), the Theatre des Champs-Elysees, the Louvre auditorium and the Salle Pleyel (Paris), the Musikverein and the Konzerthaus (Vienna), the Concertgebouw (Amsterdam), the Mozarteum of Salzburg, the Rudolfinum Hall in Prague, the Suntory Hall (Tokyo), the Auditorium di Milano (Italy) and Bozar in Brussels.<br><br>Alexander Kniazev regulary gives masterclasses in Oviedo, Seoul, Manila, Colmar, Bad-Kissingen, Belgrade and in many cites in Russia.<br><br>Among the last great events in his career, we find a triumphal debut at the Musikverein (Vienna) with the Russian Tchaikovsky Orchestra conducted by Vladimir Fedoseev. As an organist, in 1991 Alexander Kniazev graduated from the Nizhny Novgorod Conservatoire where he studied with the well-known Russian organist Professor Galina Kozlova. His organ's concert activity starting just afterwards. He played in such important halls as the Great Hall in Moscow, the Capella in St. Peterburg and many other organs in Russia. He was invited to play the famous organ in Saint Eustashe and Cathedrale Notre-Dame (France). In 2010 he played at the festival of Radio France in Montpellier (the complete Trio-sonates of J.S. Bach). In 2011, he made his debut in the Great Hall of St. Peterburg. His repertoire included many works by J.S. Bach, Mozart, Handel and Haydn, but also romantic music by Mendelssohn, Schumann, Brahms and Franck. In 2012 Alexander Kniazev was invited as president of the Russian Organ Competition in Kaliningrad.<br><br>He played in Germany, in Japan (Tokyo Casals-Hall), in the Republic of South Africa (Pretoria), in the Great Hall of Sofia Philarmonic, in Ukraine, in Estonia, in the organ of the Riga Cathedral of Latvia (Dom) where he recorded his first CD ('18 Leipzig Chorals' of J.S. Bach). His last recording is J.S. Bach's Goldberg Variations (transcribed by Jean Guillou).<br><br>The 21th century widened the touring scope of Alexander Kniazev. It started with a tour in Japan (both as a cellist and organist), concerts in Luxembourg, Norway and France and his first tours in Israel (with Y. Bashmet), Greece (Megaro Concert Hall in Athens), Australia, Sweden (Gothenburg Symphony Orchestra), Portugal and Ireland.<br><br>The musician's concerts with Evgeny Kissin in Monpellier (Radio France Festival-2004), Verbier (Swiss), at the Suntory Hall (Tokyo, 2011), at the Theatre des Champs-Elysees (Paris 2012), as well as performance of the Elgar cello concerto with Maestro Yuri Temirkanov in Venice received the highest appraisals.",
    facebook: "https://www.facebook.com/alexander.knyazev.125"
  },
  {
    id: "10",
    name: "Roby Lakatos",
    instrument: "Violin",
    imageUrl: "/images/artists/10-800.jpeg",
    url: "Roby-Lakatos",
    bio: "Born into the legendary family of gypsy violinists descended from Janos Bihari, \"King of Gypsy Violinists\", Roby Lakatos was introduced to music as a child and at age nine he made his public debut as first violin in a gypsy band. His musicianship evolved not only within his own family but also at the Béla Bartók Conservatory of Budapest, where he won the first prize for classical violin in 1984. Between 1986 and 1996, he and his ensemble delighted audiences at \"Les Atéliers de la grande Ille\" in Brussels, their musical home throughout this period. He has collaborated with Vadim Repin and Stéphane Grappelli, and his playing was greatly admired by Sir Yehudi Menuhin, who always made a point of visiting the club in Brussels to hear Lakatos.<br><br>Roby Lakatos is not only a scorching virtuoso, but a musician of extraordinary stylistic versatility. Equally comfortable performing classical music as he is playing jazz and his own Hungarian folk idiom, Lakatos is the rare musician who defies definition. He is referred to as a gypsy violinist or \"devil's fiddler\", a classical virtuoso, a jazz improviser, a composer and arranger, and a 19th-century throwback, and he is actually all of these things at once. He is the kind of universal musician so rarely encountered in our time – a player whose strength as an interpreter derives from his activities as an improviser and composer. He has performed at the great halls and festivals of Europe, Asia and America.",
    facebook: "https://www.facebook.com/roby.lakatos.9"
  },
  {
    id: "11",
    name: "Karin Lechner",
    instrument: "Piano",
    imageUrl: "/images/artists/11-800.jpeg",
    url: "Karin-Lechner",
    bio: "Born in Buenos Aires, Argentina, Karin Lechner received her first music lessons from her mother Lyl Tiempo in Caracas, Venezuela. She made her public debut at the age of five and recorded her first album at thirteen. She continued her training with Maria Curcio and Pierre Sancan and also benefited from regular advice by Martha Argerich, Daniel Barenboim, Nelson Freire, Nikita Magaloff and Rafael Orozco.<br><br>Karin Lechner today performs at the world's most prestigious concert halls, in particular at the Royal Concertgebouw of Amsterdam, the Philharmonic Society of Berlin, the Téatro Colon of Buenos Aires, the Suntory Hall of Tokyo, and the Kennedy Center in Washington DC. She is also the guest at the greatest musical festivals, among them Salzburg, Schleswig-Holstein, Colmar, Menton, Verbier or Montpellier. Karin is also a regular guest at the Festival Martha Argerich and Friends in Lugano. She appears in concert with a great number of partners, among them with Barbara Hendricks, Viktoria Mullova and Mischa Maisky.",
    facebook: "https://www.facebook.com/karin.lechner.161"
  },
  {
    id: "12",
    name: "Polina Leschenko",
    instrument: "Piano", 
    imageUrl: "/images/artists/12-800.jpeg",
    url: "Polina-Leschenko",
    bio: "Awarded a 'Choc' by French music magazine le Monde de la Musique, among others, for 'her extraordinarily powerful and virtuosic playing' and her 'unique sensibility', Russian pianist Polina Leschenko has worked with orchestras around the world including the Hallé, Russian National Orchestra, Bournemouth Symphony, Gulbenkian Orchestra, Bern Symphony, I Pomeriggi Musicali in Milan, Orquesta de Euskadi, Australian Chamber Orchestra, Camerata Salzburg, Lausanne Chamber Orchestra, Scottish Chamber Orchestra, London Mozart Players and Britten Sinfonia.<br><br>An accomplished and admired chamber musician, Polina Leschenko also performs frequently at many festivals such as Verbier, Salzburger Festspiele, Progetto Martha Argerich in Lugano, La Roque d'Anthéron, International Chamber Music Festival in Utrecht, Stavanger, Aldeburgh, Cheltenham, Oxford, Risor, Istanbul, Enescu Festival in Bucharest, Musiktage Mondsee, Schubertiade, Gstaad.<br><br>Regular chamber music partners include Martha Argerich, Patricia Kopatchinskaja, Ivry Gitlis, Julian Rachlin, Ilya Gringolts, Nathan Braude, Heinrich Schiff, Mischa Maisky and Torleif Thedéen…<br><br>Leschenko has performed in venues such as Vienna's Konzerthaus, Mozarteum Salzburg, Amsterdam's Concertgebouw, Lincoln Center, Carnegie Hall, Köln Philharmonie, Wigmore hall, Cité de la Musique, Palais des Beaux Arts in Brussels, Tonhalle in Zürich, Victoria Hall in Geneva, Auditorio Nacional de Musica in Madrid.<br><br>Polina Leschenko was born in St Petersburg into a family of musicians, and began playing the piano under her father's guidance at the age of six. Two years later she made her solo début with the Leningrad Symphony Orchestra in St Petersburg. She studied with Sergei Leschenko, Vitali Margulis, Pavel Gililov, Alexandre Rabinovitch-Barakovsky and Christopher Elton.<br><br>Currently Polina resides in Brussels with her husband Nathan Braude and her lovely daughter Alicia.",
    facebook: "https://www.facebook.com/Polina-Leschenko-340738827483/"
  },
  {
    id: "13",
    name: "Lily Maisky",
    instrument: "Piano",
    imageUrl: "/images/artists/13-800.jpeg",
    url: "Lily-Maisky",
    bio: "Lily Maisky was born in Paris, moving to Brussels soon after. She began playing the piano at the age of four, with Lyl Tiempo, also studying with Hagit Kerbel, Ilana Davids and Alan Weiss. Lily was a pupil at the 'Purcell School of Music' from 2001 to 2005 where she also studied jazz piano. She has received master classes and musical advice from renowned artists including Martha Argerich, Dmitri Bashkirov, Joseph Kalichstein, Pavel Gililov, Vitali Margulis, Oleg Maisenberg and Marielle Labeque to name just a few.<br><br>Concert appearances have taken her throughout Europe as well as the Far East, and she has been invited to many of the great festivals such as the Verbier Festival, Progetto Martha Argerich in Lugano, the Edinburgh Festival, Maggio Musicale Fiorentino, Bergamo-Brescia, the Franz Liszt festival in Austria, Julian Rachlin and Friends in Dubrovnik, Rencontres de Bel Air in France, the Schlesswig-Holstein Music Festival, the Berlin Festival, the Beijing Piano Festival as well as the English Chamber Orchestra Music Cruise. Lily has performed concertos under the batons of maestros Thomas Sanderling, Gerd Albrecht, Daniel Raiskin and Charles Olivieri Munroe, amongst others. She has also performed solo and ensemble works in such prestigious venues as the Royal Festival Hall in London, Vienna's Concerthaus, Munich's Prinzregentheatre, Hamburg's Leiszhalle, Venezia's La Fenice, Bonn's BeethovenHalle, Tokyo's Suntory Hall, Rome's Teatro Olimpico, Moscow Conservatory, Saint Petersburg Philarmonie, New York's Carnegie Hall, Seoul's Performing Arts Center, Athens Megaron and Buckingham Palace among many others.<br><br>Lily features on several Deutsche Grammophon and EMI releases, and has been frequently broadcast on European and Asian radio and television. She enjoys playing chamber music as well as solo piano and forms a regular duo for many years with Mischa Maisky, as well as the Maisky Trio where her brother Sascha joins them. She has also performed with such artists as Julian Rachlin, Janine Jansen, Dora Schwarzberg, Renaud Capuçon, Chantal Juillet, Sergey Krylov, Martha Argerich, Nicholas Angelich, Frank Braley, Gérard Caussé as well as Alissa Margulis, Hrachya Avanesyan, Geza Hosszu-Legocky, Alena Baeva, Isztvan Vardai, Orfeo Mandozzi, Boris Brovtsyn and Boris Andrianov.",
    facebook: "https://www.facebook.com/lilymaisky/"
  },
  {
    id: "14",
    name: "Francesco Piemontesi",
    instrument: "Piano",
    imageUrl: "/images/artists/14-800.jpeg",
    url: "Francesco-Piemontesi",
    bio: "Born in 1983 in Switzerland, Francesco Piemontesi studied with Nora Doallo in Lugano and with Arie Vardi at the Hanover University of music. Alongside his studies he gained valuable inspiration from his work with Alfred Brendel, Cécile Ousset, Murray Perahia, Mitsuko Uchida and Alexis Weissenberg.<br><br>He is the recipient of numerous international prizes, including the Queen Elisabeth Competition in Brussels and a 2009 Borletti-Buitoni Trust Fellowship.<br><br>In September 2009, BBC named Francesco one of its \\\"New Generation Artists\\\".<br><br>Francesco Piemontesi has made guest appearances at such internationally recognized venues as the BBC Proms, Schleswig-Holstein, City of London Festival, Martha Argerich Project, Cheltenham, Ruhr, Rheingau, Ludwigsburg, Kissinger Sommer and Roque d'Anthéron Festivals and can look back on performances at the Philharmonie in Berlin, Carnegie Hall in New York, Musikverein in Vienna, Wigmore Hall in London, Concertgebouw in Amsterdam, Rudolfinum in Prague and at Lucerne Festival and Suntory Hall in Tokyo.<br><br>He has played as soloist with the Symphonieorchester des Bayerischen Runfunks, BBC Symphony and BBC Philharmonic Orchestra, London Philharmonic Orchestra, BBC National Orchestra of Wales, Israel Philharmonic Orchestra, Scottish Chamber Orchestra, Orchestra del Maggio Musicale Fiorentino, Orchestre Philharmonique de Monte Carlo, Prague Symphony Orchestra, Osaka Philharmonic, Belgian National Orchestra, Tonkünstler Orchestra, London Mozart Players and the Zurich Chamber Orchestra collaborating with such conductors as Zubin Mehta, Jiri Belohlavek, Sakari Oramo, Lawrence Foster, Mikhail Pletnev, Christoph Poppen, Eiji Oue, Vassily Petrenko and Bruno Weil.<br><br>Francesco nurtures a special artistic interest in chamber music. He has played with Yuri Bashmet, Renaud und Gautier Capuçon, Emmanuel Pahud, Heinrich Schiff, Jörg Widmann and the Ebène quartet.",
    facebook: "https://www.facebook.com/PiemontesiFrancesco/"
  },
  {
    id: "15",
    name: "Philippe Quint",
    instrument: "Violin",
    imageUrl: "/images/artists/15-800.jpeg", 
    url: "Philippe-Quint",
    bio: "Award-winning American violinist Philippe Quint is a multi-faceted artist whose wide range of interests has led to several Grammy nominations for his albums, performances with major orchestras throughout the world at venues ranging from the Gewandhaus in Leipzig to Carnegie Hall in New York, a leading role in a major independent film called Downtown Express, and explorations of tango with his band The Quint Quintet.<br><br>Quint's live performances and interviews have been broadcast on television by CBS, CNN, ABC, BBC World News, NBC, Reuters, Bloomberg TV, as well as by radio stations nationwide including NPR, WNYC and WQXR. His recordings have received multiple \\\"Editor's Choice\\\" selections in Gramophone, The Strad, Strings, and the Daily Telegraph.<br><br>Philippe Quint plays the magnificent 1708 \\\"Ruby\\\" Antonio Stradivari violin on loan to him through the generous efforts of The Stradivari Society®. His remarkable degree of lyricism, poetry and impeccable virtuosity has gripped the eyes and ears of audiences in Asia, Australia, Latin America, Africa, Europe and the U.S. with what The Times (London) describes as his \\\"bravura technique, and unflagging energy.\\\"<br><br>In spring 2012, Avanticlassic released Quint's new recording of concertos by Mendelssohn and Bruch, and Beethoven's Romances Nos. 1 and 2, with the Orquesta Sinfónica de Minería led by Carlos Miguel Prieto which Gramophone described as \\\"pure sound and refined expression. An account well worth hearing\\\". This disc was Quint's first recording as part of his new agreement with Avanticlassic, where he joins such luminaries as Martha Argerich and Roby Lakatos. His next CD of rare operatic transcriptions with pianist Lily Maisky will be out in Spring 2013.<br><br>Quint is the first classical artist to star in the lead role of a major independent picture. Downtown Express, from Michael Hausman (producer of Gangs of New York, Brokeback Mountain and Amadeus) and multi-Emmy winning director David Grubin, is currently premiering through out the world at various national and international film festivals including Woodstock, New York, Houston, Mons (Belguim), Cuba, Vermont and Tampa.<br><br>Philippe Quint formed The Quint Quintet in 2009. The ensemble is dedicated to exploring the music of Astor Piazzolla and Argentine Tango. Quint is also Founder and Artistic Director of the Mineria Chamber Music Festival in Mexico City, and collaborates with cellist Zuill Bailey and pianist Navah Perlman as the Perlman/Quint/Bailey Trio.<br><br>In addition to his Grammy-nominated recording of William Schuman's Violin Concerto and his new Mendelssohn/Bruch/Beethoven album, Quint's formidable discography includes a large variety of rediscovered treasures along with popular works from standard repertoire. His recording of Korngold's Violin Concerto (2009), which was ranked in the top 20 on Billboard's Classical Chart in its first week of sales, was also nominated for two Grammy Awards.<br><br>Constantly in demand worldwide, Quint's most recent appearances include performances with the orchestras of Chicago, Detroit, Indianapolis, New Jersey, Minnesota, Bournemouth, Houston, Weimar Staatskapelle, Royal Liverpool, China National, Orpheus, Berlin Komische Oper, Leipzig's MDR at Gewandhaus, Nordwestdeutsche and Bochumer Sinfonikers, Cape Town Philharmonic, and Plácido Domingo's Youth Orchestra of the Americas.<br><br>Philippe Quint studied at Moscow's Special Music School for the Gifted with the famed Russian violinist Andrei Korsakov, and made his orchestral debut at the age of nine, performing Wieniawski's Concerto No. 2. After emigrating to the United States, he earned both Bachelor's and Master's degrees from Juilliard. His distinguished pedagogues included Dorothy Delay, Cho-Liang Lin, Masao Kawasaki, and Felix Galimir.<br><br>The Chicago Tribune proclaimed, \\\"Here is a fiddle virtuoso whose many awards are fully justified by the brilliance of his playing.\\\" Among his many honors, Quint was also the winner of the Juilliard Competition and Career Grant Recipient of Salon de Virtuosi, Bagby and Clarisse Kampel Foundations.",
    facebook: "https://www.facebook.com/philippequint/",
    instagram: "https://www.instagram.com/philippe_quint/",
    twitter: "https://twitter.com/PhilippeQuint"
  },
  {
    id: "16",
    name: "Dora Schwarzberg",
    instrument: "Violin",
    imageUrl: "/images/artists/16-800.jpeg",
    url: "Dora-Schwarzberg",
    bio: "Dora Schwarzberg undertook her musical studies at the Stoliarsky School in Russia and with Yuri Yankelevitch at the Moscow Conservatory. She has played with the most distinguished orchestras in the world, including the New York Philharmonic Orchestra, the National Symphony Orchestra (Washington DC) and the most renowned Russian ensembles. She is a highly skilled chamber musician and has given recitals in the most prestigious concert halls, including the Amsterdam Concertgebouw, the Vienna Musikverein and the Queen Elizabeth Hall. Her musical partners have included Valeri Afanassiev, Martha Argerich, Yuri Bashmet, Valentin Berlinski (of the Borodin Quartet), Gérard Caussé, Lucy Hall, Nabuko Imai, Misha Maisky and Alexander Rabinovitch.<br><br>Teaching plays a fundamental role in Dora Schwarzberg's life. She is a professor at the Vienna Academy of Music and has trained inumerous violinists who have won international prizes or become first violinists for such prestigious bodies as the Israel Philharmonic and the Luxembourg Philharmonic Orchestra. She gives master classes worldwide, in particular in the Yehudi Menuhin School and in the Shanghai Conservatory of Music (where she is an Honorary Professor). She also serves on several international juries.",
    facebook: "https://www.facebook.com/Dora-Schwarzberg-337188444982/"
  },
  {
    id: "17",
    name: "Steven Sloane",
    instrument: "Conductor",
    imageUrl: "/images/artists/17-800.jpeg",
    url: "Steven-Sloane",
    bio: "American-Israeli conductor Steven Sloane is a visionary whose creative concepts and outstanding artistic merits have garnered respect in both artistic circles and in the realm of cultural politics. A student of Eugene Ormandy, Franco Ferrara, and Gary Bertini, he quickly set off for an international career and served as music director of the Spoleto Festival USA, Opera North in Leeds, and the American Composers Orchestra, as principal conductor of the Stavanger Symphony Orchestra, as artistic director of \"Ruhr.2010\" Capital of Culture, and as principal guest conductor and artistic advisor of the Malmö Opera.<br><br>From 1994 to 2021, Steven Sloane has been general music director of the Bochum Symphony, which he transformed into one of Germany's leading orchestras. He was instrumental in the building and realisation of the orchestra's own music centre, the Anneliese Brost Musikforum Ruhr, inaugurating the hall in 2016 to international acclaim. Other extraordinary achievements of his work with the Bochum Symphony include the exceptional production of Zimmermann's Die Soldaten at the Ruhrtriennale (2006) and at the New York Lincoln Center Festival (2008), the celebrated Mahler/Ives cycle at the Philharmonie Essen, and numerous CD projects, including the complete recording of Joseph Marx's orchestral works. He will remain associated with the Bochum Symphony as honorary conductor.<br><br>In September 2020, Steven Sloane took up his new post as music director of the Jerusalem Symphony Orchestra, introducing several new concert series and formats in his first season. Highlights in 2021 include a tour to Germany in June 2021 with concerts at the Elbphilharmonie Hamburg, Konzerthaus Berlin, and Klavier-Festival Ruhr, as well as a joint performance of Gustav Mahler's Symphony No. 2 with the Bochum Symphony Orchestra at the Jahrhunderthalle, and the world premiere of the new opera Kundry by Avner Dorman at the Regarding Festival in Tel Aviv in October.<br><br>Steven Sloane is a frequent guest with prestigious orchestras including the London Philharmonic Orchestra, San Francisco Symphony, Israel Philharmonic, Sydney Symphony, Tokyo Metropolitan, Deutsche Kammerphilharmonie Bremen, Deutsches Symphonie-Orchester Berlin, hr-Sinfonieorchester, Philharmonia Orchestra London, City of Birmingham Symphony Orchestra, Orchestre Philharmonique de Radio France, Orquestra Sinfônica do Estado de São Paulo, and the Chicago Symphony Orchestra.<br><br>As a sought after opera conductor, he has been welcomed at houses such as the Royal Opera House Covent Garden (Le Nozze di Figaro), Los Angeles Opera (Dido and Aeneas/Bluebeard's Castle), San Francisco Opera (Wallace: Bonesetter's Daughter), Royal Danish Opera (Madama Butterfly), Grand Théâtre de Genève (Britten: A Midsummer Night's Dream), Houston Grand Opera (Vec Makropulos, The Magic Flute), Welsh National Opera (Iphigénie en Tauride), Deutsche Oper Berlin (The Love for Three Oranges) and Stuttgart Opera (Macbeth) as well as at festivals in Hong Kong (Salome), Santa Fe (Káta Kabanová), Edinburgh (Genoveva), Salzburg (Feldman: Neither) and New York (Turnage's Anna Nicole at the NY City Opera). His most recent opera accomplishments include the Berlin premiere of Reimann's Medea at Komische Oper, Adriana Lecouvreur at Oper Frankfurt, Der Fliegende Holländer, Tosca and Falstaff in Malmö, and Salome at the Spoleto Festival USA.<br><br>Mentoring young musicians has always been important to Steven Sloane. He has regularly conducted youth orchestras such as Junge Deutsche Philharmonie, Bundesjugendorchester, and Young Israel Philharmonic, and since 2013 he has served as professor at the Universität der Künste Berlin, where he founded the International Conducting Academy Berlin."
  },
  {
    id: "18",
    name: "Sergio Tiempo", 
    instrument: "Piano",
    imageUrl: "/images/artists/18-800.jpeg",
    url: "Sergio-Tiempo",
    bio: "Described by Gramophone magazine as \\\"the most dazzling and spontaneous pianist of his generation\\\", Sergio Tiempo has developed a reputation as one of the most individual piano virtuoso. Tiempo established his international credentials at an early age, making his professional debut at the age of fourteen at the Concertgebouw in Amsterdam. A tour of the USA and a string of engagements across Europe quickly followed. Since then he has appeared with many of the world's leading orchestras and conductors and is a frequent guest at major festivals worldwide.<br><br>Born in Caracas, Venezuela, Tiempo began his piano studies with his mother, Lyl Tiempo, at the age of two and made his concert debut when he had just turned three. Whilst at the Fondazione per il Pianoforte in Como, Italy, he worked with Dimitri Bashkirov, Fou Tsong, Murray Perahia and Dietrich Fischer-Dieskau. He has received frequent musical guidance and advice from Martha Argerich, Nelson Freire and Nikita Magaloff.<br><br>Since then, Sergio Tiempo has been one of the most acclaimed soloists in the world. He collaborates in particular with conductors Claudio Abbado, Charles Dutoit, Christoph Eschenbach, Leonard Slatkin or Michael Tilson-Thomas and performs regularly with fellow-countryman and friend Gustavo Dudamel including concerts with the Simón Bolívar Orchestra. He also performs with the Orchestre Philharmonique de Radio France, the German Symphony Orchestra of Berlin, the Bamberg Symphony Orchestra, the Chicago Symphony Orchestra, the Orchestra of Cleveland, the Philharmonic of Los Angeles, the Symphony Orchestra of Montreal, the BBC Symphony Orchestra, the City of Birmingham Symphony Orchestra, the Hallé Orchestra, the Symphony Orchestra of the Academy of Santa Cecilia in Rome, the Rotterdam Symphony Orchestra, the Metropolitan and Philharmonic Orchestras of Tokyo, the Queensland Orchestra and the Auckland Philharmonia to name but a few.<br><br>Sergio Tiempo performs at the Vienna Konzerthaus, London's Wigmore Hall, Queen Elizabeth Hall, the Berlin Philharmonie and regularly features at the most prestigious music festivals, in particular at the Edinburgh International Festival as well as well as the Oslo Chamber Music Festival, the Warsaw Chopin Festival, Salzburg, Schleswig-Holstein, Colmar, Verbier, Toulouse or at the 'Dias da Musica' in Lisbon. He also appears at the Festival Arturo Benedetti Michelangeli of Bergamo and is the regular guest of Martha Argerich at her Festival in Lugano.",
    facebook: "https://www.facebook.com/sergio.tiempo/"
  },
  {
    id: "19",
    name: "Kasparas Uinskas",
    instrument: "Piano",
    imageUrl: "/images/artists/19-800.jpeg",
    url: "Kasparas-Uinskas",
    bio: "Kasparas Uinskas is an internationally acclaimed pianist, praised by critics for his virtuosity and romantic style. Kasparas performs in the most renowned concert halls like New York's Carnegie Hall, the Berlin Philharmonie, London's Wigmore Hall, Madrid's Auditorio Nacional, the J. F. Kennedy Center in Washington, DC and many others.<br><br>His recent performances include his concert with legendary cellist Alexander Kniazev at the Martha Argerich Festival in Hamburg (in June 2021) after his first appearance at this festival in piano duo with pianist Evgeni Bozhanov; with the Royal Chamber Orchestra of Wallonia (Belgium), with the Lithuanian State Symphony Orchestra, with the North Czech Philharmonic Orchestra (Czech Republic), with the Philharmonie Südwestfalen (Germany), with the Liepaja Symphony Orchestra at Piano Stars Festival (Latvia), with the Krakow Philharmonic Orchestra (Poland), as well as solo recitals at the Wigmore Hall in London, at the Baerum Kulturhus at the Piano Master Series (Norway), at the BoZar concert hall in Brussels, at the Brussels piano festival, at the Festival Nordland Musikkfestuke in Bodø (Norway), at the Fantastic Pianist Series tour in Japan and during a chamber recital tour in Norway and Lithuania together with the International Tchaikovsky Competition laureate, violinist Nikita Boriso-Glebsky; piano duo concert tour with pianist Evgeni Bozhanov and chamber concert tour with cello legend Alexander Kniazev and also with the International Tchaikovsky competition winner cellist Andrei Ionita.<br><br>Last season, Mr. Uinskas appeared together with violinist Nikita Boriso-Glebsky at the Bratislava festival, at the Slovak Philharmonic hall, with solo recital in Zurich (Switzerland), in Mumbai (India), in solo recitals and concerts with orchestra in Moscow, Voronezh, Ulyanovsk (Russia), with the Rosario Symphony orchestra at Teatro El Circulo in Rosario (Argentina), with an all Chopin recital in Belgium's Brussels Chopin days among others. Mr. Uinskas is a frequent guest at many international music festivals throughout Europe and the USA, including the Aspen Music Festival (USA), the Music Festival of the Hamptons (USA), the South Shore Music (USA), and the Holland Music Sessions. Kasparas Uinskas also appeared as a soloist at the Verbier Festival as recipient of the Reuter's Grand Prix, awarded by the festival.<br><br>His repertoire includes works by a wide range of composers, from Johann Sebastian Bach to 20th Century, however composers of the romantic era dominate his repertoire. Recent releases include Uinskas' recording of a Chopin recital and the DVD of his live concert at the Berlin Philharmonie.<br><br>Kasparas Uinskas is a frequent guest on the Radio and TV programs, including BBC Radio 3 'In Tune' program; the classical music radio station of The New York Times, program 'Reflections from the Keyboard' on WQXR with David Dubal.<br><br>Kasparas Uinskas was born in Lithuania. He began studying the piano at the age of six. He studied at the Lithuanian Academy of Music and Theatre, where he completed his Doctoral studies, at the Frédéric Chopin Music University in Warsaw, Poland, and at The Juilliard School in New York (with the prof. Kalichstein), as a recipient of the Vladimir Horowitz Scholarship.",
    facebook: "https://www.facebook.com/kasparas.uinskas"
  }
]

// Complete releases data mapped to artists based on original data
const artistReleases: Record<string, Release[]> = {
  "Martha-Argerich": [
    {
      id: "6",
      title: "Recital Franck • Debussy • Schumann",
      artists: "Dora Schwarzberg, Martha Argerich", 
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/6.jpeg",
      url: "Recital-Franck-Debussy-Schumann-Dora-Schwarzberg-Martha-Argerich"
    },
    {
      id: "28",
      title: "Rendez-vous with Martha Argerich",
      artists: "Martha Argerich",
      format: "7CD",
      imageUrl: "/images/releases/28.jpeg",
      url: "Rendez-vous-with-Martha-Argerich-Martha-Argerich"
    },
    {
      id: "31",
      title: "Rendez-vous with Martha Argerich - Volume 2",
      artists: "Martha Argerich",
      format: "6 CD",
      imageUrl: "/images/releases/31.jpeg",
      url: "Rendez-vous-with-Martha-Argerich-Volume-2"
    },
    {
      id: "34",
      title: "Martha Argerich plays Beethoven & Ravel",
      artists: "Martha Argerich",
      format: "1 CD",
      imageUrl: "/images/releases/34.jpeg",
      url: "Martha-Argerich-plays-Beethoven&Ravel-IPO-Lahav-Shani"
    },
    {
      id: "35",
      title: "HOMMAGE",
      artists: "Sergio Tiempo",
      format: "1 CD",
      imageUrl: "/images/releases/35.jpeg",
      url: "HOMMAGE-Sergio-Tiempo"
    },
    {
      id: "36",
      title: "Rendez-vous with Martha Argerich - Volume 3",
      artists: "Martha Argerich",
      format: "7 CD",
      imageUrl: "/images/releases/36.jpeg",
      url: "Rendez-vous-with-Martha-Argerich-Volume-3"
    }
  ],
  "Roby-Lakatos": [
    {
      id: "1",
      title: "Fire Dance", 
      artists: "Roby Lakatos",
      format: "1 CD",
      imageUrl: "/images/releases/1.jpeg",
      url: "Fire-Dance-Roby-Lakatos"
    },
    {
      id: "5", 
      title: "Klezmer Karma",
      artists: "Roby Lakatos",
      format: "1 CD", 
      imageUrl: "/images/releases/5.jpeg",
      url: "Klezmer-Karma-Roby-Lakatos"
    },
    {
      id: "10",
      title: "Roby Lakatos with Musical Friends",
      artists: "Roby Lakatos", 
      format: "1 CD + 1 Bonus CD",
      imageUrl: "/images/releases/10.jpeg",
      url: "Roby-Lakatos-with-Musical-Friends-Roby-Lakatos"
    },
    {
      id: "18",
      title: "La Passion",
      artists: "Roby Lakatos", 
      format: "2 CD",
      imageUrl: "/images/releases/18.jpeg",
      url: "La Passion-Roby-Lakatos"
    },
    {
      id: "22",
      title: "The Four Seasons",
      artists: "Roby Lakatos", 
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/22.jpeg",
      url: "The-Four-Seasons-Roby-Lakatos"
    },
    {
      id: "27",
      title: "Tribute to Stephane & Django",
      artists: "Roby Lakatos, Bireli Lagrene",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/27.jpeg",
      url: "Tribute-to-Stephane&Django-Roby-Lakatos&Bireli-Lagrene"
    },
    {
      id: "30",
      title: "Peacock",
      artists: "Dr L. Subramaniam, Roby Lakatos",
      format: "1 CD",
      imageUrl: "/images/releases/30.jpeg",
      url: "Peacock-Dr-L.-Subramaniam-Roby-Lakatos"
    },
    {
      id: "37",
      title: "World Tangos Odyssey",
      artists: "Roby Lakatos",
      format: "1 CD",
      imageUrl: "/images/releases/37.jpeg",
      url: "WORLD-TANGOS-ODYSSEY"
    }
  ],
  "Evgeni-Bozhanov": [
    {
      id: "29",
      title: "Morgen",
      artists: "Evgeni Bozhanov",
      format: "1 CD",
      imageUrl: "/images/releases/29.jpeg",
      url: "Morgen-Evgeni-Bozhanov"
    }
  ],
  "Polina-Leschenko": [
    {
      id: "2",
      title: "The Prokofiev Project",
      artists: "Polina Leschenko",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/2.jpeg",
      url: "The-Prokofiev-Project-Polina-Leschenko"
    },
    {
      id: "4", 
      title: "Schumann : the Violin Sonatas and Fantasiestücke",
      artists: "Dora Schwarzberg, Polina Leschenko",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/4.jpeg", 
      url: "Schumann-the-Violin-Sonatas-and-Fantasiestücke-Dora-Schwarzberg-Polina-Leschenko"
    },
    {
      id: "7", 
      title: "Liszt Recital",
      artists: "Polina Leschenko",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/7.jpeg", 
      url: "Liszt-Recital-Polina-Leschenko"
    },
    {
      id: "15", 
      title: "Forgotten Melodies",
      artists: "Polina Leschenko",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/15.jpeg", 
      url: "Forgotten-Melodies-Polina-Leschenko"
    }
  ],
  "Pedro-Burmester": [
    {
      id: "3",
      title: "Recital Schumann • Liszt",
      artists: "Pedro Burmester",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/3.jpeg",
      url: "Recital-Schumann-Liszt-Pedro-Burmester"
    }
  ],
  "Dora-Schwarzberg": [
    {
      id: "4",
      title: "Schumann : the Violin Sonatas and Fantasiestücke",
      artists: "Dora Schwarzberg, Polina Leschenko",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/4.jpeg",
      url: "Schumann-the-Violin-Sonatas-and-Fantasiestücke-Dora-Schwarzberg-Polina-Leschenko"
    },
    {
      id: "6",
      title: "Recital Franck • Debussy • Schumann",
      artists: "Dora Schwarzberg, Martha Argerich",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/6.jpeg",
      url: "Recital-Franck-Debussy-Schumann-Dora-Schwarzberg-Martha-Argerich"
    }
  ],
  "Adriel-Gomez-Mansur": [
    {
      id: "8",
      title: "Recital",
      artists: "Adriel Gomez-Mansur",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/8.jpeg",
      url: "Recital-Adriel-Gomez-Mansur"
    }
  ],
  "Sergio-Tiempo": [
    {
      id: "9",
      title: "La Belle Epoque",
      artists: "Sergio Tiempo, Karin Lechner",
      format: "1 Hybrid SACD + Bonus DVD",
      imageUrl: "/images/releases/9.jpeg",
      url: "La Belle Epoque-Sergio-Tiempo-Karin-Lechner"
    },
    {
      id: "13",
      title: "Liszt Totentanz • Tchaikovsky Piano Concerto",
      artists: "Sergio Tiempo",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/13.jpeg",
      url: "Liszt Totentanz-Tchaikovsky-Piano-Concerto-Sergio-Tiempo"
    },
    {
      id: "14",
      title: "Tango Rhapsody",
      artists: "Sergio Tiempo, Karin Lechner",
      format: "1 Hybrid SACD + Bonus DVD",
      imageUrl: "/images/releases/14.jpeg",
      url: "Tango-Rhapsody-Sergio-Tiempo-Karin-Lechner"
    },
    {
      id: "26",
      title: "Legacy",
      artists: "Sergio Tiempo",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/26.jpeg",
      url: "Legacy-Sergio-Tiempo"
    }
  ],
  "Karin-Lechner": [
    {
      id: "9",
      title: "La Belle Epoque",
      artists: "Sergio Tiempo, Karin Lechner",
      format: "1 Hybrid SACD + Bonus DVD",
      imageUrl: "/images/releases/9.jpeg",
      url: "La Belle Epoque-Sergio-Tiempo-Karin-Lechner"
    },
    {
      id: "14",
      title: "Tango Rhapsody",
      artists: "Sergio Tiempo, Karin Lechner",
      format: "1 Hybrid SACD + Bonus DVD",
      imageUrl: "/images/releases/14.jpeg",
      url: "Tango-Rhapsody-Sergio-Tiempo-Karin-Lechner"
    }
  ],
  "Alexander-Gurning": [
    {
      id: "12",
      title: "Goldberg Variations",
      artists: "Alexander Gurning",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/12.jpeg",
      url: "Goldberg-Variations-Alexander-Gurning"
    }
  ],
  "Myriam-Fuks": [
    {
      id: "11",
      title: "Anthology of a Yiddishe Mama",
      artists: "Myriam Fuks",
      format: "1 CD",
      imageUrl: "/images/releases/11.jpeg",
      url: "Anthology-of-a-Yiddishe-Mama-Myriam-Fuks"
    },
    {
      id: "20",
      title: "Ver Bin Ikh!",
      artists: "Myriam Fuks",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/20.jpeg",
      url: "Ver-Bin-Ikh!-Myriam-Fuks"
    }
  ],
  "Philippe-Quint": [
    {
      id: "16",
      title: "Bruch & Mendelssohn Violin Concertos • Beethoven Romances",
      artists: "Philippe Quint",
      format: "1 Hybrid SACD + Bonus DVD",
      imageUrl: "/images/releases/16.jpeg",
      url: "Bruch&Mendelssohn-Violin-Concertos-Beethoven-Romances-Philippe-Quint"
    },
    {
      id: "19",
      title: "Opera Breve",
      artists: "Philippe Quint, Lily Maisky",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/19.jpeg",
      url: "Opera-Breve-Philippe-Quint-Lily-Maisky"
    },
    {
      id: "21",
      title: "Tchaikovsky Violin Concerto • Arensky Quintet",
      artists: "Philippe Quint",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/21.jpeg",
      url: "Tchaikovsky-Violin-Concerto-Arensky-Quintet-Philippe-Quint"
    },
    {
      id: "23",
      title: "Bach XXI",
      artists: "Matt Herskovitz Trio, Philippe Quint",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/23.jpeg",
      url: "Bach-XXI-Matt-Herskovitz-Trio-Philippe-Quint"
    },
    {
      id: "24",
      title: "Khachaturian & Glazunov Violin Concertos",
      artists: "Philippe Quint",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/24.jpeg",
      url: "Khachaturian&Glazunov-Violin-Concertos-Philippe-Quint"
    }
  ],
  "Lily-Maisky": [
    {
      id: "19",
      title: "Opera Breve",
      artists: "Philippe Quint, Lily Maisky",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/19.jpeg",
      url: "Opera-Breve-Philippe-Quint-Lily-Maisky"
    }
  ],
  "Francesco-Piemontesi": [
    {
      id: "17",
      title: "Recital Haendel • Brahms • Bach • Liszt",
      artists: "Francesco Piemontesi",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/17.jpeg",
      url: "Recital-Haendel-Brahms-Bach-Liszt-Francesco-Piemontesi"
    }
  ],
  "Alexander-Kniazev": [
    {
      id: "32",
      title: "Sonatas Op. 120 - Four Serious Songs Op. 121",
      artists: "Alexander Kniazev, Kasparas Uinskas",
      format: "1 CD",
      imageUrl: "/images/releases/32.jpeg",
      url: "Sonatas-Op.-120-Four-Serious-Songs-Op.-121-Alexander-Kniazev-Kasparas-Uinskas"
    }
  ],
  "Kasparas-Uinskas": [
    {
      id: "32",
      title: "Sonatas Op. 120 - Four Serious Songs Op. 121",
      artists: "Alexander Kniazev, Kasparas Uinskas",
      format: "1 CD",
      imageUrl: "/images/releases/32.jpeg",
      url: "Sonatas-Op.-120-Four-Serious-Songs-Op.-121-Alexander-Kniazev-Kasparas-Uinskas"
    }
  ],
  "Baritone-Dietrich-Henschel": [
    {
      id: "33",
      title: "Wunderhorn",
      artists: "Dietrich Henschel, Bochumer Symphoniker, Steven Sloane",
      format: "2 CD",
      imageUrl: "/images/releases/33.jpeg",
      url: "Wunderhorn-Dietrich-Henschel-Bochumer-Symphoniker-Steven-Sloane"
    }
  ],
  "Steven-Sloane": [
    {
      id: "33",
      title: "Wunderhorn",
      artists: "Dietrich Henschel, Bochumer Symphoniker, Steven Sloane",
      format: "2 CD",
      imageUrl: "/images/releases/33.jpeg",
      url: "Wunderhorn-Dietrich-Henschel-Bochumer-Symphoniker-Steven-Sloane"
    }
  ],
  "Manu-Comte": [
    {
      id: "25",
      title: "Homilia",
      artists: "Manu Comté, B'Strings Quintet",
      format: "1 Hybrid SACD",
      imageUrl: "/images/releases/25.jpeg",
      url: "Homilia-Manu-Comté-B'Strings-Quintet"
    }
  ]
}

export default function ArtistDetailPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArtistData() {
      setLoading(true)
      
      // Always start with fallback English data
      let artistData = fallbackArtists.find((a) => a.id === params.id || a.url === params.id)
      
      // Only try API for non-English languages (when translations exist)
      if (language !== 'en' && artistData) {
        try {
          const apiData = await getArtist(params.id, language)
          if (apiData && apiData.bio) {
            // Merge API translation with fallback data
            artistData = { ...artistData, bio: apiData.bio }
          }
        } catch (error) {
          console.log('No translation available for', language, '- using English')
        }
      }

      setArtist(artistData)

      if (artistData) {
        // Get artist releases
        const { releases: artistReleases } = await getArtistReleases(artistData.name)
        const fallbackReleases = artistReleases[artistData.url || artistData.name] || []
        const displayReleases = artistReleases.length > 0 ? artistReleases : fallbackReleases
        setReleases(displayReleases)
      }
      
      setLoading(false)
    }

    fetchArtistData()
  }, [params.id, language]) // Re-fetch when language changes

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-24 text-center">
        <div className="animate-pulse">Loading artist...</div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Artist Not Found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">The artist you are looking for does not exist.</p>
        <Button asChild className="mt-8">
          <Link href="/artists">Back to Artists</Link>
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
          <Link href="/artists">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Artists
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <div className="w-full max-w-md">
            <Image
              src={artist.imageUrl || "/placeholder.svg"}
              width={400}
              height={400}
              alt={artist.name}
              className="rounded-lg object-cover aspect-square shadow-lg w-full"
              priority
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">{artist.name}</h1>
          <p className="text-xl text-primary font-semibold">{artist.instrument}</p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: artist.bio }}
            />
          </div>

          {/* Social Media Links */}
          <SocialMediaLinks artist={artist} />
        </div>
      </div>

      {/* Artist Releases Section */}
      {releases.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
            Releases by {artist.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {releases.map((release) => (
              <Link key={release.id} href={`/releases/${release.url || release.id}`} className="block">
                <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105">
                  <CardContent className="p-0">
                    <Image
                      src={release.imageUrl}
                      width={300}
                      height={300}
                      alt={release.title}
                      className="w-full h-auto object-cover aspect-square"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-base line-clamp-2 min-h-[3em] text-gray-900 dark:text-gray-50 mb-2 group-hover:text-primary transition-colors">
                        {release.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{release.format}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SocialMediaLinks({ artist }: { artist: Artist }) {
  const socialLinks = [
    { url: artist.facebook, icon: Facebook, label: "Facebook", color: "hover:text-blue-600" },
    { url: artist.youtube, icon: Youtube, label: "YouTube", color: "hover:text-red-600" },
    { url: artist.website, icon: Globe, label: "Website", color: "hover:text-green-600" },
  ].filter(link => link.url) // Only show links that exist

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-4 pt-4">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center">Follow:</span>
      {socialLinks.map((link, index) => {
        const IconComponent = link.icon
        return (
          <Link
            key={index}
            href={link.url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${link.color} transition-colors duration-200`}
            aria-label={`${artist.name} on ${link.label}`}
          >
            <IconComponent className="h-5 w-5" />
            <span className="text-sm hidden sm:inline">{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}