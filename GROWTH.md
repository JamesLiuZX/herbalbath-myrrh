# Growth runbook

What's built, what it costs, and what only you can do.

The premise behind all of it: a bottle lasts 3–4 months, so a customer buys at
most ~3 times a year. At S$39 that's roughly **S$90–110 of annual revenue per
person** — far too little to support paid acquisition. The business only
compounds through (a) people who already bought buying again, and (b)
distribution that costs nothing per customer. Everything here serves one of
those two.

---

## 1. Reorder engine — do this first

**Why:** it is the single highest-ROI thing available to you. Utility-category
WhatsApp messages in Singapore cost ~S$0.0205 each. Nudging 15,000 customers
costs about **S$310**. The same messages sent as marketing-category cost
~S$1,400.

**Built:**

| File | Role |
| --- | --- |
| `app/lib/reorder.ts` | Due-date maths, template builder, Cloud API client |
| `app/actions/customers.ts` | `recordPurchase()`, `optOutCustomer()`, base stats |
| `app/api/cron/reorder-nudges/route.ts` | Daily cron: select → send → reschedule |

Nudges at day 75 × bottles purchased (a 4-bottle bundle buyer isn't empty at
day 75), one follow-up, then it stops. Opt-outs survive repeat purchases.

**To go live:**

1. Connect Upstash Redis from the Vercel Marketplace.
2. Import your existing customers. Export orders from Shopee / Carousell /
   TikTok Shop plus your WhatsApp threads into
   `phone,name,lastPurchaseAt,bottles,lang`, then call `recordPurchase()` per
   row. An approximate `lastPurchaseAt` still lands the nudge in the right
   month — don't let perfect data hold this up.
3. Create the template in WhatsApp Manager. Suggested body, submitted as
   **UTILITY**:
   > `{{1}} 您好，您在 {{2}} 天前订购的没药喷雾差不多该用完了。需要补货可以直接回复这则讯息，我们照旧送到府上。`

   Write it as a transaction follow-up, not an offer. Opening with a discount
   gets it re-categorised as marketing — 4.5× the cost, and it needs marketing
   opt-in. **Check the category Meta actually assigned before sending.**
4. Set `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` (use a System
   User token, not the 24-hour one).

**Before step 4, hit the cron and read the counts.** With no token it runs in
dry-run: full selection and scheduling, zero sends. That's the cheapest way to
catch a bad import before 15,000 people get a message.

Cron runs `0 2 * * *` UTC = **10am Singapore**, daily. Daily rather than
weekly on purpose — bursts look like spam to Meta's quality system, and a
quality-rating drop cuts your daily send limit.

---

## 2. Captain kit — `/kit`

**What changed and why it matters:** `/partner` used to mint a `?ref=` URL and
ask the referrer to copy it to their clipboard. That requires selecting text,
switching apps, and pasting — and when any step failed, it failed silently.
That is very likely the whole reason the program had no traction.

Replaced with:

- **A 5-character code**, not a URL. Codes survive being said aloud, written
  on a card, screenshotted, forwarded, and re-photographed. In this
  demographic a human is the transport layer, so attribution has to be
  human-readable. Confusable characters (`O/0`, `I/L/1`, `S/5`) are never
  issued, and typed input is normalised back to what they probably saw.
- **A forwardable card**, rendered client-side on canvas with the captain's
  own code baked in, handed straight to the WhatsApp share sheet via
  `navigator.share({ files })`. One tap, pick a group, sent. Canvas rather
  than a server-generated image because the phone already has the Chinese
  fonts, and because what the captain needs is an *image in their gallery*,
  not a URL.
- Idempotent registration by phone — re-registering returns the same code, so
  already-forwarded cards keep attributing.

**Optional:** drop a `public/images/paynow-qr.png` and it appears on the card.
Without it the card renders fine, just without the QR.

`/kit` is `noindex` on purpose — hand it out to people you've onboarded. A
referral network full of strangers stops converting.

**Recruit from your own base first.** Repeat buyers with 3+ orders are already
evangelising for free. Beyond them: line-dance and taichi instructors,
morning-walk leaders, karaoke organisers, tour leaders, clan association
welfare committee members, insurance agents with older books.

Commission is single-tier and paid strictly on product sold. Paying anyone for
recruiting other recruiters would put this in scope of the **Multi-Level
Marketing and Pyramid Selling (Prohibition) Act**. Keep it one level deep.

---

## 3. Trade channel — `/trade`

Highest-conversion channel available to you: the practitioner has hands on the
exact body part, and already sells medicated oils at the counter. Your product
also *demos instantly* — perceptible heat in seconds. That is wasted on a
webpage and lethal in a treatment room.

Wholesale ladder in `app/lib/growth-config.ts`. **Outright purchase, not
consignment** — consignment means you carry stock risk *and* a reconciliation
task per outlet per month forever, which is the opposite of low-ops.

> ⚠️ The price ladder is a proposed starting structure. Confirm your landed
> cost and margin floor before quoting a single clinic. Quoted trade prices
> are very hard to walk back.

**The regulatory unlock:** consumer advertising carrying medicinal claims needs
an HSA permit, but that requirement doesn't apply to material directed
exclusively at people who may lawfully sell the product in their trade. `/trade`
is `noindex` and off the public nav to keep it a trade communication rather
than a consumer advertisement. **Linking it from the homepage weakens that.**

Kill threshold: `MIN_UNITS_PER_DOOR_PER_MONTH = 8`. Below that, replace the
door rather than nurture it.

---

## 4. Outreach targets — `app/lib/outreach-targets.ts`

Pre-researched target list plus Chinese outreach scripts, one ask per message.
Organisation names and angles are researched; **contact details deliberately
aren't included** — they go stale and a wrong number wastes a first
impression. Look each up on the org's own site.

Covers: 10 AAC operator HQs (one conversation ≈ 27 centres, versus 230
individual centres), TCM chains, clan associations, Chinese media, senior tour
operators.

Two notes on approach:

- **AACs are AIC-funded.** They will not let you sell on site. The realistic
  ask is a sponsored talk by a registered TCM physician, product in the goodie
  bag, your number on a Chinese card.
- **For media, the clipping is the asset, not the reach.** A feature becomes
  laminated collateral for every clinic visit and the most-forwarded image in
  aunty WhatsApp groups. Pitch a person, never a product. 8world first — lower
  bar, and print desks pick up what performs.

---

## 5. Claims cleanup — done, but not finished

Removed sitewide: "无副作用" / "no side effects", "深层治愈" / "deep healing",
"解决风湿、关节炎根本问题" / "addresses root cause of arthritis", "远超化学药物",
and named-competitor comparisons (Tiger Balm). Efficacy claims are now framed
as sensory ("10秒感受热感") rather than therapeutic.

Arthritis and rheumatism are **not** on the prohibited specified-diseases
schedule, so the underlying positioning is fine — it was the *cure / no side
effects / guaranteed* framing that was the exposure.

**Still yours to do, and it gates most of section 4:**

- Confirm HSA product classification. A herbal topical with medicinal claims
  most likely lands as a **Chinese Proprietary Medicine**, needing product
  listing and a dealer's licence.
- Build the trade dossier: classification, full ingredient list, manufacturer
  GMP status, shelf life, barcode, wholesale ladder. Retail buyers and clinic
  owners all ask for exactly this, and most shophouse competitors can't produce
  it — it's a moat, not a cost.
- Verify "15,000+ users" and "4.9 stars" are substantiable before a journalist,
  a pharmacy buyer, or HSA asks.

---

## What is not automated, and won't be

The handshakes. Roughly 50 outlet sign-ups and 20 community partnerships. That
work is **front-loaded, not recurring** — once a door is signed it's a
recurring channel, and everything downstream (reorder, attribution, restock,
payout) is code.

Also still manual, and worth fixing before the first bulk PO: **fulfilment.**
Every channel here scales volume through whoever currently packs the boxes.
Move to a 3PL before growth becomes a household problem.

## What I'd skip

Paid social prospecting to 55+ — the arithmetic at S$39 AOV doesn't work, and
it doesn't compound. Watsons/Guardian as a first move: slow, margin-
destroying, and they'll want velocity data you don't have yet. Get the velocity
from clinics first.

---

## Environment variables

| Variable | Needed for |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Everything persistent. Set this first. |
| `CRON_SECRET` | Authenticating Vercel cron calls in production |
| `WHATSAPP_ACCESS_TOKEN` | Reorder sends (dry-run without it) |
| `WHATSAPP_PHONE_NUMBER_ID` | Reorder sends (dry-run without it) |

Without Redis every page still renders and is testable — nothing persists.
Trade enquiries fall back to a loud `console.warn` so they're at least
recoverable from Vercel logs.
