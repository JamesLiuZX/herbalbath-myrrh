"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Image as ImageIcon, MessageCircle, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerCaptain, recordCaptainShare } from "@/app/actions/captains"
import {
  buildCaptainBroadcastText,
  buildCaptainShareLink,
  type Captain,
} from "@/app/lib/captains"
import { renderShareCard, shareOrDownloadCard } from "@/app/lib/share-card"
import { CONTACT, RETAIL, CAPTAIN } from "@/app/lib/growth-config"

// Everything on this page is sized for a 60+ user on a phone in bright light:
// 18px floor on body text, 56px+ tap targets, one action per screenful.

export function CaptainKitClient() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [captain, setCaptain] = useState<Captain | null>(null)
  const [persisted, setPersisted] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleRegister = async () => {
    setSubmitting(true)
    try {
      const result = await registerCaptain(name, phone)
      if (!result.ok || !result.captain) {
        toast({ title: "请检查资料", description: result.error, variant: "destructive" })
        return
      }
      setCaptain(result.captain)
      setPersisted(result.persisted)
      toast({
        title: result.existing ? "找回您的介绍码" : "介绍码已生成",
        description: `${result.captain.code} — 请记下来或截图保存`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleShareCard = async () => {
    if (!captain) return
    setGenerating(true)
    try {
      const blob = await renderShareCard({
        captainName: captain.name,
        captainCode: captain.code,
        whatsappDisplay: CONTACT.whatsappDisplay,
        site: "herbalbathsg.com",
        price: `${RETAIL.currency}${RETAIL.singlePrice}`,
        bundleLine: `买3送1 · 4瓶 ${RETAIL.currency}${RETAIL.bundlePrice}`,
        productImageSrc: "/images/product-hero.png",
        payNowQrSrc: "/images/paynow-qr.png",
      })
      if (!blob) {
        toast({ title: "生成失败", description: "请重试", variant: "destructive" })
        return
      }

      const broadcast = buildCaptainBroadcastText(
        CONTACT.whatsappNumber,
        captain.code,
        captain.name,
        "herbalbathsg.com",
      )
      const outcome = await shareOrDownloadCard(
        blob,
        `herbalbath-${captain.code}.png`,
        broadcast,
      )
      void recordCaptainShare(captain.code)

      toast({
        title: outcome === "shared" ? "已打开分享" : "图片已下载",
        description:
          outcome === "shared"
            ? "选择您的 WhatsApp 群组即可"
            : "图片已存到您的电脑，可以转发到 WhatsApp",
      })
    } catch (error) {
      console.error("[CaptainKit] Card generation failed:", error)
      toast({ title: "生成失败", description: "请重试", variant: "destructive" })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyText = async () => {
    if (!captain) return
    const text = buildCaptainBroadcastText(
      CONTACT.whatsappNumber,
      captain.code,
      captain.name,
      "herbalbathsg.com",
    )
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    toast({ title: "文字已复制", description: "可以贴到 WhatsApp 群组" })
  }

  if (!captain) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="captain-name" className="text-lg font-medium">
              您的姓名 Your name
            </Label>
            <Input
              id="captain-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：陈美玲"
              className="py-7 text-lg"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="captain-phone" className="text-lg font-medium">
              手机号码 Mobile number
            </Label>
            <Input
              id="captain-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="8123 4567"
              className="py-7 text-lg"
              inputMode="tel"
              autoComplete="tel"
            />
            <p className="text-base text-gray-500">用来发放您的佣金（PayNow）</p>
          </div>
          <Button
            onClick={handleRegister}
            disabled={submitting}
            className="w-full py-7 text-lg bg-red-700 hover:bg-red-800"
          >
            {submitting ? "处理中..." : "生成我的介绍码"}
          </Button>
          <p className="text-base text-gray-500 leading-relaxed">
            每成功推荐一单，您可获得 {CAPTAIN.commissionPct}% 佣金，每月{" "}
            {CAPTAIN.payoutDayOfMonth} 号以 PayNow 发放。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="p-6 sm:p-8 text-center space-y-2">
          <p className="text-lg text-amber-900">您的介绍码</p>
          <p className="text-6xl font-bold tracking-[0.2em] text-amber-900">{captain.code}</p>
          <p className="text-lg text-amber-800">{captain.name}</p>
          <p className="text-base text-amber-700 pt-2">
            请截图保存。朋友订购时讲这个号码，就算您的推荐。
          </p>
        </CardContent>
      </Card>

      {!persisted && (
        <p className="text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
          注意：目前尚未连接数据库，此介绍码未被保存。请先设置 Upstash Redis。
        </p>
      )}

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold">分享给朋友</h2>

          <Button
            onClick={handleShareCard}
            disabled={generating}
            className="w-full py-8 text-lg bg-green-600 hover:bg-green-700"
          >
            <ImageIcon className="mr-2 h-6 w-6 flex-shrink-0" />
            {generating ? "制作中..." : "① 制作图片并分享到群组"}
          </Button>
          <p className="text-base text-gray-500 -mt-1">
            会生成一张有您介绍码的图片，可直接转发到 WhatsApp 群。
          </p>

          <Button
            onClick={handleCopyText}
            variant="outline"
            className="w-full py-8 text-lg border-2"
          >
            {copied ? (
              <Check className="mr-2 h-6 w-6 flex-shrink-0" />
            ) : (
              <Copy className="mr-2 h-6 w-6 flex-shrink-0" />
            )}
            ② 复制推荐文字
          </Button>

          <Button
            onClick={() =>
              window.open(
                buildCaptainShareLink(CONTACT.whatsappNumber, captain.code, captain.name),
                "_blank",
              )
            }
            variant="outline"
            className="w-full py-8 text-lg border-2"
          >
            <MessageCircle className="mr-2 h-6 w-6 flex-shrink-0" />
            ③ 测试订购链接
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardContent className="p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold">怎么用？</h2>
          <ol className="space-y-2 text-lg text-gray-700 list-decimal list-inside leading-relaxed">
            <li>按上面「制作图片」，选择您的 WhatsApp 群组发出去。</li>
            <li>朋友看到图片，WhatsApp {CONTACT.whatsappDisplay} 订购。</li>
            <li>他们讲您的介绍码 {captain.code}，我们就知道是您推荐的。</li>
            <li>每月 {CAPTAIN.payoutDayOfMonth} 号，佣金 PayNow 给您。</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
