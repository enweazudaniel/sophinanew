import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Sophina Nursery and Primary School",
    template: "%s | Sophina Nursery and Primary School",
  },
  description:
    "Sophina Nursery and Primary School provides high-quality education fostering holistic development of each child through innovative teaching methods and a supportive learning environment.",
  keywords: ["school", "education", "nursery", "primary school", "Ogwashi-Uku", "Delta State", "Nigeria"],
  authors: [{ name: "Sophina Nursery and Primary School" }],
  creator: "Sophina Nursery and Primary School",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://sophina.vercel.app",
    title: "Sophina Nursery and Primary School",
    description: "Quality education for nursery and primary school children in Ogwashi-Uku, Delta State.",
    siteName: "Sophina Nursery and Primary School",
    images: [
      {
        url: "https://i.ibb.co/Kv2kM0c/photo-2023-08-07-14-24-24.jpg",
        width: 1200,
        height: 630,
        alt: "Sophina School Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sophina Nursery and Primary School",
    description: "Quality education for nursery and primary school children in Ogwashi-Uku, Delta State.",
    images: ["https://i.ibb.co/Kv2kM0c/photo-2023-08-07-14-24-24.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google verification code
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"
