# HerbalBath SEO: audit, strategy and the content engine

Written 17 Oct 2026. Covers herbalbathsg.com as it stood on `main` (ed301c9) and what changed in the pull request that added this file. Companion files: [`content/WRITING.md`](./content/WRITING.md) (how articles are written), [`content/calendar.json`](./content/calendar.json) (what gets written when), [`STRATEGY.md`](./STRATEGY.md) §2.3 (why Chinese first).

## At a glance

| | |
|---|---|
| **Fixed in this pull request** | Blog posts are server-rendered with per-post metadata and article markup. Hidden keyword blocks removed. One honest set of structured data. Sitemap and page dates are real. `lang="zh-SG"`. Search Console verification hook. Two cron jobs that did nothing replaced by a working weekly writer. |
| **Waiting on James** | Seven decisions, mostly about claims (below). The biggest SEO risk left on the site is decision 1, the star rating in the markup. |
| **Set up once** | Verify Search Console. Add the `ANTHROPIC_API_KEY` secret and allow Actions to open pull requests. Then one article a week arrives as a pull request every Monday. |

## 1. Audit

### Fixed

| Finding | Why it mattered | What changed |
|---|---|---|
| **Blog post pages were one client component** that bundled every post's full text into the JavaScript of every post page. | Slow pages on the phones this audience uses; text that only exists after JavaScript runs is indexed later and less reliably. | `app/blog/[slug]` renders on the server (`BlogPostView.tsx`). Each post has its own title, description, canonical URL, Open Graph card, `BlogPosting` and `BreadcrumbList` markup, and its sources listed visibly. |
| **Hidden keyword blocks** (`sr-only` "Keywords: …") on blog posts and on every pain-point page. | Hidden text and keyword stuffing are both named in Google's spam policies; they invite a manual action and help nothing. | Removed from both templates. |
| **Structured data described a different business.** A `LocalBusiness` with the geographic centre of Singapore as its location and 24/7 opening hours, a second `Organization`, and a `WebSite` search box pointing at a blog search that doesn't exist (Google retired that feature in 2024 anyway). | Markup that doesn't match reality is ignored at best and is a spam signal at worst. | One `Organization` with a customer-service `contactPoint` and the real contact details, and a plain `WebSite`. Both live in `app/lib/structured-data.ts`. |
| **Product markup on every page**, so every blog post claimed to be a product page with a 4.9-star rating. | Google expects product markup only where the product is sold. | `Product` markup on the homepage only. (Its rating is decision 1.) |
| **Fake freshness.** The sitemap stamped every page "modified now" on every build, and every pain-point page told Google it was published and modified at build time (`new Date()`). | Google uses `lastmod` only when it's consistently accurate. Dates that always say "today" teach it to ignore the site's dates. | Real dates only: posts carry their own date, the blog index carries the newest post's date, pain points carry the day their content last changed (3 Aug 2026, from git), and pages with no real date carry none. |
| **The blog index listed posts oldest first**, loaded 7.6 MB of full-size PNGs through plain `<img>` tags, and showed broken images for 8 posts whose image files were never added, and v0 placeholders for 4 more. Those posts' social cards pointed at the missing files too. | The newest, most relevant posts were at the bottom; the page was heavy for a phone and looked broken. | Newest first, images through `next/image` (resized, AVIF/WebP), a lettered cover for any post without a real image file (`existingImage()` checks `public/`), and an "English" badge on English articles. |
| **`<html lang="zh">`** | Screen readers and browser translation work better with the regional tag. | `zh-SG`. English articles mark themselves `en-SG`. |
| **No Search Console verification**, only a TODO. | Without Search Console there's no data on queries, clicks or indexing problems, and no way to submit the sitemap. | `GOOGLE_SITE_VERIFICATION` environment variable (see Setup). |
| **The two content cron jobs only wrote to the log.** `generate-articles` listed topic gaps and published nothing (Vercel's filesystem is read-only at run time); `update-pain-points` computed seasonal tips and discarded them. | Looked automated; wasn't. | Both removed, with `app/lib/rag.ts`. The content engine replaces them (section 3). The reorder-nudge cron stays. |
| **Pain-point pages linked only to hand-written posts.** | New articles could never appear as related reading. | They draw from every post. |

### Second audit: SEOptimer, 17 Oct 2026

The report graded the homepage B- (on-page A-, links F, usability B+, performance A-). Fixed in the pull request that added this section:

| Finding | What changed |
|---|---|
| Title 70 characters; meta description 196 | Title "HerbalBath 草本沐 没药草本能量油 \| Myrrh Herbal Oil Singapore" (51). Description 128 characters, approved claims only. The social card text matches. |
| Keyword consistency: the page's main words weren't in the title, description or headings | The H1 now opens with the brand and product name (HerbalBath 草本沐 · 没药草本能量油), the same words as the title and description, above James's tagline. |
| Thin content (685 words) | The middle of the homepage is a Shopee-style detail column (`components/product-details.tsx`): the listing's own images with text panels for the story, how to use it, everyday moments, a specification table and the guarantees. It renders on the server, so it ships no JavaScript. |
| /internal discoverable from the homepage | The footer link is gone, and robots.txt blocks `/internal` itself (the old `/internal/` rule only covered the pages under it). The pages were already `noindex`. |
| No llms.txt | `public/llms.txt`: what the brand sells, prices, how to buy, the main pages. |
| Render-blocking scripts | Google Analytics and the Meta and TikTok pixels load with `next/script` after the page is interactive, not as blocking tags in `<head>`. |
| Image optimisation | Store logos were 225–1200 px PNGs (the Shopee one 254 KB) shown at 20–32 px; now 64 px WebP files through `next/image`. |
| Social card showed the old spray box | New `public/images/og-image.jpg` with the 55 ml Herbal Energy Oil. |
| Structured data | The organisation is typed `OnlineStore`, the Organization subtype Google documents for online shops. Still no `LocalBusiness`: there is no shop to visit. |

Left for James, outside the code:

- **Email records (DNS at Porkbun).** No SPF and no DMARC, so mail claiming to be from herbalbathsg.com is easy to spoof, and outreach email lands in spam more often. Add Resend's records when setting it up (ops/README.md §4), plus `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hello@herbalbathsg.com`. Tighten to `p=quarantine` after a few clean weeks.
- **One redirect hop instead of two.** The report measured a redirect chain on the way in (0.6 s on mobile). In Vercel → Project → Settings → Domains, make `herbalbathsg.com` the primary domain and set `www.herbalbathsg.com` to redirect straight to it. If GitHub Pages is switched on for this repository (it has a CNAME file), turn it off so only Vercel answers.
- **Backlinks.** 85 links, almost all from link-farm domains. Google ignores those; don't buy more, and don't file a disavow unless Search Console shows a manual action. Real links come from the trade partners (each stockist page can link the site), Singapore directories, community and clan-association newsletters around 重阳 and CNY, and Chinese-language media.
- **Social profiles.** No Facebook, Instagram or YouTube links yet. Once the Facebook Page exists, add its URL to `SOCIAL_PROFILES` (below).
- **Meta Pixel.** Set `NEXT_PUBLIC_META_PIXEL_ID` in Vercel once there's a Pixel; it loads automatically.

### Waiting on James: seven decisions

These are judgement calls about what the business claims, so nothing here was changed. As noted in REMINDERS.md, James wants to decide claims himself.

1. **The star rating in the product markup.** `aggregateRating` says 4.9 stars from **15,000 reviews**. 15,000 is the customer count, and the reviews aren't on the page. Google requires a rating to summarise reviews that visitors can read where the markup is, and this is the kind of markup that earns a "spammy structured data" manual action, which strips rich results from the whole site. Either set `reviewCount` to the number of reviews actually shown (the testimonials page could carry them), or delete the block. It's in `app/lib/structured-data.ts`, marked ⚠️.
2. **Effect and superlative claims in page copy.** (The title, description and social card were rewritten with approved wording in the second audit, so "10秒见效" and "Singapore's #1" are gone from them. The product markup still says "Works in 10 seconds".) Page copy carries 神奇, 奇效, 治愈, 治本, 告别疼痛, 无副作用 and "no side effects" on the homepage, pain-point pages, testimonials, the blog CTA and both ad landing pages. These are the same words `content/rules.json` bans in new articles. They matter for ads review (Meta and TikTok both reject health-effect claims), for health-product advertising rules (worth settling with the HSA classification REMINDERS.md already lists), and for trust on a health site. The approved wording used in new articles: 10秒感受温热, 一瓶可用3-4个月, 100%天然成分.
3. **One customer number.** The site says 15,000+; James's portfolio says 30,000+. Pick the true one and use it everywhere.
4. **"Since 2016" and "8年品质保证".** In the organisation markup (`foundingDate`) and the FAQ. Keep if accurate.
5. **The Tiger Balm comparison** in the review quoted in the product markup ("much stronger than Tiger Balm"). It's a real testimonial, but naming a competitor in your own markup is a comparative claim. Keep it on the testimonials page if you like; consider a different review for the markup.
6. **Statistics without sources on pain-point pages.** "根据新加坡卫生部数据，约30%的乐龄人士…" (knee pain) and "约80%的成年人…" (back pain), with no source given. On health pages an unsourced figure attributed to MOH is a credibility problem if it can't be found. Find the source and link it, or remove the number.
7. **The product label** says "Rapid Pain Relief" and "Rheumatic Pain". That matters for ad review: product shots showing the label can get ads rejected even when the copy is clean.

### Still to do (not decisions, just work)

- **Social profiles.** The old markup claimed facebook.com/herbalbathsg and tiktok.com/@herbalbathsg; neither turned up in a search. Once the Facebook Page exists ([`marketing/facebook/README.md`](./marketing/facebook/README.md) has the setup), add its URL to `SOCIAL_PROFILES` in `app/lib/growth-config.ts`.
- **Content gaps.** Pain-point pages name 11 related articles that don't exist yet (they're simply not shown): evening-relaxation-routine, morning-stretching-routine, hip-strengthening-exercises, joint-protection-daily-activities, hand-exercises-arthritis, ergonomic-tips-seniors, foot-care-diabetics, shoe-selection-guide, hydration-tips-seniors, housework-pain-prevention, sitting-posture-guide. Good calendar material, each needing two health sources first.
- **The 22 hand-written posts** in `app/lib/blog-data.tsx` predate the rules: no sources, and several claim words (治愈, 治本, 神奇, 最有效, 见效). Refresh the best performers once Search Console shows which they are, by moving them into `content/blog/` as JSON so the checks apply.
- **English pages.** The homepage's English toggle is client-side state on one URL, so English versions can't be indexed separately. Separate `/en` routes would be needed if English search matters; the blog already handles it by publishing English articles as their own posts.
- **An editorial page.** Health sites earn trust by saying who writes and checks their articles. A short "关于我们的文章 / How we write" page (based on `content/WRITING.md`), and, ideally, a named reviewer such as a TCM physician or physiotherapist, would strengthen every health article.

## 2. Strategy

**Aim: be the most useful Chinese-language page in Singapore for the questions families ask about ageing well at home, and let the product be a gentle, optional part of that.** The people who buy a myrrh spray for a parent are the people searching 乐龄易 申请, 重阳节送什么, 长辈出院 照顾 and 乐龄活动中心. Ranking for their questions builds an audience the brand owns, which ads can't.

**Chinese first.** English health searches compete with the entire anglophone health internet. Singapore's Mandarin searches for local schemes, places and festivals have little serious competition (STRATEGY.md §2.3). No keyword-volume data was available for this audit, so the calendar is built on judgement. After 8 to 12 weeks of Search Console data, re-rank it by real impressions.

**Topic clusters** (each article links to others in its cluster and to the matching pain-point page):

| Cluster | Examples | Why |
|---|---|---|
| Home safety and schemes | 乐龄易 (EASE), home caregiving grant, fall prevention | High intent, concrete, government sources, rarely explained well in Chinese |
| Caregiving | hospital discharge week, helper guides, caregiver support | STRATEGY.md §2.1 and §2.2: helpers and discharge are the best moments |
| Active living | Active Ageing Centres, parks, daily movement | Positive, shareable, and an alternative to "pain" content |
| Festivals and gifting | 重阳, 冬至, CNY, gifts for parents | Seasonal peaks where the product fits naturally as a gift |
| Protection | scams that target seniors (ScamShield 1799) | Very high need and very shareable in family chats |
| Body care (existing) | knees, back, joints, sleep, diet | The existing posts and pain-point pages |

**Cadence.** One article a week, every Monday, reviewed by a person before it goes live. That's slow enough to keep quality high and fast enough to build a library of about 50 sourced articles a year. Google's policy on AI-assisted content is about quality, not authorship; what it penalises is mass-produced, unhelpful pages ("scaled content abuse"). One sourced, human-reviewed article a week is the opposite of that.

**What every article does** is in `content/WRITING.md`: answers the search in the first paragraph, Singapore specifics, facts only from listed sources, a practical list or table, an FAQ, 2 to 4 internal links, and at most one optional product mention using approved claims. The checks in `scripts/content/lib.mjs` enforce the hard rules mechanically.

**Distribution.** Each article becomes a Facebook post ([`marketing/facebook`](./marketing/facebook/README.md) has 35 written ahead, Monday's always being the new article) and a WhatsApp-forwardable link. Family chats are where 55+ content travels in Singapore. Don't buy links. The links worth earning come from community partners (Active Ageing Centres, clan associations, senior fellowships) when an article is genuinely useful to their members.

## 3. The content engine

```
content/calendar.json ──► scripts/content/write-article.mjs ──► pull request ──► you review ──► merge ──► live
  (what, when, sources)     1. Claude reads the sources            (article JSON,     (WRITING.md     (Vercel deploys;
                               (web fetch) → research notes         checks, sources,   "Reviewing")    blog, related,
                            2. Claude writes the article as JSON    cover prompt)                       sitemap)
                            3. checks; one repair round; else draft
```

- **Every Monday at 09:17 Singapore time**, `.github/workflows/content-engine.yml` picks the earliest `planned` calendar entry due within the week. It skips any slug that already has a `content/<slug>` branch, so an open pull request is never written twice.
- **Research first.** Claude fetches the entry's sources (only those domains) and writes notes, quoting figures exactly. The article may state only what the notes support, and may cite only the sources that were read.
- **The writer's brief** is `content/WRITING.md` plus the lists in `content/rules.json`. Edit those files to change how every future article is written.
- **Checks.** Banned phrases, effect words next to the product, approved claims in the product block, length, snippet sizes, source count for health topics, and links that go nowhere. A failing draft gets one repair round. If it still fails, it's saved with `"draft": true`: it never renders, and the pull request lists what to fix.
- **The pull request** carries the article, the checks, a review checklist with links to each source, the research notes, the writer's notes, and a cover-image prompt for Kino.
- **Cost.** Typically 50k to 200k tokens per article, with each fetched page capped at 20k tokens. The pull request shows the exact count.

### Setup (once)

1. **Search Console.** Add a URL-prefix property for `https://herbalbathsg.com`, choose "HTML tag", and put the `content="…"` value in Vercel as `GOOGLE_SITE_VERIFICATION` (Production). Redeploy, verify, then submit `https://herbalbathsg.com/sitemap.xml`.
2. **API key.** In GitHub: Settings → Secrets and variables → Actions → New repository secret `ANTHROPIC_API_KEY`.
3. **Permission.** In GitHub: Settings → Actions → General → Workflow permissions → tick "Allow GitHub Actions to create and approve pull requests".
4. **First run.** Actions → Content engine → Run workflow, with slug `helper-guide-gentle-massage-routine` (the 26 Oct entry) to see a pull request straight away.

### Day to day

- **Review and merge** the Monday pull request (checklist in `content/WRITING.md`). Not merging is fine: close it and delete the branch, and that entry will be written again the next week.
- **Plan ahead** by editing `content/calendar.json`: add rows, reorder, sharpen angles. Each health entry needs at least two sources from `content/sources.json`. Add a source there first if it's new, after checking the page yourself.
- **Run it on demand** from the Actions tab with any planned slug, or locally: `ANTHROPIC_API_KEY=… node scripts/content/write-article.mjs <slug>`. Add `--dry-run` to see exactly what would be sent.
- **Write by hand** whenever you like: add a JSON file in `content/blog/` and run `node scripts/content/check.mjs`. Pull requests that touch `content/` run the same checks (`.github/workflows/content-check.yml`), and `pnpm test` runs them too.

## 4. Measurement

| When | Look at | Act on it |
|---|---|---|
| Weekly (with the article) | Search Console → Pages: is last week's article indexed? | If not after two weeks, inspect the URL and request indexing. |
| Monthly | Search Console → Performance, by page and by query | Articles with impressions but a click-through rate under ~2%: rewrite the title and description. Queries you rank 8 to 20 for: write or extend an article that answers them. |
| Monthly | GA4 (`G-8XF0GB41LM`): blog sessions, and clicks from blog posts to `/pay` and WhatsApp | Which clusters bring buyers, not just readers. Plan more of those. |
| Quarterly | Calendar re-rank | Swap planned topics for the queries Search Console shows people actually use. |
| When a scheme changes | The affected articles | Update the figures, set `"updated"` to that day (it shows on the page and in the markup), merge. |

Re-dating an article without changing it is the fake-freshness problem this audit removed. Only set `updated` when the content changed.
