import { Phone, Mail, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
        About Avanti Classic
      </h1>

      <section className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6 mb-16 text-gray-700 dark:text-gray-300">
        <p>
          Avanti Classic and AvantiJazz have been created with the aim of re-establishing a relationship between artist
          and record company that, in the current music industry, practically no longer exists. We believe in fostering
          a true partnership with our artists, providing them with comprehensive support throughout their careers.
        </p>
        <p>
          Active in the fields of classical music and jazz, our labels are committed not only to recording and promoting
          artists we believe in, but also to offering them real support in all facets of their career, from artistic
          development to global distribution.
        </p>
        <p>
          To achieve this goal, Avanticlassic and AvantiJazz leverage the best available technology at every level, from
          the selection of recording studios and advanced recording techniques to the final production process. Our
          commitment to excellence ensures that every product we offer meets the highest standards of quality.
        </p>
        <p>
          Our releases are presented in the highest quality formats, including CD/SACD hybrid music carriers,
          attractively packaged in a contemporary, fresh, and modern style. Each release includes insightful liner notes
          written by specialists, providing a deeper understanding of the music. We also offer high-resolution streaming
          and downloads (96kHz/24bits) for an unparalleled listening experience.
        </p>
        <p>
          We work closely with our distributors and all major streaming and download online services to ensure the
          widest possible visibility for the exceptional talents we represent. Our goal is to connect passionate
          listeners with extraordinary music.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
          List of Distributors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
          {/* Distributor 1 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Australia</h3>
            <p className="mb-2">SELECT AUDIO VISUAL DISTRIBUTION</p>
            <address className="not-italic mb-2">
              Unit 7, Botany Bay Industrial Estate 2-12
              <br />
              Beauchamp Road Banksmeadow NSW 2019
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.savd.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.savd.com.au
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@savd.com.au" className="hover:underline text-primary">
                Email: info@savd.com.au
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +61 (0)2 8287 4882
            </p>
          </div>

          {/* Distributor 2 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Austria</h3>
            <p className="mb-2">LOTUS RECORDS</p>
            <address className="not-italic mb-2">Kirchplatz 2/1 A-5110 Oberndorf</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.lotusrecords.at"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.lotusrecords.at
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:elsinger@lotusrecords.at" className="hover:underline text-primary">
                Email: elsinger@lotusrecords.at
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +43 (0)6272 73175
            </p>
          </div>

          {/* Distributor 3 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Belgium</h3>
            <p className="mb-2">OUTHERE DISTRIBUTION</p>
            <address className="not-italic mb-2">Rue De L'Epergne, 29 1000 Bruxelles</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.outhere-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:emma@outhere-music.com" className="hover:underline text-primary">
                Email: emma@outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +32 (0)2 648 79 69
            </p>
          </div>

          {/* Distributor 4 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Canada</h3>
            <p className="mb-2">NAXOS OF AMERICA, Inc.</p>
            <address className="not-italic mb-2">1810 Columbia Ave, Suite 28, Franklin, TN 37064 USA</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.naxosusa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:shickey@naxosusa.com" className="hover:underline text-primary">
                Email: shickey@naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +1 615.465.3840
            </p>
          </div>

          {/* Distributor 5 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Czech Republic</h3>
            <p className="mb-2">CLASSIC MUSIC DISTRIBUTION</p>
            <address className="not-italic mb-2">Biskupcova 37 130 00 Praha 3</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.classic.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.classic.cz
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:classic@classic.cz" className="hover:underline text-primary">
                Email: classic@classic.cz
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: 271 770 737
            </p>
          </div>

          {/* Distributor 6 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Finland</h3>
            <p className="mb-2">NAXOS SWEDEN</p>
            <address className="not-italic mb-2">Kryptongatan 8, SE-703 74 Örebro</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.naxosdirect.se"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.naxosdirect.se
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@naxos.se" className="hover:underline text-primary">
                Email: info@naxos.se
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +46 19206860
            </p>
          </div>

          {/* Distributor 7 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">France</h3>
            <p className="mb-2">OUTHERE MUSIC France</p>
            <address className="not-italic mb-2">31, Rue du Fbg Poissonnière 75009 Paris</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.outhere-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:loic@outhere-music.com" className="hover:underline text-primary">
                Email: loic@outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +33 (0)1 43 45 02 89
            </p>
          </div>

          {/* Distributor 8 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Germany</h3>
            <p className="mb-2">NOTE 1 MUSIC GmbH</p>
            <address className="not-italic mb-2">Carl-Benz-Str. 1 69115 Heidelberg</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.note1-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.note1-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:miethe@note1-music.com" className="hover:underline text-primary">
                Email: miethe@note1-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +49 (0)6221-720351
            </p>
          </div>

          {/* Distributor 9 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Greece</h3>
            <p className="mb-2">OPERA COMPACT DISC</p>
            <address className="not-italic mb-2">Ακαδημίας 57, Αθήνα ΤΚ 106 79</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.operacd.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.operacd.gr
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@operacd.gr" className="hover:underline text-primary">
                Email: info@operacd.gr
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +30 210 3626137
            </p>
          </div>

          {/* Distributor 10 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Hong Kong</h3>
            <p className="mb-2">SHUN CHEONG RECORDS & Co., LTD.</p>
            <address className="not-italic mb-2">Unit No. 1 & 2, Winning Centre, 11/F., 29 Tai Yau Street, San Po Kong, Kowloon, Hong Kong, SAR</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.shuncheongrec.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.shuncheongrec.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:clementng@shuncheongrec.com" className="hover:underline text-primary">
                Email: clementng@shuncheongrec.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +(852) 2332 2397
            </p>
          </div>

          {/* Distributor 11 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Hungary</h3>
            <p className="mb-2">KARSAY ÉS TÁRSA KFT</p>
            <address className="not-italic mb-2">1188 Budapest, Vezér u. 77 / b.</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://mgrecords.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: mgrecords.hu
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@mgrecords.hu" className="hover:underline text-primary">
                Email: info@mgrecords.hu
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: + 36-20-971-5023
            </p>
          </div>

          {/* Distributor 12 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Italy</h3>
            <p className="mb-2">SELF DISTRIBUZIONE</p>
            <address className="not-italic mb-2">Via Gianfranco Malipiero, 14 20138 Milano</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.self.it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.self.it
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:digital1@self.it" className="hover:underline text-primary">
                Email: digital1@self.it
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +39 02 509011
            </p>
          </div>

          {/* Distributor 13 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Japan</h3>
            <p className="mb-2">ナクソス・ジャパン株式会社</p>
            <address className="not-italic mb-2">東京都渋谷区神南1-9-2 大畠ビル6階</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://naxos.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: naxos.jp
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: 03-5489-7055
            </p>
          </div>

          {/* Distributor 14 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Mexico</h3>
            <p className="mb-2">NAXOS OF AMERICA, Inc.</p>
            <address className="not-italic mb-2">1810 Columbia Ave, Suite 28, Franklin, TN 37064 USA</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://naxosusa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:shickey@naxosusa.com" className="hover:underline text-primary">
                Email: shickey@naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +1 615.465.3840
            </p>
          </div>

          {/* Distributor 15 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">New Zealand</h3>
            <p className="mb-2">ODE RECORDS</p>
            <address className="not-italic mb-2">PO Box 56 450 Dominion Rd. 1446</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.oderecords.co.nz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.oderecords.co.nz
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@oderecords.co.nz" className="hover:underline text-primary">
                Email: info@oderecords.co.nz
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +64 9 630 1177
            </p>
          </div>

          {/* Distributor 16 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Norway</h3>
            <p className="mb-2">NAXOS SWEDEN</p>
            <address className="not-italic mb-2">Kryptongatan 8, SE-703 74 Örebro</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.naxosdirect.se"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.naxosdirect.se
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@naxos.se" className="hover:underline text-primary">
                Email: info@naxos.se
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +46 19206860
            </p>
          </div>

          {/* Distributor 17 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Poland</h3>
            <p className="mb-2">CMD (Classical Music Distribution)</p>
            <address className="not-italic mb-2">ul.Zielonogórska 6 45-323 Opole</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.cmd.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.cmd.pl
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:cmd@cmd.pl" className="hover:underline text-primary">
                Email: cmd@cmd.pl
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +48 601 446 226
            </p>
          </div>

          {/* Distributor 18 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Portugal</h3>
            <p className="mb-2">DISTRIJAZZ</p>
            <address className="not-italic mb-2">Timoteo Padrós, 31 28200 San Lorenzo de El Escorial</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://distrijazz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:contacto@distrijazz.com" className="hover:underline text-primary">
                Email: contacto@distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +34 93 444 79 57 ext. 2005
            </p>
          </div>

          {/* Distributor 19 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Russia</h3>
            <p className="mb-2">WARNER MUSIC Ltd.</p>
            <address className="not-italic mb-2">Nastavnicheskiy Pereulok, 17 ctp.1, Moskva, 105120</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://warnermusic.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: warnermusic.ru
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +7 (495) 787-56-70
            </p>
          </div>

          {/* Distributor 20 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">South Korea</h3>
            <p className="mb-2">LAON-I (NABISORI)</p>
            <address className="not-italic mb-2">#606 19 jungang-ro 126lbeon-gil ilsandong-gu goyang-si gyeonggi-do Korea (410-837)</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.nabisori.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.nabisori.co.kr
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:chulki@nabisori.com" className="hover:underline text-primary">
                Email: chulki@nabisori.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +82 31 901 57 18
            </p>
          </div>

          {/* Distributor 21 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Spain</h3>
            <p className="mb-2">DISTRIJAZZ</p>
            <address className="not-italic mb-2">Timoteo Padrós, 31 28200 San Lorenzo de El Escorial</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://distrijazz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:contacto@distrijazz.com" className="hover:underline text-primary">
                Email: contacto@distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +34 93 444 79 57 ext. 2005
            </p>
          </div>

          {/* Distributor 22 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Sweden</h3>
            <p className="mb-2">NAXOS SWEDEN</p>
            <address className="not-italic mb-2">Kryptongatan 8, SE-703 74 Örebro</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.naxosdirect.se"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.naxosdirect.se
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@naxos.se" className="hover:underline text-primary">
                Email: info@naxos.se
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +46 19206860
            </p>
          </div>

          {/* Distributor 23 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Switzerland</h3>
            <p className="mb-2">MUSIKONTAKT</p>
            <address className="not-italic mb-2">Forchstrasse 136 CH-8032 Zürich</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://musikontakt.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: musikontakt.ch
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@musikontakt.ch" className="hover:underline text-primary">
                Email: info@musikontakt.ch
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +41 (0)44 381 02 95
            </p>
          </div>

          {/* Distributor 24 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Taiwan</h3>
            <p className="mb-2">OSCC</p>
            <address className="not-italic mb-2">No. 185-1, Sec. 2, Fuxing S. Rd., 106 Da'an Dist. Taipei, Taiwan (ROC)</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.stsd99.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.stsd99.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:stsdbox@gmail.com" className="hover:underline text-primary">
                Email: stsdbox@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +886 2 77288385
            </p>
          </div>

          {/* Distributor 25 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">The Netherlands</h3>
            <p className="mb-2">OUTHERE DISTRIBUTION</p>
            <address className="not-italic mb-2">Rue De L'Epargne, 29 1000 Bruxelles</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.outhere-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:emma@outhere-music.com" className="hover:underline text-primary">
                Email: emma@outhere-music.com
              </a>
            </p>
          </div>

          {/* Distributor 26 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">United Kingdom</h3>
            <p className="mb-2">RSK ENTERTAINMENT Ltd</p>
            <address className="not-italic mb-2">Unit 3, Home Farm, Welford, Newbury, Berkshire RG20 8HR UK</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.rskentertainment.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.rskentertainment.co.uk
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@rskentertainment.co.uk" className="hover:underline text-primary">
                Email: info@rskentertainment.co.uk
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Phone: +44(0)1488 608900
            </p>
          </div>

          {/* Distributor 27 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">USA</h3>
            <p className="mb-2">THE ORCHARD</p>
            <address className="not-italic mb-2">23 E. 4th St., 3rd Fl New York, NY 10003 USA</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.theorchard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                Website: www.theorchard.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:clientservices@theorchard.com" className="hover:underline text-primary">
                Email: clientservices@theorchard.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
