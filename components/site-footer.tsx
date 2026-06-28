import { Youtube, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-3">
            <h3 className="font-bold text-lg tracking-wide">SCHOOL ADDRESS</h3>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              Off Polytechnic Road
              <br />
              Ogwashi-Uku, Delta State, 320109
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-lg tracking-wide">CONTACT US</h3>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              Phone: 07038046878, 08027446756
              <br />
              Email: sophina4christ@gmail.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://youtube.com/@sophinaschool?si=mzLE2jOaDnTWtgKJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 hover:bg-red-500 text-primary-foreground transition-all duration-300 hover:scale-110"
              aria-label="Visit our YouTube channel"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/sophinaschool?igsh=OGJ1cGdvYThhdXZi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 hover:bg-pink-500 text-primary-foreground transition-all duration-300 hover:scale-110"
              aria-label="Visit our Instagram page"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <p className="text-center text-primary-foreground/70 text-sm">© {new Date().getFullYear()} Sophina School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
