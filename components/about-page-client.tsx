"use client"

import { Phone, Mail, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslations } from "@/lib/translations"

export function AboutPageClient() {
  const { language } = useLanguage()
  const t = useTranslations(language)

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">
        {t.about.title}
      </h1>

      <section className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6 mb-16 text-gray-700 dark:text-gray-300">
        <p>
          {t.about.paragraph1}
        </p>
        <p>
          {t.about.paragraph2}
        </p>
        <p>
          {t.about.paragraph3}
        </p>
        <p>
          {t.about.paragraph4}
        </p>
        <p>
          {t.about.paragraph5}
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
          {t.about.distributorsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
          {/* Distributor 1 - Australia */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Australia</h3>
            <p className="mb-2">SELECT AUDIO VISUAL DISTRIBUTION</p>
            <address className="not-italic mb-2">
              Unit 7, Botany Bay Industrial Estate, 2-12 Beauchamp Road, Banksmeadow NSW 2019
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.savd.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.savd.com.au
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@savd.com.au" className="hover:underline text-primary">
                {t.about.email}: info@savd.com.au
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +61 (0)2 8287 4882
            </p>
          </div>

          {/* Distributor 2 - Austria */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Austria</h3>
            <p className="mb-2">LOTUS RECORDS</p>
            <address className="not-italic mb-2">Kirchplatz 2/1, A-5110 Oberndorf</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.lotusrecords.at"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.lotusrecords.at
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:elsinger@lotusrecords.at" className="hover:underline text-primary">
                {t.about.email}: elsinger@lotusrecords.at
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +43 (0)6272 73175
            </p>
          </div>

          {/* Distributor 3 - Belgium */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Belgium</h3>
            <p className="mb-2">OUTHERE DISTRIBUTION</p>
            <address className="not-italic mb-2">Rue De L'Epargne, 29, 1000 Bruxelles</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.outhere-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:emma@outhere-music.com" className="hover:underline text-primary">
                {t.about.email}: emma@outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +32 (0)2 648 79 69
            </p>
          </div>

          {/* Distributor 4 - Czech Republic */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Czech Republic</h3>
            <p className="mb-2">CLASSIC MUSIC DISTRIBUTION</p>
            <address className="not-italic mb-2">Biskupcova 37, 130 00 Praha 3</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.classic.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.classic.cz
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:classic@classic.cz" className="hover:underline text-primary">
                {t.about.email}: classic@classic.cz
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: 271 770 737
            </p>
          </div>

          {/* Distributor 5 - France */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">France</h3>
            <p className="mb-2">OUTHERE MUSIC France</p>
            <address className="not-italic mb-2">31, Rue du Fbg Poissonnière, 75009 Paris</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="http://www.outhere-music.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:loic@outhere-music.com" className="hover:underline text-primary">
                {t.about.email}: loic@outhere-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +33 (0)1 43 45 02 89
            </p>
          </div>

          {/* Distributor 6 - Germany */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Germany</h3>
            <p className="mb-2">NOTE 1 MUSIC GmbH</p>
            <address className="not-italic mb-2">Carl-Benz-Str. 1, 69115 Heidelberg</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.note1-music.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.note1-music.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:miethe@note1-music.com" className="hover:underline text-primary">
                {t.about.email}: miethe@note1-music.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +49 (0)6221-720351
            </p>
          </div>

          {/* Distributor 7 - Greece */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Greece</h3>
            <p className="mb-2">OPERA COMPACT DISC</p>
            <address className="not-italic mb-2">Ακαδημίας 57, Αθήνα, ΤΚ 106 79</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.operacd.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.operacd.gr
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@operacd.gr" className="hover:underline text-primary">
                {t.about.email}: info@operacd.gr
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +30 210 3626137
            </p>
          </div>

          {/* Distributor 8 - Hong Kong */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Hong Kong</h3>
            <p className="mb-2">SHUN CHEONG RECORDS & Co., LTD.</p>
            <address className="not-italic mb-2">
              Unit No. 1 & 2, Winning Centre, 11/F., 29 Tai Yau Street, San Po Kong, Kowloon, Hong Kong, SAR
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.shuncheongrec.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.shuncheongrec.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:clementng@shuncheongrec.com" className="hover:underline text-primary">
                {t.about.email}: clementng@shuncheongrec.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +(852) 2332 2397
            </p>
          </div>

          {/* Distributor 9 - Hungary */}
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
                {t.about.website}: mgrecords.hu
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@mgrecords.hu" className="hover:underline text-primary">
                {t.about.email}: info@mgrecords.hu
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: + 36-20-971-5023
            </p>
          </div>

          {/* Distributor 10 - Italy */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Italy</h3>
            <p className="mb-2">SELF DISTRIBUZIONE</p>
            <address className="not-italic mb-2">Via Gianfranco Malipiero, 14, 20138 Milano</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.self.it"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.self.it
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:digital1@self.it" className="hover:underline text-primary">
                {t.about.email}: digital1@self.it
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +39 02 509011
            </p>
          </div>

          {/* Distributor 11 - Japan */}
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
                {t.about.website}: naxos.jp
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: 03-5489-7055
            </p>
          </div>

          {/* Distributor 12 - New Zealand */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">New Zealand</h3>
            <p className="mb-2">ODE RECORDS</p>
            <address className="not-italic mb-2">PO Box 56 450, Dominion Rd., 1446</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.oderecords.co.nz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.oderecords.co.nz
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@oderecords.co.nz" className="hover:underline text-primary">
                {t.about.email}: info@oderecords.co.nz
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +64 9 630 1177
            </p>
          </div>

          {/* Distributor 13 - Norway */}
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
                {t.about.website}: www.naxosdirect.se
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@naxos.se" className="hover:underline text-primary">
                {t.about.email}: info@naxos.se
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +46 19206860
            </p>
          </div>

          {/* Distributor 14 - Poland */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Poland</h3>
            <p className="mb-2">CMD (Classical Music Distribution)</p>
            <address className="not-italic mb-2">ul.Zielonogórska 6, 45-323 Opole</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.cmd.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.cmd.pl
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:cmd@cmd.pl" className="hover:underline text-primary">
                {t.about.email}: cmd@cmd.pl
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +48 601 446 226
            </p>
          </div>

          {/* Distributor 15 - Portugal */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Portugal</h3>
            <p className="mb-2">DISTRIJAZZ</p>
            <address className="not-italic mb-2">Timoteo Padrós, 31, 28200 San Lorenzo de El Escorial</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://distrijazz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:contacto@distrijazz.com" className="hover:underline text-primary">
                {t.about.email}: contacto@distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +34 93 444 79 57 ext. 2005
            </p>
          </div>

          {/* Distributor 16 - Russia */}
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
                {t.about.website}: warnermusic.ru
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +7 (495) 787-56-70
            </p>
          </div>

          {/* Distributor 17 - South Korea */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">South Korea</h3>
            <p className="mb-2">LAON-I (NABISORI)</p>
            <address className="not-italic mb-2">
              #606 19 jungang-ro 126lbeon-gil ilsandong-gu goyang-si gyeonggi-do Korea (410-837)
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.nabisori.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.nabisori.co.kr
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:chulki@nabisori.com" className="hover:underline text-primary">
                {t.about.email}: chulki@nabisori.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +82 31 901 57 18
            </p>
          </div>

          {/* Distributor 18 - Spain */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Spain</h3>
            <p className="mb-2">DISTRIJAZZ</p>
            <address className="not-italic mb-2">Timoteo Padrós, 31, 28200 San Lorenzo de El Escorial</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://distrijazz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:contacto@distrijazz.com" className="hover:underline text-primary">
                {t.about.email}: contacto@distrijazz.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +34 93 444 79 57 ext. 2005
            </p>
          </div>

          {/* Distributor 19 - Sweden */}
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
                {t.about.website}: www.naxosdirect.se
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@naxos.se" className="hover:underline text-primary">
                {t.about.email}: info@naxos.se
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +46 19206860
            </p>
          </div>

          {/* Distributor 20 - Switzerland */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Switzerland</h3>
            <p className="mb-2">MUSIKONTAKT</p>
            <address className="not-italic mb-2">Forchstrasse 136, CH-8032 Zürich</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://musikontakt.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: musikontakt.ch
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@musikontakt.ch" className="hover:underline text-primary">
                {t.about.email}: info@musikontakt.ch
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +41 (0)44 381 02 95
            </p>
          </div>

          {/* Distributor 21 - Taiwan */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">Taiwan</h3>
            <p className="mb-2">OSCC</p>
            <address className="not-italic mb-2">
              No. 185-1, Sec. 2, Fuxing S. Rd., 106 Da'an Dist. Taipei, Taiwan (ROC)
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.stsd99.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.stsd99.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:stsdbox@gmail.com" className="hover:underline text-primary">
                {t.about.email}: stsdbox@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +886 2 77288385
            </p>
          </div>

          {/* Distributor 22 - UK */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">United Kingdom</h3>
            <p className="mb-2">RSK ENTERTAINMENT Ltd</p>
            <address className="not-italic mb-2">
              Unit 3, Home Farm, Welford, Newbury, Berkshire RG20 8HR UK
            </address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.rskentertainment.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.rskentertainment.co.uk
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@rskentertainment.co.uk" className="hover:underline text-primary">
                {t.about.email}: info@rskentertainment.co.uk
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +44(0)1488 608900
            </p>
          </div>

          {/* Distributor 23 - USA (NAXOS) */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">USA</h3>
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
                {t.about.website}: naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:shickey@naxosusa.com" className="hover:underline text-primary">
                {t.about.email}: shickey@naxosusa.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t.about.phone}: +1 615.465.3840
            </p>
          </div>

          {/* Distributor 24 - USA (THE ORCHARD) */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-50">USA</h3>
            <p className="mb-2">THE ORCHARD</p>
            <address className="not-italic mb-2">23 E. 4th St., 3rd Fl, New York, NY 10003, USA</address>
            <p className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <a
                href="https://www.theorchard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {t.about.website}: www.theorchard.com
              </a>
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:clientservices@theorchard.com" className="hover:underline text-primary">
                {t.about.email}: clientservices@theorchard.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}