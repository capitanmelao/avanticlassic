import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroCarousel() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container grid gap-8 px-4 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">WORLD TANGOS ODYSSEY</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Embark on a captivating musical journey with{" "}
              <span className="font-semibold text-foreground">ROBY LAKATOS</span> as he delves into the soul-stirring
              rhythms of Tango. Teaming up with the renowned{" "}
              <span className="font-semibold text-foreground">GANG TANGO</span>, the King of Gypsy violinists invites
              you to explore the rich traditions of Tango from across the globe. From timeless classics like Oblivion
              and La Cumparsita to undiscovered jewels such as Rookgordijnen and Yalu Mousiki. This album is a veritable
              treasure chest for lovers of passionate music-making.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous album</span>
            </Button>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              <span className="h-2 w-2 rounded-full bg-gray-400" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next album</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            width={400}
            height={400}
            alt="World Tangos Odyssey album cover"
            className="aspect-square object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
