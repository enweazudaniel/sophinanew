import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://i.ibb.co/Kv2kM0c/photo-2023-08-07-14-24-24.jpg"
            alt="Sophina School Logo"
            width={50}
            height={50}
            className="h-12 w-12"
          />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/apply" className="text-gray-600 hover:text-gray-900">
            Admissions
          </Link>
          <Link href="/student-life" className="text-gray-600 hover:text-gray-900">
            Student Life
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>
        <Link href="/apply">
          <Button className="bg-blue-600 hover:bg-blue-700">Apply</Button>
        </Link>
      </div>
    </header>
  )
}
