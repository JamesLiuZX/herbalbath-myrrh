# HerbalBath: what is true about the product

The single source of truth for every Autopilot agent (and for anyone writing about HerbalBath). Agents read this file at the start of every run. **If a fact isn't here, an agent doesn't state it.** Each fact says where it comes from; anything marked **unconfirmed** is never stated as fact in public copy.

Last reviewed: 17 Oct 2026. To change a fact, edit this file. Every agent follows it from its next run.

## The company

- **Brand:** HerbalBath; Chinese name **草本沐** (on the logo). Website herbalbathsg.com.
- **Company:** a Singapore-registered company (stated on the /pay page). Payments go to an Aspire business account via PayNow.
- **Contact:** WhatsApp / phone **8426 1225** (+65 8426 1225), email hello@herbalbathsg.com.
- **Where it's sold:** herbalbathsg.com/pay (PayNow, amount and reference filled in), WhatsApp orders, cash on delivery by arrangement, and Shopee ([listing](https://shopee.sg/Myrrh-Soreness-Muscle-Relief-Spray-Herbalbath-Singapore-i.177895131.41413960917)). The site also shows Carousell, TikTok Shop and Facebook logos: unconfirmed which of those are live stores.

## The product as sold now

From the current packaging (Shopee listing images, Oct 2026):

- **Name on the box:** **Myrrh Herbal Energy Oil**, Chinese **没药草本能量油**. 55 ml.
- **Look:** a red-and-gold box with a gold teardrop logo (草本沐 HERBAL BATH) and a photo of myrrh resin. Inside is an amber glass bottle with a tall gold cap and a gold-on-maroon label (MYRRH HERBAL ENERGY OIL, 没药草本能量油, 55ml).
- **Box text:** "SOOTHES: Muscle Strain · Joint Discomfort · Sore Knee & Heels · Lower Back Tension · Stiff Neck & Shoulder". That's packaging wording; our own copy doesn't repeat it as a claim (see Claims).
- **Ingredients we can name:** myrrh and frankincense (the site has always said so). The Shopee infographic says "up to 15 Chinese herbs, high concentration, synergistic formula". Safe to say: 多达15味中草药 / up to 15 Chinese herbs. The full ingredient list is **unconfirmed**; don't list other herbs by name.
- **Sensation:** a warm feeling within about 10 seconds (approved claim: 10秒感受温热). The Shopee listing calls it a strong heat sensation (热感强烈).
- **Made:** the ad creative carries a "Formulated in Singapore / Singapore brand" seal. Safe to say 新加坡品牌 / a Singapore brand.

Earlier versions you'll still see on the site and in old photos: "Myrrh Soreness Relief Spray" (60 ml spray bottle, old box with "Rapid Pain Relief" on the label), and a 58 ml bottle in the Shopee infographic.

### Unconfirmed: how it's applied

The website and the Shopee title call it a **spray** (没药喷雾), and the homepage teaches spraying from 5–10 cm. The new 55 ml bottle has a white fitment under the cap, which could be a roll-on, a dropper insert or a spray. The Shopee infographic says "只需每天几滴" (a few drops a day).

**Until James confirms, describe use without the mechanism:**
- 使用 / 涂抹在肩颈、腰背、膝盖, 用手掌轻轻按压约10秒, 每天2次
- in English: apply to the shoulders, back or knees, then press gently with your palm for about 10 seconds, twice a day

Never write 喷 / spray / roll / drops in new copy.

## Prices and offers

These come from `app/lib/growth-config.ts`, which is authoritative. If the two ever disagree, that file wins.

| | |
|---|---|
| One bottle | **S$39** (was S$49) |
| Buy 3 Get 1 Free (买3送1) | 4 bottles for **S$117** (S$29.25 a bottle) |
| Delivery | free, island-wide (新加坡全岛免费送货) |
| Guarantee | **30-day money-back guarantee** (30天不满意，全额退款) |
| How long a bottle lasts | 3–4 months at twice a day (approved claim: 一瓶可用3-4个月) |
| Paying | herbalbathsg.com/pay (PayNow QR) · WhatsApp 8426 1225 |

Reorder reminders go out on day 75, with a follow-up on day 105 (the reorder engine; needs Upstash connected).

## Claims: what we may and may not say

The hard rules are in `content/rules.json`; `scripts/content/lib.mjs` (`claimProblems`) enforces them on articles, posts and agent output.

- **Approved claims, word for word:** 10秒感受温热 · 一瓶可用3-4个月 · 100%天然成分 · 买3送1 · 30天不满意，全额退款 (English: warmth in 10 seconds · one bottle lasts 3-4 months · 100% natural ingredients · buy 3 get 1 free · 30-day money-back guarantee).
- **Never next to the product:** 缓解, 舒缓, 止痛, 消炎, 改善, 减轻, 治疗, 修复, 活血, 疗效, 见效, or relief, relieve, soothe(s), heal, treat, reduce pain, anti-inflammatory, works in. The product makes no therapeutic promise; it's warmth, tradition, ritual and a gift.
- **Never anywhere:** 无副作用, 根治, 治愈, 神奇, 奇效, 特效, 保证有效, 100%有效, 告别疼痛, 医生推荐, 临床证明, 使用前后, 第一品牌, 最有效, or no side effects, cure, miracle, guaranteed results, permanent relief, doctor recommended, clinically proven, before and after, number one, #1, most effective.
- **Also never:**
  - disease names next to the product (风湿, 关节炎, 痛风, arthritis, rheumatism, gout);
  - comparisons with named products (Tiger Balm etc.);
  - before-and-after;
  - people in lab coats;
  - addressing the reader's body or age in an ad ("你膝盖痛吗？", "Are you over 60?"). That's Meta's personal-attributes policy.
- **The Shopee listing's own images carry claims these rules ban** (效果显著, 消除, 修复, 活血化瘀, 风湿关节显著效果, 排酸排毒, "Body pain?"). Don't reuse that wording. James decides whether to change the listing.
- **Numbers that are unconfirmed, so never used in new content:**
  - "15,000+ customers": the portfolio says 30,000+;
  - "4.9 stars";
  - "since 2016 / 8 years".

  The site still shows them. SEO.md, decisions 1–4.
- **Regulatory status:** the HSA classification hasn't been done (REMINDERS.md). Consumer advertising with medicinal claims would need an HSA permit. Material aimed only at people who sell the product in their trade is treated differently (GROWTH.md §3), which is why `/trade` is noindex. Trade emails can link `/trade`; consumer content never makes medicinal claims.

## Proof we can use

- Real customer WhatsApp screenshots and two video compilations on /testimonials. Use them only on the site; ads with customer content need their consent first.
- One published quote (陈女士 Mdm Tan) about warmth and a loosened shoulder after three weeks. On the site only, without the Tiger Balm comparison.
- The 30-day guarantee and free delivery: real and safe to repeat.

## Assets

| File | What |
|---|---|
| `public/images/product-pack.webp` | New box and bottle, transparent background (738×1186). Use whenever the product is on screen. |
| `public/images/product-pack-square.jpg` | Same, on cream, 1200×1200. |
| `public/images/product-lifestyle.webp` | Box and bottle with candles and raw myrrh. Illustrative: the small label text is not legible. |
| `public/images/logo.png` | Logo, 512×512 |
| Brand colours | maroon #7F351E, copper #B87333, cream #FBF4E8, dark brown text #2B1A12 |

**Image rule:** when the product appears, it is the real packaging (edit the photo; never let a model invent a bottle or label).

## Open questions for James

Agents must not guess these. Ask in the weekly report until they're answered, then update this file.

1. Is the 55 ml Herbal Energy Oil applied as a spray, a roll-on or drops? Is the 60 ml spray discontinued?
2. Should the site switch its product name from 没药喷雾 to 没药草本能量油?
3. Which customer number is true (15,000+ or 30,000+)? Is the 4.9-star rating backed by reviews? Was the brand founded in 2016?
4. HSA classification: started? Result?
5. Are Carousell, TikTok Shop and a Facebook store live?
6. The 随身装 travel size and the 孝心礼盒 CNY gift box: ordered? Prices?
7. Wholesale prices in growth-config: confirmed against landed cost?
