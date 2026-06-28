import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mission & Vision",
  description:
    "Discover our mission and vision at Sophina School. We provide high-quality, inclusive education fostering holistic development of each child.",
  openGraph: {
    title: "Mission & Vision | Sophina School",
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
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        <Image
          src="https://i.ibb.co/35SLFPTL/PXL-20240326-114354119.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center px-4 drop-shadow-lg">Mission & Vision</h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="section-padding container-premium">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-8">
              Our mission at Sophina School is to provide a high-quality, inclusive education that
              fosters the holistic development of each child. We are committed to giving our students a competitive
              edge through an extensive curriculum and dynamic teaching methodologies, and to creating a positive and
              supportive learning environment that promotes creativity, critical thinking, and collaboration. Our goal
              is to prepare our students for success in their future academic and personal endeavors and to help them
              reach their full potential.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl animate-scale-in">
            <Image
              src="https://i.ibb.co/k29pVq6B/PXL-20260401-112327042.jpg"
              alt="Mission Image"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-muted/40">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl animate-scale-in order-last md:order-first">
              <Image
                src="https://i.ibb.co/kVpmQhK5/PXL-20241021-131450129-1-1-1.png"
                alt="Vision Image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-8 animate-fade-in-up order-first md:order-last">
              <h2 className="text-primary">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-8">
                At Sophina School, we envision a future where all our students are confident,
                compassionate, and curious learners who are well-equipped to thrive in a rapidly changing world. Through
                a dynamic and inclusive learning environment, we empower our students to reach their full potential and
                become responsible global citizens who make a positive impact on their communities and the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-padding container-premium">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do at Sophina School
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Excellence",
              description:
                "We strive for excellence in everything we do, setting high standards and encouraging our students to reach their full potential.",
            },
            {
              title: "Innovation",
              description:
                "We embrace innovative teaching methods and technologies to provide our students with the best possible learning experience.",
            },
            {
              title: "Character",
              description:
                "We believe in developing strong character and values in our students, preparing them to be responsible and ethical leaders.",
            },
          ].map((value, i) => (
            <div key={i} className="card-elevated hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl text-primary mb-4 font-bold">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
