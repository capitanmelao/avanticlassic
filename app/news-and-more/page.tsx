import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { NewsCard } from "@/components/news-and-more/news-card"
import { ReviewItem } from "@/components/news-and-more/review-item"
import NewsletterBanner from "@/components/news-and-more/newsletter-banner"

// Dummy data for news
const dummyNews = [
  {
    id: "1",
    date: "Jun 26, 2025",
    title: "2025 OPUS KLASSIK AWARD WINNERS ANNOUNCED",
    description:
      "CONGRATULATIONS TO GOLDA SCHULTZ, JURI REINVERE AND JULIEN CHAUVIN & LE CONCERT DE LA LOGEThe winners of Germany's most prestigious classical music award have been revealed...",
  },
  {
    id: "2",
    date: "Jun 4, 2025",
    title: "OPUS KLASSIK ANNOUNCES ITS SHORTLIST FOR THE 2025 AWARDS",
    description:
      "CONGRATULATIONS TO ALL OUR NOMINATED ARTISTS The Opus Klassik jury has published its shortlist of nominees for the upcoming 2025 awards ceremony...",
  },
  {
    id: "3",
    date: "Mar 24, 2025",
    title: "OUR ARTISTS WIN THREE INTERNATIONAL CLASSICAL MUSIC AWARDS",
    description:
      "CONGRATULATIONS TO LEONARDO GARCÍA ALARCÓN, SCHERZI MUSICALI & NICHOLAS ACHTEN, AND MARTIN HELMCHENLeonardo García Alarcón and his ensemble have been recognized for their outstanding contributions...",
  },
]

// Dummy data for reviews
const dummyReviews = [
  {
    id: "r1",
    date: "25.06.2026",
    publication: "LA LIBRE BELGIQUE",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+1",
    reviewText:
      "[...] la voix chaleureuse, le naturel et la maîtrise de Appl transforment le concept en une véritable réussite artistique.",
  },
  {
    id: "r2",
    date: "11.11.2025",
    publication: "BBC RADIO 3",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+2",
    reviewText:
      "There's an excellent mike balance here which means that the clarity is superb, and it really captures that youthful fresh vigour in his performance. He's known for flair and risk-taking and I think he was an excellent choice for the concert.",
  },
  {
    id: "r3",
    date: "11.11.2025",
    publication: "BBC RADIO 3",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+3",
    reviewText:
      "What they do bring instead is a freshness and they're very good at sustaining the pace, so it's a lovely recording. Like I said it's got a freshness to it, and it does seem very well historically informed. Quite exciting.",
  },
]

export default function NewsAndMorePage() {
  return (
    <div className="flex flex-col">
      {/* Latest News Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">LATEST NEWS</h1>
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href="#">
                ALL NEWS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            {dummyNews.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Banner */}
      <NewsletterBanner />

      {/* Videos Preview Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-12">VIDEOS</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our collection of captivating performances, interviews, and behind-the-scenes footage.
          </p>
          <Button
            asChild
            className="px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Link href="/videos">View All Videos</Link>
          </Button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">REVIEWS</h2>
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href="#">
                ALL REVIEWS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dummyReviews.map((reviewItem) => (
              <ReviewItem key={reviewItem.id} review={reviewItem} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
