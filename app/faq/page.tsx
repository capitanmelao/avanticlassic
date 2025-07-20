import type { Metadata } from "next"
import { JsonLdScript } from "@/components/json-ld"
import { generateMetadata } from "@/lib/seo"
import { generateFAQSchema } from "@/lib/structured-data"

// FAQ data optimized for AI search engines and classical music queries
const faqData = [
  {
    question: "What is Avanti Classic?",
    answer: "Avanti Classic is a modern classical music label featuring world-renowned artists and premium recordings. We specialize in high-quality classical music productions, offering both CD and Hybrid SACD formats with exceptional sound quality."
  },
  {
    question: "What types of classical music does Avanti Classic release?",
    answer: "Avanti Classic releases a diverse range of classical music including orchestral works, chamber music, solo piano performances, violin concertos, and contemporary classical compositions. Our catalog features both established masterpieces and modern interpretations by internationally acclaimed artists."
  },
  {
    question: "Who are some notable artists on Avanti Classic?",
    answer: "Avanti Classic features renowned classical musicians including Martha Argerich (piano), Roby Lakatos (violin), Polina Leschenko (piano), and many other internationally recognized performers. Our artists are selected for their exceptional technical skill and musical interpretation."
  },
  {
    question: "What audio formats does Avanti Classic offer?",
    answer: "Avanti Classic releases music in multiple high-quality formats including standard CD and Hybrid SACD (Super Audio CD). Hybrid SACDs provide superior audio quality and are compatible with both SACD players and standard CD players."
  },
  {
    question: "How can I purchase Avanti Classic recordings?",
    answer: "Avanti Classic recordings are available through our online shop at avanticlassic.vercel.app/shop. We offer secure online ordering with international shipping. Albums are typically priced at €14.00 for CDs and €16.00 for Hybrid SACDs."
  },
  {
    question: "Does Avanti Classic offer streaming services?",
    answer: "Yes, many Avanti Classic releases are available on major streaming platforms including Spotify, Apple Music, and YouTube Music. You can find our curated playlists and individual albums on these platforms."
  },
  {
    question: "What makes Avanti Classic recordings special?",
    answer: "Avanti Classic focuses on exceptional audio quality, featuring state-of-the-art recording techniques and mastering processes. Our recordings capture the full dynamic range and nuanced performances of classical music, providing an immersive listening experience."
  },
  {
    question: "How often does Avanti Classic release new albums?",
    answer: "Avanti Classic regularly releases new recordings throughout the year. We maintain a careful curation process, ensuring each release meets our high standards for musical excellence and audio quality."
  },
  {
    question: "Can I find information about classical music composers on Avanti Classic?",
    answer: "Yes, Avanti Classic provides detailed information about the composers, musical works, and historical context of our recordings. Each release includes comprehensive liner notes and artist biographies."
  },
  {
    question: "Does Avanti Classic support emerging classical musicians?",
    answer: "Avanti Classic is committed to supporting both established and emerging classical talent. We work with artists who demonstrate exceptional musical ability and contribute to the evolution of classical music performance."
  },
  {
    question: "What is the difference between CD and Hybrid SACD?",
    answer: "CDs offer standard 16-bit/44.1kHz audio quality, while Hybrid SACDs provide superior 1-bit Direct Stream Digital (DSD) encoding with higher resolution and broader frequency response. Hybrid SACDs can be played on both SACD and standard CD players."
  },
  {
    question: "How can I stay updated on new Avanti Classic releases?",
    answer: "You can stay updated on new releases by visiting our website regularly, following our social media channels, or subscribing to our newsletter. We announce all new recordings and special releases through these channels."
  }
]

export const metadata: Metadata = generateMetadata({
  title: "Frequently Asked Questions - Classical Music",
  description: "Get answers to common questions about Avanti Classic, our classical music recordings, artists, audio formats, and how to purchase premium classical albums. Learn about CD vs SACD, streaming options, and our featured musicians.",
  keywords: [
    "classical music FAQ",
    "classical music questions",
    "classical recording formats",
    "SACD vs CD",
    "classical music label",
    "classical music artists",
    "how to buy classical music",
    "classical music streaming"
  ],
  canonical: "/faq",
  type: "website"
})

export default function FAQPage() {
  const faqSchema = generateFAQSchema(faqData)

  return (
    <div className="min-h-screen bg-background">
      <JsonLdScript data={faqSchema} />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 font-playfair mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Avanti Classic, our classical music recordings, 
              featured artists, and how to experience exceptional classical music.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-3 font-playfair">
                  {faq.question}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4 font-playfair">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                If you can't find the answer you're looking for, please don't hesitate to contact us. 
                We're here to help you discover and enjoy exceptional classical music.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </a>
                <a 
                  href="/shop" 
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Browse Our Catalog
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}