"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, Phone, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const whatsappNumber = "+6584261225"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const whatsappMessage = encodeURIComponent(
      `Hi HerbalBath SG! My name is ${name}${phone ? `, my number is ${phone}` : ""}. ${message || "I'm interested in the Myrrh Spray and would like to know more."}`,
    )

    setSubmitted(true)

    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank")
      router.push("/herbalbathsg/contact/thank-you")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-serif font-semibold">
            HerbalBath SG
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!submitted ? (
            <div className="bg-background rounded-2xl shadow-lg p-8">
              {/* Icon + Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground font-serif">Contact Us</h1>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Fill in your details and we'll connect you instantly via WhatsApp.
                  <br />
                  <span className="text-xs text-muted-foreground/70">
                    填写您的联系方式，我们将通过WhatsApp立即与您联系。
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name / 姓名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone / 电话 <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message / 留言 <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="message"
                    type="text"
                    placeholder="e.g. I'd like to order / 我想订购"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Send via WhatsApp
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or call us directly</span>
                </div>
              </div>

              <a
                href="tel:+6584261225"
                className="flex items-center justify-center gap-2 w-full h-11 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +65 8426 1225
              </a>

              <p className="text-center text-xs text-muted-foreground mt-6">
                🚚 Free island-wide delivery &nbsp;|&nbsp; 💰 Cash on delivery available
              </p>
            </div>
          ) : (
            <div className="bg-background rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Opening WhatsApp...</h2>
              <p className="text-muted-foreground text-sm">
                Connecting you to our team now. 正在连接客服...
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        © 2025 HerbalBath SG · Natural Pain Relief Singapore
      </footer>
    </div>
  )
}
