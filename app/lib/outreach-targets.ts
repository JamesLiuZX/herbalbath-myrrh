// Outreach target list and scripts.
//
// This is the part that cannot be automated — but it CAN be pre-researched,
// so the work left is dialling and turning up rather than figuring out who to
// dial. Deliberately structured as data so you can render it, export it to a
// sheet, or drive a merge from it.
//
// ⚠️ ORGANISATION NAMES ARE RESEARCHED; CONTACT DETAILS ARE NOT INCLUDED.
// Phone numbers and named contacts go stale fast and a wrong number wastes a
// first impression, so look each up on the org's own site before reaching
// out. Outlet counts are approximate and drift — treat them as sizing, not
// fact, and never quote them back to the organisation itself.

export type OutreachChannel =
  | "aac-operator"
  | "tcm-chain"
  | "clan-association"
  | "media"
  | "tour-operator"

export interface OutreachTarget {
  name: string
  nameZh?: string
  channel: OutreachChannel
  /** Why this specific door, in one line. */
  angle: string
  /** Rough scale — how many end-points one conversation reaches. */
  reach?: string
  website?: string
}

export const OUTREACH_TARGETS: OutreachTarget[] = [
  // ─── Active Ageing Centre operators ──────────────────────────────────
  // There are 230+ AACs islandwide but only a handful of operators. Going
  // to the operator HQ turns 230 conversations into about ten. Note these
  // are AIC-funded social service agencies: they will not let you sell on
  // site. The realistic ask is a sponsored health talk or workshop, with
  // product in the goodie bag and your WhatsApp number on a Chinese card.
  {
    name: "NTUC Health",
    channel: "aac-operator",
    angle: "Largest single AAC operator. One HQ conversation covers ~27 centres.",
    reach: "~27 centres",
    website: "https://ntuchealth.sg",
  },
  {
    name: "Lions Befrienders",
    channel: "aac-operator",
    angle: "~10,000 beneficiaries across AACs and eldercare programmes.",
    website: "https://www.lionsbefrienders.org.sg",
  },
  {
    name: "Fei Yue Community Services",
    nameZh: "飞跃社区服务",
    channel: "aac-operator",
    angle: "Strongly Mandarin-speaking senior base — matches your product language.",
    website: "https://fycs.org",
  },
  {
    name: "Care Corner Singapore",
    channel: "aac-operator",
    angle: "Large Mandarin-speaking service base, multiple AACs.",
    website: "https://www.carecorner.org.sg",
  },
  {
    name: "TOUCH Community Services",
    channel: "aac-operator",
    angle: "Runs TOUCH Seniors Activity Centres; open to health-education partnerships.",
    website: "https://www.touch.org.sg",
  },
  {
    name: "Thye Hua Kwan Moral Charities",
    channel: "aac-operator",
    angle: "Chinese-heritage charity with senior services and TCM-friendly framing.",
    website: "https://www.thkmc.org.sg",
  },
  {
    name: "Montfort Care (GoodLife!)",
    channel: "aac-operator",
    angle: "GoodLife! centres run active, mobile senior programming — good talk audience.",
    website: "https://www.montfortcare.org.sg",
  },
  {
    name: "Kwong Wai Shiu Hospital",
    nameZh: "广惠肇留医院",
    channel: "aac-operator",
    angle: "Runs both TCM services and community senior care — rare combined fit.",
    website: "https://www.kwsh.org.sg",
  },
  {
    name: "Brahm Centre",
    channel: "aac-operator",
    angle: "Multiple AACs with an established health-talk programme format.",
    website: "https://www.brahmcentre.com",
  },
  {
    name: "Methodist Welfare Services",
    channel: "aac-operator",
    angle: "Senior services plus a route into Mandarin church senior fellowships.",
    website: "https://mws.sg",
  },

  // ─── TCM chains and medical halls ────────────────────────────────────
  // Highest-conversion channel: the practitioner has hands on the exact
  // body part, and already sells medicated oils at the counter. Chains
  // first for leverage, then independents street by street.
  {
    name: "Ma Kuang TCM",
    nameZh: "马光中医",
    channel: "tcm-chain",
    angle: "30+ clinics. One buyer decision covers the whole chain.",
    reach: "30+ clinics",
    website: "https://makuang.com.sg",
  },
  {
    name: "Hockhua Tonic",
    nameZh: "福华",
    channel: "tcm-chain",
    angle: "~60 retail outlets, senior-skewed footfall, already sells TCM topicals.",
    reach: "~60 outlets",
    website: "https://hockhuatonic.com",
  },
  {
    name: "Eu Yan Sang",
    nameZh: "余仁生",
    channel: "tcm-chain",
    angle: "Highest credibility, slowest process. Pitch after you have velocity data.",
    website: "https://www.euyansang.com.sg",
  },
  {
    name: "Thye Shan Medical Hall",
    nameZh: "泰山药行",
    channel: "tcm-chain",
    angle: "Established multi-outlet medical hall, classic liniment buyer.",
    website: "https://thyeshan.com",
  },
  {
    name: "Singapore Chinese Medical Institution",
    nameZh: "中华医院",
    channel: "tcm-chain",
    angle: "High-volume charitable TCM clinics; enormous senior patient flow.",
  },
  {
    name: "Thong Chai Medical Institution",
    nameZh: "同济医院",
    channel: "tcm-chain",
    angle: "Free-clinic network treating large numbers of elderly pain patients daily.",
  },

  // ─── Clan associations ───────────────────────────────────────────────
  // Membership skews heavily 60+ and Mandarin/dialect-speaking. The play is
  // goodie-bag sponsorship at 敬老 dinners and CNY events — cheaper than any
  // ad, perfectly targeted, and it arrives carrying the association's
  // implicit endorsement. Decision-makers move fast; no procurement cycle.
  {
    name: "Singapore Federation of Chinese Clan Associations",
    nameZh: "新加坡宗乡会馆联合总会",
    channel: "clan-association",
    angle: "Umbrella body for 200+ member associations. Start here for warm intros.",
    reach: "200+ associations",
    website: "https://sfcca.sg",
  },
  {
    name: "Singapore Hokkien Huay Kuan",
    nameZh: "新加坡福建会馆",
    channel: "clan-association",
    angle: "Largest clan association; runs major 敬老 and festive events.",
    website: "https://www.shhk.com.sg",
  },
  {
    name: "Teochew Poit Ip Huay Kuan",
    nameZh: "潮州八邑会馆",
    channel: "clan-association",
    angle: "Large, active senior membership with regular welfare distributions.",
    website: "https://teochew.org.sg",
  },
  {
    name: "Kwangtung Hui Kuan",
    nameZh: "广东会馆",
    channel: "clan-association",
    angle: "Cantonese-speaking senior base; strong TCM cultural affinity.",
  },
  {
    name: "Singapore Hainan Hwee Kuan",
    nameZh: "新加坡海南会馆",
    channel: "clan-association",
    angle: "Active senior welfare committee, regular member events.",
  },

  // ─── Chinese-language media ──────────────────────────────────────────
  // The clipping is the asset, not the reach. A feature becomes laminated
  // collateral for every clinic visit, a packaging insert, and the single
  // most-forwarded image in aunty WhatsApp groups. Pitch a story about a
  // person, never a product.
  {
    name: "Shin Min Daily News",
    nameZh: "新明日报",
    channel: "media",
    angle: "Only Chinese evening daily. Heartland, older, livelihood-story format.",
    reach: "~130k circulation",
  },
  {
    name: "Lianhe Zaobao",
    nameZh: "联合早报",
    channel: "media",
    angle: "Larger and more affluent. Pitch the lifestyle/health desk, in Chinese.",
  },
  {
    name: "8world (8视界)",
    nameZh: "8视界",
    channel: "media",
    angle: "Lowest bar to entry. Land here first — print desks pick up what performs.",
  },
  {
    name: "Capital 958",
    nameZh: "958城市频道",
    channel: "media",
    angle: "Mandarin 45-65+. Ask for a host live-read (口播), not a spot ad.",
  },
  {
    name: "Love 972",
    nameZh: "972好聽",
    channel: "media",
    angle: "Slightly older, nostalgic programming. Strongest senior fit of any station.",
  },

  // ─── Senior tour operators ───────────────────────────────────────────
  // Mandarin-speaking 60+ on multi-day coach tours, where joint pain is a
  // universal and acute problem. Day-1 goodie bag, tour leader carries
  // testers.
  {
    name: "CTC Travel",
    nameZh: "职总旅游",
    channel: "tour-operator",
    angle: "Heavily China-tour focused with an older Mandarin-speaking passenger base.",
    website: "https://www.ctc.com.sg",
  },
  {
    name: "Chan Brothers Travel",
    nameZh: "陈氏旅游",
    channel: "tour-operator",
    angle: "Largest operator; runs dedicated senior and slow-paced tour lines.",
    website: "https://www.chanbrothers.com",
  },
]

export interface OutreachScript {
  channel: OutreachChannel
  titleZh: string
  /** The opening message. Short on purpose — long pitches don't get read. */
  bodyZh: string
  /** What you are actually asking for. One ask per message. */
  askZh: string
}

// One ask per message. The most common failure in cold outreach here is
// asking for the sale in message one; every script below asks only for the
// next small step.
export const OUTREACH_SCRIPTS: OutreachScript[] = [
  {
    channel: "tcm-chain",
    titleZh: "中医诊所 / 中药店 — 首次接触",
    bodyZh: [
      "您好，我是草药浴 HerbalBath 的负责人。",
      "我们做的是没药和乳香配方的外用喷雾，主要客群是本地乐龄人士的膝盖、肩颈和腰背酸痛。",
      "在新加坡已经卖了 8 年，目前在 Shopee 和 WhatsApp 直销。",
      "想请问贵店有没有兴趣了解同业批发价？",
    ].join("\n"),
    askZh: "我可以送几支免费试用装过去，您和同事先试用看看，不需要先下单。",
  },
  {
    channel: "aac-operator",
    titleZh: "乐龄活动中心营运机构 — 赞助健康讲座",
    bodyZh: [
      "您好，我是草药浴 HerbalBath 的负责人。",
      "我们想赞助一场面向乐龄人士的「关节与肩颈保养」讲座，由注册中医师主讲，内容以日常保健知识为主。",
      "费用由我们承担，贵机构不需要出讲师或场地费用。",
    ].join("\n"),
    askZh: "想请问贵机构有没有适合的中心可以合作，或该联络哪位同事洽谈？",
  },
  {
    channel: "clan-association",
    titleZh: "宗乡会馆 — 敬老活动赞助",
    bodyZh: [
      "您好，我是本地品牌草药浴 HerbalBath 的负责人。",
      "我们生产没药乳香外用喷雾，客群以乐龄人士为主。",
      "想请问贵会馆今年的敬老宴或新春活动，是否接受实物赞助？",
      "我们可以提供产品作为会员礼包的一部分。",
    ].join("\n"),
    askZh: "想了解贵会馆活动的日期和参加人数，我们再看可以赞助多少份。",
  },
  {
    channel: "media",
    titleZh: "华文媒体 — 人物故事线",
    bodyZh: [
      "您好，我是草药浴 HerbalBath 的创办人。",
      "想向贵报推荐一个本地小生意的故事：",
      "我是国大电脑系毕业，白天写程序，晚上和家人一起包装没药喷雾，做了 8 年，卖出超过一万五千支。",
      "客户多数是六七十岁的长辈，很多是靠口耳相传找上门的。",
    ].join("\n"),
    askZh: "如果贵报有兴趣，我可以提供照片和几位长期顾客的联络（已获他们同意）。",
  },
  {
    channel: "tour-operator",
    titleZh: "旅行社 — 乐龄团礼包",
    bodyZh: [
      "您好，我是草药浴 HerbalBath 的负责人。",
      "我们的产品是外用舒缓喷雾，主要用在膝盖、肩颈和腰背。",
      "注意到贵公司有不少乐龄团和长程巴士行程，长辈在旅途中最常反映的就是关节和腰腿不舒服。",
    ].join("\n"),
    askZh: "想请问贵公司的团体礼包是否接受赞助？我们可以先提供一团的份量试看看。",
  },
]

export function targetsByChannel(channel: OutreachChannel): OutreachTarget[] {
  return OUTREACH_TARGETS.filter((t) => t.channel === channel)
}

export function scriptFor(channel: OutreachChannel): OutreachScript | undefined {
  return OUTREACH_SCRIPTS.find((s) => s.channel === channel)
}
