import { MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

const whatsappNumber = "6584261225"
const whatsappMessage = encodeURIComponent("Hi HerbalBath SG! I'm interested in the Myrrh Spray and would like to place an order.")

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-serif font-semibold">
            HerbalBath SG
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-background rounded-2xl shadow-lg p-10 w-full max-w-sm text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Get in Touch</h1>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Chat with us on WhatsApp to order or ask any questions.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Buy via WhatsApp
          </a>

          <a
            href="tel:+6584261225"
            className="flex items-center justify-center gap-2 w-full border border-border rounded-xl py-3 text-sm font-medium hover:bg-secondary transition-colors text-foreground"
          >
            <Phone className="h-4 w-4" />
            Call +65 8426 1225
          </a>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © 2025 HerbalBath SG · Natural Pain Relief Singapore
      </footer>
    </div>
  )
}
