import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/image-slider"
import { ScrollingAnnouncement } from "@/components/scrolling-announcement"

const slides = [
  { url: "https://i.ibb.co/p9vC3Hj/PXL-20250319-095044592-PORTRAIT.jpg", alt: "Students at Sophina School" },
    { url: "https://i.ibb.co/xKR8G410/photo-2025-12-03-23-15-02.jpg", alt: "Art and music programs" },
    { url: "https://i.ibb.co/Jw2jqkNx/PXL-20260401-110344914.jpg", alt: "Art s" },
  { url: "https://i.ibb.co/39y8k00P/photo-1-2026-02-17-10-24-24.jpg", alt: "School facilities" },
  { url: " https://i.ibb.co/LdYBY3qB/PXL-20260325-124322457-EFFECTS.jpg", alt: "Schools" },
  { url: "https://i.ibb.co/BH9gJJVy/PXL-20251107-083048799.jpg", alt: "Classroom activities" },
  { url: "https://i.ibb.co/NGxx2pB/PXL-20251201-123313920-1.jpg", alt: "Sports events" },
  { url: "https://i.ibb.co/DHmGBPKX/PXL-20260128-102733820.jpg", alt: "Classroom activities" },

]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Scrolling Announcement */}
      <ScrollingAnnouncement text="Now accepting applications for the 2026-27 School Year" />

      {/* Hero Section */}
      <ImageSlider slides={slides} />

      {/* Welcome Section */}
      <section className="section-padding container-premium">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-primary mb-6">Welcome to Sophina School</h2>
              <p className="text-lg text-muted-foreground leading-8">
                We foster a culture of excellence, nurturing a love for learning in a supportive environment. Our approach
                encourages curiosity, creativity, and builds a strong foundation in academics and character development.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link href="/apply">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg transition-all duration-300 hover:shadow-lg">
                  Apply Now
                </Button>
              </Link>
              <Link href="/our-school">
                <Button variant="outline" className="font-semibold px-8 py-6 text-lg transition-all duration-300 hover:border-primary hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted shadow-xl animate-scale-in">
            <iframe
              src="https://www.youtube.com/embed/0WXhVtbvBLE?si=B0MsC1KCWDFjSceQ"
              title="Welcome to Sophina School"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="section-padding bg-muted/40">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-primary mb-4">What Sets Us Apart?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover what makes Sophina School a premier educational institution dedicated to excellence
            </p>
          </div>
          <div className="section-spacing">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src="https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg"
                  alt="Students learning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                />
              </div>
              <div className="card-elevated">
                <h3 className="text-3xl text-primary mb-4">Learner-Centered</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Sophina School, students take charge of their learning journey with our
                  innovative approach to education. Our distinctive environment fosters independence, curiosity, and a
                  lifelong love for learning.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="card-elevated md:order-first">
                <h3 className="text-3xl text-primary mb-4">Innovative Curriculum</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our curriculum is designed to challenge and inspire, integrating traditional subjects with modern
                  skills. We emphasize critical thinking, problem-solving, and creativity to prepare students for future
                  success.
                </p>
              </div>
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
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

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src="https://i.ibb.co/xKR8G410/photo-2025-12-03-23-15-02.jpg"
                  alt="Holistic development"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                />
              </div>
              <div className="card-elevated">
                <h3 className="text-3xl text-primary mb-4">Holistic Development</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe in nurturing the whole child. Our programs focus on academic excellence while also
                  developing social skills, emotional intelligence, and physical well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding container-premium">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-4">Latest News & Updates</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest happenings at Sophina School
          </p>
        </div>
        <div className="grid gap-6 max-w-4xl mx-auto">
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
            <div key={i} className="card-premium flex gap-6 items-start hover:shadow-xl transition-all duration-300">
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{news.title}</h3>
                  <span className="text-xs font-medium text-primary whitespace-nowrap ml-4">{news.date}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application CTA */}
      <section className="section-padding bg-muted/40">
        <div className="container-premium text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-primary">Ready to Join Sophina School?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sophina School is dedicated to providing a nurturing and innovative learning environment.
              Our focus is on building a strong foundation for lifelong learning through creativity, curiosity, and academic
              excellence.
            </p>
          </div>
          <Link href="/apply">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-7 text-lg transition-all duration-300 hover:shadow-lg">
              Start Your Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
