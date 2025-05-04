"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/apply", label: "Admissions" },
    { href: "/our-school", label: "Our School" },
    { href: "/about", label: "Mission & Vision" },
  ]

  return (
    <header className="border-b relative bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://i.ibb.co/Kv2kM0c/photo-2023-08-07-14-24-24.jpg"
            alt="Sophina School Logo"
            width={70}
            height={70}
            className="h-16 w-16"
          />
        </Link>
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/apply" className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90">Apply</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t z-50">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/apply" className="mt-4" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90">Apply</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
