import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mission & Vision",
  description:
    "Discover our mission and vision at Sophina Nursery and Primary School. We provide high-quality, inclusive education fostering holistic development of each child.",
  openGraph: {
    title: "Mission & Vision | Sophina Nursery and Primary School",
    description:
      "Learn about our mission to provide high-quality, inclusive education and our vision for confident, compassionate learners.",
    images: [
      {
        url: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg",
        width: 1200,
        height: 630,
        alt: "Sophina School Mission and Vision",
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://i.ibb.co/35SLFPTL/PXL-20240326-114354119.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Mission & Vision</h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Mission</h2>
              <p className="text-muted-foreground">
                Our mission at Sophina Nursery and Primary School is to provide a high-quality, inclusive education that
                fosters the holistic development of each child. We are committed to giving our students a competitive
                edge through an extensive curriculum and dynamic teaching methodologies, and to creating a positive and
                supportive learning environment that promotes creativity, critical thinking, and collaboration. Our goal
                is to prepare our students for success in their future academic and personal endeavors and to help them
                reach their full potential.
              </p>
            </div>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://i.ibb.co/0RZZVq15/PXL-20230714-111207121-1-1-1.png"
                alt="Mission Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://i.ibb.co/kVpmQhK5/PXL-20241021-131450129-1-1-1.png"
                alt="Vision Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Vision</h2>
              <p className="text-muted-foreground">
                At Sophina Nursery and Primary School, we envision a future where all our students are confident,
                compassionate, and curious learners who are well-equipped to thrive in a rapidly changing world. Through
                a dynamic and inclusive learning environment, we empower our students to reach their full potential and
                become responsible global citizens who make a positive impact on their communities and the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-primary">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, setting high standards and encouraging our students to
                reach their full potential.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-primary">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace innovative teaching methods and technologies to provide our students with the best possible
                learning experience.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-primary">Character</h3>
              <p className="text-muted-foreground">
                We believe in developing strong character and values in our students, preparing them to be responsible
                and ethical leaders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
