import Link from "next/link"

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
      </div>
    </footer>
  )
}
