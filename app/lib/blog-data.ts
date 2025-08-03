import type React from "react"
export interface Post {
  slug: string
  title: string
  description: string
  image: string
  author: string
  date: string
  content: React.ReactNode
}

export const posts: Post[] = [
  {
    slug: "top-10-pain-relief-methods-for-seniors-sg",
    title: "新加坡关节疼痛怎么办？阿姨们亲测有效的10个方法",
    description:
      "还在为关节疼痛、肌肉酸痛烦恼吗？我们为您整理了10种经过验证的缓解方法，从传统草药到现代科技，总有一种适合您。",
    image: "/images/blog-1.jpg",
    author: "HerbalBath 健康小编",
    date: "2024-07-15",
    content: (
      <>
        <p>
          在新加坡，潮湿炎热的天气常常让关节疼痛问题雪上加霜。许多叔叔阿姨们常年忍受着膝盖、腰部、肩膀的酸痛。除了看医生，还有什么方法可以帮助我们缓解这些恼人的疼痛呢？今天，我们就来盘点一下在新加坡特别受欢迎且有效的10种方法。
        </p>
        <h3 className="font-bold mt-4">1. 没药与乳香喷雾 (Myrrh & Frankincense Spray)</h3>
        <p>
          这是一种结合了古老智慧和现代科技的产品。没药和乳香在几千年前就被用于止痛和消炎。现代研究发现，它们能有效抑制炎症，促进血液循环。高品质的喷雾能快速渗透皮肤，直达疼痛根源，是目前最受欢迎的天然疗法之一。
        </p>
        <h3 className="font-bold mt-4">2. 中医推拿与针灸 (TCM Tuina & Acupuncture)</h3>
        <p>中医是新加坡非常普及的疗法。通过推拿和针灸，可以疏通经络，调和气血，对于慢性劳损和关节炎有很好的效果。</p>
        {/* ... Add more methods here ... */}
        <h3 className="font-bold mt-4">10. 保持积极心态 (Stay Positive)</h3>
        <p>研究表明，情绪对疼痛感知有很大影响。保持乐观，多与朋友家人交流，参加社区活动，有助于减轻疼痛感。</p>
        <p className="mt-6 font-semibold">
          结论：缓解疼痛的方法有很多，关键是找到最适合自己的。如果您正在寻找一种快速、安全且能从根本上解决问题的天然方法，HerbalBath的没药喷雾绝对值得一试。
        </p>
      </>
    ),
  },
  {
    slug: "myrrh-frankincense-miracle-herbs",
    title: "没药和乳香：被遗忘的天然止痛神药",
    description:
      "您知道吗？在圣经时代，没药和乳香比黄金还要珍贵。探索这两种神奇草药的历史、科学原理，以及它们如何成为现代疼痛管理的革命性方案。",
    image: "/images/blog-2.jpg",
    author: "HerbalBath 历史研究员",
    date: "2024-07-10",
    content: (
      <>
        <p>
          当东方三博士拜访新生的耶稣时，他们带来了三样礼物：黄金、乳香和没药。为什么这两种树脂会与黄金相提并论？因为在古代世界，它们是公认的具有神奇疗效的“液体黄金”。
        </p>
        <h3 className="font-bold mt-4">没药 (Myrrh): 天然的镇痛剂</h3>
        <p>
          古埃及人用它来防腐和治疗伤口。古希腊医生则用它来处理战场创伤。现代科学发现，没药中含有的化合物可以直接作用于大脑的阿片受体，从而产生强大的镇痛效果，但又没有成瘾性。
        </p>
        <h3 className="font-bold mt-4">乳香 (Frankincense): 强大的抗炎剂</h3>
        <p>
          乳香以其强大的抗炎特性而闻名。它含有的乳香酸可以有效抑制导致炎症的关键酶，从而减轻关节炎等炎症性疾病引起的肿胀和疼痛。
        </p>
        <h3 className="font-bold mt-4">古老智慧与现代科技的结合</h3>
        <p>
          HerbalBath通过先进的提取技术，将这两种神奇草药的活性成分最大化，并制成易于吸收的喷雾。当您使用它时，您不仅是在使用一种产品，更是在体验传承千年的自然治愈力量。
        </p>
      </>
    ),
  },
]
