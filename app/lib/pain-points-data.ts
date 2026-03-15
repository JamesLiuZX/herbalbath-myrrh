export interface PainPoint {
  slug: string
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  keywords: string[]
  contentZh: string
  contentEn: string
  relatedBlogSlugs: string[]
  lastUpdated: string
  seasonalRelevance?: string[]
}

// Initial pain points data - will be updated by CRON job
export const painPointsData: PainPoint[] = [
  {
    slug: 'knee-pain',
    titleZh: '膝盖疼痛',
    titleEn: 'Knee Pain Relief in Singapore',
    descriptionZh: '新加坡乐龄人士膝盖疼痛的天然解决方案。了解如何通过天然草药和生活方式改善膝盖健康。',
    descriptionEn: 'Natural solutions for knee pain relief for seniors in Singapore. Learn how herbal remedies and lifestyle changes can improve knee health.',
    keywords: ['膝盖疼痛', 'knee pain singapore', 'herbalbath', 'herbal bath singapore', '膝关节炎', 'knee arthritis treatment'],
    contentZh: `
## 为什么新加坡乐龄人士常见膝盖疼痛？

新加坡潮湿炎热的气候，加上HDB组屋的楼梯爬行，让许多55岁以上的乐龄人士深受膝盖疼痛困扰。

### 常见原因：
- **组屋楼梯** - 每天上下楼梯对膝盖造成压力
- **潮湿气候** - 高湿度可能加重关节不适
- **年龄因素** - 软骨自然磨损
- **体重负担** - 额外体重增加膝盖压力

### 天然缓解方法：

1. **没药喷雾** - HerbalBath没药喷雾采用古老的没药和乳香配方，10秒见效，深层渗透关节
2. **热敷疗法** - 每天15-20分钟温热敷
3. **低冲击运动** - 游泳、水中健走
4. **抗炎饮食** - 多吃三文鱼、姜黄、绿叶蔬菜

### 为什么选择HerbalBath？

15,000+新加坡用户信赖，8年品质保证。我们的没药喷雾：
- 100%天然成分
- 无副作用
- 10秒快速见效
- 深层渗透疼痛根源
    `,
    contentEn: `
## Why Do Singapore Seniors Often Experience Knee Pain?

Singapore's humid climate, combined with climbing HDB stairwells, causes many seniors aged 55+ to suffer from knee pain.

### Common Causes:
- **HDB Staircases** - Daily stair climbing puts pressure on knees
- **Humid Climate** - High humidity may worsen joint discomfort
- **Age Factors** - Natural cartilage wear
- **Weight Burden** - Extra weight increases knee stress

### Natural Relief Methods:

1. **Myrrh Spray** - HerbalBath Myrrh Spray uses ancient myrrh and frankincense formula, works in 10 seconds, penetrates deep into joints
2. **Heat Therapy** - 15-20 minutes of warm compress daily
3. **Low-Impact Exercise** - Swimming, water aerobics
4. **Anti-Inflammatory Diet** - Eat more salmon, turmeric, leafy greens

### Why Choose HerbalBath?

Trusted by 15,000+ Singapore users, 8 years of quality assurance. Our Myrrh Spray:
- 100% natural ingredients
- No side effects
- Works in 10 seconds
- Penetrates deep to pain source
    `,
    relatedBlogSlugs: ['knee-pain-relief-singapore', 'anti-inflammatory-diet-guide', 'gentle-exercises-for-seniors'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year', 'monsoon'],
  },
  {
    slug: 'back-pain',
    titleZh: '腰酸背痛',
    titleEn: 'Back Pain Relief for Singapore Seniors',
    descriptionZh: '新加坡乐龄人士腰背疼痛的有效缓解方案。天然草药疗法帮助您重获舒适生活。',
    descriptionEn: 'Effective back pain relief solutions for Singapore seniors. Natural herbal remedies help you regain comfortable living.',
    keywords: ['腰酸背痛', 'back pain singapore', 'lower back pain elderly', 'herbalbath sg', 'herbal bath', '腰痛'],
    contentZh: `
## 新加坡乐龄人士的腰背疼痛问题

腰酸背痛是新加坡55岁以上人群最常见的健康问题之一。长期的不良姿势、缺乏运动和年龄增长都会导致腰背不适。

### 常见症状：
- 早晨起床时腰部僵硬
- 久坐后难以站直
- 弯腰时疼痛加剧
- 疼痛放射到臀部或腿部

### HerbalBath天然解决方案：

我们的没药喷雾特别适合腰背疼痛：
- **深层渗透** - 活性成分直达肌肉深层
- **温和发热** - 促进血液循环
- **持久舒缓** - 效果可持续数小时

### 日常保养建议：

1. 保持正确坐姿和站姿
2. 每小时起身活动5分钟
3. 睡前使用没药喷雾
4. 适度进行核心肌群训练
    `,
    contentEn: `
## Back Pain Issues for Singapore Seniors

Lower back pain is one of the most common health issues among Singapore residents aged 55+. Poor posture, lack of exercise, and aging all contribute to back discomfort.

### Common Symptoms:
- Morning stiffness in lower back
- Difficulty standing straight after sitting
- Pain worsens when bending
- Pain radiating to buttocks or legs

### HerbalBath Natural Solution:

Our Myrrh Spray is specially effective for back pain:
- **Deep Penetration** - Active ingredients reach deep muscle layers
- **Gentle Warming** - Promotes blood circulation
- **Long-lasting Relief** - Effects last for hours

### Daily Care Tips:

1. Maintain correct sitting and standing posture
2. Get up and move every hour for 5 minutes
3. Use Myrrh Spray before bed
4. Do moderate core strengthening exercises
    `,
    relatedBlogSlugs: ['office-neck-shoulder-pain', 'improve-blood-circulation-naturally', 'better-sleep-with-chronic-pain'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year'],
  },
  {
    slug: 'joint-arthritis',
    titleZh: '风湿关节炎',
    titleEn: 'Rheumatism & Joint Arthritis Relief Singapore',
    descriptionZh: '风湿关节炎困扰着许多新加坡乐龄人士。了解天然草药如何帮助缓解风湿痛。',
    descriptionEn: 'Rheumatism and joint arthritis affect many Singapore seniors. Learn how natural herbs can help relieve rheumatic pain.',
    keywords: ['风湿关节炎', 'rheumatism singapore', 'joint arthritis', 'herbalbath', '关节炎', 'arthritis treatment natural'],
    contentZh: `
## 新加坡季风季节的风湿关节炎

新加坡的雨季（11月至1月）是风湿关节炎患者最难熬的时期。气压变化和湿度增加往往会加重关节疼痛。

### 季风季节的挑战：
- 气压下降引发关节肿胀
- 高湿度加重僵硬感
- 温度波动影响血液循环
- 室内外温差（空调）造成不适

### HerbalBath的季节性解决方案：

没药和乳香自古以来就是风湿病的天然克星。我们的配方：
- 采用圣经时代的古老智慧
- 结合现代提取技术
- 针对新加坡气候特别优化

### 雨季保养指南：

1. **早晚使用** - 每天早晚各喷一次没药喷雾
2. **保持温暖** - 避免空调直吹关节
3. **适度活动** - 不要因为疼痛就完全不动
4. **抗炎饮食** - 多吃姜、蒜、姜黄
    `,
    contentEn: `
## Rheumatism During Singapore's Monsoon Season

Singapore's rainy season (November to January) is the toughest period for rheumatism sufferers. Pressure changes and increased humidity often worsen joint pain.

### Monsoon Season Challenges:
- Dropping air pressure causes joint swelling
- High humidity increases stiffness
- Temperature fluctuations affect blood circulation
- Indoor-outdoor temperature differences (AC) cause discomfort

### HerbalBath's Seasonal Solution:

Myrrh and frankincense have been natural enemies of rheumatism since ancient times. Our formula:
- Uses ancient wisdom from biblical times
- Combined with modern extraction technology
- Specially optimized for Singapore's climate

### Rainy Season Care Guide:

1. **Morning & Evening Use** - Apply Myrrh Spray twice daily
2. **Stay Warm** - Avoid AC blowing directly on joints
3. **Stay Active** - Don't stop moving because of pain
4. **Anti-Inflammatory Diet** - Eat more ginger, garlic, turmeric
    `,
    relatedBlogSlugs: ['tcm-vs-western-pain-relief', 'myrrh-frankincense-miracle-herbs', 'anti-inflammatory-diet-guide'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['monsoon', 'rainy-season'],
  },
  {
    slug: 'numbness-tingling',
    titleZh: '手脚麻痹',
    titleEn: 'Hand & Foot Numbness Relief Singapore',
    descriptionZh: '手脚麻痹影响日常生活质量。了解如何通过天然方法改善血液循环，缓解麻痹症状。',
    descriptionEn: 'Numbness in hands and feet affects quality of life. Learn how to improve blood circulation naturally and relieve numbness symptoms.',
    keywords: ['手脚麻痹', 'numbness hands feet', 'poor circulation singapore', 'herbalbath', '血液循环', 'tingling elderly'],
    contentZh: `
## 为什么乐龄人士容易手脚麻痹？

手脚麻痹是血液循环不良的常见信号。在新加坡，长时间待在空调房、缺乏运动、以及糖尿病等因素都可能导致这一问题。

### 常见原因：
- 长期空调环境导致血管收缩
- 糖尿病引起的神经病变
- 脊椎问题压迫神经
- 缺乏运动导致循环不畅

### HerbalBath促进循环配方：

没药喷雾中的活性成分能够：
- 温和扩张血管
- 促进局部血液循环
- 为神经提供营养
- 缓解麻痹不适感

### 改善建议：

1. **定期按摩** - 配合没药喷雾按摩手脚
2. **温水泡脚** - 每晚睡前泡脚15分钟
3. **活动四肢** - 每小时活动手脚5分钟
4. **避免久坐** - 定期起身走动
    `,
    contentEn: `
## Why Do Seniors Often Experience Numbness in Hands and Feet?

Numbness in hands and feet is a common sign of poor blood circulation. In Singapore, long hours in air-conditioning, lack of exercise, and conditions like diabetes can all contribute to this problem.

### Common Causes:
- Long-term AC exposure causes blood vessel constriction
- Diabetic neuropathy
- Spinal issues compressing nerves
- Lack of exercise leading to poor circulation

### HerbalBath Circulation-Boosting Formula:

Active ingredients in our Myrrh Spray can:
- Gently dilate blood vessels
- Promote local blood circulation
- Provide nutrients to nerves
- Relieve numbness discomfort

### Improvement Tips:

1. **Regular Massage** - Massage hands and feet with Myrrh Spray
2. **Warm Foot Soaks** - Soak feet for 15 minutes before bed
3. **Move Your Limbs** - Move hands and feet for 5 minutes every hour
4. **Avoid Prolonged Sitting** - Get up and walk regularly
    `,
    relatedBlogSlugs: ['improve-blood-circulation-naturally', 'gentle-exercises-for-seniors'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year'],
  },
  {
    slug: 'neck-shoulder-stiffness',
    titleZh: '肩颈僵硬',
    titleEn: 'Neck & Shoulder Stiffness Relief Singapore',
    descriptionZh: '空调和不良姿势导致的肩颈僵硬困扰着许多新加坡人。了解天然缓解方法。',
    descriptionEn: 'AC exposure and poor posture cause neck and shoulder stiffness for many Singaporeans. Learn natural relief methods.',
    keywords: ['肩颈僵硬', 'neck pain singapore', 'shoulder stiffness', 'herbalbath sg', '落枕', 'stiff neck elderly'],
    contentZh: `
## 新加坡空调文化与肩颈问题

新加坡被称为"空调之国"。无论是办公室、商场还是公交车，空调几乎无处不在。长期暴露在空调环境下，加上使用手机和电脑的不良姿势，让肩颈问题成为新加坡人的通病。

### 为什么空调会导致肩颈僵硬？
- 冷气直吹导致肌肉紧张
- 室内外温差大，血管频繁收缩扩张
- 冷环境下身体不自觉缩紧
- 血液循环受影响

### HerbalBath温热疗法：

没药喷雾的温热感能有效对抗空调伤害：
- 快速温暖僵硬的肩颈
- 放松紧张的肌肉
- 促进血液循环
- 缓解疼痛和不适

### 日常预防：

1. **避免冷气直吹** - 调整座位或使用围巾
2. **定时活动** - 每小时转动颈部和耸肩
3. **正确姿势** - 屏幕与视线平行
4. **睡前护理** - 使用没药喷雾按摩肩颈
    `,
    contentEn: `
## Singapore's AC Culture and Neck Problems

Singapore is known as the "Air-Conditioning Nation." Whether in offices, malls, or public transport, AC is everywhere. Long-term exposure to air-conditioning, combined with poor posture from phone and computer use, makes neck and shoulder problems common among Singaporeans.

### Why Does AC Cause Neck and Shoulder Stiffness?
- Cold air directly hitting muscles causes tension
- Large indoor-outdoor temperature differences cause frequent blood vessel changes
- Body unconsciously tightens in cold environments
- Blood circulation is affected

### HerbalBath Warming Therapy:

The warming sensation of Myrrh Spray effectively counters AC damage:
- Quickly warms stiff neck and shoulders
- Relaxes tense muscles
- Promotes blood circulation
- Relieves pain and discomfort

### Daily Prevention:

1. **Avoid Direct AC** - Adjust seating or use a scarf
2. **Regular Movement** - Rotate neck and shrug shoulders every hour
3. **Correct Posture** - Keep screen at eye level
4. **Bedtime Care** - Use Myrrh Spray to massage neck and shoulders
    `,
    relatedBlogSlugs: ['office-neck-shoulder-pain', 'improve-blood-circulation-naturally'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year'],
  },
  {
    slug: 'sleep-difficulties',
    titleZh: '睡眠困难',
    titleEn: 'Sleep Difficulties with Chronic Pain Singapore',
    descriptionZh: '慢性疼痛导致的睡眠问题严重影响生活质量。了解如何打破疼痛与失眠的恶性循环。',
    descriptionEn: 'Sleep problems caused by chronic pain severely affect quality of life. Learn how to break the vicious cycle of pain and insomnia.',
    keywords: ['睡眠困难', 'sleep problems elderly', 'chronic pain insomnia', 'herbalbath', '失眠', 'pain relief sleep'],
    contentZh: `
## 疼痛与失眠的恶性循环

对于许多患有慢性疼痛的乐龄人士来说，夜晚往往是最难熬的时刻。疼痛让人难以入睡，而睡眠不足又会降低疼痛阈值，形成恶性循环。

### 疼痛如何影响睡眠？
- 疼痛引发焦虑和紧张
- 难以找到舒适的睡姿
- 夜间疼痛加剧频繁醒来
- 缺乏深度睡眠影响恢复

### HerbalBath睡前仪式：

建立一个包含没药喷雾的睡前放松仪式：

**睡前30分钟：**
1. 温水泡脚或温水浴
2. 在疼痛部位喷上没药喷雾
3. 轻柔按摩直到吸收
4. 进行深呼吸放松

### 改善睡眠的建议：

1. **固定作息** - 每天同一时间睡觉和起床
2. **温暖环境** - 保持卧室温度适宜（22-25°C）
3. **减少蓝光** - 睡前1小时不看手机
4. **放松心情** - 听舒缓音乐或冥想
    `,
    contentEn: `
## The Vicious Cycle of Pain and Insomnia

For many seniors with chronic pain, nighttime is often the hardest. Pain makes it difficult to fall asleep, while sleep deprivation lowers pain threshold, creating a vicious cycle.

### How Does Pain Affect Sleep?
- Pain triggers anxiety and tension
- Difficulty finding comfortable sleeping position
- Nighttime pain worsening causes frequent waking
- Lack of deep sleep affects recovery

### HerbalBath Bedtime Ritual:

Establish a bedtime relaxation ritual including Myrrh Spray:

**30 Minutes Before Bed:**
1. Warm foot soak or warm bath
2. Apply Myrrh Spray on painful areas
3. Gently massage until absorbed
4. Practice deep breathing relaxation

### Tips for Better Sleep:

1. **Fixed Schedule** - Sleep and wake at the same time daily
2. **Warm Environment** - Keep bedroom temperature comfortable (22-25°C)
3. **Reduce Blue Light** - No phone for 1 hour before bed
4. **Relax Mind** - Listen to soothing music or meditate
    `,
    relatedBlogSlugs: ['better-sleep-with-chronic-pain', 'improve-blood-circulation-naturally'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year'],
  },
  {
    slug: 'morning-stiffness',
    titleZh: '晨起僵硬',
    titleEn: 'Morning Stiffness Relief for Seniors Singapore',
    descriptionZh: '早晨起床时关节僵硬是许多乐龄人士的困扰。了解如何缓解晨僵，开启活力一天。',
    descriptionEn: 'Morning joint stiffness troubles many seniors. Learn how to relieve morning stiffness and start your day with energy.',
    keywords: ['晨起僵硬', 'morning stiffness elderly', 'joint stiffness morning', 'herbalbath singapore', '关节僵硬', 'wake up stiff'],
    contentZh: `
## 为什么早晨关节特别僵硬？

许多乐龄人士都有这样的经历：早晨醒来时，关节僵硬得像生了锈。这种"晨僵"现象通常需要30分钟到几小时才能缓解。

### 晨僵的原因：
- 夜间关节液减少
- 长时间不活动导致僵硬
- 夜间炎症因子累积
- 血液循环减慢

### HerbalBath晨间唤醒法：

**起床前5分钟：**
1. 在床上轻轻活动手脚
2. 坐起后喷上没药喷雾
3. 轻柔按摩僵硬的关节
4. 慢慢站起，逐渐活动

### 预防晨僵的建议：

1. **睡前护理** - 睡前使用没药喷雾
2. **保持温暖** - 使用舒适的被褥
3. **床边放置喷雾** - 方便早晨即时使用
4. **晨间拉伸** - 简单的床上拉伸运动
    `,
    contentEn: `
## Why Are Joints Especially Stiff in the Morning?

Many seniors share this experience: waking up with joints feeling rusty. This "morning stiffness" typically takes 30 minutes to several hours to ease.

### Causes of Morning Stiffness:
- Reduced joint fluid during night
- Prolonged inactivity causes stiffness
- Overnight accumulation of inflammatory factors
- Slowed blood circulation

### HerbalBath Morning Wake-Up Method:

**5 Minutes Before Getting Up:**
1. Gently move hands and feet while in bed
2. After sitting up, apply Myrrh Spray
3. Gently massage stiff joints
4. Slowly stand up, gradually move around

### Tips to Prevent Morning Stiffness:

1. **Bedtime Care** - Use Myrrh Spray before sleep
2. **Stay Warm** - Use comfortable bedding
3. **Keep Spray Bedside** - Easy access for morning use
4. **Morning Stretches** - Simple stretching exercises in bed
    `,
    relatedBlogSlugs: ['gentle-exercises-for-seniors', 'better-sleep-with-chronic-pain'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['all-year'],
  },
  {
    slug: 'weather-related-pain',
    titleZh: '天气变化疼痛',
    titleEn: 'Weather-Related Joint Pain Singapore',
    descriptionZh: '天气变化时关节疼痛加剧是许多人的共同经历。了解如何应对新加坡气候对关节的影响。',
    descriptionEn: 'Joint pain worsening with weather changes is a common experience. Learn how to cope with Singapore climate effects on joints.',
    keywords: ['天气变化疼痛', 'weather pain joints', 'barometric pressure pain', 'herbalbath sg', '气压疼痛', 'rainy season joint pain'],
    contentZh: `
## 新加坡气候与关节疼痛

"我的关节比天气预报还准！" 这是许多乐龄人士的真实写照。在新加坡，特别是在雨季和季风季节，天气变化引发的关节疼痛尤为明显。

### 为什么天气影响关节？
- **气压变化** - 低气压使关节囊膨胀
- **湿度增加** - 高湿度加重炎症
- **温度波动** - 影响血液循环
- **雨前感应** - 气压下降的早期信号

### 新加坡气候挑战：
- 全年高湿度（70-90%）
- 季风季节（11-1月，6-9月）
- 频繁的短时雷阵雨
- 室内外温差大

### HerbalBath应对策略：

在天气变化时：
1. **提前使用** - 感觉天气要变时就开始使用
2. **增加频率** - 雨季期间每天2-3次
3. **重点部位** - 着重喷在最敏感的关节
4. **配合保暖** - 避免关节受凉

### 季节性保养日历：

**雨季（11-1月）：** 每天早晚使用，重点保护膝盖和腰部
**热季（3-5月）：** 注意空调伤害，保护肩颈
**季风期（6-9月）：** 全身关节护理，预防风湿发作
    `,
    contentEn: `
## Singapore Climate and Joint Pain

"My joints are more accurate than the weather forecast!" This is the reality for many seniors. In Singapore, especially during rainy and monsoon seasons, weather-related joint pain is particularly noticeable.

### Why Does Weather Affect Joints?
- **Pressure Changes** - Low pressure causes joint capsule swelling
- **Increased Humidity** - High humidity worsens inflammation
- **Temperature Fluctuations** - Affects blood circulation
- **Pre-Rain Sensing** - Early signal of pressure drop

### Singapore Climate Challenges:
- Year-round high humidity (70-90%)
- Monsoon seasons (Nov-Jan, Jun-Sep)
- Frequent short thunderstorms
- Large indoor-outdoor temperature differences

### HerbalBath Coping Strategy:

During weather changes:
1. **Use Proactively** - Start using when you sense weather changing
2. **Increase Frequency** - 2-3 times daily during rainy season
3. **Target Areas** - Focus on most sensitive joints
4. **Keep Warm** - Protect joints from cold

### Seasonal Care Calendar:

**Rainy Season (Nov-Jan):** Use morning and evening, protect knees and lower back
**Hot Season (Mar-May):** Watch for AC damage, protect neck and shoulders
**Monsoon Period (Jun-Sep):** Full body joint care, prevent rheumatism flare-ups
    `,
    relatedBlogSlugs: ['myrrh-frankincense-miracle-herbs', 'tcm-vs-western-pain-relief', 'anti-inflammatory-diet-guide'],
    lastUpdated: new Date().toISOString(),
    seasonalRelevance: ['monsoon', 'rainy-season', 'all-year'],
  },
]

// Helper function to get pain point by slug
export function getPainPointBySlug(slug: string): PainPoint | undefined {
  return painPointsData.find((p) => p.slug === slug)
}

// Helper function to get all pain point slugs for static generation
export function getAllPainPointSlugs(): string[] {
  return painPointsData.map((p) => p.slug)
}

// Helper function to get seasonally relevant pain points
export function getSeasonalPainPoints(season: string): PainPoint[] {
  return painPointsData.filter(
    (p) => p.seasonalRelevance?.includes(season) || p.seasonalRelevance?.includes('all-year')
  )
}
