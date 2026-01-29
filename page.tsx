import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageSlider } from "@/components/image-slider"
import { ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Admissions
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Student Life
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              News
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <Button className="bg-blue-600 hover:bg-blue-700">Apply</Button>
        </div>
      </header>

      {/* Hero Section */}
      <ImageSlider />

      {/* Welcome Section */}
      <section className="py-16 container mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Image
              src="https://i.ibb.co/8vd7wWw/model1.jpg"
              alt="Principal"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Sophina Nursery and Primary School</h2>
              <p className="text-gray-600">
                We foster a culture of excellence, fostering a love for learning in a nurturing environment. Our
                approach encourages curiosity, creativity, and a strong foundation in academics and character
                development.
              </p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            Learn More <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src="https://www.youtube.com/embed/b14yhd1flko?si=XZ7pdfKRAErlZkZC"
            title="Welcome to Sophina School"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="bg-[#F5FAFA] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Sets Us Apart?</h2>
          <div className="space-y-12 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="https://sjc.microlink.io/tZQs6GR2ENrLSyw7EQKhBDII6brOcuF6TsclV7AzaIHhH7_rjwyWACyPd_iXVX9kvzNMUHdqAjP8DYJ7ajeDCA.jpeg"
                  alt="Students learning"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Learner-Centered</h3>
                <p className="text-gray-600 mb-4">
                  At Sophina Nursery and Primary School, students take charge of their learning journey with our
                  innovative approach to education. Our distinctive environment fosters independence, curiosity, and a
                  lifelong love for learning.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Active Learning</h3>
                <p className="text-gray-600 mb-4">
                  We believe in hands-on learning experiences where students engage in discussions, problem-solving, and
                  real-world applications. Our approach ensures a balance between collaboration and self-mastery.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="https://sjc.microlink.io/zSW_O0XOSLjzZGahe8LSbLhvR_OCFjaNbuUzThcWz2jPE_16OgqRP_n5TxN8mykOKgKnEiYn87FaEi1DTsCyEw.jpeg"
                  alt="Students in traditional dress"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Flexible learning"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Flexible & Accelerated Pacing</h3>
                <p className="text-gray-600 mb-4">
                  Our students advance at their own pace, mastering content without unnecessary repetition. This allows
                  them to accelerate their learning and build confidence in their abilities.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">In the News</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              title: "Second Term Mid-term Break",
              date: "February 14, 2024",
              image: "/placeholder.svg?height=80&width=80",
              description: "Students recharged and reconnected during our Second Term Mid-term Break",
            },
            {
              title: "End of Year Party",
              date: "December 15, 2023",
              image: "/placeholder.svg?height=80&width=80",
              description:
                "Our Year End Students celebrated their achievements and camaraderie at our festive End of Year Party",
            },
            {
              title: "Graduation Day",
              date: "July 15, 2024",
              image: "/placeholder.svg?height=80&width=80",
              description: "Students celebrated their achievements and embraced new beginnings at our Graduation Day",
            },
            {
              title: "Annual Colour Day",
              date: "March 28, 2024",
              image: "/placeholder.svg?height=80&width=80",
              description:
                "Students enriched our School with a vibrant colours and showcased their creativity at our Annual Colour Day",
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
                <h3 className="font-bold text-lg">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{news.date}</p>
                <p className="text-gray-600">{news.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Now accepting applications for the 2025-26 School Year</h2>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Apply Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">SCHOOL ADDRESS</h3>
              <p className="text-sm">
                Off Polytechnic Road
                <br />
                Opposite HoLi BRed Gate, 320104
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">CONTACT US</h3>
              <p className="text-sm">
                Phone: 0703214578/0702718470
                <br />
                Email: sophina1info@gmail.com
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400">© Sophina Nursery and Primary School</div>
        </div>
      </footer>
    </div>
  )
}
