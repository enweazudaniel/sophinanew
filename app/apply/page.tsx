import type { Metadata } from "next"
import ApplyPageClient from "./ApplyPageClient"

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Apply to Sophina School for the 2026-27 school year. Join our inclusive educational environment focused on academic excellence.",
  openGraph: {
    title: "Apply Now | Sophina School",
    description: "Submit your application for the 2026-27 school year at Sophina School.",
    images: [
      {
        url: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg",
        width: 1200,
        height: 630,
        alt: "Apply to Sophina School",
      },
    ],
  },
}

export default function ApplyPage() {
  return <ApplyPageClient />
}
