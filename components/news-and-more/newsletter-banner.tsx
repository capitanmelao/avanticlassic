import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function NewsletterBanner() {
  return (
    <section className="w-full py-16 md:py-24 bg-black text-white relative overflow-hidden">
      <Image
        src="/placeholder.svg?height=400&width=600"
        width={600}
        height={400}
        alt="Violin scrolls"
        className="absolute left-0 top-0 h-full w-1/2 object-cover object-left opacity-50 md:opacity-100"
      />
      <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-end gap-8 relative z-10">
        <div className="md:w-1/2 text-center md:text-right">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">KEEP UP TO DATE</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Our newsletter brings you the latest music, special offers and news from our artists.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4">
            <Input
              type="email"
              placeholder="Enter your email here"
              className="max-w-sm bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:ring-white focus:border-white"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              SUBSCRIBE <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            <input type="checkbox" id="privacy-consent" className="mr-2" />
            <label htmlFor="privacy-consent">
              I have read and agree to the Avanti Classic{" "}
              <Link href="#" className="underline hover:text-white">
                Privacy Policy
              </Link>
              .
            </label>
          </p>
        </div>
      </div>
    </section>
  )
}
