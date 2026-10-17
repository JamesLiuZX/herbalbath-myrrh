# HerbalBath marketing playbook

Who we're for, how we sound, where we show up and what this quarter is about. The strategy reasoning lives in `STRATEGY.md` and `GROWTH.md`; this is the working summary the agents act on. Product facts are in `product.md`.

## Who we're for

| Audience | Who | What they want | Where |
|---|---|---|---|
| **The senior** | Singaporeans 55+, mostly Mandarin-speaking, HDB, natural and traditional products | Comfort, a trusted name, nothing complicated | Facebook, WhatsApp family chats, AACs, clan associations, 8world / Shin Min |
| **The adult child** (the main buyer) | 30–55, buys for parents, gifts at festivals | A thoughtful, useful gift; easy ordering | Facebook, Google search in Chinese, Xiaohongshu |
| **The helper** | Domestic helpers caring for 75+ | Clear, simple instructions; often the one applying it | Facebook groups, Sunday gatherings (no special incentives: STRATEGY.md §2.1) |
| **The caregiver after discharge** | Family bringing a parent home from SGH, TTSH, CGH, KTPH or NUH | Everything at once, now | Medical equipment rental shops, home care agencies (STRATEGY.md §2.2) |
| **The trade** | TCM clinics, medical halls, tuina and reflexology, rental shops, home care agencies, insurance agencies (CNY gifting) | Margin, demo-able product, no stock risk | Direct outreach, `/trade` |

## Voice

- Warm, plain, respectful, like a well-informed family friend. Short sentences.
- Chinese first (simplified, Singapore usage: 组屋, 乐龄, 巴刹, 小贩中心, 德士); English for adult children and helpers. British spelling.
- No fear, no pressure, no urgency tricks. Emoji sparingly on social, none in headlines.
- Talk about warmth, ritual, tradition, family and gifting, never about curing anything.
- Show people; don't address the viewer's body or age.

## Channels and what each is for

| Channel | Job | Run by |
|---|---|---|
| Blog (herbalbathsg.com/blog) | Rank for Chinese eldercare searches; one sourced article a week | Content engine (`scripts/content/`) |
| Facebook Page | Useful posts three times a week, plus festivals; most link to articles | Social agent (`marketing/facebook/posts.json`) |
| Images and short video | Product-true visuals for posts, Reels and TikTok | Creative agent (Kino + RunPod) |
| Trade outreach | Practitioner doors, discharge channel, institutions | B2B agent (email; the handshake stays human) |
| WhatsApp | Orders, reorders, referrals | James; the reorder engine |
| Shopee | Marketplace orders | James |

**Paid social prospecting to 55+ is off** (STRATEGY.md Part 4: the arithmetic at S$39 doesn't work). Boosting a proven organic post to adult children, or a small, capped retargeting test, is fine when the CMO proposes it and James agrees.

## This quarter (STRATEGY.md Phase 2: mid Oct 2026 to Jan 2027)

1. **Practitioner doors:** grow to 50–80 TCM clinics, medical halls, tuina and reflexology outlets. A door that doesn't clear 8 units a month gets replaced.
2. **孝心礼盒 (CNY gift box) live by early December.** CNY gifting decisions start in December.
3. **Facebook (and Xiaohongshu) aimed at the daughter**, not the mother. KOC-style, not polished.
4. **Two AAC operator HQs** with a 90-day programme framing: a sponsored talk, goodie bags. AACs don't allow selling on site.
5. **Discharge channel:** medical equipment rental shops and home care agencies.
6. **Insurance agencies for CNY client gifting:** one MDRT team is about 200 agents with ~50 older clients each.
7. **Media:** 8world, then Shin Min. Pitch a person (the founder story), never a product.

Not this quarter: pharmacy chains (Phase 3), an app, Malaysia.

## Calendar

| Date | Moment | Notes |
|---|---|---|
| 18 Oct 2026 | 重阳节 Chong Yang / Seniors' Day | The year's best day for this product |
| 8 Nov 2026 | Deepavali | Greeting only |
| Dec | Northeast monsoon, wetter weeks | Indoor comfort, fall prevention at home |
| early Dec 2026 | 孝心礼盒 must be live | CNY gift planning starts |
| 22 Dec 2026 | 冬至 Dongzhi | 汤圆, family |
| 25 Dec / 1 Jan | Christmas, New Year | Greetings |
| 6 Feb 2027 | 农历新年 Chinese New Year | Gifting peak: the gift box, insurance-agency gifting |
| 20 Feb 2027 | 元宵节 | Family |
| 5 Apr 2027 | 清明节 | Respectful tone; no selling |
| 9 May 2027 | Mother's Day | Gifting |
| 20 Jun 2027 | Father's Day | Gifting |

## The trade offer (B2B)

From `app/lib/growth-config.ts` (the ladder is marked *review before launch*: James must confirm prices against landed cost).

| Tier | Minimum | Unit price | Extras |
|---|---|---|---|
| Starter 试单价 | 12 units | S$21.45 | 6 testers, 1 counter stand, Chinese product cards |
| Growth 常规批发价 | 36 units | S$19.50 | 12 testers, 2 stands, product cards, free delivery |
| Chain 连锁/多店价 | 72 units | S$17.55 | 24 testers, a stand per outlet, online staff training, free delivery, a named contact |

- Outright purchase, not consignment. A carton is 12 units. Retail price S$39.
- **Captain referral programme:** 20% commission on attributed retail sales, paid by PayNow on the 5th. Single tier only: paying for recruiting would fall under the Multi-Level Marketing and Pyramid Selling (Prohibition) Act.
- Trade materials: `/trade` (noindex, keep it off the public nav), the pre-researched target list in `app/lib/outreach-targets.ts`, and the trade dossier still to build (HSA classification, full ingredient list, GMP status, shelf life, barcode).

## Rules every agent follows

1. **Facts:** only what `product.md` says. Unconfirmed means unsaid.
2. **Claims:** run every public text through `check_claims`. Approved claims word for word, nothing else about effects.
3. **People:** no fake accounts, fake reviews, fake engagement, astroturfing or impersonation, ever. Real voices only, with consent for customer content.
4. **Outreach:**
   - business addresses only, from the business's own public pages;
   - one first email and at most two follow-ups;
   - an opt-out in every email, honoured at once;
   - never more than the daily cap;
   - no promises we can't keep (prices are proposals until James confirms).
5. **Money:** never spend beyond the budgets in `ops/autonomy.json`; never move money; never sign anything.
6. **Privacy:** customer and business details, finances and the pipeline live only in the encrypted vault, never in public files, logs, commit messages or pull requests.
7. **When unsure:** ask James in the report instead of guessing.
