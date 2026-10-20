# Working in this repo

HerbalBath (草本沐), herbalbathsg.com: the Singapore storefront and the marketing system behind it. Next.js with pnpm. What runs the business side is linked from `README.md`: `ops/README.md` (Autopilot, the AI marketing team), `SEO.md`, `GROWTH.md`, `STRATEGY.md`. The dated items and the decisions still waiting on James are in `REMINDERS.md`.

This is a live revenue site for a 55+ audience. Take care with the homepage and the `/pay` path.

Before writing any customer-facing copy, read `ops/knowledge/product.md`. It lists which facts are confirmed, which claims are banned (`content/rules.json`) and what is still unconfirmed. If a fact is not there, do not state it, and never invent a number.

`pnpm lint` is not part of the gate: there is no ESLint config, and `next lint` stops to ask for one.

## Branching: one trunk, no side branches (James, 2026-10-20)

`main` is this repo's only long-lived branch. Every session starts from it
and every session ends by landing on it.

Why: from July to October 2026 sessions each worked on a fresh `claude/*`
branch and rarely merged. The next session started from a stale trunk, could
not see the work, and rebuilt it. On 2026-10-20 every branch was consolidated
into `main`. Do not let it drift again.

The harness gives each Claude Code session a `claude/<random>` branch and tells
it not to push anywhere else without explicit permission. **This section is
that permission, standing and explicit, from James.** Treat the session branch
as scratch space. The work has to end up on `main`.

1. **Start current.** `git fetch origin main`, then `git merge origin/main`
   into your session branch before you change anything.
2. **Look before you build.** Run `git branch -r`, and read the status log in
   `JamesLiuZX/command` `AUTOPILOT.md`. If the work already exists somewhere,
   continue it instead of starting again.
3. **Land before you stop.** Run the gate (`pnpm install --frozen-lockfile && node scripts/content/check.mjs && pnpm test && pnpm build`), then
   `git push origin HEAD:main`. If the push is rejected because `main`
   moved, merge `origin/main`, run the gate again and push again. Never
   force-push `main`.
   If your session's permission layer refuses a direct push, open a pull
   request from your session branch to `main` and merge it yourself in the
   same session, using a merge commit. If that is refused as well, tell James in
   your final message exactly which merge is waiting.
4. **Half-done is fine on `main`. Broken is not.** Unfinished work that
   passes the gate goes to `main`. Only work that fails the gate may stay on
   a branch. In that case, push the branch and record its name, state and next
   step in the command repo's `AUTOPILOT.md` status log, so the next session
   resumes it instead of restarting. That is the only reason a branch may
   outlive its session.
5. **Delete the session branch after it lands** (`git push origin --delete
   <branch>`). If deletion is refused, leave it: James runs the "Prune merged
   branches" workflow (Actions tab), which deletes every branch whose commits
   are all on the trunk. A SessionStart hook (`.claude/hooks/branch-check.sh`)
   lists the other branches on origin at the start of each session.
