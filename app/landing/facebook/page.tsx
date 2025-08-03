"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Star, Users, Shield, Truck, Award, Zap, Heart } from "lucide-react"
import { useReferral } from "@/app/hooks/useReferral"

export default function FacebookLanding() {
  const whatsappNumber = "+6594606058"
  const baseWhatsappMessage = "Hi! I saw your Facebook ad about the Myrrh Spray. I'm interested!"
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Facebook Style */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-lg font-medium">📘 Facebook 独家优惠</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  体验圣经时代的
                  <br />
                  <span className="text-red-600">神奇治愈力量</span>
                </h1>

                <p className="text-xl text-gray-600">没药 - 比黄金更珍贵的液体黄金，15,000+ 新加坡人见证奇迹</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">15,000+</div>
                    <div className="text-sm text-gray-600">见证奇迹</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">4.9/5</div>
                    <div className="text-sm text-gray-600">客户评分</div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-xl px-8 py-6 w-full"
                  onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  WhatsApp 立即订购
                </Button>
              </div>

              <div className="relative">
                <img
                  src="/images/product-hero.png"
                  alt="Myrrh Soreness Relief Spray"
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
                <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full px-4 py-2 font-bold shadow-lg">
                  限时优惠
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">为什么选择我们？</h2>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto" />
                  <h3 className="text-lg font-semibold">新加坡第一</h3>
                  <p className="text-gray-600">销量领先品牌</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Shield className="w-12 h-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-semibold">安全认证</h3>
                  <p className="text-gray-600">100% 天然成分</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Truck className="w-12 h-12 text-blue-500 mx-auto" />
                  <h3 className="text-lg font-semibold">快速配送</h3>
                  <p className="text-gray-600">当日下单次日送达</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Users className="w-12 h-12 text-purple-500 mx-auto" />
                  <h3 className="text-lg font-semibold">客户信赖</h3>
                  <p className="text-gray-600">98% 复购率</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Zap className="w-12 h-12 text-orange-500 mx-auto" />
                  <h3 className="text-lg font-semibold">10秒深层渗透</h3>
                  <p className="text-gray-600">快速吸收，效果显著</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Heart className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-lg font-semibold">圣经时代神奇草药</h3>
                  <p className="text-gray-600">传承千年，天然有效</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="space-y-4">
                  <Award className="w-12 h-12 text-yellow-500 mx-auto" />
                  <h3 className="text-lg font-semibold">治愈根本原因</h3>
                  <p className="text-gray-600">深层治疗，持久效果</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">真实客户反馈</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img src="/images/testimonial-1.png" alt="Customer testimonial" className="w-full h-auto" />
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img src="/images/testimonial-2.png" alt="Customer payment confirmation" className="w-full h-auto" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Facebook 独家体验价</h2>
            <p className="text-xl mb-6">体验几千年来最神奇的治愈力量！</p>
            <p className="text-lg mb-8">原价 S$35.90，现在只需 S$28.90</p>
            <p className="text-lg mb-8">限时优惠，数量有限，先到先得！</p>

            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-xl px-12 py-8"
              onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              立即抢购 - WhatsApp
            </Button>

            <p className="text-sm mt-6 opacity-90">🚚 全岛免费送货 | 💰 货到付款 | 📞 24小时客服支持</p>
          </div>
        </div>
      </section>
    </div>
  )
}
