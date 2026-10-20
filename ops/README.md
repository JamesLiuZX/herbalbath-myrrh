# Autopilot: HerbalBath's AI marketing team

Six AI agents that run HerbalBath's marketing on a schedule, act through a fixed set of tools, and report to you on Telegram. They research the market, plan the week, write Facebook posts, make product pictures and video ads, find trade partners and write to them, and keep the books. Everything they know about the product comes from one file, [`knowledge/product.md`](knowledge/product.md). Change it, and every agent follows from its next run.

```
                 ┌──────────── Telegram (you) ────────────┐
                 │ reports · drafts to approve · questions │
                 └──────────────────┬─────────────────────┘
  Mon 07:03  Researcher ──► research note ─┐                 │ /approve /run /pause …
  Mon 08:07  CMO ─────────► weekly plan ───┼──► everyone reads the plan, the shared
  Mon/Wed/Fri Social ─────► Facebook posts │    insights and the activity log
  Tue/Fri    Creative ────► media briefs ──┤
  Wed        Trade (B2B) ─► leads, emails ─┤
  1st        Bookkeeper ──► ledger, P&L ───┘
                 │                                   GitHub Actions does the acting,
                 ▼                                   with keys the agents never see:
   marketing/facebook/posts.json  ──► Facebook executor (schedules on the Page, daily)
   ops/creative/queue/            ──► Media executor (Kino + RunPod → public/social/)
   ops/private/ (encrypted)       ──► Email executor (Resend, weekdays, capped)
                                      Inbox (Telegram commands, every 30 min)
```

## The team

| Agent | When (SGT) | Does | Playbook |
|---|---|---|---|
| **Researcher** | Mon 07:03 | Next six weeks' moments, competitors on Shopee and Lazada, scheme and scam news, trade leads, questions people ask, media to pitch. Every finding with a source. | [research.md](agents/research.md) |
| **CMO** | Mon 08:07 | Reads everything, sets 3–5 priorities, writes the weekly plan the others follow. Sends you a short report with the decisions it needs. Monthly review deck. Answers your Telegram messages. | [cmo.md](agents/cmo.md) |
| **Social** | Mon, Wed, Fri 10:13 | Keeps the Facebook Page two weeks ahead: articles, tips, festival and product posts, all claims-checked. | [social.md](agents/social.md) |
| **Creative** | Tue, Fri 11:19 | Pictures for posts, plus product scenes and video ads for Reels and TikTok, always showing the real packaging. | [creative.md](agents/creative.md) |
| **Trade (B2B)** | Wed 09:23 | Finds TCM clinics, medical halls, rental shops, home care and insurance agencies. Writes short personal emails and follow-ups, and makes trade decks. | [b2b.md](agents/b2b.md) |
| **Bookkeeper** | 1st of the month 09:29 | Turns the bank and Shopee exports you send the bot into a ledger and a monthly P&L, with a GST-threshold watch. | [finance.md](agents/finance.md) |

The blog's weekly writer (`scripts/content/`, SEO.md) works alongside them, and the social agent posts each new article.

## What it won't do

It never runs fake accounts, buys or fakes likes, follows or reviews, posts as anyone but HerbalBath, or comments as "customers". Coordinated fake engagement is what gets a Facebook Page and ad account permanently banned, and fake reviews are deceptive advertising. That would put the whole channel at risk. Autopilot gets its scale the honest way: it never stops, it posts on time, every week, it follows up on every lead, and it remembers what worked.

## Setup

Each step switches on more of the team; nothing breaks if you stop halfway.

### 1. The brain (required)

1. **Anthropic key:** repository secret `ANTHROPIC_API_KEY`. It's the same one the content engine uses. Set a monthly spend limit in the Anthropic Console.
2. **Vault key:** run `node scripts/ops/vault-cli.mjs keygen`.
   - Put the key in GitHub as the secret `OPS_DATA_KEY`.
   - Put it in `.env.local` as `OPS_DATA_KEY=...` so you can read the data yourself.
   - Keep a copy somewhere safe: without it, the private data can't be read.
3. **Pull requests:** in GitHub, Settings → Actions → General → Workflow permissions, tick "Allow GitHub Actions to create and approve pull requests". It's needed for review mode and for the content engine.

That's enough for the agents to run. Without Telegram their reports wait in the vault (`vault-cli.mjs show reports`).

### 2. Telegram (strongly recommended)

1. In Telegram, message **@BotFather** → `/newbot` → name it, e.g. "HerbalBath Autopilot". Copy the token into the secret `TELEGRAM_BOT_TOKEN`.
2. Message **@userinfobot** to get your numeric chat id, and put it in the secret `TELEGRAM_CHAT_ID`. The bot only listens to that chat.
3. Send your new bot `/start`. Within 30 minutes it answers with the command list.

### 3. Facebook

Create the Page and get a Page token: see [`marketing/facebook/README.md`](../marketing/facebook/README.md) §1 and §3. Then set the secrets `FB_PAGE_ID` and `FB_PAGE_TOKEN`. From the next morning, posts due in the next 28 days are scheduled on the Page every day.

### 4. Trade emails

1. Create a free [Resend](https://resend.com) account and verify **herbalbathsg.com**. It shows you three or four DNS records to add where the domain's DNS is managed.
2. Add these secrets:

   | Secret | Value |
   |---|---|
   | `RESEND_API_KEY` | your Resend API key |
   | `OUTREACH_FROM` | `James at HerbalBath <james@herbalbathsg.com>` |
   | `OUTREACH_REPLY_TO` | your own inbox, where replies should land |
   | `OUTREACH_BCC` | optional: you get a copy of every email |

3. Emails start in **review mode**:
   - each draft comes to Telegram, and nothing goes out until you `/approve` it;
   - once you've seen a few and like them, set `"emails": "auto"` in [`autonomy.json`](autonomy.json);
   - either way, at most 5 go out a day.
4. **When someone replies:** tell the bot `/lead <id> replied` so the agent stops following up. (You'll find the id with `/leads`.)

### 5. Pictures and video on a GPU (optional)

Without a GPU, Autopilot already makes camera-move videos and captioned Reels and TikTok ads from the real product photo. For product scenes (the box and bottle placed into new settings) and generated pictures:

1. Set up a RunPod Serverless endpoint with [`runpod/README.md`](https://github.com/JamesLiuZX/kino/tree/HEAD/runpod) in the Kino repo.
2. Add the secrets `RUNPOD_ENDPOINT_ID` and `RUNPOD_API_KEY`.

Finished media arrives in Telegram. Videos are yours to post on TikTok: its API doesn't allow scheduling without app review. Pictures for Facebook posts are attached automatically.

## Day to day

**On Telegram:**

| Command | Does |
|---|---|
| `/status` | what's running, what's queued |
| `/plan` | this week's plan |
| `/drafts`, `/approve <id>`, `/approve all`, `/reject <id>` | trade emails waiting for you |
| `/leads`, `/lead <id> replied` (or meeting, won, lost, unsubscribed) | the pipeline |
| `/run cmo`, `/run social focus on CNY gifts` | run an agent now, optionally with an instruction |
| `/pause all`, `/pause b2b`, `/resume all` | stop and start |
| a CSV file | your Aspire or Shopee export, for the bookkeeper |
| anything else | a question or instruction for the CMO. "No more scam posts this month" is remembered by the whole team. |

**Stopping everything:**
- send `/pause all`; or
- set `"paused": true` in `autonomy.json`; or
- set the repository variable `AUTOPILOT_PAUSED` to `true` (Settings → Secrets and variables → Actions → Variables). That one works even if Telegram is down.

**More control:** set an agent's `mode` to `"review"` in `autonomy.json` and its public changes (posts, briefs) arrive as pull requests instead of going live. Set it to `"off"` to stop it running.

**Running one by hand:** Actions → Autopilot agents → Run workflow → pick the agent.

**Locally, to see what an agent would be told without calling Claude:** `node scripts/ops/run-agent.mjs social --dry-run`

**Reading the private data:** `node --env-file=.env.local scripts/ops/vault-cli.mjs show leads`. The collections are leads, outbox, plan, research, insights, activity, finance, reports and state.

**Teaching it:**
- edit `knowledge/product.md` (facts, claims, open questions) or `knowledge/playbook.md` (audiences, voice, the quarter's priorities, the calendar);
- edit any playbook in `agents/`;
- or just tell the CMO on Telegram.

## Costs

| | |
|---|---|
| **Claude** | About 10 agent runs a week, each mostly re-reading the cached knowledge base: typically 50k–300k input tokens and 5k–30k output tokens per run. Research and trade runs are at the top of that range (web search). The exact count for each run is in the Actions log and in `vault-cli.mjs show activity`. |
| **GitHub Actions** | Free: the repository is public. |
| **Telegram** | Free. |
| **Resend** | Free tier covers this volume. |
| **RunPod** | Per second of GPU, only when product scenes or generated pictures are made. Capped by `mediaJobsPerWeek`. |

## How it's built, and why it's safe

- **One brain per job.** `scripts/ops/run-agent.mjs` gives each agent:
  - its playbook, the knowledge base, the plan, the team's memory and the recent activity;
  - only its own tools (`scripts/ops/tools/`).

  Claude works through the job with those tools, plus web search and fetch for research and trade.
- **Rules in code, not just in prompts:**
  - every public text passes the claims checker (`claimProblems`, the same one the blog uses);
  - every tool input is validated;
  - the tools enforce the limits: dates, product-post share, the outreach rules (one first email, two follow-ups, the opt-out line, the daily cap, closed leads), the media budget.
- **Private data stays private in a public repository.**
  - Leads, emails, plans, research and money live in `ops/private/` as AES-256-GCM encrypted files.
  - Logs, commit messages and pull requests carry counts only, because Actions logs on a public repo are public.
  - The agents never see the Facebook, Resend or RunPod keys: the executors hold them.
- **Safe concurrent writes.** Every run records its changes in a journal (`scripts/ops/lib/changes.mjs`). At the end it replays them on top of the latest `main` before pushing, so two runs never overwrite each other.
- **Tests:** `pnpm test` covers:
  - the vault;
  - replay over a concurrent push, against a real git remote;
  - validation;
  - every tool's rules;
  - the Telegram commands;
  - the bookkeeping maths.

### Files

| Path | What |
|---|---|
| `ops/knowledge/` | product truth and marketing playbook |
| `ops/agents/` | one playbook per agent |
| `ops/autonomy.json` | modes, email approval, limits, pause |
| `ops/private/` | encrypted team data |
| `ops/creative/` | media briefs (`queue/`) and the media index |
| `scripts/ops/` | runner, tools, executors, vault CLI |
| `.github/workflows/autopilot*.yml` | schedules |
