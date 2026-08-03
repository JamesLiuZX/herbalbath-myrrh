"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitTradeLead, type TradeOutletType } from "@/app/actions/tradeLeads"
import { CONTACT, RETAIL, WHOLESALE_TIERS, UNITS_PER_CARTON } from "@/app/lib/growth-config"

const OUTLET_TYPES: { id: TradeOutletType; labelZh: string; labelEn: string }[] = [
  { id: "tcm-clinic", labelZh: "中医诊所", labelEn: "TCM clinic" },
  { id: "medical-hall", labelZh: "中药店", labelEn: "Medical hall" },
  { id: "tuina-reflexology", labelZh: "推拿 / 足底反射", labelEn: "Tuina / reflexology" },
  { id: "physio-chiro", labelZh: "物理治疗 / 脊椎", labelEn: "Physio / chiro" },
  { id: "eldercare", labelZh: "乐龄中心 / 疗养院", labelEn: "Eldercare / nursing home" },
  { id: "other", labelZh: "其他", labelEn: "Other" },
]

export function TradePageClient() {
  const [businessName, setBusinessName] = useState("")
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [outletType, setOutletType] = useState<TradeOutletType>("tcm-clinic")
  const [outletCount, setOutletCount] = useState("1")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const result = await submitTradeLead({
        businessName,
        contactName,
        phone,
        outletType,
        outletCount,
        notes,
      })
      if (!result.ok) {
        toast({ title: "请检查资料", description: result.error, variant: "destructive" })
        return
      }
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  const tradeWhatsApp = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    "您好，我想了解批发价格和试用装。（同业查询）",
  )}`

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">批发价格 Trade pricing</h2>
        <p className="text-gray-600 mb-6">
          建议零售价 {RETAIL.currency}
          {RETAIL.singlePrice} / 支。一箱 = {UNITS_PER_CARTON} 支。买断制，非寄卖。
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {WHOLESALE_TIERS.map((t) => (
            <Card key={t.id} className="border-2">
              <CardContent className="p-6">
                <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                  {t.nameEn}
                </p>
                <h3 className="text-xl font-bold mt-1">{t.nameZh}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-4">
                  {RETAIL.currency}
                  {t.unitPrice.toFixed(2)}
                  <span className="text-base font-normal text-gray-500"> / 支</span>
                </p>
                <p className="text-sm text-green-700 font-medium mt-1">
                  比零售价低 {t.discountPct}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  最低订量 {t.minUnits} 支（{t.minUnits / UNITS_PER_CARTON} 箱）
                </p>
                <ul className="mt-4 space-y-2">
                  {t.perksZh.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 md:p-10 border">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          为什么值得上架 Why stock it
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-2">客人当场就有感觉</h3>
            <p className="leading-relaxed">
              喷上去几秒内就有明显热感。推拿或针灸后当场试用，客人自己感受得到，不需要您多解释。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">回购周期稳定</h3>
            <p className="leading-relaxed">
              一支约用 3–4 个月。客人用完自然回来，是可预期的重复生意，不是一次性买卖。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">买断，不占您的现金太久</h3>
            <p className="leading-relaxed">
              起订仅 {WHOLESALE_TIERS[0].minUnits} 支，附免费试用装和柜台展示架。卖得动再补货。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">中文包装说明</h3>
            <p className="leading-relaxed">
              产品说明卡为中文，适合乐龄客群，店员不必额外翻译或解释成分。
            </p>
          </div>
        </div>
      </section>

      <section id="enquiry">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            {done ? (
              <div className="text-center py-8 space-y-4">
                <Check className="h-14 w-14 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold">已收到您的查询</h2>
                <p className="text-gray-600">
                  我们会尽快联系您，并提供完整产品资料（成分、HSA 分类、保质期、条码）。
                </p>
                <Button
                  onClick={() => window.open(tradeWhatsApp, "_blank")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> 直接 WhatsApp 我们
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">索取批发资料 Trade enquiry</h2>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="biz" className="text-base">
                      店名 / 诊所名称
                    </Label>
                    <Input
                      id="biz"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="py-6 text-base"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-base">
                        联络人
                      </Label>
                      <Input
                        id="contact"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="py-6 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tel" className="text-base">
                        联络电话
                      </Label>
                      <Input
                        id="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        className="py-6 text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">店铺类型</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {OUTLET_TYPES.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setOutletType(o.id)}
                          className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                            outletType === o.id
                              ? "border-red-600 bg-red-50 text-red-800"
                              : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                          }`}
                        >
                          {o.labelZh}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outlets" className="text-base">
                      门店数量
                    </Label>
                    <Input
                      id="outlets"
                      value={outletCount}
                      onChange={(e) => setOutletCount(e.target.value)}
                      inputMode="numeric"
                      className="py-6 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base">
                      备注（选填）
                    </Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="py-6 text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-6 text-lg bg-red-700 hover:bg-red-800"
                  >
                    {submitting ? "提交中..." : "索取批发资料"}
                  </Button>
                  <Button
                    onClick={() => window.open(tradeWhatsApp, "_blank")}
                    variant="outline"
                    className="w-full py-6 text-lg border-2"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" /> 或直接 WhatsApp{" "}
                    {CONTACT.whatsappDisplay}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
