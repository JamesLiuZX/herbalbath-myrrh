# HerbalBath on Facebook

Everything needed to start the HerbalBath Facebook Page: setup steps and copy, 35 posts written ahead from 重阳 (18 Oct 2026) to New Year 2027, and a script that schedules them.

| File | What it is |
|---|---|
| `posts.json` | The posts: date and time (Singapore), language, type, text, link or image. Checked by `pnpm test` against `content/rules.json`, the same rules as the blog. |
| `posts.csv` | The same posts as a spreadsheet, for reading or copy-paste. Regenerate with `node scripts/facebook/schedule-posts.mjs --csv`. |
| `../../scripts/facebook/schedule-posts.mjs` | Schedules the next 28 days of posts on the Page through Meta's Graph API. |

## 1. Create the Page (about 15 minutes)

Meta requires a real person's Facebook account behind every Page, so this step is yours. If HerbalBath already has a Page, skip to step 4 and use that one.

1. On Facebook: **Menu → Pages → Create new Page**.
2. **Page name:** `HerbalBath SG`
3. **Category:** type "Health" and pick the closest match (for example *Health & wellness website* or *Health/beauty*); add *Shopping & retail* as a second.
4. **Bio** (Facebook allows 101 characters):
   - 中文：`新加坡乐龄生活小百科：居家安全、乐龄活动、照顾长辈、节日习俗。HerbalBath 没药喷雾，100%天然成分。`
   - English: `Practical tips for ageing well in Singapore, and HerbalBath Myrrh Spray: 100% natural ingredients.`
5. **Username:** Settings → Page setup → Username → `herbalbathsg` (or `herbalbath.sg` if taken). Your link becomes facebook.com/herbalbathsg.
6. **Profile picture:** `public/images/logo.png` (512×512). Facebook crops it to a circle; check that nothing important is cut off.
7. **Cover photo:** generate one in Kino (Image tool, 16:9) with the prompt below. Facebook crops covers differently on phones and computers, so keep the subject in the middle.
   > A wide, sunlit Singapore park connector in the morning, an elderly Chinese couple walking together under rain trees, a younger family member a few steps behind them, soft greens and warm cream tones, open sky on the left, photorealistic, no text
8. **Contact details:** website `https://herbalbathsg.com`, WhatsApp `8426 1225` (Settings → Linked accounts → WhatsApp), email `hello@herbalbathsg.com`, service area Singapore. No street address: it's an online shop.
9. **Action button:** *Send WhatsApp message*, or *Shop now* linking to `https://herbalbathsg.com/pay`.
10. **Welcome post:** post this and pin it (⋯ → Pin to top):
    > 欢迎来到 HerbalBath SG！🌿
    > 这里会分享新加坡乐龄生活的实用资讯：居家安全、乐龄活动、照顾长辈、节日习俗，也会介绍我们的 HerbalBath 没药喷雾（100%天然成分，一瓶可用3-4个月）。
    > 订购：herbalbathsg.com/pay ｜ WhatsApp 8426 1225
11. **Tell the website about it:** add the Page's URL to `SOCIAL_PROFILES` in `app/lib/growth-config.ts`. Search engines then know the Page is officially yours (SEO.md).

Optional, for ads later: in **Meta Events Manager**, create a Pixel, put its ID in Vercel as `NEXT_PUBLIC_META_PIXEL_ID`, and redeploy. The site already sends page views, plus a "Contact" event when someone taps WhatsApp.

## 2. The posts

- **Rhythm:** three a week. Monday 08:30 is the new blog article, Wednesday 20:00 a tip or a question, Saturday 09:00 something for the family or about the product. Festivals get their own post on the day: 重阳, Deepavali, 冬至, Christmas, New Year.
- **What they do:** most are useful on their own (EASE, Active Ageing Centres, fall checks, healthy plate, caregiver grants) and link to an article or an official page. Five of the 35 are about the product, each using the approved claims word for word. Two warn about scams that target seniors, including the fake "seniors' activities" ads on Facebook and TikTok that police warned about. On a Page that will itself advertise to seniors, saying plainly what HerbalBath will never ask for builds trust.
- **Posts that link to articles** wait until the article is live, so merge the Monday blog pull request (SEO.md) and the Facebook post follows.
- **Pictures:** link posts show the article's preview card. Text posts that carry an `imagePrompt` look better with a picture. Generate one in Kino (Image tool, 1:1 or 4:5), save it as `public/social/<post id>.webp`, and set `"image": "/social/<post id>.webp"` on that post. Once that's deployed, the script posts it as a photo.
- **Writing more:** copy the shape of an existing post into `posts.json` and run `pnpm test`. It rejects banned phrases, effect words next to the product, product posts without an approved claim, more than one product post in five, and links to articles that don't exist.

## 3. Scheduling

**Without code.** Meta Business Suite → Planner → Create post. Paste the text and link from `posts.csv`, set the date and time, and schedule. About two minutes a post.

**With the script.** It takes about 20 minutes to set up once, then a single command every few weeks.

1. Go to [developers.facebook.com](https://developers.facebook.com) → My Apps → Create app, and choose the use case for managing a Page. An app left in development mode can post to Pages you manage; it needs no review.
2. Tools → Graph API Explorer: pick the app, then **Get Page Access Token**. Grant `pages_show_list`, `pages_read_engagement` and `pages_manage_posts`, and choose HerbalBath SG.
3. Make the token long-lived:
   - In the Access Token Debugger, extend the user token.
   - In Graph API Explorer, call `me/accounts` with the extended token.
   - Copy the Page's `id` and `access_token`. A Page token obtained this way doesn't expire.
4. Put them in `.env.local` in the project folder. That file is never committed.
   ```
   FB_PAGE_ID=1234567890
   FB_PAGE_TOKEN=EAAB...
   ```
5. Preview, then schedule:
   ```
   node --env-file=.env.local scripts/facebook/schedule-posts.mjs --dry-run
   node --env-file=.env.local scripts/facebook/schedule-posts.mjs
   ```
6. **Run it again every three or four weeks.** Meta accepts scheduled times from 10 minutes to 30 days ahead, so the script schedules a 28-day window. Re-running is safe: it skips posts that are already scheduled, posts whose time has passed, and articles that aren't live yet. Scheduled posts show up in Business Suite's Planner, where you can still edit or delete them.

## 4. Replying to comments

Reply within a day. Never give medical advice in a comment. Some replies you can reuse:

- **A health question:** 谢谢您的留言🙏 每个人的情况不一样。如果疼痛持续或加重，或者有红肿、发烧，请尽快看医生。
- **How to order:** 谢谢支持！可以在 herbalbathsg.com/pay 用PayNow下单，或WhatsApp 8426 1225，我们帮您安排。
- **A complaint:** 很抱歉让您有不好的体验。请WhatsApp 8426 1225告诉我们详情，我们会尽快处理。
- **"Is this a scam?":** HerbalBath 不会私信要求您安装应用程序，也不会索取Singpass或银行登录资料。下单只需 herbalbathsg.com 或 WhatsApp 8426 1225。有疑问也可以打ScamShield热线1799。

Report copycat Pages that use the HerbalBath name or photos to Facebook (⋯ → Find support or report).

## 5. Boosting and ads

Boosted posts and ads go through Meta's ad review. Health-related ads get rejected when they:

- imply the viewer has a condition: "你膝盖痛吗？" or "Do you have joint pain?" Meta's personal-attributes rule bans this.
- promise an effect;
- show before-and-after.

The posts here are written to avoid all three, so they're safe to boost. For video ads, the Kino ad studio checks the same rules. Close-ups of the bottle can still be rejected, because the label says "Rapid Pain Relief" and "Rheumatic Pain" (SEO.md, decision 7).
