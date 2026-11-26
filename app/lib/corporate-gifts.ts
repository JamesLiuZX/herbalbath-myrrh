// Copy for /gifts/corporate. Claim-free by rule: this page talks about a gift,
// never about the body, and shows no prices or discount tiers (a quote is given
// on request). app/lib/corporate-gifts.test.mjs holds every string here to the
// promotion-copy rules, the strictest the site has. Facts come from
// ops/knowledge/product.md; if it is not there, it is not here.

export const CORPORATE_GIFTS = {
  zh: {
    title: "企业与团体送礼",
    lead: "农历新年、年终答谢、乐龄活动：为长辈准备一份新加坡品牌的礼物。",
    productHeading: "礼物是什么",
    product: [
      "HerbalBath 没药草本能量油，55毫升，红金礼盒包装。",
      "以没药、乳香等多达15味中草药调制，100%天然成分。",
      "新加坡品牌，新加坡全岛包邮。",
    ],
    stepsHeading: "怎么订",
    steps: ["告诉我们数量，和希望收到的日期。", "我们回复报价，和可以安排的送货时间。", "确认后用PayNow付款，我们安排送货。"],
    askHeading: "索取报价",
    ask: "用WhatsApp或电邮联系我们，写上公司名称、数量和日期。我们按数量报价。",
    whatsapp: "WhatsApp 询问报价",
    email: "电邮询问报价",
    whatsappText: "您好，我想了解 HerbalBath 企业送礼的报价。公司：　数量：　希望收到的日期：",
  },
  en: {
    title: "Corporate and group gifting",
    lead: "Chinese New Year, year-end thank-yous, seniors' events: a Singapore-brand present for parents and elders.",
    productHeading: "What the present is",
    product: [
      "HerbalBath Myrrh Herbal Energy Oil, 55 ml, in a red-and-gold box.",
      "Made with myrrh, frankincense and up to 15 Chinese herbs, with 100% natural ingredients.",
      "A Singapore brand, with island-wide delivery included.",
    ],
    stepsHeading: "How to order",
    steps: ["Tell us the quantity and the date you need it by.", "We reply with a quote and the delivery times we can arrange.", "Once you confirm, pay by PayNow and we arrange delivery."],
    askHeading: "Ask for a quote",
    ask: "Message us on WhatsApp or by email with your company name, the quantity and the date. Quotes depend on quantity.",
    whatsapp: "Ask on WhatsApp",
    email: "Ask by email",
    whatsappText: "Hello, I would like a quote for HerbalBath corporate gifting. Company:  Quantity:  Date needed:",
  },
} as const

export const CORPORATE_EMAIL = "hello@herbalbathsg.com"
