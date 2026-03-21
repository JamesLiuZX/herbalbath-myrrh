import Link from "next/link"
import { CheckCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thank You - Contact Received | HerbalBath SG",
  description: "Thank you for contacting HerbalBath SG. We'll get back to you shortly via WhatsApp.",
}

export default function ThankYouPage() {
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
        <div className="w-full max-w-md text-center bg-background rounded-2xl shadow-lg p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-serif mb-3">
            Contact Received!
          </h1>
          <p className="text-muted-foreground mb-2">谢谢您的留言！</p>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Our team will reach out to you on WhatsApp shortly.
            <br />
            我们的客服将通过WhatsApp与您联系。
          </p>

          <div className="space-y-3">
            <a
              href="https://wa.me/6584261225"
              className="flex items-center justify-center gap-2 w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp Now
            </a>
            <Button asChild variant="outline" className="w-full h-12">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © 2025 HerbalBath SG · Natural Pain Relief Singapore
      </footer>
    </div>
  )
}
