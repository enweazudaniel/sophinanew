export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">SCHOOL ADDRESS</h3>
            <p className="text-sm">
              Off Polytechnic Road
              <br />
              Ogwashi-Uku,Delta State, 320109
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">CONTACT US</h3>
            <p className="text-sm">
              Phone: 07038046878,08027446756
              <br />
              Email: sophina4christ@gmail.com
            </p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Sophina Nursery and Primary School
        </div>
      </div>
    </footer>
  )
}
