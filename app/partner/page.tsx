"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, MessageCircle, Share2, Award, DollarSign, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PartnerPage() {
  const [partnerId, setPartnerId] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const { toast } = useToast()
  const whatsappNumber = "+6584261225"
  const partnerInquiryMessage = encodeURIComponent("Hi! I'm interested in becoming a partner for HerbalBath SG.")

  const handleGenerateLink = () => {
    if (!partnerId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a unique name or ID.",
        variant: "destructive",
      })
      return
    }
    const link = `${window.location.origin}/?ref=${encodeURIComponent(partnerId.trim())}`
    setGeneratedLink(link)
  }

  const handleCopyLink = () => {
    if (!generatedLink) return
    navigator.clipboard.writeText(generatedLink)
    toast({
      title: "Copied!",
      description: "Your referral link has been copied to the clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-red-700">
            草药浴 HerbalBath
          </a>
          <Button onClick={() => (window.location.href = "/")}>Back to Main Page</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-medium mb-4">Partner Program</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Share the Healing, Share the Rewards</h1>
          <p className="text-xl md:text-2xl text-gray-600 mt-4">
            Join our mission to bring natural pain relief to everyone in Singapore.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-12 md:my-16 text-center">
          <div className="p-6">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Generous Commissions</h3>
            <p className="text-gray-600 mt-2">
              Earn for every successful referral you bring. The more you share, the more you earn.
            </p>
          </div>
          <div className="p-6">
            <Share2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Easy to Share</h3>
            <p className="text-gray-600 mt-2">
              Get your unique tracking link instantly. Share it on WhatsApp, Facebook, or anywhere else.
            </p>
          </div>
          <div className="p-6">
            <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Make a Difference</h3>
            <p className="text-gray-600 mt-2">
              Help friends and family find a real solution to their chronic pain and improve their lives.
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">Get Your Unique Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="partnerId" className="text-lg">
                Enter Your Name or a Unique ID
              </Label>
              <Input
                id="partnerId"
                placeholder="e.g., AuntieMary, JohnT"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="py-6 text-lg"
              />
            </div>
            <Button onClick={handleGenerateLink} className="w-full py-6 text-lg">
              <Award className="mr-2 h-5 w-5" /> Generate My Link
            </Button>
            {generatedLink && (
              <div className="p-4 bg-gray-100 rounded-lg space-y-4">
                <p className="text-sm text-gray-600">
                  Your unique link is ready! Share it with your friends and family.
                </p>
                <div className="flex items-center space-x-2">
                  <Input value={generatedLink} readOnly className="py-6 text-base bg-white" />
                  <Button size="icon" onClick={handleCopyLink}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold">Have Questions?</h3>
          <p className="text-gray-600 mt-2 mb-6">
            Contact our partner manager to learn more about distributorship and bulk pricing.
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-lg"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${partnerInquiryMessage}`, "_blank")}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
          </Button>
        </div>
      </main>
    </div>
  )
}
