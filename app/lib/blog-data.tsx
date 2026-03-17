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
    slug: "knee-pain-relief-singapore",
    title: "新加坡膝盖痛怎么办？给乐龄人士的10个终极建议",
    description:
      "膝盖疼痛是许多新加坡乐龄人士的困扰。本文深入探讨了从日常习惯到天然疗法的10种有效缓解膝盖疼痛的方法，帮助您重获行动自由。",
    image: "/senior-knee-pain-relief.png",
    author: "HerbalBath 健康专家",
    date: "2024-07-20",
    content: (
      <>
        <p className="lead">
          在新加坡，潮湿炎热的气候和我们日常的习惯，如上下楼梯，都可能加重膝盖的负担。当膝盖开始抗议时，我们的生活品质也随之下降。但这并不意味着我们只能默默忍受。这里有10个经过验证的建议，可以帮助您有效管理和缓解膝盖疼痛。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">1. 保持健康的体重</h3>
        <p>
          您知道吗？您的身体每增加1公斤的重量，您的膝盖在走路时就要承受额外4公斤的压力。减轻体重是减轻膝盖负担最有效的方法之一。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">2. 进行低冲击运动</h3>
        <p>
          许多人因为怕痛而不敢运动，但这反而会让关节更僵硬。选择游泳、水中健走或骑固定脚踏车等低冲击运动，可以在不伤害关节的情况下，强化腿部肌肉，为膝盖提供更好的支撑。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">3. 使用天然消炎喷雾</h3>
        <p>
          现代科学证实，一些古老的草药具有强大的消炎和镇痛效果。例如，HerbalBath使用的没药和乳香，自古以来就是皇室专用的"液体黄金"。它们能通过皮肤深层渗透，直达疼痛根源，安全且无副作用，是日常保养的绝佳选择。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">4. 注意饮食：多吃抗炎食物</h3>
        <p>
          三文鱼、坚果、橄榄油、姜黄和绿叶蔬菜等富含Omega-3和抗氧化剂的食物，可以帮助身体对抗炎症，从内部缓解关节不适。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">5. 定期进行关节活动</h3>
        <p>即使疼痛，也要定期进行关节活动，以保持关节的灵活性和血液循环。简单的拉伸和旋转运动可以有效预防关节僵硬。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">6. 使用热敷或冷敷</h3>
        <p>
          热敷可以帮助放松肌肉，缓解疼痛；冷敷则可以减少炎症和肿胀。根据您的具体情况选择合适的方法，或交替使用以获得最佳效果。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">7. 保持良好的姿势</h3>
        <p>错误的姿势会增加膝盖的负担。无论是站立、坐着还是走路，都要保持脊柱直立，避免长时间保持同一姿势。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">8. 使用护膝垫</h3>
        <p>在上下楼梯或进行其他可能加重膝盖负担的活动时，使用护膝垫可以提供额外的支持，减轻疼痛。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">9. 保持积极心态</h3>
        <p>研究表明，情绪对疼痛感知有很大影响。保持乐观，多与朋友家人交流，参加社区活动，有助于减轻疼痛感。</p>
        <h3 className="font-bold mt-6 mb-2 text-xl">10. 寻求专业帮助</h3>
        <p>如果疼痛持续或加重，请务必咨询医生或物理治疗师。他们可以为您提供准确的诊断和个人化的治疗方案。</p>
        <p className="mt-8 font-semibold text-lg">
          结论：管理膝盖疼痛是一个综合性的过程。通过结合健康的生活方式、适当的运动和有效的天然疗法，您可以大大改善生活品质，重新享受无痛的自由生活。
        </p>
      </>
    ),
  },
  {
    slug: "myrrh-frankincense-miracle-herbs",
    title: "没药和乳香：被遗忘的天然止痛神药",
    description:
      "您知道吗？在圣经时代，没药和乳香比黄金还要珍贵。探索这两种神奇草药的历史、科学原理，以及它们如何成为现代疼痛管理的革命性方案。",
    image: "/myrrh-frankincense.png",
    author: "HerbalBath 历史研究员",
    date: "2024-07-18",
    content: (
      <>
        <p className="lead">
          当东方三博士拜访新生的耶稣时，他们带来了三样礼物：黄金、乳香和没药。为什么这两种树脂会与黄金相提并论？因为在古代世界，它们是公认的具有神奇疗效的"液体黄金"。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">没药 (Myrrh): 天然的镇痛剂</h3>
        <p>
          古埃及人用它来防腐和治疗伤口。古希腊医生则用它来处理战场创伤。现代科学发现，没药中含有的化合物可以直接作用于大脑的阿片受体，从而产生强大的镇痛效果，但又没有成瘾性。它能温和地舒缓深层、顽固的疼痛。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">乳香 (Frankincense): 强大的抗炎剂</h3>
        <p>
          乳香以其强大的抗炎特性而闻名。它含有的乳香酸可以有效抑制导致炎症的关键酶（如5-LOX），从而减轻关节炎等炎症性疾病引起的肿胀和疼痛，从根源上解决问题。
        </p>
        <h3 className="font-bold mt-6 mb-2 text-xl">古老智慧与现代科技的结合</h3>
        <p>
          HerbalBath通过先进的提取技术，将这两种神奇草药的活性成分最大化，并制成易于吸收的喷雾。我们确保每一滴精华都能快速渗透，发挥最大效用。当您使用它时，您不仅是在使用一种产品，更是在体验传承千年的自然治愈力量。
        </p>
      </>
    ),
  },
  {
    slug: "anti-inflammatory-diet-guide",
    title: "吃出健康：对抗关节炎的10大抗炎食物",
    description: "食物就是你最好的医药。了解哪些食物可以帮助您对抗身体炎症，缓解关节疼痛，从餐桌上开始您的疗愈之旅。",
    image: "/anti-inflammatory-foods.png",
    author: "HerbalBath 营养师",
    date: "2024-07-15",
    content: (
      <>
        <p className="lead">
          "让食物成为你的药物，让药物成为你的食物。"
          古希腊医学之父希波克拉底的这句话，在今天依然具有深刻的意义。研究表明，慢性炎症是许多疾病的根源，包括关节炎、心脏病和糖尿病。好消息是，通过选择正确的食物，我们可以有效对抗炎症，从内而外地改善健康。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">1. 深海鱼类：Omega-3的宝库</h3>
        <p>
          三文鱼、鲭鱼、沙丁鱼等深海鱼富含EPA和DHA，这些Omega-3脂肪酸是天然的抗炎剂。研究显示，每周食用2-3次深海鱼的人，关节炎症状明显减轻。如果您不喜欢鱼腥味，可以选择鱼油补充剂。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">2. 姜黄：黄金香料的力量</h3>
        <p>
          姜黄中的姜黄素具有强大的抗炎和抗氧化作用，其效果甚至可以媲美某些抗炎药物。在新加坡，您可以轻易买到新鲜姜黄或姜黄粉。建议与黑胡椒一起食用，可以增加吸收率高达2000%。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">3. 绿叶蔬菜：天然的维生素K</h3>
        <p>
          菠菜、羽衣甘蓝、芥兰等绿叶蔬菜富含维生素K、维生素C和抗氧化剂。这些营养素能够中和自由基，减少炎症反应。每天至少食用一份绿叶蔬菜，是维持关节健康的简单方法。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">4. 浆果类：抗氧化剂的天然来源</h3>
        <p>
          蓝莓、草莓、覆盆子等浆果含有丰富的花青素和维生素C。这些化合物不仅能对抗炎症，还能保护关节软骨免受损伤。新鲜或冷冻的浆果都有同样的效果。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">5. 坚果和种子：健康脂肪的来源</h3>
        <p>
          核桃、杏仁、亚麻籽和奇亚籽富含Omega-3脂肪酸和维生素E。每天一小把坚果（约30克），可以显著降低体内炎症标记物。但要注意控制分量，因为坚果热量较高。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">6. 橄榄油：地中海饮食的精髓</h3>
        <p>
          特级初榨橄榄油含有油橄榄刺激醛，这种化合物具有类似布洛芬的抗炎作用。用橄榄油代替其他烹饪油，或直接淋在沙拉上食用，都是很好的选择。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">7. 生姜：温暖的治愈力量</h3>
        <p>
          生姜含有姜辣素，具有强大的抗炎和镇痛作用。无论是泡茶、炒菜还是制作果汁，生姜都是很好的选择。对于关节疼痛的人来说，每天食用1-2克生姜可以有效缓解症状。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">8. 绿茶：抗氧化的液体宝石</h3>
        <p>
          绿茶富含EGCG（表没食子儿茶素没食子酸酯），这是一种强效的抗炎化合物。每天饮用2-3杯绿茶，不仅能对抗炎症，还能提供温和的咖啡因提神效果。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">9. 樱桃：天然的止痛剂</h3>
        <p>
          酸樱桃含有花青素和褪黑激素，具有天然的抗炎和镇痛作用。研究显示，每天饮用酸樱桃汁可以显著减少关节炎患者的疼痛和僵硬感。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">10. 大蒜：天然的抗生素</h3>
        <p>
          大蒜含有大蒜素，具有抗炎、抗菌和免疫调节作用。生大蒜的效果最好，但如果您不能接受生蒜的辛辣，熟大蒜也有一定的抗炎效果。
        </p>

        <div className="bg-green-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">实用建议：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 每餐都包含至少一种抗炎食物</li>
            <li>• 避免加工食品、糖分过高的食物和反式脂肪</li>
            <li>• 保持饮食多样化，不要只依赖单一食物</li>
            <li>• 配合适量运动和充足睡眠，效果更佳</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          记住，食疗是一个长期过程，需要持之以恒。结合天然草药疗法如HerbalBath没药喷雾，内外兼治，您将能更快地感受到改善。
        </p>
      </>
    ),
  },
  {
    slug: "improve-blood-circulation-naturally",
    title: "手脚冰冷，时常麻痹？5个简单方法促进血液循环",
    description:
      "良好的血液循环是健康的关键。本文将教您几个简单有效的日常方法，来改善血液循环，为您的身体注入新的活力。",
    image: "/blood-circulation-improvement.png",
    author: "HerbalBath 健康专家",
    date: "2024-07-12",
    content: (
      <>
        <p className="lead">
          您是否经常感到手脚冰冷，即使在新加坡的炎热天气下？或者长时间坐着后感到腿部麻痹？这些都可能是血液循环不良的信号。良好的血液循环对于输送氧气和营养到身体各个部位至关重要，也是维持关节健康和缓解疼痛的基础。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">1. 定期运动：让血液流动起来</h3>
        <p>
          运动是改善血液循环最有效的方法。即使是简单的散步也能显著改善循环。对于乐龄人士，建议每天至少步行30分钟。如果关节疼痛限制了您的活动，可以尝试水中运动或椅子运动。
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">推荐运动：</h4>
          <ul className="text-sm space-y-1">
            <li>• 快步走或慢跑</li>
            <li>• 游泳或水中健走</li>
            <li>• 太极或瑜伽</li>
            <li>• 简单的拉伸运动</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">2. 按摩和自我按摩</h3>
        <p>
          按摩能够刺激血管，促进血液流动。您不需要专业按摩师，简单的自我按摩就很有效。用手掌轻柔地按摩手臂、腿部和脚部，从远端向心脏方向按摩。
        </p>
        <div className="bg-orange-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">自我按摩技巧：</h4>
          <ul className="text-sm space-y-1">
            <li>• 每次按摩5-10分钟</li>
            <li>• 使用温和的压力</li>
            <li>• 可以配合使用按摩油或没药喷雾</li>
            <li>• 重点按摩手脚和关节部位</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">3. 热水浴和冷热交替</h3>
        <p>
          温热的水能够扩张血管，改善血液流动。每天泡15-20分钟的温水澡，水温控制在37-40°C。如果条件允许，可以尝试冷热水交替，这能够刺激血管收缩和扩张，像给血管做运动一样。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">4. 改善饮食习惯</h3>
        <p>
          某些食物能够自然地改善血液循环。辣椒中的辣椒素、大蒜中的大蒜素、生姜中的姜辣素都能促进血液流动。同时，要避免过多的盐分和饱和脂肪，这些会影响血管健康。
        </p>
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">促进循环的食物：</h4>
          <ul className="text-sm space-y-1">
            <li>• 辣椒和胡椒</li>
            <li>• 大蒜和洋葱</li>
            <li>• 生姜和姜黄</li>
            <li>• 深色浆果</li>
            <li>• 绿茶和红茶</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">5. 使用天然促循环产品</h3>
        <p>
          天然草药如没药和乳香不仅能缓解疼痛，还能促进局部血液循环。HerbalBath没药喷雾中的活性成分能够温暖肌肤，刺激血管扩张，改善局部循环。使用时您会感受到温热感，这正是血液循环改善的信号。
        </p>

        <div className="bg-red-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">日常小贴士：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 避免长时间保持同一姿势</li>
            <li>• 穿着宽松舒适的衣物</li>
            <li>• 保持足够的水分摄入</li>
            <li>• 戒烟限酒，因为它们会影响血管健康</li>
            <li>• 保持双脚温暖，可以穿保暖袜</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          改善血液循环需要综合方法和持续努力。结合运动、按摩、饮食调整和天然草药产品，您将能够感受到明显的改善，重新享受温暖有力的身体。
        </p>
      </>
    ),
  },
  {
    slug: "office-neck-shoulder-pain",
    title: "告别电脑肩：给上班族的5个肩颈放松秘诀",
    description:
      "长时间对着电脑工作，肩颈酸痛已成常态？别担��，这5个简单的办公室拉伸和放松技巧，能帮助您有效缓解不适。",
    image: "/placeholder-0qqck.png",
    author: "HerbalBath 物理治疗顾问",
    date: "2024-07-10",
    content: (
      <>
        <p className="lead">
          在新加坡快节奏的工作环境中，许多上班族每天要在电脑前工作8-10小时。长期的不良姿势导致肩颈肌肉紧张，形成了所谓的"电脑肩"。如果您也深受其害，这5个简单有效的方法将帮助您重获轻松的肩颈。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">1. 颈部拉伸运动</h3>
        <p>
          这是最简单也是最有效的缓解方法。坐直身体，慢慢将头部向右侧倾斜，用右手轻轻按压头部，感受左侧颈部的拉伸。保持15-30秒，然后换另一边。每小时重复2-3次。
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">颈部拉伸步骤：</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>坐直，双肩放松</li>
            <li>头部缓慢向一侧倾斜</li>
            <li>用同侧手轻压头部</li>
            <li>保持15-30秒</li>
            <li>缓慢回到中间位置</li>
            <li>重复另一侧</li>
          </ol>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">2. 肩膀滚动和耸肩</h3>
        <p>
          肩膀滚动能够放松紧张的肩部肌肉，改善血液循环。向前滚动肩膀10次，然后向后滚动10次。接着做耸肩运动：将肩膀向上提起至耳朵位置，保持5秒，然后放松。重复10次。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">3. 胸部开展运动</h3>
        <p>
          长时间驼背会导致胸部肌肉紧张。站起来，将双手放在背后交握，慢慢向上抬起，同时挺胸。这个动作能够拉伸胸部肌肉，改善姿势。保持15-30秒，重复3-5次。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">4. 上背部拉伸</h3>
        <p>
          坐在椅子上，将双手向前伸展，十指交握，手心向外。慢慢向前推，感受上背部的拉伸。这个动作特别适合缓解肩胛骨之间的紧张感。保持15-30秒，重复3-5次。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">5. 使用天然舒缓产品</h3>
        <p>
          在进行拉伸运动的同时，可以使用天然的舒缓产品来增强效果。HerbalBath没药喷雾含有天然的肌肉松弛成分，能够深层渗透，缓解肌肉紧张。在拉伸前后使用，效果更佳。
        </p>

        <div className="bg-yellow-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">预防电脑肩的工作习惯：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 每小时起身活动5-10分钟</li>
            <li>• 调整电脑屏幕高度，视线平视或略向下</li>
            <li>• 使用符合人体工学的椅子和键盘</li>
            <li>• 保持双脚平放在地面</li>
            <li>• 手臂与桌面平行，避免悬空</li>
            <li>• 定期检查和调整坐姿</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">办公室快速缓解法：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 深呼吸：缓慢深呼吸5次，放松全身</li>
            <li>• 眼部运动：转动眼球，缓解眼部疲劳</li>
            <li>• 手腕转动：防止鼠标手</li>
            <li>• 脚踝转动：促进下肢血液循环</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          记住，预防胜于治疗。养成良好的工作习惯，定期进行这些简单的运动，配合天然草药产品的辅助，您就能告别电脑肩，享受轻松舒适的工作生活。
        </p>
      </>
    ),
  },
  {
    slug: "tcm-vs-western-pain-relief",
    title: "中医 vs 西医：如何选择适合您的关节痛疗法？",
    description:
      "针灸、推拿、止痛药、物理治疗... 面对五花八门的治疗方案，您该如何选择？本文为您深入分析中西疗法的利弊。",
    image: "/chinese-medicine-herbs.png",
    author: "HerbalBath 健康研究员",
    date: "2024-07-08",
    content: (
      <>
        <p className="lead">
          面对关节疼痛，您是选择西医的快速止痛，还是中医的温和调理？这是许多新加坡人面临的选择难题。实际上，中西医各有优势，了解它们的特点，才能做出最适合自己的选择。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">西医疗法：快速精准的现代医学</h3>

        <h4 className="font-semibold mt-4 mb-2">优势：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>快速见效：</strong>止痛药能在30分钟内缓解疼痛
          </li>
          <li>
            <strong>精准诊断：</strong>X光、MRI等检查能准确定位问题
          </li>
          <li>
            <strong>标准化治疗：</strong>有明确的治疗指南和剂量标准
          </li>
          <li>
            <strong>急症处理：</strong>对于严重创伤和急性炎症效果显著
          </li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">局限性：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>副作用：</strong>长期使用止痛药可能损害肝肾功能
          </li>
          <li>
            <strong>治标不治本：</strong>主要缓解症状，较少关注根本原因
          </li>
          <li>
            <strong>依赖性：</strong>某些药物可能产生依赖
          </li>
          <li>
            <strong>成本较高：</strong>检查和药物费用不菲
          </li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">中医疗法：整体调理的传统智慧</h3>

        <h4 className="font-semibold mt-4 mb-2">优势：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>整体调理：</strong>不仅治疗症状，更注重身体整体平衡
          </li>
          <li>
            <strong>副作用小：</strong>天然草药相对安全
          </li>
          <li>
            <strong>个性化治疗：</strong>根据个人体质制定治疗方案
          </li>
          <li>
            <strong>预防为主：</strong>强调"治未病"，预防疾病发生
          </li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">局限性：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>见效较慢：</strong>通常需要数周甚至数月才能看到明显效果
          </li>
          <li>
            <strong>诊断主观：</strong>依赖医师经验，可能存在差异
          </li>
          <li>
            <strong>急症处理能力有限：</strong>对于急性疼痛效果不如西药
          </li>
          <li>
            <strong>质量参差不齐：</strong>草药质量和医师水平差异较大
          </li>
        </ul>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="font-bold text-lg mb-4">如何选择适合您的疗法？</h3>

          <h4 className="font-semibold mb-2">选择西医，如果您：</h4>
          <ul className="text-sm space-y-1 mb-4">
            <li>• 疼痛急性发作，需要快速缓解</li>
            <li>• 怀疑有结构性损伤（如骨折、韧带撕裂）</li>
            <li>• 需要明确的诊断和检查结果</li>
            <li>• 对传统疗法持怀疑态度</li>
          </ul>

          <h4 className="font-semibold mb-2">选择中医，如果您：</h4>
          <ul className="text-sm space-y-1">
            <li>• 慢性疼痛，西医治疗效果不佳</li>
            <li>• 希望减少药物依赖</li>
            <li>• 注重整体健康调理</li>
            <li>• 对天然疗法有信心</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">最佳选择：中西医结合</h3>
        <p>
          现代医学越来越认识到，中西医结合往往能取得最佳效果。急性期使用西医快速控制症状，慢性期采用中医调理，这种方法既能快速缓解痛苦，又能从根本上改善健康。
        </p>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">HerbalBath：现代科技与古老智慧的完美结合</h4>
          <p className="text-sm mb-3">
            HerbalBath没药喷雾正是中西医结合的典型例子。我们采用现代提取技术，最大化保留古老草药的活性成分，既有中医的温和调理，又有现代产品的快速见效。
          </p>
          <ul className="text-sm space-y-1">
            <li>• 10秒快速见效，媲美西药速度</li>
            <li>• 天然成分，无副作用</li>
            <li>• 深层调理，治标又治本</li>
            <li>• 方便使用，适合现代生活</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          无论选择哪种疗法，最重要的是找到适合自己的方法。建议在专业医师指导下，结合个人情况，制定最适合的治疗方案。记住，健康是一个长期的过程，需要耐心和坚持。
        </p>
      </>
    ),
  },
  {
    slug: "better-sleep-with-chronic-pain",
    title: "疼痛让您夜不能寐？7个技巧改善慢性疼痛患者的睡眠品质",
    description:
      "良好的睡眠对于疼痛恢复至关重要。学习如何创建一个舒适的睡眠环境，并掌握一些睡前放松技巧，让您安然入梦。",
    image: "/better-sleep-quality.png",
    author: "HerbalBath 睡眠顾问",
    date: "2024-07-05",
    content: (
      <>
        <p className="lead">
          疼痛和睡眠之间存在着恶性循环：疼痛让人难以入睡，而睡眠不足又会加重疼痛感。研究显示，慢性疼痛患者中有超过70%的人存在睡眠问题。但好消息是，通过一些简单的技巧，您可以打破这个循环，重获安稳的睡眠。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">1. 创建理想的睡眠环境</h3>
        <p>
          在新加坡的热带气候下，保持卧室凉爽尤为重要。理想的睡眠温度是22-25°C。使用遮光窗帘阻挡光线，选择舒适的床垫和枕头来支撑疼痛的关节。考虑使用白噪音机器来掩盖外界噪音。
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">睡眠环境清单：</h4>
          <ul className="text-sm space-y-1">
            <li>• 温度：22-25°C</li>
            <li>• 湿度：50-60%</li>
            <li>• 光线：尽可能黑暗</li>
            <li>• 噪音：安静或使用白噪音</li>
            <li>• 床垫：支撑性好，适合您的睡姿</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">2. 建立规律的睡眠时间</h3>
        <p>
          即使疼痛影响了您的睡眠，也要尽量保持固定的就寝和起床时间。这有助于调节您的生物钟。即使夜里睡得不好，也要在固定时间起床，避免白天长时间午睡。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">3. 睡前疼痛管理</h3>
        <p>
          在睡前1-2小时进行疼痛管理。可以使用热敷、温水浴或天然止痛产品如HerbalBath没药喷雾。温热感能够放松肌肉，减轻疼痛，为良好睡眠做准备。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">4. 放松技巧和冥想</h3>
        <p>
          学习深呼吸、渐进性肌肉放松或正念冥想。这些技巧不仅能帮助您放松身心，还能转移对疼痛的注意力。每天练习15-20分钟，效果会逐渐显现。
        </p>
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">简单的4-7-8呼吸法：</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>用鼻子吸气4秒</li>
            <li>屏住呼吸7秒</li>
            <li>用嘴呼气8秒</li>
            <li>重复4-8次</li>
          </ol>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">5. 选择合适的睡姿</h3>
        <p>
          不同的疼痛需要不同的睡姿。背痛患者可以在膝盖下放一个枕头；侧睡时在双腿间夹一个枕头；颈部疼痛的人应选择支撑性好的枕头。找到最舒适的姿势并坚持使用。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">6. 避免睡眠干扰因素</h3>
        <p>
          睡前3-4小时避免咖啡因，睡前2小时避免大量进食和剧烈运动。虽然酒精可能让您感到困倦，但它会影响深度睡眠质量，应该避免。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">7. 白天的活动管理</h3>
        <p>
          适度的白天活动有助于夜间睡眠，但要避免过度劳累加重疼痛。选择温和的运动如散步、游泳或太极。确保有足够的自然光照射，这有助于调节生物钟。
        </p>

        <div className="bg-yellow-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">睡前例行程序建议：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>睡前2小时：</strong>停止使用电子设备，调暗灯光
            </li>
            <li>
              <strong>睡前1小时：</strong>温水浴或热敷疼痛部位
            </li>
            <li>
              <strong>睡前30分钟：</strong>使用没药喷雾，进行放松练习
            </li>
            <li>
              <strong>睡前15分钟：</strong>阅读轻松的书籍或听舒缓音乐
            </li>
            <li>
              <strong>上床后：</strong>进行深呼吸或冥想
            </li>
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">何时寻求专业帮助：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 连续数周难以入睡或频繁醒来</li>
            <li>• 白天极度疲劳影响日常生活</li>
            <li>• 疼痛严重影响睡眠质量</li>
            <li>• 出现睡眠呼吸暂停症状</li>
            <li>• 自我管理方法无效</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          改善睡眠质量需要时间和耐心。结合疼痛管理、环境优化和放松技巧，您将能够逐渐改善睡眠，从而形成疼痛缓解和睡眠改善的良性循环。记住，良好的睡眠是最好的天然止痛剂。
        </p>
      </>
    ),
  },
  {
    slug: "gentle-exercises-for-seniors",
    title: "乐龄人士动起来！5种最适合新加坡乐龄的温和运动",
    description:
      "运动是保持关节灵活和身体健康的关键。我们为您推荐5种安全有效的温和运动，如太极和水中健走，让您动得开心又安心。",
    image: "/gentle-exercises-seniors.png",
    author: "HerbalBath 健身教练",
    date: "2024-07-02",
    content: (
      <>
        <p className="lead">
          "生命在于运动"，但对于乐龄人士来说，选择合适的运动方式至关重要。在新��坡，许多乐龄人士因为担心受伤而不敢运动，但适度的运动实际上是维持关节健康、预防疼痛的最佳方法。这里为您推荐5种安全有效的温和运动。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">1. 太极：动中有静的东方智慧</h3>
        <p>
          太极被誉为"最适合乐龄人士的运动"。它动作缓慢、流畅，对关节冲击小，却能有效改善平衡、柔韧性和肌肉力量。在新加坡，许多公园都有太极班，您可以加入社区一起练习。
        </p>
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">太极的益处：</h4>
          <ul className="text-sm space-y-1">
            <li>• 改善平衡，减少跌倒风险</li>
            <li>• 增强下肢肌肉力量</li>
            <li>• 提高关节灵活性</li>
            <li>• 减轻关节炎疼痛</li>
            <li>• 改善心理健康，减少焦虑</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">2. 水中健走：关节友好的全身运动</h3>
        <p>
          水的浮力能减轻关节负担，同时水的阻力提供了温和的肌肉训练。新加坡有许多公共游泳池提供水中健走课程。即使不会游泳，您也可以在浅水区进行水中健走。
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">水中运动技巧：</h4>
          <ul className="text-sm space-y-1">
            <li>• 水深至胸部最为理想</li>
            <li>• 保持正常的走路姿势</li>
            <li>• 可以加入手臂摆动</li>
            <li>• 每次20-30分钟</li>
            <li>• 水温28-30°C最舒适</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">3. 椅子运动：随时随地的健身方案</h3>
        <p>
          对于行动不便或平衡能力较差的乐龄人士，椅子运动是绝佳选择。坐在稳固的椅子上，您可以进行上肢运动、腿部抬举、脚踝转动等多种运动，安全又有效。
        </p>
        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">椅子运动示例：</h4>
          <ul className="text-sm space-y-1">
            <li>• 坐姿抬腿：每腿10-15次</li>
            <li>• 手臂画圈：前后各10次</li>
            <li>• 脚踝转动：每脚各方向5次</li>
            <li>• 肩膀耸动：上下10次</li>
            <li>• 颈部转动：左右各5次</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">4. 散步：最简单的有氧运动</h3>
        <p>
          散步是最容易开始的运动。在新加坡，您可以选择公园、购物中心或组屋楼下的空地。建议从每天15分钟开始，逐渐增加到30-45分钟。选择平坦的路面，穿着舒适的鞋子。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">5. 瑜伽：身心合一的柔韧训练</h3>
        <p>
          温和的瑜伽动作能够改善柔韧性、平衡和肌肉力量。选择专为乐龄人士设计的瑜伽课程，避免过于复杂或需要极度柔韧性的动作。重点关注呼吸和身体感受。
        </p>

        <div className="bg-orange-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">运动安全指南：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>开始前：</strong>咨询医生，了解自己的身体状况
            </li>
            <li>
              <strong>热身：</strong>每次运动前进行5-10分钟热身
            </li>
            <li>
              <strong>强度：</strong>能够正常对话的强度最适宜
            </li>
            <li>
              <strong>频率：</strong>每周至少3-5次，每次20-30分钟
            </li>
            <li>
              <strong>休息：</strong>感到疲劳或疼痛时要及时休息
            </li>
            <li>
              <strong>装备：</strong>穿着合适的运动鞋和舒适的衣物
            </li>
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">运动后的恢复：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 进行5-10分钟的缓慢拉伸</li>
            <li>• 补充足够的水分</li>
            <li>• 如有肌肉酸痛，可使用没药喷雾缓解</li>
            <li>• 保证充足的休息和睡眠</li>
            <li>• 记录运动感受，调整运动计划</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">新加坡乐龄运动资源：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 人民协会社区中心：提供各种乐龄运动课程</li>
            <li>• 公园连道：安全的散步和慢跑路线</li>
            <li>• 公共游泳池：水中运动的理想场所</li>
            <li>• 社区花园：太极和瑜伽的练习地点</li>
            <li>• 购物中心：雨天室内散步的好选择</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          记住，最好的运动是您能够坚持的运动。从小步开始，逐渐增加强度和时间。结合适当的疼痛管理和恢复措施，运动将成为您保持健康、享受生活的重要伙伴。年龄不是限制，只要开始，永远不会太晚！
        </p>
      </>
    ),
  },
  {
    slug: "understanding-rheumatism",
    title: "风湿痛怎么办？深入了解成因与日常护理",
    description:
      "天气一变，关节就痛？这可能是风湿痛的信号。本文将带您了解风湿痛的成因，并提供实用的日常护理和保暖建议。",
    image: "/rheumatism-care.png",
    author: "HerbalBath 健康专家",
    date: "2024-06-30",
    content: (
      <>
        <p className="lead">
          "天气一变，关节就痛"——这是许多新加坡乐龄人士的共同经历。虽然新加坡气候相对稳定，但空调环境、雨季湿气和温度变化仍然会触发风湿痛。了解风湿痛的成因和应对方法，能帮助您更好地管理这个常见的健康问题。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">什么是风湿痛？</h3>
        <p>
          风湿痛是一个广义的概念，包括多种影响关节、肌肉和结缔组织的疾病。常见的包括类风湿关节炎、骨关节炎、痛风等。这些疾病的共同特点是会引起关节疼痛、僵硬和炎症。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">为什么天气变化会加重疼痛？</h3>
        <p>
          虽然科学界对此仍有争议，但多数研究认为气压变化、湿度和温度波动会影响关节内的压力和血液循环，从而加重疼痛感。在新加坡，以下情况特别容易触发风湿痛：
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">常见触发因素：</h4>
          <ul className="text-sm space-y-1">
            <li>• 雨季前的低气压</li>
            <li>• 空调房间的温度骤变</li>
            <li>• 高湿度环境</li>
            <li>• 长时间处于冷气环境</li>
            <li>• 季风季节的天气变化</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">风湿痛的常见症状</h3>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>晨僵：</strong>早晨起床时关节僵硬，需要活动一段时间才能缓解
          </li>
          <li>
            <strong>关节疼痛：</strong>特别是手指、膝盖、肩膀等部位
          </li>
          <li>
            <strong>肿胀：</strong>关节周围出现肿胀和发热
          </li>
          <li>
            <strong>活动受限：</strong>关节活动范围减少
          </li>
          <li>
            <strong>疲劳：</strong>全身乏力，精神不振
          </li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">日常护理策略</h3>

        <h4 className="font-semibold mt-4 mb-2">1. 保暖措施</h4>
        <p>
          即使在热带的新加坡，保暖仍然重要。在空调环境中，可以准备薄外套或围巾。睡觉时确保关节部位保暖，可以使用薄毯子覆盖膝盖和肩膀。
        </p>

        <h4 className="font-semibold mt-4 mb-2">2. 适度运动</h4>
        <p>
          规律的温和运动能够保持关节灵活性，增强肌肉力量。推荐游泳、太极、瑜伽等低冲击运动。避免在疼痛急性期进行剧烈运动。
        </p>

        <h4 className="font-semibold mt-4 mb-2">3. 饮食调理</h4>
        <p>
          选择抗炎食物，如深海鱼、坚果、橄榄油、姜黄等。减少红肉、糖分和加工食品的摄入。保持充足的水分摄入，帮助排除体内毒素。
        </p>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">新加坡风湿痛管理小贴士：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>空调使用：</strong>避免直接对着空调出风口，温度设置在24-26°C
            </li>
            <li>
              <strong>雨季准备：</strong>随身携带雨具，避免淋雨受凉
            </li>
            <li>
              <strong>室内湿度：</strong>使用除湿机保持室内湿度在50-60%
            </li>
            <li>
              <strong>出行安排：</strong>关注天气预报，在天气变化前做好防护
            </li>
            <li>
              <strong>工作环境：</strong>办公室准备小毯子或护膝
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">天然缓解方法</h3>

        <h4 className="font-semibold mt-4 mb-2">1. 热敷疗法</h4>
        <p>使用热水袋、热毛巾或温水浴来缓解关节僵硬和疼痛。每次15-20分钟，每天2-3次。注意温度不要过高，避免烫伤。</p>

        <h4 className="font-semibold mt-4 mb-2">2. 按摩护理</h4>
        <p>
          轻柔的按摩能够促进血液循环，缓解肌肉紧张。可以使用天然精油或没药喷雾来增强效果。按摩时动作要轻柔，避免过度用力。
        </p>

        <h4 className="font-semibold mt-4 mb-2">3. 草药疗法</h4>
        <p>
          传统草药如没药、乳香、姜黄等具有天然的抗炎和镇痛作用。HerbalBath没药喷雾结合了这些古老智慧，能够快速渗透，缓解风湿痛症状。
        </p>

        <div className="bg-yellow-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">何时需要就医：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 关节疼痛持续超过6周</li>
            <li>• 关节出现明显变形</li>
            <li>• 疼痛严重影响日常生活</li>
            <li>• 伴有发热、体重下降等全身症状</li>
            <li>• 自我护理方法无效</li>
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">预防风湿痛复发：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 保持规律的作息时间</li>
            <li>• 避免过度劳累和精神压力</li>
            <li>• 定期进行健康检查</li>
            <li>• 保持积极乐观的心态</li>
            <li>• 建立支持网络，与家人朋友分享感受</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          风湿痛虽然不能完全治愈，但通过正确的管理和护理，完全可以控制症状，保持良好的生活质量。关键是要有耐心，坚持健康的生活方式，并在需要时寻求专业帮助。记住，您不是一个人在战斗，有很多资源和方法可以帮助您管理风湿痛。
        </p>
      </>
    ),
  },
  {
    slug: "natural-remedies-vs-painkillers",
    title: "天然草药 vs 止痛药：哪个才是长远之计？",
    description:
      "止痛药能快速缓解症状，但长期使用有副作用。天然草药温和而持久。本文为您分析两者的区别，帮助您做出明智的选择。",
    image: "/natural-remedies-vs-painkillers.png",
    author: "HerbalBath 药剂师顾问",
    date: "2024-06-28",
    content: (
      <>
        <p className="lead">
          面对疼痛，您是选择立即见效的止痛药，还是温和持久的天然草药？这是许多慢性疼痛患者面临的重要选择。作为专业的药剂师顾问，我将为您详细分析两者的优缺点，帮助您做出最适合自己的决定。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">止痛药：快速但有代价</h3>

        <h4 className="font-semibold mt-4 mb-2">常见止痛药类型：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>对乙酰氨基酚（扑热息痛）：</strong>适用于轻中度疼痛
          </li>
          <li>
            <strong>非甾体抗炎药（NSAIDs）：</strong>如布洛芬、双氯芬酸
          </li>
          <li>
            <strong>阿片类药物：</strong>用于严重疼痛，需医生处方
          </li>
          <li>
            <strong>局部止痛药：</strong>如止痛贴、止痛膏
          </li>
        </ul>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">止痛药的优势：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>快速见效：</strong>通常30分钟内开始起作用
            </li>
            <li>
              • <strong>效果可预测：</strong>剂量和效果关系明确
            </li>
            <li>
              • <strong>广泛可得：</strong>药房容易购买
            </li>
            <li>
              • <strong>急症处理：</strong>对急性疼痛效果显著
            </li>
          </ul>
        </div>

        <div className="bg-red-100 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">止痛药的风险：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>肝肾损害：</strong>长期使用可能损害肝肾功能
            </li>
            <li>
              • <strong>胃肠问题：</strong>NSAIDs可能引起胃溃疡、出血
            </li>
            <li>
              • <strong>心血管风险：</strong>某些止痛药增加心脏病风险
            </li>
            <li>
              • <strong>依赖性：</strong>阿片类药物可能产生依赖
            </li>
            <li>
              • <strong>掩盖症状：</strong>可能延误疾病诊断
            </li>
            <li>
              • <strong>药物相互作用：</strong>与其他药物可能产生不良反应
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">天然草药：温和而持久的选择</h3>

        <h4 className="font-semibold mt-4 mb-2">常用天然止痛草药：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>没药：</strong>强效镇痛，无成瘾性
          </li>
          <li>
            <strong>乳香：</strong>天然抗炎，减少关���炎症
          </li>
          <li>
            <strong>姜黄：</strong>含姜黄素，抗炎效果显著
          </li>
          <li>
            <strong>白柳皮：</strong>天然阿司匹林的来源
          </li>
          <li>
            <strong>魔鬼爪：</strong>传统用于关节疼痛
          </li>
        </ul>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">天然草药的优势：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>副作用小：</strong>相对安全，副作用较少
            </li>
            <li>
              • <strong>整体调理：</strong>不仅止痛，还能改善整体健康
            </li>
            <li>
              • <strong>无依赖性：</strong>不会产生药物依赖
            </li>
            <li>
              • <strong>长期使用安全：</strong>适合慢性疼痛的长期管理
            </li>
            <li>
              • <strong>多重功效：</strong>同时具有抗炎、抗氧化等作用
            </li>
          </ul>
        </div>

        <div className="bg-green-100 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">天然草药的局限：</h4>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>见效较慢：</strong>通常需要数天到数周才能看到效果
            </li>
            <li>
              • <strong>效果个体差异大：</strong>不同人反应可能不同
            </li>
            <li>
              • <strong>质量参差不齐：</strong>产品质量和纯度可能有差异
            </li>
            <li>
              • <strong>急症处理能力有限：</strong>对急性剧痛效果不如西药
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">科学对比：效果与安全性</h3>

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">比较项目</th>
                <th className="border border-gray-300 p-3 text-center">止痛药</th>
                <th className="border border-gray-300 p-3 text-center">天然草药</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">见效时间</td>
                <td className="border border-gray-300 p-3 text-center">30分钟-2小时</td>
                <td className="border border-gray-300 p-3 text-center">数天-数周</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">副作用风险</td>
                <td className="border border-gray-300 p-3 text-center text-red-600">高</td>
                <td className="border border-gray-300 p-3 text-center text-green-600">低</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">长期使用安全性</td>
                <td className="border border-gray-300 p-3 text-center text-red-600">有风险</td>
                <td className="border border-gray-300 p-3 text-center text-green-600">相对安全</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">成本</td>
                <td className="border border-gray-300 p-3 text-center">中等</td>
                <td className="border border-gray-300 p-3 text-center">中等-高</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">急症处理</td>
                <td className="border border-gray-300 p-3 text-center text-green-600">优秀</td>
                <td className="border border-gray-300 p-3 text-center text-yellow-600">有限</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">如何做出明智的选择？</h3>

        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">选择止痛药，如果您：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 面临急性疼痛，需要快速缓解</li>
            <li>• 疼痛严重影响日常生活</li>
            <li>• 短期使用（少于2周）</li>
            <li>• 在医生指导下使用</li>
            <li>• 没有肝肾疾病或胃肠问题</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">选择天然草药，如果您：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 患有慢性疼痛，需要长期管理</li>
            <li>• 希望减少药物依赖</li>
            <li>• 注重整体健康调理</li>
            <li>• 对化学药物敏感或有副作用</li>
            <li>• 愿意等待较长时间看到效果</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">最佳策略：阶梯式疼痛管理</h3>
        <p>现代疼痛管理提倡阶梯式方法：</p>
        <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
          <li>
            <strong>第一阶梯：</strong>生活方式调整 + 天然草药
          </li>
          <li>
            <strong>第二阶梯：</strong>必要时加入温和的止痛药
          </li>
          <li>
            <strong>第三阶梯：</strong>严重时使用强效止痛药
          </li>
          <li>
            <strong>维持期：</strong>回到天然方法进行长期管理
          </li>
        </ol>

        <div className="bg-purple-50 p-6 rounded-lg mt-8">
          <h4 className="font-bold text-lg mb-3">HerbalBath：现代科技与古老智慧的结合</h4>
          <p className="text-sm mb-3">
            HerbalBath没药喷雾代表了天然草药的现代化应用。我们通过先进的提取技术，让古老的没药和乳香发挥最大功效，既保持了天然草药的温和特性，又实现了快速见效。
          </p>
          <ul className="text-sm space-y-1">
            <li>• 10秒快速渗透，快速缓解疼痛</li>
            <li>• 100%天然成分，无化学添加剂</li>
            <li>• 长期使用安全，无依赖性</li>
            <li>• 深层调理，治标又治本</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          选择止痛药还是天然草药，没有标准答案。关键是要根据自己的具体情况，在专业指导下做出明智的选择。对于大多数慢性疼痛患者来说，以天然草药为主，必要时辅以止痛药的综合方法，往往能取得最佳效果。记住，最好的治疗方案是最适合您的方案。
        </p>
      </>
    ),
  },
  // ============================================
  // NEW BLOG POSTS FOR SEO EXPANSION
  // ============================================
  {
    slug: "hdb-stair-climbing-knee-protection",
    title: "HDB组屋楼梯：如何保护您的膝盖不受伤？",
    description:
      "新加坡HDB组屋楼梯是膝盖的隐形杀手。学习正确的上下楼梯技巧，保护您的膝关节免受损伤。",
    image: "/hdb-stairs-knee.png",
    author: "HerbalBath 物理治疗顾问",
    date: "2024-08-01",
    content: (
      <>
        <p className="lead">
          在新加坡，超过80%的人口住在HDB组屋中。对于许多乐龄人士来说，每天上下楼梯已经成为生活的一部分。然而，您可能不知道，错误的上下楼梯方式正在悄悄损害您的膝盖。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">为什么HDB楼梯对膝盖伤害大？</h3>
        <p>
          当您走下楼梯时，您的膝盖需要承受相当于体重3-4倍的压力。如果您体重60公斤，每走一级楼梯，您的膝盖就承受180-240公斤的压力！如果您住在8楼，每天上下两次，您的膝盖一天就要承受数千次这样的冲击。
        </p>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">膝盖压力计算：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>平地走路：</strong>膝盖承受约1.5倍体重</li>
            <li>• <strong>上楼梯：</strong>膝盖承受约2-3倍体重</li>
            <li>• <strong>下楼梯：</strong>膝盖承受约3-4倍体重</li>
            <li>• <strong>跑下楼梯：</strong>膝盖承受约5-6倍体重</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">正确的上楼梯技巧</h3>
        <p>上楼梯时，膝盖需要弯曲发力，如果方法不对，会加速关节磨损。</p>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">上楼梯正确步骤：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>用整个脚掌踏在台阶上，不要只用脚尖</li>
            <li>让好腿先上，把身体重心转移到好腿上</li>
            <li>用大腿肌肉发力，不要只用膝盖撑</li>
            <li>身体略微前倾，减少膝盖弯曲角度</li>
            <li>扶好扶手，借助上肢力量</li>
          </ol>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">正确的下楼梯技巧</h3>
        <p>下楼梯对膝盖的冲击更大，正确的技巧更为重要。</p>
        
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">下楼梯正确步骤：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>紧握扶手，让上肢分担部分体重</li>
            <li>让痛腿先下（记住：好上坏下）</li>
            <li>慢慢放下脚，控制速度，避免冲击</li>
            <li>膝盖保持微弯，不要完全伸直锁死</li>
            <li>一步一级，不要跳级或跑下</li>
          </ol>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">上下楼梯前的准备</h3>
        <p>如果您的膝盖已经有不适，上下楼梯前做好准备可以减少疼痛。</p>
        
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li><strong>喷上没药喷雾：</strong>在膝盖周围喷上HerbalBath没药喷雾，温热感能帮助肌肉放松</li>
          <li><strong>简单热身：</strong>在楼梯前做几个膝盖弯曲动作，让关节液流动</li>
          <li><strong>使用护膝：</strong>如果膝盖较弱，考虑使用护膝提供额外支撑</li>
          <li><strong>穿对鞋子：</strong>避免穿拖鞋或高跟鞋上下楼梯</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">什么时候应该使用电梯？</h3>
        <p>虽然爬楼梯是好运动，但在某些情况下，您应该优先使用电梯：</p>
        
        <div className="bg-yellow-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">建议使用电梯的情况：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 膝盖正在疼痛或发炎</li>
            <li>• 刚做完关节手术或受伤</li>
            <li>• 携带重物（超过5公斤）</li>
            <li>• 感到头晕或身体不适</li>
            <li>• 楼层超过4层</li>
            <li>• 雨天楼梯湿滑</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">强化膝盖的居家运动</h3>
        <p>强壮的大腿肌肉可以保护膝盖，减少上下楼梯时的压力。</p>
        
        <div className="bg-purple-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">每天5分钟膝盖保护运动：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li><strong>坐姿抬腿：</strong>坐在椅子上，慢慢抬起一条腿伸直，保持5秒，放下。每腿10次。</li>
            <li><strong>靠墙半蹲：</strong>背靠墙，慢慢下蹲到大腿与地面平行，保持10-30秒。</li>
            <li><strong>单腿站立：</strong>扶住椅子，单腿站立30秒，锻炼平衡。每腿3次。</li>
            <li><strong>脚跟抬起：</strong>双手扶椅子，慢慢踮起脚跟，再放下。15次一组，做2组。</li>
          </ol>
        </div>

        <p className="mt-8 font-semibold text-lg">
          保护膝盖是一个长期的过程。通过正确的上下楼梯技巧、适当的锻炼和天然草药护理，您可以大大减少HDB楼梯对膝盖的伤害，让您的关节更健康、更长寿。
        </p>
      </>
    ),
  },
  {
    slug: "monsoon-joint-care-guide",
    title: "新加坡雨季来了！您的关节准备好了吗？",
    description:
      "新加坡雨季（11月-1月）是关节疼痛的高发期。学习如何在雨季保护您的关节，减少疼痛发作。",
    image: "/monsoon-joint-care.png",
    author: "HerbalBath 健康专家",
    date: "2024-08-05",
    content: (
      <>
        <p className="lead">
          每年11月到1月，新加坡进入东北季风季节，也就是我们俗称的"雨季"。对于许多有关节问题的乐龄人士来说，这也是最难熬的季节——天气一变，关节就开始"预警"。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">为什么雨季关节更痛？</h3>
        <p>
          虽然科学界对此仍有争议，但大多数研究和临床经验都支持天气变化确实会影响关节疼痛。主要原因包括：
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">天气影响关节的科学解释：</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>气压变化：</strong>下雨前气压下降，关节囊内的压力相对增加，导致肿胀和不适。这就是为什么很多人能"预测"下雨。
            </li>
            <li>
              <strong>湿度增加：</strong>高湿度可能增加组织水肿，影响关节润滑液的粘度，导致关节更僵硬。
            </li>
            <li>
              <strong>温度下降：</strong>虽然新加坡温差不大，但雨天温度略低，可能导致血管收缩，减少关节血供。
            </li>
            <li>
              <strong>活动减少：</strong>雨天人们往往减少外出和运动，久坐不动会加重关节僵硬。
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">雨季关节护理日历</h3>
        
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">11月：准备阶段</h4>
          <ul className="text-sm space-y-1">
            <li>• 备好HerbalBath没药喷雾</li>
            <li>• 检查除湿机是否正常工作</li>
            <li>• 准备保暖衣物和护膝</li>
            <li>• 开始每天使用没药喷雾预防</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">12月：高峰阶段</h4>
          <ul className="text-sm space-y-1">
            <li>• 每天早晚使用没药喷雾</li>
            <li>• 关注天气预报，提前防护</li>
            <li>• 保持室内干燥</li>
            <li>• 坚持室内运动</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">1月：缓解阶段</h4>
          <ul className="text-sm space-y-1">
            <li>• 继续维持护理习惯</li>
            <li>• 逐渐恢复户外活动</li>
            <li>• 评估雨季期间的症状变化</li>
            <li>• 为下一个雨季做记录</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">雨季居家关节护理</h3>
        
        <h4 className="font-semibold mt-4 mb-2">1. 保持温暖干燥</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>使用除湿机保持室内湿度在50-60%</li>
          <li>空调温度不要设置太低（24-26°C）</li>
          <li>避免冷气直接吹向关节</li>
          <li>准备薄毛毯覆盖膝盖和肩膀</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">2. 坚持室内运动</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>太极和简单瑜伽</li>
          <li>椅子运动</li>
          <li>关节活动操</li>
          <li>观看运动视频跟着做</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">3. 热敷和按摩</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>每天热敷疼痛关节15-20分钟</li>
          <li>使用没药喷雾配合按摩</li>
          <li>温水泡脚促进全身循环</li>
          <li>睡前放松护理</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">雨季饮食建议</h3>
        <p>雨季期间，选择温热和抗炎的食物有助于缓解关节不适。</p>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">雨季关节友好食物：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>生姜：</strong>温暖身体，抗炎止痛。可以泡姜茶或加入菜肴。</li>
            <li>• <strong>姜黄：</strong>强效抗炎，可以加入汤或热饮。</li>
            <li>• <strong>温热汤品：</strong>如鸡汤、药材汤，温暖关节。</li>
            <li>• <strong>辛香料：</strong>如胡椒、肉桂，促进血液循环。</li>
            <li>• <strong>深海鱼：</strong>富含Omega-3，减少炎症。</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">雨季应避免的食物：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 冰冷饮料和食物</li>
            <li>• 过多的糖分</li>
            <li>• 油炸食品</li>
            <li>• 高嘌呤食物（如果有痛风风险）</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          雨季虽然对关节是挑战，但通过提前准备和正确护理，您完全可以舒适地度过这个季节。记得关注天气预报，提前使用HerbalBath没药喷雾，让您的关节在雨季也能保持灵活舒适。
        </p>
      </>
    ),
  },
  {
    slug: "diabetes-joint-care",
    title: "糖尿病患者的关节护理：您需要知道的一切",
    description:
      "糖尿病不仅影响血糖，还会影响关节健康。了解糖尿病患者如何保护关节，预防神经病变。",
    image: "/diabetes-joint-care.png",
    author: "HerbalBath 健康研究员",
    date: "2024-08-10",
    content: (
      <>
        <p className="lead">
          在新加坡，糖尿病是最常见的慢性疾病之一。许多糖尿病患者可能不知道，糖尿病不仅影响血糖控制，还会对关节和神经系统产生深远影响。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">糖尿病如何影响关节？</h3>
        
        <h4 className="font-semibold mt-4 mb-2">1. 糖尿病性关节病</h4>
        <p>
          长期高血糖会导致关节软骨中的糖分子异常积累，影响软骨的弹性和功能。这可能导致关节僵硬、活动受限，严重时可能发展为"糖尿病性骨关节病"。
        </p>

        <h4 className="font-semibold mt-4 mb-2">2. 糖尿病周围神经病变</h4>
        <p>
          高血糖会损害末梢神经，导致手脚麻木、刺痛、烧灼感。约50%的糖尿病患者最终会发展出某种程度的神经病变。
        </p>

        <h4 className="font-semibold mt-4 mb-2">3. 冻结肩（五十肩）</h4>
        <p>
          糖尿病患者发生冻结肩的风险是正常人的2-4倍。肩关节逐渐僵硬，活动范围明显受限。
        </p>

        <h4 className="font-semibold mt-4 mb-2">4. 腕管综合症</h4>
        <p>
          糖尿病患者更容易发生腕管综合症，导致手指麻木、无力，影响日常生活。
        </p>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">糖尿病关节问题的警示信号：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 手脚持续麻木或刺痛</li>
            <li>• 关节活动范围明显减少</li>
            <li>• 手指难以完全伸直或弯曲</li>
            <li>• 脚底感觉异常或丧失</li>
            <li>• 关节僵硬持续超过30分钟</li>
            <li>• 夜间手脚疼痛或不适</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">糖尿病患者的关节护理策略</h3>

        <h4 className="font-semibold mt-4 mb-2">1. 控制血糖是基础</h4>
        <p>良好的血糖控制是预防糖尿病并发症的关键。定期检测血糖，遵医嘱用药，保持HbA1c在目标范围内。</p>

        <h4 className="font-semibold mt-4 mb-2">2. 每天检查双脚</h4>
        <p>糖尿病患者应每天检查双脚，因为神经病变可能导致感觉减退，小伤口可能不被察觉。</p>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">每日足部检查清单：</h4>
          <ul className="text-sm space-y-1">
            <li>✓ 检查脚底、脚趾缝有无伤口</li>
            <li>✓ 观察皮肤颜色变化</li>
            <li>✓ 检查有无红肿或水泡</li>
            <li>✓ 感觉有无麻木或异常</li>
            <li>✓ 检查指甲是否需要修剪</li>
          </ul>
        </div>

        <h4 className="font-semibold mt-4 mb-2">3. 适度运动</h4>
        <p>运动不仅有助于控制血糖，还能保持关节灵活。但糖尿病患者需要注意：</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
          <li>选择低冲击运动（游泳、骑车、太极）</li>
          <li>穿着合适的鞋子保护双脚</li>
          <li>避免脚部受伤的运动</li>
          <li>运动前后检查血糖</li>
          <li>携带糖果预防低血糖</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">4. 使用天然护理产品</h4>
        <p>
          HerbalBath没药喷雾可以帮助改善局部血液循环，缓解关节不适。对于糖尿病患者来说，天然成分更加安全，避免了化学药物可能的相互作用。
        </p>
        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">糖尿病患者使用提示：</h4>
          <ul className="text-sm space-y-1">
            <li>• 使用前确保皮肤完整无伤口</li>
            <li>• 避免在溃疡或感染部位使用</li>
            <li>• 感觉减退区域使用时注意观察</li>
            <li>• 如有任何异常反应立即停用</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">饮食对关节的影响</h3>
        <p>糖尿病患者的饮食选择对关节健康也有重要影响。</p>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">对血糖和关节都友好的食物：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>深海鱼：</strong>Omega-3抗炎，蛋白质稳定血糖</li>
            <li>• <strong>绿叶蔬菜：</strong>低糖高纤维，富含抗氧化剂</li>
            <li>• <strong>坚果（少量）：</strong>健康脂肪，有益关节</li>
            <li>• <strong>豆类：</strong>低升糖指数，富含蛋白质</li>
            <li>• <strong>姜黄和生姜：</strong>抗炎，有助血糖控制</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          糖尿病患者的关节护理需要综合方法：控制血糖、适度运动、日常护理和定期检查。如果您是糖尿病患者并有关节问题，请务必与医生讨论，制定适合您的护理计划。
        </p>
      </>
    ),
  },
  {
    slug: "posture-correction-seniors",
    title: "姿势不对，全身都累！乐龄人士的正确姿势指南",
    description:
      "不良姿势是许多疼痛问题的根源。学习如何在日常生活中保持正确姿势，减少颈肩腰背的负担。",
    image: "/posture-correction.png",
    author: "HerbalBath 物理治疗顾问",
    date: "2024-08-15",
    content: (
      <>
        <p className="lead">
          "站有站相，坐有坐相"——这句老话不仅是礼仪，更是健康。研究显示，不良姿势是导致颈肩痛、腰背痛的主要原因之一。对于乐龄人士来说，正确的姿势尤为重要，因为它直接影响关节健康和生活质量。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">不良姿势的危害</h3>
        
        <div className="bg-red-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">长期姿势不良会导致：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>颈椎问题：</strong>头痛、颈痛、手麻</li>
            <li>• <strong>肩膀疼痛：</strong>肩周炎、肌肉紧张</li>
            <li>• <strong>腰椎问题：</strong>腰痛、坐骨神经痛</li>
            <li>• <strong>呼吸受限：</strong>驼背压迫胸腔</li>
            <li>• <strong>消化不良：</strong>弯腰压迫腹部</li>
            <li>• <strong>平衡问题：</strong>增加跌倒风险</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">正确的站立姿势</h3>
        <p>想象有一条线从头顶穿过身体到脚底，这条线应该是直的。</p>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">站立姿势检查点：</h4>
          <ul className="text-sm space-y-2">
            <li>✓ 头部正直，下巴微收</li>
            <li>✓ 双肩放松，略向后展</li>
            <li>✓ 胸部自然挺起</li>
            <li>✓ 腹部略微收紧</li>
            <li>✓ 膝盖放松，不要锁死</li>
            <li>✓ 双脚与肩同宽，重心均匀</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">正确的坐姿</h3>
        <p>新加坡人平均每天坐着超过8小时，正确的坐姿至关重要。</p>
        
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">坐姿检查点：</h4>
          <ul className="text-sm space-y-2">
            <li>✓ 臀部坐到椅子最里面</li>
            <li>✓ 背部靠在椅背上</li>
            <li>✓ 腰部有支撑（可加腰垫）</li>
            <li>✓ 大腿与地面平行</li>
            <li>✓ 双脚平放地面</li>
            <li>✓ 膝盖弯曲90度</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">看手机和电视的正确姿势</h3>
        
        <h4 className="font-semibold mt-4 mb-2">看手机时：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>将手机抬高至眼睛水平</li>
          <li>避免低头看屏幕</li>
          <li>每20分钟休息一下</li>
          <li>考虑使用手机支架</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">看电视时：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>电视屏幕与眼睛平视</li>
          <li>不要躺着看电视</li>
          <li>坐在有支撑的椅子或沙发上</li>
          <li>每小时起身活动</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">日常活动的正确姿势</h3>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">捡东西：</h4>
          <ul className="text-sm space-y-1">
            <li>• 弯膝蹲下，而不是弯腰</li>
            <li>• 背部保持直立</li>
            <li>• 站起来时用腿部力量</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">提东西：</h4>
          <ul className="text-sm space-y-1">
            <li>• 物品靠近身体</li>
            <li>• 重物分两次拿</li>
            <li>• 用双手而不是单手</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">做家务：</h4>
          <ul className="text-sm space-y-1">
            <li>• 扫地拖地时保持背部直立</li>
            <li>• 使用长柄工具减少弯腰</li>
            <li>• 避免长时间保持同一姿势</li>
            <li>• 每30分钟换一个动作</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">姿势矫正配合疼痛护理</h3>
        <p>
          改善姿势需要时间，在这个过程中，可能会出现肌肉酸痛。HerbalBath没药喷雾可以帮助缓解因姿势调整导致的肌肉不适。
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>练习正确姿势后，在酸痛部位使用没药喷雾</li>
          <li>睡前按摩放松一天的肌肉紧张</li>
          <li>感到疲劳时及时舒缓</li>
        </ul>

        <p className="mt-8 font-semibold text-lg">
          改变多年的姿势习惯不是一朝一夕的事。每天提醒自己检查姿势，坚持练习，配合适当的疼痛护理，您会逐渐感受到正确姿势带来的好处——更少的疼痛，更好的精神，更健康的身体。
        </p>
      </>
    ),
  },
  {
    slug: "walking-tips-seniors",
    title: "走路也是学问：新加坡乐龄人士的健康步行指南",
    description:
      "步行是最适合乐龄人士的运动之一。学习正确的走路姿势、时间和地点选择，让每一步都走得健康。",
    image: "/walking-tips-seniors.png",
    author: "HerbalBath 健康专家",
    date: "2024-08-20",
    content: (
      <>
        <p className="lead">
          步行被誉为"最完美的运动"。它简单、免费、随时可做，而且对关节的冲击远小于跑步。对于新加坡乐龄人士来说，每天步行30分钟可以带来显著的健康益处。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">步行对乐龄人士的好处</h3>
        
        <div className="bg-green-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">每天步行30分钟可以：</h4>
          <ul className="space-y-2 text-sm">
            <li>• 增强心肺功能，降低心脏病风险</li>
            <li>• 控制血糖，有益糖尿病患者</li>
            <li>• 保持关节灵活，减少僵硬</li>
            <li>• 增强骨骼密度，预防骨质疏松</li>
            <li>• 改善平衡，降低跌倒风险</li>
            <li>• 提升心情，减少抑郁和焦虑</li>
            <li>• 帮助控制体重</li>
            <li>• 改善睡眠质量</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">正确的步行姿势</h3>
        <p>走路姿势不对，可能会加重关节负担，适得其反。</p>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">头部和颈部：</h4>
          <ul className="text-sm space-y-1">
            <li>• 眼睛看前方3-6米处</li>
            <li>• 下巴微收，不要低头</li>
            <li>• 颈部放松，不要前倾</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">肩膀和手臂：</h4>
          <ul className="text-sm space-y-1">
            <li>• 肩膀放松下沉，不要耸肩</li>
            <li>• 手臂自然摆动</li>
            <li>• 手肘弯曲约90度</li>
            <li>• 手不要握拳太紧</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">核心和腿部：</h4>
          <ul className="text-sm space-y-1">
            <li>• 腹部微微收紧</li>
            <li>• 背部挺直，不要驼背</li>
            <li>• 脚跟先着地，然后过渡到脚尖</li>
            <li>• 步幅适中，不要过大</li>
            <li>• 膝盖略微弯曲，不要锁死</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">新加坡步行的最佳时间和地点</h3>

        <h4 className="font-semibold mt-4 mb-2">最佳时间：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>早晨6-8点：</strong>天气凉爽，空气清新</li>
          <li><strong>傍晚5-7点：</strong>太阳不那么猛烈</li>
          <li><strong>避免：</strong>中午11点-3点最热时段</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">新加坡适合步行的地点：</h4>
        <div className="bg-orange-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">户外选择：</h4>
          <ul className="text-sm space-y-1">
            <li>• 公园连道（Park Connectors）</li>
            <li>• 东海岸公园</li>
            <li>• 植物园</li>
            <li>• 组屋楼下有遮盖的走道</li>
            <li>• 碧山-宏茂桥公园</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">室内选择（雨天或太热时）：</h4>
          <ul className="text-sm space-y-1">
            <li>• 购物中心（早上人少）</li>
            <li>• 社区中心室内</li>
            <li>• 有空调的连道</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">步行前后的护理</h3>

        <h4 className="font-semibold mt-4 mb-2">步行前：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>在关节部位喷上没药喷雾，预防不适</li>
          <li>做5分钟简单热身</li>
          <li>喝一杯水</li>
          <li>穿合适的运动鞋</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">步行后：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>做5分钟拉伸放松</li>
          <li>在疲劳的关节喷上没药喷雾</li>
          <li>补充水分</li>
          <li>休息后检查双脚（尤其是糖尿病患者）</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">步行计划建议</h3>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">初学者4周计划：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>第1周：</strong>每天10分钟，走走停停也可以</li>
            <li>• <strong>第2周：</strong>每天15分钟，逐渐连续</li>
            <li>• <strong>第3周：</strong>每天20分钟</li>
            <li>• <strong>第4周：</strong>每天25-30分钟</li>
            <li>• <strong>之后：</strong>保持每天30分钟，每周5天</li>
          </ul>
        </div>

        <p className="mt-8 font-semibold text-lg">
          走路是最简单却最有效的运动。在新加坡这个花园城市，有无数适合步行的地方。选择正确的时间和地点，保持正确的姿势，配合适当的护理，让每一步都成为通向健康的阶梯。今天就开始您的步行计划吧！
        </p>
      </>
    ),
  },
  {
    slug: "singapore-tcm-pain-relief",
    title: "新加坡中医疼痛治疗：传统智慧与现代生活的融合",
    description:
      "中医在新加坡有着悠久的历史。了解中医如何看待和治疗疼痛，以及如何结合现代生活进行调理。",
    image: "/tcm-pain-relief-sg.png",
    author: "HerbalBath 中医研究员",
    date: "2024-08-25",
    content: (
      <>
        <p className="lead">
          新加坡是一个多元文化的社会，中医在这里有着深厚的根基。许多乐龄人士从小就接触中医，对针灸、推拿、草药等疗法并不陌生。今天，我们来深入了解中医如何看待和治疗各种疼痛问题。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">中医对疼痛的理解</h3>
        <p>
          中医认为，疼痛的根本原因是"不通则痛"。当气血运行受阻时，就会产生疼痛。这可能由多种原因引起：
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">中医疼痛病因：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>风：</strong>疼痛游走不定，一会儿这里痛，一会儿那里痛</li>
            <li>• <strong>寒：</strong>疼痛固定，遇冷加重，遇热缓解</li>
            <li>• <strong>湿：</strong>疼痛伴有沉重感，阴雨天加重</li>
            <li>• <strong>热：</strong>疼痛伴有红肿发热</li>
            <li>• <strong>瘀：</strong>疼痛固定如针刺，夜间加重</li>
            <li>• <strong>虚：</strong>隐隐作痛，劳累后加重</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">新加坡气候与中医调理</h3>
        <p>
          新加坡属于热带海洋性气候，全年高温高湿。从中医角度看，这种环境容易导致"湿邪"入侵，影响关节健康。
        </p>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">新加坡常见的中医证型：</h4>
          <ul className="text-sm space-y-2">
            <li>• <strong>风湿痹阻：</strong>关节酸痛，遇雨天加重</li>
            <li>• <strong>寒湿凝滞：</strong>关节冷痛，空调房加重</li>
            <li>• <strong>气血瘀滞：</strong>疼痛固定，夜间明显</li>
            <li>• <strong>肝肾亏虚：</strong>腰膝酸软，劳累后加重</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">常见的中医疼痛治疗方法</h3>

        <h4 className="font-semibold mt-4 mb-2">1. 针灸</h4>
        <p>
          针灸通过刺激特定穴位，调节气血运行，是治疗各种疼痛的有效方法。在新加坡，针灸需要由注册中医师进行。
        </p>

        <h4 className="font-semibold mt-4 mb-2">2. 推拿</h4>
        <p>
          推拿按摩可以放松肌肉，促进血液循环，缓解关节僵硬。在新加坡有许多提供中医推拿的诊所。
        </p>

        <h4 className="font-semibold mt-4 mb-2">3. 中药内服</h4>
        <p>
          根据个人体质配制的中药汤剂或中成药，从内部调理身体。需要中医师诊断后开方。
        </p>

        <h4 className="font-semibold mt-4 mb-2">4. 外用药物</h4>
        <p>
          如药油、药酒、药膏等，直接作用于疼痛部位。这也是HerbalBath没药喷雾的原理——将古老的外用草药智慧与现代科技结合。
        </p>

        <div className="bg-green-50 p-6 rounded-lg mt-6">
          <h4 className="font-bold text-lg mb-3">没药和乳香：中医经典外用药材</h4>
          <p className="text-sm mb-3">
            没药（Myrrh）和乳香（Frankincense）在中医典籍中都有记载，被归为活血化瘀、消肿止痛的良药。
          </p>
          <ul className="space-y-2 text-sm">
            <li>• <strong>没药：</strong>活血止痛，消肿生肌</li>
            <li>• <strong>乳香：</strong>活血行气，消肿止痛</li>
            <li>• <strong>两者配合：</strong>增强活血化瘀效果</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">中医养生建议</h3>

        <div className="bg-purple-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">饮食调理：</h4>
          <ul className="text-sm space-y-1">
            <li>• 少吃生冷食物，尤其是空调房里</li>
            <li>• 适量吃姜、葱等温性食物</li>
            <li>• 雨季多喝祛湿汤水（薏米、茯苓）</li>
            <li>• 避免油腻和过甜的食物</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">生活起居：</h4>
          <ul className="text-sm space-y-1">
            <li>• 避免久坐，定时活动</li>
            <li>• 空调温度不要太低</li>
            <li>• 雨天注意保暖，避免淋雨</li>
            <li>• 睡眠充足，不要熬夜</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">运动养生：</h4>
          <ul className="text-sm space-y-1">
            <li>• 太极拳：调和气血，柔韧关节</li>
            <li>• 八段锦：简单易学，适合乐龄</li>
            <li>• 散步：每天30分钟，促进气血运行</li>
            <li>• 避免大汗淋漓的剧烈运动</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">新加坡中医资源</h3>
        <p>新加坡有完善的中医注册和监管制度，寻找正规的中医服务很方便：</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>中华医院和善济医院提供可负担的中医服务</li>
          <li>许多综合诊所有中医门诊</li>
          <li>选择注册中医师（可在TCM Practitioners Board网站查询）</li>
          <li>部分中医服务可使用MediSave</li>
        </ul>

        <p className="mt-8 font-semibold text-lg">
          中医与西医各有所长，在新加坡这个多元社会，我们有幸能够结合两种医学的优势。对于慢性疼痛，中医的整体调理理念和天然疗法值得尝试。HerbalBath没药喷雾正是将中医外用草药的智慧与现代技术相结合，让古老的疗法更方便地融入现代生活。
        </p>
      </>
    ),
  },
  {
    slug: "air-con-joint-pain-singapore",
    title: "空调是关节的敌人？新加坡人必读的空调与关节健康指南",
    description:
      "新加坡号称'空调之国'，但长期暴露在空调环境可能伤害关节。学习如何在空调环境中保护您的关节。",
    image: "/aircon-joint-pain.png",
    author: "HerbalBath 健康研究员",
    date: "2024-08-30",
    content: (
      <>
        <p className="lead">
          新加坡被称为"空调之国"。无论是办公室、购物中心、公共交通还是家里，空调几乎无处不在。对于怕热的人来说这是福音，但对于关节来说，这可能是一个隐形的健康威胁。
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">空调如何影响关节健康？</h3>

        <div className="bg-blue-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">空调对关节的影响：</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>血管收缩：</strong>低温使血管收缩，减少关节部位的血液供应，导致僵硬和不适。
            </li>
            <li>
              <strong>肌肉紧张：</strong>在冷环境中，身体会不自觉地收缩肌肉以保暖，长期可导致肌肉紧张和疼痛。
            </li>
            <li>
              <strong>关节液粘度增加：</strong>低温可能使关节润滑液变得更粘稠，增加关节摩擦。
            </li>
            <li>
              <strong>温差刺激：</strong>频繁进出空调房，温差刺激可能引发关节不适。
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">哪些人最容易受影响？</h3>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>已有关节炎的人</li>
          <li>血液循环不好的人</li>
          <li>经常穿短袖短裤在空调房的人</li>
          <li>办公室工作者，每天在空调下超过8小时</li>
          <li>乐龄人士，关节本身较脆弱</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">空调房关节保护策略</h3>

        <h4 className="font-semibold mt-4 mb-2">1. 温度管理</h4>
        <div className="bg-green-50 p-4 rounded-lg mt-2">
          <ul className="text-sm space-y-1">
            <li>• 空调温度设置在24-26°C</li>
            <li>• 避免温度低于22°C</li>
            <li>• 使用风扇配合空调，提高感知温度</li>
            <li>• 夜间可设置稍高温度或使用定时功能</li>
          </ul>
        </div>

        <h4 className="font-semibold mt-4 mb-2">2. 着装保护</h4>
        <div className="bg-yellow-50 p-4 rounded-lg mt-2">
          <ul className="text-sm space-y-1">
            <li>• 办公室准备薄外套或披肩</li>
            <li>• 穿长裤保护膝盖</li>
            <li>• 考虑使用护膝或护肘</li>
            <li>• MRT和巴士上带件外套</li>
          </ul>
        </div>

        <h4 className="font-semibold mt-4 mb-2">3. 定时活动</h4>
        <div className="bg-purple-50 p-4 rounded-lg mt-2">
          <ul className="text-sm space-y-1">
            <li>• 每小时起身活动5分钟</li>
            <li>• 做简单的关节活动操</li>
            <li>• 转动颈部、耸肩、活动手腕</li>
            <li>• 如果可能，到户外走动，让身体暖和</li>
          </ul>
        </div>

        <h4 className="font-semibold mt-4 mb-2">4. 空调出风口管理</h4>
        <div className="bg-orange-50 p-4 rounded-lg mt-2">
          <ul className="text-sm space-y-1">
            <li>• 调整出风口方向，避免直吹关节</li>
            <li>• 如果座位在出风口下方，考虑换位置</li>
            <li>• 家里可以安装导风板</li>
            <li>• 睡觉时关闭正对床的出风口</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">进出空调房的保护</h3>
        <p>
          频繁进出空调房，温差可能高达10°C以上。这种温差刺激对关节是很大的负担。
        </p>

        <div className="bg-red-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">进出空调房的建议：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>进入空调房前：</strong>喷上没药喷雾，让关节先暖起来</li>
            <li>• <strong>刚进入时：</strong>在门口停留片刻，让身体适应</li>
            <li>• <strong>准备离开前：</strong>收好外套，准备迎接户外高温</li>
            <li>• <strong>离开后：</strong>避免立即进入另一个空调房</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">HerbalBath空调关节护理方案</h3>
        <p>
          没药喷雾的温热感特别适合对抗空调带来的寒凉：
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">办公室使用：</h4>
          <ul className="text-sm space-y-1">
            <li>• 早上到达办公室后使用</li>
            <li>• 午休后使用</li>
            <li>• 感觉关节冷或僵硬时使用</li>
            <li>• 下班前使用，为回家做准备</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">居家使用：</h4>
          <ul className="text-sm space-y-1">
            <li>• 睡前使用，确保关节温暖入睡</li>
            <li>• 早晨起床前使用，缓解晨僵</li>
            <li>• 长时间看电视后使用</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">空调与睡眠</h3>
        <p>
          许多新加坡人习惯开着空调睡觉。虽然凉爽的环境有助于睡眠，但也需要保护关节：
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>空调温度设置在25-26°C</li>
          <li>使用薄被盖住肩膀和膝盖</li>
          <li>考虑使用定时功能，后半夜关闭</li>
          <li>睡前在关节部位使用没药喷雾</li>
          <li>如果半夜醒来感觉冷，及时调整温度</li>
        </ul>

        <p className="mt-8 font-semibold text-lg">
          在新加坡，完全避免空调是不现实的。但通过正确的防护措施、适当的着装、定时活动和使用天然护理产品，您可以享受空调带来的凉爽，同时保护您的关节健康。记住，预防胜于治疗，今天的保护是为了明天的健康。
        </p>
      </>
    ),
  },
  {
    slug: "grandparent-grandchild-activities",
    title: "带孙乐：如何在照顾孙子时保护您的关节",
    description:
      "照顾孙子是许多乐龄人士的日常，但抱孩子、追孩子可能伤害关节。学习如何在享受天伦之乐的同时保护自己。",
    image: "/grandparent-activities.png",
    author: "HerbalBath 健康专家",
    date: "2024-09-01",
    content: (
      <>
        <p className="lead">
          在新加坡，许多乐龄人士都承担着照顾孙子的重任。抱孙子、追着孩子跑、蹲下陪玩——这些都是幸福的时刻，但也可能对关节造成负担。如何在享受天伦之乐的同时保护好自己的身体？
        </p>

        <h3 className="font-bold mt-6 mb-2 text-xl">照顾孙子对关节的常见挑战</h3>

        <div className="bg-red-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">高风险动作：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>长时间抱孩子：</strong>手臂、肩膀、腰部负担</li>
            <li>• <strong>弯腰捡玩具：</strong>腰椎压力</li>
            <li>• <strong>蹲下陪玩：</strong>膝盖压力</li>
            <li>• <strong>追着跑：</strong>膝盖和脚踝冲击</li>
            <li>• <strong>抱起放下：</strong>腰部扭转风险</li>
            <li>• <strong>推婴儿车：</strong>手腕和肩膀疲劳</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">安全抱孩子的技巧</h3>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">正确的抱姿：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>蹲下到孩子的高度，而不是弯腰</li>
            <li>让孩子靠近您的身体</li>
            <li>用腿部力量站起来</li>
            <li>孩子的重量分散在两只手臂</li>
            <li>避免用单手抱太久</li>
            <li>定时换手或放下休息</li>
          </ol>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">放下孩子时：</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>蹲下而不是弯腰</li>
            <li>保持背部直立</li>
            <li>慢慢放下，不要突然</li>
            <li>站起来时用腿部发力</li>
          </ol>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">陪玩时的关节保护</h3>

        <h4 className="font-semibold mt-4 mb-2">地面活动：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>使用坐垫或瑜伽垫</li>
          <li>选择坐着而不是蹲着</li>
          <li>定时站起来活动</li>
          <li>让孩子到您的高度来，而不是您蹲下去</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">户外活动：</h4>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>选择平坦的场地</li>
          <li>穿着有支撑的鞋子</li>
          <li>让孩子跑，您慢走跟着</li>
          <li>使用推车代替长时间抱</li>
          <li>找有椅子的地方休息</li>
        </ul>

        <h3 className="font-bold mt-6 mb-2 text-xl">照顾孙子前后的护理</h3>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">开始前：</h4>
          <ul className="text-sm space-y-1">
            <li>• 在容易疲劳的关节喷上没药喷雾</li>
            <li>• 做5分钟简单伸展</li>
            <li>• 准备好坐垫、护膝等辅助工具</li>
            <li>• 确保穿着舒适的鞋子</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">结束后：</h4>
          <ul className="text-sm space-y-1">
            <li>• 在酸痛部位使用没药喷雾</li>
            <li>• 做放松拉伸</li>
            <li>• 如果可能，热水泡脚</li>
            <li>• 好好休息</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">适合祖孙一起做的温和活动</h3>
        <p>选择对关节友好的活动，让您和孙子都能享受：</p>

        <div className="bg-orange-50 p-6 rounded-lg mt-4">
          <h4 className="font-bold text-lg mb-3">推荐活动：</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>阅读故事：</strong>坐着进行，对关节没有压力</li>
            <li>• <strong>拼图和积木：</strong>在桌子上进行，不用蹲下</li>
            <li>• <strong>画画和手工：</strong>坐着创作，锻炼手指灵活性</li>
            <li>• <strong>唱歌和音乐：</strong>坐着进行，愉悦心情</li>
            <li>• <strong>散步：</strong>让孩子走或坐推车，您悠闲地走</li>
            <li>• <strong>园艺：</strong>使用升高的花盆，避免弯腰</li>
          </ul>
        </div>

        <h3 className="font-bold mt-6 mb-2 text-xl">与家人沟通</h3>
        <p>照顾孙子是全家人的事，不要一个人扛：</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
          <li>告诉子女您的身体状况和限制</li>
          <li>商量合理的照顾时间和强度</li>
          <li>请求帮助做重体力活动</li>
          <li>保留自己休息和运动的时间</li>
          <li>必要时聘请帮手分担</li>
        </ul>

        <p className="mt-8 font-semibold text-lg">
          照顾孙子是幸福的天伦之乐，但不应该以牺牲自己的健康为代价。通过正确的姿势、适当的护理和合理的安排，您可以在享受与孙子共处时光的同时，保护好自己的关节。记住，只有自己健康，才能更长久地陪伴孙子成长。
        </p>
      </>
    ),
  },
]
