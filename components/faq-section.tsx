"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  questionEn: string
  answer: string
  answerEn: string
}

const faqItems: FAQItem[] = [
  {
    question: "HerbalBath没药喷雾是什么？",
    questionEn: "What is HerbalBath Myrrh Spray?",
    answer: "HerbalBath没药喷雾是一种100%天然的疼痛缓解喷雾，采用古老的没药和乳香配方。这些成分自圣经时代起就被用于治疗疼痛和炎症。我们的喷雾能在10秒内见效，深层渗透到关节和肌肉组织，提供持久的疼痛缓解。",
    answerEn: "HerbalBath Myrrh Spray is a 100% natural pain relief spray using ancient myrrh and frankincense formula. These ingredients have been used for pain and inflammation treatment since biblical times. Our spray works in 10 seconds, penetrating deep into joints and muscles for long-lasting pain relief.",
  },
  {
    question: "没药喷雾对乐龄人士安全吗？",
    questionEn: "Is Myrrh Spray safe for seniors?",
    answer: "是的，HerbalBath没药喷雾专为55岁以上的乐龄人士设计，采用100%天然成分，无化学添加剂，无副作用。我们已经服务超过15,000位新加坡用户超过8年，是新加坡乐龄人士信赖的选择。如果您有特殊健康状况，建议先咨询医生。",
    answerEn: "Yes, HerbalBath Myrrh Spray is specially designed for seniors 55+, using 100% natural ingredients with no chemical additives and no side effects. We have served over 15,000 Singapore users for 8 years. If you have special health conditions, please consult your doctor first.",
  },
  {
    question: "没药喷雾能缓解什么疼痛？",
    questionEn: "What types of pain can Myrrh Spray relieve?",
    answer: "HerbalBath没药喷雾能有效缓解多种疼痛，包括：膝盖疼痛、腰酸背痛、风湿关节炎、肩颈僵硬、手脚麻痹、天气变化引起的关节痛等。无论是慢性疼痛还是运动后的肌肉酸痛，都能得到有效缓解。",
    answerEn: "HerbalBath Myrrh Spray effectively relieves various types of pain including: knee pain, lower back pain, rheumatism and arthritis, neck and shoulder stiffness, numbness in hands and feet, and weather-related joint pain. It works for both chronic pain and post-exercise muscle soreness.",
  },
  {
    question: "多久能看到效果？",
    questionEn: "How quickly does it work?",
    answer: "HerbalBath没药喷雾能在10秒内见效！喷上后您会立即感受到温热感渗透到疼痛部位。为了获得最佳效果，建议每天使用2次，持续3-4个月。一瓶可以使用3-4个月。",
    answerEn: "HerbalBath Myrrh Spray works in just 10 seconds! You'll immediately feel warmth penetrating the painful area after spraying. For best results, use twice daily for 3-4 months. One bottle lasts 3-4 months.",
  },
  {
    question: "如何购买HerbalBath没药喷雾？",
    questionEn: "How can I purchase HerbalBath Myrrh Spray?",
    answer: "您可以通过多种方式购买：1) WhatsApp联系我们的客服 2) 拨打电话订购 3) 在Shopee、Carousell、TikTok Shop等平台购买。新加坡全岛免费送货，支持货到付款。现在购买还有买3送1的优惠！",
    answerEn: "You can purchase through: 1) WhatsApp our customer service 2) Call to order 3) Buy on Shopee, Carousell, TikTok Shop. Free delivery island-wide in Singapore, cash on delivery available. Buy 3 get 1 free promotion now!",
  },
  {
    question: "HerbalBath有退款保证吗？",
    questionEn: "Does HerbalBath offer a refund guarantee?",
    answer: "是的！我们提供30天不满意全额退款保证。如果您对产品效果不满意，可以在30天内联系我们申请退款。我们对产品质量充满信心，这就是为什么我们敢于提供这样的保证。",
    answerEn: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the results, contact us within 30 days for a full refund. We're confident in our product quality, which is why we offer this guarantee.",
  },
]

// Generate FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: `${item.question} / ${item.questionEn}`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${item.answer} ${item.answerEn}`,
    },
  })),
}

interface FAQSectionProps {
  language?: "zh" | "en"
}

function FAQItemComponent({ 
  item, 
  language, 
  isOpen, 
  onToggle 
}: { 
  item: FAQItem
  language: "zh" | "en"
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-stone-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-lg font-semibold text-emerald-800 block">
            {language === "zh" ? item.question : item.questionEn}
          </span>
          <span className="text-base text-stone-500 block mt-1">
            {language === "zh" ? item.questionEn : item.question}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-emerald-600 flex-shrink-0 mt-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5">
          <p className="text-stone-700 text-lg leading-relaxed mb-3">
            {language === "zh" ? item.answer : item.answerEn}
          </p>
          <p className="text-stone-500 text-base leading-relaxed">
            {language === "zh" ? item.answerEn : item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection({ language = "zh" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-12 md:py-16 bg-stone-50" id="faq">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-900 mb-3 font-serif">
              {language === "zh" ? "常见问题" : "Frequently Asked Questions"}
            </h2>
            <p className="text-lg text-stone-600">
              {language === "zh" 
                ? "关于HerbalBath没药喷雾的常见问题解答"
                : "Common questions about HerbalBath Myrrh Spray"}
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItemComponent
                key={index}
                item={item}
                language={language}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>

          {/* Additional SEO Keywords (visually hidden) */}
          <div className="sr-only">
            <p>
              herbalbath, herbal bath singapore, herbalbath sg, herbal bath sg,
              myrrh spray singapore, natural pain relief, 没药喷雾新加坡,
              天然止痛喷雾, knee pain relief singapore, back pain elderly,
              joint pain natural remedy
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
