"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Star, CheckCircle, Clock, Users } from "lucide-react"
import { useReferral } from "@/app/hooks/useReferral"

export default function TikTokLandingContent() {
  const whatsappNumber = "+6584261225"
  const baseWhatsappMessage = "Hi! I saw your TikTok video about the Myrrh Spray. I want to order!"
  const { getWhatsAppLink } = useReferral(baseWhatsappMessage)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - TikTok Style */}
      <section className="py-8 bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge className="bg-pink-100 text-pink-800 px-4 py-2 text-lg font-medium animate-pulse">
              🔥 TikTok 爆款产品
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              10秒神奇效果
              <br />
              <span className="text-red-600">没药古老秘方</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600">TikTok 爆款 • 圣经时代的神奇草药 • 深层治愈不只缓解</p>

            {/* Video Placeholder */}
            <div className="max-w-md mx-auto">
              <div className="aspect-[9/16] bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                  <p className="text-gray-600">TikTok 真实使用视频</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-xl px-8 py-8"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                立即 WhatsApp 订购
              </Button>
              <p className="text-sm text-gray-500">💰 特价 S$39 | 🚚 当日送达</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold">5分钟</div>
              <div className="text-sm text-gray-600">快速见效</div>
            </div>
            <div className="text-center p-4">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold">10,000+</div>
              <div className="text-sm text-gray-600">用户推荐</div>
            </div>
            <div className="text-center p-4">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold">4.9/5</div>
              <div className="text-sm text-gray-600">好评率</div>
            </div>
            <div className="text-center p-4">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold">100%</div>
              <div className="text-sm text-gray-600">天然成分</div>
            </div>
            {/* New Benefits Section */}
            <div className="text-center p-4">
              <div className="w-12 h-12 text-green-600 mx-auto mb-2">⚡</div>
              <div className="text-lg font-bold">10秒内感受热浪涌入</div>
              <div className="text-sm text-gray-600">快速见效</div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 text-blue-600 mx-auto mb-2">🎯</div>
              <div className="text-lg font-bold">深层渗透直达疼痛根源</div>
              <div className="text-sm text-gray-600">用户推荐</div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 text-yellow-500 mx-auto mb-2">✨</div>
              <div className="text-lg font-bold">治愈根本而非暂时麻痹</div>
              <div className="text-sm text-gray-600">好评率</div>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 text-purple-600 mx-auto mb-2">🌿</div>
              <div className="text-lg font-bold">圣经时代珍贵草药配方</div>
              <div className="text-sm text-gray-600">天然成分</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">为什么选择没药喷雾？</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">快速缓解疼痛</h3>
                  <p className="text-gray-600">5分钟内感受到明显的疼痛缓解</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">天然安全</h3>
                  <p className="text-gray-600">100% 天然没药提取，无副作用</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">便携使用</h3>
                  <p className="text-gray-600">小巧设计，随时随地使用</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-red-100 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-800 mb-2">体验几千年来最神奇的治愈力量</p>
              <p className="text-red-700">TikTok 特价：S$39 (原价 S$49)</p>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-xl px-12 py-8 w-full"
                onClick={() => window.open(getWhatsAppLink(whatsappNumber), "_blank")}
              >
                <MessageCircle className="w-6 h-6 mr-2" />
                立即订购 - WhatsApp
              </Button>
              <p className="text-sm text-gray-500 mt-4">🚚 全岛免费送货 | 💰 货到付款 | 📞 24小时客服</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
