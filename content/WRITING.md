# How HerbalBath articles are written

This guide is for people and for the content engine alike: `scripts/content/write-article.mjs` sends this whole file to Claude as the brief. Change a rule here and both follow it. The hard limits (banned phrases, approved product claims, lengths, number of sources) live in `rules.json`, and `scripts/content/check.mjs` enforces them on every article.

## Who we write for

- **Singaporeans aged 55 and over, and their adult children.** Most read Chinese (simplified, Singapore usage); some read English. Many read on a phone with large text.
- **The adult child is often the one searching**: for a parent's gift, a scheme, a safer bathroom, someone to talk to. Write so they can act today.
- Respect the reader. Never talk down, never frighten, never pressure. Say 长辈 / 家里的长辈 / parents; avoid 老人 on its own in headings.

## What a good article does

1. **Answers the search in the first paragraph.** Someone who searched 乐龄易 申请 should learn in three sentences what it is, who qualifies and where to apply.
2. **Is specific to Singapore.** Name the scheme, the agency, the hotline, the app, the place: HDB, AIC (1800-650-6060), SupportGoWhere, HealthHub, ScamShield (1799), NParks. Use local words: 组屋, 乐龄, 巴刹, 小贩中心, 公积金, 德士; in English, HDB flat, hawker centre, void deck.
3. **States only facts the sources support.** Every number, price, age limit, date and eligibility rule must come from the research notes, which come from the pages in `sources.json`. If the notes don't cover something, leave it out or send the reader to the official page (请以官方网站最新资料为准 / check the official page for the latest details). Never fill a gap from memory.
4. **Is practical.** Steps as numbered lists, options as bullet lists, costs or comparisons as a table, one tip box with a small thing to do today.
5. **Ends with an FAQ** of 3 to 5 questions people actually type into Google, each answered in one to three sentences.
6. **Links to 2 to 4 of our other articles** where they genuinely help the reader, written as `[label](/blog/slug)`. Never link to an article that isn't on the list you're given.

## Health topics (knees, back, joints, exercise, diet, sleep, caregiving, home safety)

Google holds health pages to a higher standard, and so do we.

- General information only. No diagnosis, no treatment plans, no medicine or dosage advice, no promises of results.
- Tell readers when to see a doctor: pain that lasts or gets worse, swelling, redness or heat, fever, numbness, a fall, anything new or sudden.
- Exercises: gentle, with how many times, what to avoid, and "stop if it hurts". Suggest checking with a doctor or physiotherapist first for anyone with a condition or a recent operation.
- At least two sources, preferably HealthHub, HPB, AIC, MOH, HDB, polyclinics or hospitals.
- Don't write a disclaimer: the site adds one under every article.

## The product

The articles exist to help the reader. The product may appear once, after the main help, as an option, never as the answer.

- **At most one product block**, placed in the second half of the article. It must read as optional: 如果……可以考虑 / if you'd like…
- **Use at least one approved claim word for word** (the list is in `rules.json`): 10秒感受温热, 一瓶可用3-4个月, 100%天然成分, 买3送1, 30天不满意，全额退款.
- **Never tie the product to an effect.** No 缓解, 舒缓, 止痛, 改善, 治疗, relief, soothe, heal, treat… in any sentence that names the product or "the spray". Those words are fine elsewhere when they describe general advice from a source.
- **No conditions next to the product**: no 风湿, 关节炎, 痛风, arthritis, rheumatism in the product block.
- No prices in the text (the product card under the block shows the current price), no comparisons with other brands, no before/after, no testimonials, no "doctor recommended".
- In gift and festival articles, it may be one gift idea among several, not the first one.

## Voice

- **Chinese:** warm and plain, like a well-informed family friend. Simplified characters, Arabic numerals, short sentences. Give an English scheme name in brackets the first time: 乐龄易（EASE）.
- **English:** plain, short sentences, British spelling (centre, programme, colour).
- Short paragraphs of two to four sentences. One idea per paragraph.
- No emoji, no exclamation marks in headings, no clickbait.

## Format

Articles are JSON files in `content/blog/`, one per article, named after the slug.

- `body` is a list of blocks: `p`, `h2`, `h3` (text), `ul`, `ol` (items), `tip` (title, text), `product` (text), `table` (head, rows).
- Inline formatting is only `**bold**` and `[label](url)`. No HTML, no markdown headings inside text.
- Start with a `p`, never a heading. Four to six `h2` sections; `h3` sparingly.
- **Title**: up to 34 characters in Chinese, 70 in English, with the main keyword near the start.
- **Description** (the search snippet): 50 to 100 characters in Chinese, 110 to 175 in English. Say what the reader gets.
- **Length**: at least 900 Chinese characters (aim for 1,200 to 1,800) or 600 English words (aim for 800 to 1,200). Long enough to be the best answer, no padding.
- `keywords`: the main keyword first, then three or four close variants people actually search.

## Reviewing an article before it goes live

The engine opens a pull request every Monday. Whoever merges it is the editor:

1. **Facts.** Open each source and check every number, date, price and eligibility rule. Schemes change; the article must match the page today.
2. **The product block.** Optional in tone, approved claims only, nothing about effects or conditions.
3. **Tone.** Would you send it to your own parents? Does it sound like Singapore?
4. **Cover image (optional).** Generate one in Kino with the prompt in the pull request, save it as `public/blog/<slug>.webp` (1600×900), and set `"image": "/blog/<slug>.webp"` and `"imageAlt"` in the article. Without one the site shows a lettered cover.
5. **Merge.** Vercel deploys, and the article appears on the blog, in related articles and in the sitemap.

If the checks failed, the article arrives with `"draft": true` and stays off the site. Fix what the pull request lists, delete the `draft` line, set the calendar entry's `status` to `published`, and run `node scripts/content/check.mjs <slug>` before merging.
