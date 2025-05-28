import Image from "next/image"
import type { Metadata } from "next"
import { ClassImageSlider } from "@/components/class-image-slider"

export const metadata: Metadata = {
  title: "Our School",
  description:
    "Explore our school facilities, classes, and dedicated staff at Sophina Nursery and Primary School. From Pre-Nursery to Basic 8, we offer comprehensive education.",
  openGraph: {
    title: "Our School | Sophina Nursery and Primary School",
    description:
      "Discover our comprehensive educational programs from Pre-Nursery to Basic 8, and meet our dedicated staff.",
    images: [
      {
        url: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg",
        width: 1200,
        height: 630,
        alt: "Sophina School Facilities",
      },
    ],
  },
}
// Colour Day images
const colourdayImages = [
  "https://i.ibb.co/21gq53wx/PXL-20240326-094033787.jpg",
  "https://i.ibb.co/xKXn4CXj/PXL-20240326-103119393.jpg",
  "https://i.ibb.co/Kxjxkpgn/PXL-20240326-103729604.jpg",
  "https://i.ibb.co/tPJX2YjN/PXL-20240326-114354119.jpg",
  "https://i.ibb.co/HLppFDWW/PXL-20240326-115254862.jpg",
  "https://i.ibb.co/TBRD7WXr/PXL-20240326-115401864.jpg",
  "https://i.ibb.co/HLKYmqrr/PXL-20240326-115405424.jpg",
  "https://i.ibb.co/KzXMCrLx/PXL-20240326-115540013.jpg",
  "https://i.ibb.co/rRXT69MJ/PXL-20240326-115803212.jpg",
  "https://i.ibb.co/SDZYrBKn/PXL-20240326-120441325.jpg",
  "https://i.ibb.co/7NQZfhdP/PXL-20250404-101357895.jpg",
  "https://i.ibb.co/W4JsCRkp/PXL-20250404-101429748.jpg",
  "https://i.ibb.co/Z1XQjX32/PXL-20250404-101437933.jpg",
  "https://i.ibb.co/m5x8H8Fd/PXL-20250404-101455281.jpg",
  "https://i.ibb.co/fGtMV3bC/PXL-20250404-101819821.jpg",
  "https://i.ibb.co/fzBK86jR/PXL-20250404-102107766.jpg",
  "https://i.ibb.co/W4rp0Yy7/PXL-20250404-102725379.jpg",
  "https://i.ibb.co/d4vZRB00/PXL-20250404-103007073.jpg",
  "https://i.ibb.co/4gRC8B54/PXL-20250404-103022204.jpg",
  "https://i.ibb.co/tTXDD3jT/PXL-20250404-103630711.jpg",
  "https://i.ibb.co/PGhs7Mgt/PXL-20250404-103635859.jpg",
  "https://i.ibb.co/5WPzCY5r/PXL-20250404-103702306.jpg",
  "https://i.ibb.co/XryWVpgP/PXL-20250404-103917568.jpg",
  "https://i.ibb.co/PZ9j42C2/PXL-20250404-104038298.jpg",
  "https://i.ibb.co/ds7QnpM3/PXL-20250404-104503344.jpg",
  "https://i.ibb.co/5gYRJQvL/PXL-20250404-105348201.jpg",
  "https://i.ibb.co/TqqFJVJc/PXL-20250404-105357920.jpg",
  "https://i.ibb.co/gMHVZ9Lj/PXL-20250404-105403850.jpg",
  "https://i.ibb.co/mCWV4fC3/PXL-20250404-105525456.jpg",
  "https://i.ibb.co/7J7L4y1n/PXL-20250404-105701329.jpg",
  "https://i.ibb.co/Fkrbt5FH/PXL-20250404-105957796.jpg",
  "https://i.ibb.co/MyGqL3GH/PXL-20250404-110041514.jpg",
  "https://i.ibb.co/Fk970rXk/PXL-20250404-110325337.jpg",
  "https://i.ibb.co/p6gYhSMK/PXL-20250404-110418361.jpg",
  "https://i.ibb.co/xtxM3b1j/PXL-20250404-110456605.jpg",
  "https://i.ibb.co/JwMXTMCX/PXL-20250404-110529889.jpg",
  "https://i.ibb.co/jZ1YZ49m/PXL-20250404-110752313.jpg",
  "https://i.ibb.co/wFtGVQP0/PXL-20250404-110902442.jpg",
  "https://i.ibb.co/nqNqC5d3/PXL-20250404-121308568.jpg",
  "https://i.ibb.co/Mk8PB6Hr/PXL-20250404-122251219.jpg",
  "https://i.ibb.co/mCXBvVS3/PXL-20250404-124030498.jpg",
  "https://i.ibb.co/TxGYY9tt/PXL-20250404-132437931.jpg",
  "https://i.ibb.co/h1BZSLd3/PXL-20250404-105809865-Copy.jpg",
]

// Graduation images
const graduationImages = [
  "https://i.ibb.co/Z6fmsqJs/PXL-20230714-105205426.jpg",
  "https://i.ibb.co/3Y1SqRh6/PXL-20230714-105316943.jpg",
  "https://i.ibb.co/QtHMd6y/PXL-20230714-105345125.jpg",
  "https://i.ibb.co/KxrPPXcK/PXL-20230714-105353611.jpg",
  "https://i.ibb.co/v4MckN20/PXL-20230714-105357620.jpg",
  "https://i.ibb.co/vxnr8YXC/PXL-20230714-105403092.jpg",
  "https://i.ibb.co/dy18jbf/PXL-20230714-105431202.jpg",
  "https://i.ibb.co/My51y3cW/PXL-20230714-113137141.jpg",
  "https://i.ibb.co/F4NP5ypX/PXL-20230714-122351041.jpg",
  "https://i.ibb.co/1JY3hFZR/PXL-20230714-122822904.jpg",
  "https://i.ibb.co/39hYLc9N/PXL-20230714-123442001.jpg",
  "https://i.ibb.co/3mM3ktkN/PXL-20230714-124054523.jpg",
  "https://i.ibb.co/tdhSC1y/PXL-20230714-130128513.jpg",
  "https://i.ibb.co/rGYdpKgn/PXL-20230714-130146954.jpg",
  "https://i.ibb.co/CsWCP8xV/PXL-20230714-131146976.jpg",
  "https://i.ibb.co/zVj0Y4nn/PXL-20230714-131223158.jpg",
  "https://i.ibb.co/7dtdcY0d/PXL-20230714-132829829.jpg",
  "https://i.ibb.co/Q3DrRzv7/PXL-20230714-133050296.jpg",
  "https://i.ibb.co/QSHY19G/PXL-20230714-133930799.jpg",
  "https://i.ibb.co/21zqsktw/PXL-20230714-134451023.jpg",
  "https://i.ibb.co/YFMJQy7Z/PXL-20230714-135216792.jpg",
  "https://i.ibb.co/4R2yVdRh/PXL-20240716-121640178.jpg",
  "https://i.ibb.co/HTMpydT0/PXL-20240716-121916754.jpg",
  "https://i.ibb.co/MkZ0MVxB/PXL-20240716-123036145-1.jpg",
  "https://i.ibb.co/0zKGnbd/PXL-20240716-123451566.jpg",
  "https://i.ibb.co/T98JtKd/PXL-20240716-130851680.jpg",
  "https://i.ibb.co/s93cNRrH/PXL-20240716-130907826.jpg",
  "https://i.ibb.co/6017wvgV/PXL-20240716-130948787.jpg",
  "https://i.ibb.co/KxdZnHFW/PXL-20240716-131032730.jpg",
  "https://i.ibb.co/xK3RyqQR/PXL-20240716-140141239-1.jpg",
  "https://i.ibb.co/0yCCbk0P/PXL-20240716-140337672.jpg",
  "https://i.ibb.co/NXFCg0m/PXL-20240716-140502754-1.jpg",
]
// sports images
const sportsImages = [
  "https://i.ibb.co/Z161Qqqd/PXL-20240221-130500323.jpg",
  "https://i.ibb.co/SXsm83dh/PXL-20240221-130504594.jpg",
  "https://i.ibb.co/x8rvkd00/PXL-20250228-094405004.jpg",
  // Add placeholders to complete the 10 images
  "https://i.ibb.co/fYRB239L/PXL-20250228-094415730.jpg",
  "https://i.ibb.co/TDTQFbMh/PXL-20250319-095023433-PORTRAIT.jpg",
  "https://i.ibb.co/p9vC3Hj/PXL-20250319-095044592-PORTRAIT.jpg",
  "https://i.ibb.co/mVQkJmhr/PXL-20250319-110028624.jpg",
  "https://i.ibb.co/7xfHTHk8/PXL-20250319-110134100.jpg",
  "https://i.ibb.co/39vTWmvh/PXL-20250319-110839915.jpg",
  "https://i.ibb.co/7JfYtR6B/PXL-20250319-112554300.jpg",

]
// Basic 8 images
const basic8Images = [
  "/images/basic8/image1.jpeg",
  "/images/basic8/image2.jpeg",
  "/images/basic8/image3.jpeg",
  "/images/basic8/image4.jpeg",
  "/images/basic8/image5.jpeg",
  "/images/basic8/image6.jpeg",
  // Add placeholders to complete the 10 images
  "https://i.ibb.co/jvKCmscC/PXL-20241007-085104120.jpg",
  "https://i.ibb.co/d42WLH5v/PXL-20241007-085209695.jpg",
  "https://i.ibb.co/7t7Pwvg1/PXL-20241023-093004292.jpg",
  "https://i.ibb.co/gM35N07H/PXL-20250214-123830910.jpg",
  "https://i.ibb.co/hFhLt7DJ/PXL-20250305-090737439.jpg",
  "https://i.ibb.co/21cSxV8m/PXL-20250305-090831846.jpg",
  "https://i.ibb.co/XrDjbFCV/PXL-20250310-082626595.jpg",
  "https://i.ibb.co/HTq2TdVh/PXL-20250321-093824929-PORTRAIT.jpg",
  "https://i.ibb.co/k6G7RKLY/PXL-20250321-093844571-PORTRAIT.jpg",
  "https://i.ibb.co/xq2Kxdz9/PXL-20250321-100102224.jpg",
  "https://i.ibb.co/q3t8SsxT/PXL-20250321-110514807.jpg",
  "https://i.ibb.co/hFFnQQfW/PXL-20250326-094328787.jpg",
  "https://i.ibb.co/WNqMDLdZ/PXL-20250326-110252100.jpg",
  "https://i.ibb.co/hJq193fL/PXL-20250326-110258504.jpg",
  "https://i.ibb.co/ksDdNMJ0/PXL-20250327-112633547.jpg",
  "https://i.ibb.co/23v1MzpD/PXL-20250327-114724234.jpg",
]

// Basic 7 images
const basic7Images = [
  "/images/basic7/image1.jpeg",
  "/images/basic7/image2.jpeg",
  "/images/basic7/image3.jpeg",
  // Add placeholders to complete the 10 images
  "https://i.ibb.co/LDB5J8yX/PXL-20250528-112108716-1.jpg",
  "https://i.ibb.co/wNWTntkm/PXL-20241021-131845101.jpg",
  "https://i.ibb.co/Z670tQrR/PXL-20241021-131858996.jpg",
  "https://i.ibb.co/1YjzKMsz/PXL-20241021-131919163.jpg",
  "https://i.ibb.co/JFBV0sGZ/PXL-20241022-093659790.jpg",
  "https://i.ibb.co/PzMPQtRF/PXL-20241022-093828043.jpg",
  "https://i.ibb.co/gF7Zsvgp/PXL-20250305-090600761.jpg",
  "https://i.ibb.co/203HqdkK/PXL-20250305-090627131.jpg",
  "https://i.ibb.co/SXMtkK5D/PXL-20250321-105741882.jpg",
  "https://i.ibb.co/JR0ctSMB/PXL-20250321-131021778.jpg",
  "https://i.ibb.co/vxKPpx4v/PXL-20250321-131025676.jpg",
  "https://i.ibb.co/QjDCRyhw/PXL-20250326-094408031.jpg",
  "https://i.ibb.co/WNqMDLdZ/PXL-20250326-110252100.jpg",
  "https://i.ibb.co/hJq193fL/PXL-20250326-110258504.jpg",
  "https://i.ibb.co/tPnZRZQN/PXL-20250328-113150603.jpg",
]
// Basic 5 images
const basic5Images = [
  "https://i.ibb.co/358qNRg5/PXL-20250327-105535144.jpg",
  "https://i.ibb.co/wNv9gQjk/PXL-20250327-105538927.jpg",
]
// Basic 4 images
const basic4Images = [
  "https://i.ibb.co/HTG5Nd9P/PXL-20250304-122727542.jpg",
  "https://i.ibb.co/RTvMwk0W/PXL-20250305-090225483.jpg",
 "https://i.ibb.co/Bdm6Y3V/PXL-20250310-082559334.jpg",
]
// Basic 3 images
const basic3Images = [
  "https://i.ibb.co/v69bPXm4/PXL-20250213-145903204.jpg",
  "https://i.ibb.co/p6BNhSvf/PXL-20250213-145919719.jpg",
  "https://i.ibb.co/bgdkDvDR/PXL-20250214-081626982-2.jpg",
  "https://i.ibb.co/h1tb2N9r/PXL-20250310-082552053.jpg",
  "https://i.ibb.co/nN9PVZ5P/PXL-20250327-110227924.jpg",
]
// Basic 2 images
const basic2Images = [
  "https://i.ibb.co/svhkSzKn/PXL-20250305-085419564.jpg",
  "https://i.ibb.co/YF1y4YBx/PXL-20250327-110208664.jpg",
  "https://i.ibb.co/BVNjxhJn/PXL-20250327-110230929.jpg",
  "https://i.ibb.co/YF1y4YBx/PXL-20250327-110208664.jpg",
  "https://i.ibb.co/BVNjxhJn/PXL-20250327-110230929.jpg",
]
// Basic 1 images
const basic1Images = [
  "https://i.ibb.co/mFY4xRv1/PXL-20250213-145819914.jpg",
  "https://i.ibb.co/ccz1T8yF/PXL-20250213-145828237.jpg",
  "https://i.ibb.co/ds6gZC7G/PXL-20250213-145843270.jpg",
  "https://i.ibb.co/0jNsh6Tb/PXL-20250304-121744554.jpg",
  "https://i.ibb.co/qLqFHW5g/PXL-20250304-121749570.jpg",
  "https://i.ibb.co/5XTmjL7z/PXL-20250305-084802173.jpg",
  "https://i.ibb.co/DDmY50Cj/PXL-20250305-084807490.jpg",

]
// Nursery 3 images
const nursery3Images = [
  "https://i.ibb.co/Jw1rYsWq/PXL-20250304-121444473.jpg",
  "https://i.ibb.co/7dctcd9t/PXL-20250304-121448361.jpg",
  "https://i.ibb.co/jZfRVNXN/PXL-20250305-084643013.jpg",
]
// Nursery 2 images
const nursery2Images = [
  "https://i.ibb.co/SXRdg5sk/PXL-20250304-121213028.jpg",
  "https://i.ibb.co/7tXWDGxT/PXL-20250305-084007142.jpg",
]
// Nursery 1 images
const nursery1Images = [
  "https://i.ibb.co/spMk8xsx/PXL-20250214-082847273.jpg",
  "https://i.ibb.co/KcGjSGwF/PXL-20250310-082536354.jpg",
]
// Pre-Nursery images
const preNurseryImages = [
  "/images/pre-nursery/image1.jpeg",
  "/images/pre-nursery/image2.jpeg",
  // Add placeholders to complete the 10 images
  "https://i.ibb.co/v4Cpn8nr/PXL-20250213-145728656.jpg",
  "https://i.ibb.co/RkN2SrYN/PXL-20250213-145734376.jpg",
  "https://i.ibb.co/0y9XVyfZ/PXL-20250213-145746456.jpg",
  "https://i.ibb.co/Fbwqxxt5/PXL-20250310-082536354.jpg",
  "https://i.ibb.co/Zp5bNKZ1/PXL-20250310-082538239.jpg",
  "https://i.ibb.co/C5cNLBfn/PXL-20250327-105852240.jpg",
]
// Creche images
const crecheImages = [
  "https://i.ibb.co/6cgmx5fJ/PXL-20241021-133114920.jpg",
  "https://i.ibb.co/vxkd5Wk5/PXL-20250305-091441427.jpg",
  "https://i.ibb.co/chwBs56H/PXL-20250305-091444245.jpg",
]

const classes = [
  {
    level: "Events",
    sections: [
      {
        name: "Colour Day",
        image: "https://i.ibb.co/7d5kgRB0/PXL-20250214-132730029-1-1-1.png",
        customImages: colourdayImages,
      },
      {
        name: "Graduation",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: graduationImages,
      },
      {
        name: "Sports",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: sportsImages,
      },
    ],
  },
  {
    level: "Middle School",
    sections: [
      {
        name: "BASIC 8",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: basic8Images,
      },
      {
        name: "BASIC 7",
        image: "https://i.ibb.co/7d5kgRB0/PXL-20250214-132730029-1-1-1.png",
        customImages: basic7Images,
      },

    ],
  },
  {
    level: "Lower School",
    sections: [
      { name: "Basic 5", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: basic5Images, },
      { name: "Basic 4", image: "/placeholder.svg?height=300&width=400", customImages: basic4Images, },
      { name: "Basic 3", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg" , customImages: basic3Images,},
      { name: "Basic 2", image: "/placeholder.svg?height=300&width=400", customImages: basic2Images, },
      { name: "Basic 1", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: basic1Images, },
      { name: "Nursery 3", image: "/placeholder.svg?height=300&width=400" , customImages: nursery3Images,},
      { name: "Nursery 2", image: "/placeholder.svg?height=300&width=400" , customImages: nursery2Images,},
      { name: "Nursery 1", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: nursery1Images, },
      {
        name: "Pre-Nursery",
        image: "https://i.ibb.co/pBQ1vm7s/PXL-20250214-082847273-1-1-1.png",
        customImages: preNurseryImages,
      },
      { name: "Creche", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: crecheImages, },
    ],
  },
]

// Staff members data - expanded to include 12 more members
const staffMembers = [
  { name: "Pastor Philip E.", position: "Proprietor", image: "https://i.ibb.co/HTPhw0XW/photo-2025-04-19-19-24-12.jpg" },
  { name: "Mrs. Caroline E.", position: "Proprietress", image: "https://i.ibb.co/V8MDMBw/photo-2025-04-19-19-54-45.jpg" },
  {
    name: "Mr. Emmanuel A.",
    position: "Diction/Phonics/Phonetics Teacher",
    image: "https://i.ibb.co/jdgzbhR/photo-2025-04-19-19-44-33.jpg",
  },
  {
    name: "Mr. Daniel E.",
    position: "Middle School Teacher",
    image: "https://i.ibb.co/VdWXV1x/photo-2025-04-19-19-03-01.jpg",
  },
    {
    name: "Mrs. Stella-Maris",
    position: "Basic 3 Teacher",
    image: "https://i.ibb.co/Nd4gMyWY/photo-2025-04-19-20-05-19.jpg",
  },
  
]

export default function OurSchoolPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg"
          alt="Our School"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our School</h1>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            We believe that everyone's a student and everyone's a teacher.
          </h2>
          <p className="text-muted-foreground">
            Our Students and staff work together to foster a collaborative learning environment.
          </p>
        </div>
      </section>

      {/* Class Sections */}
      {classes.map((level) => (
        <section key={level.level} className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-primary">{level.level}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {level.sections.map((section) => (
                <div key={section.name} className="bg-card rounded-lg shadow-sm overflow-hidden border">
                  {/* Use custom images for Basic 8, Basic 7, and Pre-Nursery, default slider for others */}
                  <ClassImageSlider className={section.name} customImages={section.customImages} />
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg text-primary">{section.name}</h3>
                    <p className="text-muted-foreground">{level.level}</p>
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
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">Staff and the Board of Trustees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((staff, index) => (
              <div key={index} className="bg-card rounded-lg shadow-sm overflow-hidden border">
                <div className="relative aspect-video">
                  <Image src={staff.image || "/placeholder.svg"} alt={staff.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-primary">{staff.name}</h3>
                  <p className="text-muted-foreground">{staff.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
