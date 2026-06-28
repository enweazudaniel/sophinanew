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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        <Image
          src="https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center px-4 drop-shadow-lg">Staff & Students</h1>
        </div>
      </div>

      {/* Introduction */}
      <section className="section-padding container-premium text-center">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-primary">We believe that everyone's a student and everyone's a teacher.</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our faculty and staff work together to foster a collaborative learning environment where every voice is valued.
          </p>
        </div>
      </section>

      {/* Class Sections */}
      {classes.map((level, levelIndex) => (
        <section key={level.level} className={`section-padding ${levelIndex % 2 === 0 ? 'bg-muted/30' : ''}`}>
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-primary mb-4">{level.level}</h2>
              <p className="text-muted-foreground">Nurturing minds and building confidence</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {level.sections.map((section) => (
                <div key={section.name} className="card-elevated overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative aspect-video">
                    <Image src={section.image || "/placeholder.svg"} alt={section.name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-primary mb-1">{section.name}</h3>
                    <p className="text-sm text-muted-foreground">{level.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Leadership Section */}
      <section className="section-padding container-premium">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-4">Our Leadership</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visionary leaders dedicated to educational excellence
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="card-elevated overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="relative aspect-square">
              <Image
                src="https://i.ibb.co/8vd7wWw/model1.jpg"
                alt="Pastor Philip Enweazu"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-bold text-primary mb-1">Pastor Philip Enweazu</h3>
              <p className="text-sm text-muted-foreground">Founder & Owner</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
