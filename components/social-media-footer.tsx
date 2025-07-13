import Link from "next/link"
import Image from "next/image"

export default function SocialMediaFooter() {
  return (
    <footer className="w-full py-6 bg-background border-t">
      <div className="container flex items-center justify-center gap-4 px-4 md:px-6">
        <Link
          href="https://www.facebook.com/avanticlassic"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <Image src="/images/facebook-icon.png" width={32} height={32} alt="Facebook" className="rounded-full" />
          <span className="sr-only">Facebook</span>
        </Link>
        <Link
          href="https://www.youtube.com/avanticlassic"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80"
        >
          <Image src="/images/youtube-icon.png" width={32} height={32} alt="YouTube" className="rounded-full" />
          <span className="sr-only">YouTube</span>
        </Link>
      </div>
    </footer>
  )
}
