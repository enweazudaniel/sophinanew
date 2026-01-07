import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/image-slider"
import { ScrollingAnnouncement } from "@/components/scrolling-announcement"

const slides = [
  { url: "https://i.ibb.co/p9vC3Hj/PXL-20250319-095044592-PORTRAIT.jpg", alt: "Students at Sophina School" },
    { url: "https://i.ibb.co/xKR8G410/photo-2025-12-03-23-15-02.jpg", alt: "Art and music programs" },
  { url: "https://i.ibb.co/9QvdnNY/PXL-20250213-084232933-1-1-1.png", alt: "School facilities" },
  { url: "https://i.ibb.co/YBdPr6CG/PXL-20250214-132912272.png", alt: "Classroom activities" },
  { url: "https://i.ibb.co/0VJv6qHH/PXL-20250213-150343830-1-1-1.png", alt: "Sports events" },
  { url: "https://i.ibb.co/gM35N07H/PXL-20250214-123830910.jpg", alt: "Classroom activities" },

]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Scrolling Announcement */}
      <ScrollingAnnouncement text="Now accepting applications for the 2025-26 School Year" />

      {/* Hero Section */}
      <ImageSlider slides={slides} />

      {/* Welcome Section */}
      <section className="py-16 container mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">Welcome to Sophina Nursery and Primary School</h2>
            <p className="text-muted-foreground">
              We foster a culture of excellence, nurturing a love for learning in a supportive environment. Our approach
              encourages curiosity, creativity, and builds a strong foundation in academics and character development.
            </p>
          </div>
        </div>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
          <iframe
            src="https://www.youtube.com/embed/CldEfh80zxw?si=hyGT_cjQro1P2Hig"
            title="Welcome to Sophina School"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">What Sets Us Apart?</h2>
          <div className="space-y-12 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg"
                  alt="Students learning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                />
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold text-primary mb-4">Learner-Centered</h3>
                <p className="text-muted-foreground mb-4">
                  At Sophina Nursery and Primary School, students take charge of their learning journey with our
                  innovative approach to education. Our distinctive environment fosters independence, curiosity, and a
                  lifelong love for learning.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-6 bg-background rounded-lg shadow-sm md:order-first border">
                <h3 className="text-xl font-bold text-primary mb-4">Innovative Curriculum</h3>
                <p className="text-muted-foreground mb-4">
                  Our curriculum is designed to challenge and inspire, integrating traditional subjects with modern
                  skills. We emphasize critical thinking, problem-solving, and creativity to prepare students for future
                  success.
                </p>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="https://i.ibb.co/RGt3spWN/PXL-20241022-093659790-1-1-1.png"
                  alt="Innovative curriculum"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="https://i.ibb.co/xKR8G410/photo-2025-12-03-23-15-02.jpg"
                  alt="Holistic development"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                />
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold text-primary mb-4">Holistic Development</h3>
                <p className="text-muted-foreground mb-4">
                  We believe in nurturing the whole child. Our programs focus on academic excellence while also
                  developing social skills, emotional intelligence, and physical well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">In the News</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              title: "Annual Colour Day",
              date: "April 4, 2025",
              image: "/images/colour-day.jpeg",
              description:
                "Students showcased their team spirit and sportsmanship during our vibrant Annual Colour Day, with teams competing in various sporting activities while dressed in their house colors of blue, yellow, and green.",
            },
            {
              title: "Second Term Mid-term Break",
              date: "February 14, 2024",
              image: "https://i.ibb.co/9QvdnNY/PXL-20250213-084232933-1-1-1.png",
              description: "Students recharged and reconnected during our Second Term Mid-term Break",
            },
            {
              title: "End of Year Party",
              date: "December 9, 2025",
              image: "https://i.ibb.co/0yhkt7P5/Gemini-Generated-Image-vq06e9vq06e9vq06.png",
              description:
                "Our Year End Students celebrated their achievements and camaraderie at our festive End of Year Party",
            },
            {
              title: "New Session Begins 2025/2026",
              date: "September 8, 2025",
              image: "https://i.ibb.co/Bdm6Y3V/PXL-20250310-082559334.jpg",
              description:
                "We're excited to welcome new and returning students as we kick off another year of learning and growth at Sophina Nursery & Primary School",
            },
          ].map((news, i) => (
            <div key={i} className="flex gap-4 items-start">
              <Image
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-foreground">{news.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{news.date}</p>
                <p className="text-muted-foreground">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 container mx-auto px-4 text-center">
        <Link href="/apply">
          <Button size="lg" className="bg-primary hover:bg-primary/90 mb-6">
            Apply Now
          </Button>
        </Link>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sophina Nursery and Primary School is dedicated to providing a nurturing and innovative learning environment.
          Our focus is on building a strong foundation for lifelong learning through creativity, curiosity, and academic
          excellence.
        </p>
      </section>
    </div>
  )
}
