import Image from "next/image"

const classes = [
  {
    level: "Middle School",
    sections: [
      { name: "BASIC 7", image: "https://i.ibb.co/7d5kgRB0/PXL-20250214-132730029-1-1-1.png" },
      { name: "BASIC 8", image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png" },
      { name: "BASIC 9", image: "https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg" },
    ],
  },
  {
    level: "Lower School",
    sections: [
      { name: "Basic 5", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg" },
      { name: "Basic 4", image: "/placeholder.svg?height=300&width=400" },
      { name: "Basic 3", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg" },
      { name: "Basic 2", image: "/placeholder.svg?height=300&width=400" },
      { name: "Basic 1", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg" },
      { name: "Nursery 2", image: "/placeholder.svg?height=300&width=400" },
      { name: "Nursery 1", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg" },
      { name: "Pre-Nursery", image: "https://i.ibb.co/pBQ1vm7s/PXL-20250214-082847273-1-1-1.png" },
    ],
  },
]

export default function StudentLifePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Staff & Students</h1>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">
            We believe that everyone's a student and everyone's a teacher.
          </h2>
          <p className="text-gray-600">
            Our faculty and staff work together to foster a collaborative learning environment.
          </p>
        </div>
      </section>

      {/* Class Sections */}
      {classes.map((level) => (
        <section key={level.level} className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">{level.level}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {level.sections.map((section) => (
                <div key={section.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={section.image || "/placeholder.svg"} alt={section.name} fill className="object-cover" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg text-blue-600">{section.name}</h3>
                    <p className="text-gray-600">{level.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Staff Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Staff and the Board of Trustees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src="https://i.ibb.co/8vd7wWw/model1.jpg"
                  alt="Pastor Philip Enweazu"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg text-blue-600">Pastor Philip Enweazu</h3>
                <p className="text-gray-600">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
