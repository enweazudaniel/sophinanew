"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, BookOpen, PenTool, Award } from "lucide-react"
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

  const platformLinks = [
    {
      href: "https://sophinacbt.vercel.app/",
      label: "CBT Portal",
      icon: <PenTool className="h-4 w-4 mr-1" />,
      description: "Take tests and exams online",
    },
    {
      href: "https://sophinaedu.lovable.app",
      label: "E-Learning",
      icon: <BookOpen className="h-4 w-4 mr-1" />,
      description: "Access online classroom resources",
    },
    {
      href: "https://sophinarslt.vercel.app",
      label: "Results",
      icon: <Award className="h-4 w-4 mr-1" />,
      description: "Check your exam results",
    },
  ]

  return (
    <header className="border-b relative bg-background z-50">
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

        {/* Main Navigation - Desktop */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Platform Links - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {platformLinks.map((item) => (
            <Link key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="group relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                {item.icon}
                {item.label}
              </Button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {item.description}
              </div>
            </Link>
          ))}

          <ThemeToggle />

          <Link href="/apply" className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90">Apply</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
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

            <div className="border-t border-border my-2 pt-2">
              <p className="text-sm text-muted-foreground mb-2">Student Platforms:</p>
              {platformLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-2 text-primary hover:text-primary/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">- {item.description}</span>
                </Link>
              ))}
            </div>

            <Link href="/apply" className="mt-4" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90">Apply</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
