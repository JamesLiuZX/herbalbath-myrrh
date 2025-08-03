import type React from "react"

export interface BlogPost {
  slug: string
  title: string
  description: string
  image?: string
  author: string
  date: string
  content: React.ReactNode
}

export const posts: BlogPost[] = [
  {
    slug: "knee-pain-relief-singapore",
    title: "新加坡膝盖疼痛缓解：10个实用建议",
    description: "在新加坡的炎热气候下，学习如何有效管理和缓解膝盖疼痛的专业建议。",
    image: "/placeholder.svg?height=400&width=600&text=膝盖疼痛缓解",
    author: "HerbalBath 健康专家",
    date: "2024-07-20",
    content: (
      <>
        <p className="lead">
          在新加坡，潮湿炎热的气候和我们日常的习惯，如上下楼梯，都可能加重膝盖的负担。当膝盖开始抗议时，我们的生活品质也随之下降。但这并不意味着我们只能默默忍受。这里有10个经过验证的建议，可以帮助您有效管理和缓解膝盖疼痛。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">1. 保持健康的体重</h3>
        <p>
          每增加一公斤体重，膝盖就要承受额外的4公斤压力。在新加坡丰富的美食文化中，保持健康体重确实是个挑战，但这是保护膝盖最重要的步骤之一。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">2. 选择合适的运动</h3>
        <p>游泳是膝盖友好的运动选择，新加坡有许多公共游泳池。水的浮力可以减轻膝盖压力，同时提供良好的心血管锻炼。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">3. 使用草药浴缓解疼痛</h3>
        <p>
          传统中医草药浴可以有效缓解膝盖疼痛和炎症。温热的草药水可以促进血液循环，减轻肌肉紧张，为疼痛的关节提供天然的舒缓效果。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">4. 正确的坐姿和站姿</h3>
        <p>长时间保持同一姿势会加重膝盖负担。每30分钟起身活动一下，避免长时间跷二郎腿或蹲坐。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">5. 选择合适的鞋子</h3>
        <p>穿着支撑性好的鞋子，避免高跟鞋或完全平底的鞋子。良好的足部支撑可以减轻膝盖的压力。</p>
      </>
    ),
  },
  {
    slug: "herbal-bath-benefits",
    title: "草药浴的神奇功效：传统智慧与现代科学",
    description: "探索草药浴如何结合传统中医智慧和现代科学，为您的健康带来全面的益处。",
    image: "/placeholder.svg?height=400&width=600&text=草药浴功效",
    author: "中医养生专家",
    date: "2024-07-15",
    content: (
      <>
        <p className="lead">
          草药浴作为传统中医的重要组成部分，已有数千年的历史。现代科学研究证实了许多传统草药的疗效，让这一古老的养生方法重新焕发生机。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">草药浴的科学原理</h3>
        <p>
          通过皮肤吸收，草药的有效成分可以直接进入血液循环，避免了口服药物可能对消化系统造成的负担。温热的水温还能促进血管扩张，增强药物吸收效果。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">主要功效</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>缓解肌肉和关节疼痛</li>
          <li>改善血液循环</li>
          <li>减轻压力和焦虑</li>
          <li>促进新陈代谢</li>
          <li>改善睡眠质量</li>
        </ul>
        <h3 className="font-bold mt-6 mb-2 text-xl">适合新加坡气候的草药配方</h3>
        <p>在新加坡的热带气候下，我们特别推荐具有清热解毒、祛湿消肿功效的草药配方，如薄荷、艾叶、当归等。</p>
      </>
    ),
  },
  {
    slug: "back-pain-solutions",
    title: "告别背痛：办公族的救星指南",
    description: "针对长期坐办公室导致的背痛问题，提供实用的预防和缓解方案。",
    image: "/placeholder.svg?height=400&width=600&text=背痛解决方案",
    author: "物理治疗师",
    date: "2024-07-10",
    content: (
      <>
        <p className="lead">
          在新加坡快节奏的工作环境中，许多办公族都面临着背痛的困扰。长时间的久坐、不良的坐姿习惯，都是导致背痛的主要原因。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">背痛的常见原因</h3>
        <p>
          长时间保持同一姿势会导致肌肉僵硬，脊椎压力增加。加上现代人普遍缺乏运动，背部肌肉力量不足，更容易出现疼痛问题。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">预防措施</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>每小时起身活动5-10分钟</li>
          <li>调整办公桌椅高度，保持正确坐姿</li>
          <li>使用腰部支撑垫</li>
          <li>定期进行背部伸展运动</li>
        </ul>
        <h3 className="font-bold mt-6 mb-2 text-xl">草药浴缓解背痛</h3>
        <p>使用含有川芎、红花、当归等活血化瘀草药的药浴，可以有效缓解背部肌肉紧张，促进血液循环，减轻疼痛感。</p>
      </>
    ),
  },
  {
    slug: "stress-relief-natural",
    title: "天然减压法：在繁忙生活中找到内心平静",
    description: "学习如何使用天然方法缓解压力，在新加坡快节奏的生活中保持身心健康。",
    image: "/placeholder.svg?height=400&width=600&text=天然减压",
    author: "心理健康顾问",
    date: "2024-07-05",
    content: (
      <>
        <p className="lead">
          现代生活的压力无处不在，特别是在新加坡这样的国际都市。学会使用天然的方法来缓解压力，对维护身心健康至关重要。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">压力对身体的影响</h3>
        <p>
          长期压力会导致肌肉紧张、睡眠质量下降、免疫力降低等问题。及时缓解压力不仅能改善心理状态，也能预防各种身体疾病。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">天然减压方法</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>深呼吸和冥想练习</li>
          <li>规律的运动习惯</li>
          <li>充足的睡眠</li>
          <li>草药浴放松疗法</li>
          <li>与大自然接触</li>
        </ul>
        <h3 className="font-bold mt-6 mb-2 text-xl">放松草药浴配方</h3>
        <p>
          薰衣草、洋甘菊、柠檬香茅等草药具有天然的镇静效果。在温热的草药浴中浸泡20-30分钟，可以有效缓解一天的疲劳和压力。
        </p>
      </>
    ),
  },
  {
    slug: "joint-health-aging",
    title: "关节健康与年龄：如何优雅地老去",
    description: "随着年龄增长，了解如何保护关节健康，维持活跃的生活方式。",
    image: "/placeholder.svg?height=400&width=600&text=关节健康",
    author: "老年医学专家",
    date: "2024-06-30",
    content: (
      <>
        <p className="lead">
          年龄的增长不应该成为活跃生活的障碍。通过正确的关节保养方法，我们可以在任何年龄都保持健康的活动能力。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">年龄对关节的影响</h3>
        <p>
          随着年龄增长，关节软骨逐渐磨损，关节液减少，这些都是自然的老化过程。但通过适当的保养，我们可以大大延缓这一过程。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">关节保养要点</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>保持适度的运动量</li>
          <li>维持健康的体重</li>
          <li>补充必要的营养素</li>
          <li>定期进行关节保养</li>
          <li>避免过度使用关节</li>
        </ul>
        <h3 className="font-bold mt-6 mb-2 text-xl">草药浴的关节保养作用</h3>
        <p>含有杜仲、牛膝、独活等补肾强骨草药的药浴，可以帮助改善关节周围的血液循环，减轻关节僵硬，延缓关节老化。</p>
      </>
    ),
  },
  {
    slug: "sleep-quality-improvement",
    title: "改善睡眠质量：夜晚的自然疗愈",
    description: "探索如何通过天然方法改善睡眠质量，让每一夜都成为身体的修复时光。",
    image: "/placeholder.svg?height=400&width=600&text=改善睡眠",
    author: "睡眠专家",
    date: "2024-06-25",
    content: (
      <>
        <p className="lead">
          良好的睡眠是健康的基石。在新加坡的都市生活中，许多人都面临着睡眠质量不佳的问题。让我们探索一些天然的改善方法。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">睡眠的重要性</h3>
        <p>睡眠期间，我们的身体进行修复和再生。充足的睡眠不仅能恢复体力，还能增强免疫力，改善记忆力和情绪状态。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">影响睡眠的因素</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>压力和焦虑</li>
          <li>不规律的作息时间</li>
          <li>环境因素（光线、噪音、温度）</li>
          <li>饮食习惯</li>
          <li>缺乏运动</li>
        </ul>
        <h3 className="font-bold mt-6 mb-2 text-xl">睡前草药浴的益处</h3>
        <p>
          睡前1-2小时进行温热的草药浴，可以帮助身体放松，降低核心体温，促进自然的睡眠周期。推荐使用具有镇静效果的草药如酸枣仁、合欢皮等。
        </p>
      </>
    ),
  },
]
