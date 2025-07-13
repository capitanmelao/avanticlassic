import Link from "next/link"
import { Facebook, Youtube, Mail, Twitter, Instagram } from "lucide-react" // Added Twitter and Instagram

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Avanti Classic. All rights reserved.
        </div>
        <nav className="flex gap-6">
          <Link
            href="#"
            className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </nav>
        <div className="flex gap-4">
          <Link
            href="https://www.facebook.com/avanticlassic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <Facebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <Twitter className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://www.youtube.com/avanticlassic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <Youtube className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link
            href="mailto:info@avanticlassic.com"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <Mail className="h-6 w-6" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
