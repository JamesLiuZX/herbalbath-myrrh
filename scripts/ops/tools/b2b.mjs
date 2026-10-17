// Trade outreach. The B2B agent finds practitioner and institutional partners,
// keeps the pipeline in the vault, and drafts personal emails. Drafts wait for
// /approve on Telegram unless ops/autonomy.json sets emails to "auto"; the email
// executor (send-emails.mjs) sends approved ones within the daily cap.

import { claimProblems, loadRules } from "../../content/lib.mjs"
import { daysBetween } from "../lib/paths.mjs"
import { capped } from "../lib/vault.mjs"
import { obj, str } from "./common.mjs"

export const LEAD_TYPES = ["tcm-clinic", "medical-hall", "tuina-reflexology", "rental-shop", "home-care", "aac-operator", "clan-association", "insurance-agency", "corporate", "media", "other"]
export const LEAD_STATUSES = ["new", "contacted", "replied", "meeting", "won", "lost", "unsubscribed", "do-not-contact"]
const CLOSED = new Set(["replied", "meeting", "won", "lost", "unsubscribed", "do-not-contact"])
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export const LEADS_FALLBACK = { leads: [] }
export const OUTBOX_FALLBACK = { emails: [] }

const OPT_OUT = {
  zh: "如不希望再收到我们的邮件，回复「退订」即可。",
  en: "If you'd rather not hear from us again, just reply \"unsubscribe\".",
}

const domainOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export function leadSummary(lead, emails) {
  const sent = emails.filter((e) => e.leadId === lead.id && e.status === "sent")
  const lastSent = sent.map((e) => e.sentAt).sort().pop() ?? null
  return {
    id: lead.id,
    org: lead.org,
    type: lead.type,
    area: lead.area ?? null,
    status: lead.status,
    hasEmail: !!lead.email,
    emailsSent: sent.length,
    lastSent,
    queued: emails.filter((e) => e.leadId === lead.id && ["pending", "approved"].includes(e.status)).length,
  }
}

export function b2bTools(ctx) {
  const rules = loadRules()
  const leads = () => ctx.changes.readVault("leads", LEADS_FALLBACK).leads
  const outbox = () => ctx.changes.readVault("outbox", OUTBOX_FALLBACK).emails
  const auto = ctx.config.actions.emails === "auto"

  return [
    {
      name: "list_leads",
      description: "The trade pipeline: every lead with its type, status and email history, plus which leads have a follow-up due today.",
      input_schema: obj({ status: { type: "string", enum: LEAD_STATUSES, description: "Optional filter" } }, []),
      run: ({ status }) => {
        const emails = outbox()
        const rows = leads()
          .filter((l) => !status || l.status === status)
          .map((l) => leadSummary(l, emails))
        const [first, second] = ctx.config.limits.followUpDays
        const due = rows.filter(
          (r) =>
            r.status === "contacted" &&
            r.queued === 0 &&
            r.lastSent &&
            r.emailsSent <= ctx.config.limits.followUps &&
            daysBetween(r.lastSent.slice(0, 10), ctx.today.date) >= (r.emailsSent === 1 ? first : second),
        )
        return { leads: rows, followUpsDue: due.map((r) => r.id), counts: Object.fromEntries(LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])) }
      },
    },
    {
      name: "get_lead",
      description: "Everything stored for one lead, including notes and the emails sent so far.",
      input_schema: obj({ id: str("Lead id") }),
      run: ({ id }) => {
        const lead = leads().find((l) => l.id === id)
        if (!lead) throw new Error(`No lead ${id}.`)
        return { ...lead, emails: outbox().filter((e) => e.leadId === id).map(({ subject, body, status, kind, createdAt, sentAt }) => ({ subject, body, status, kind, createdAt, sentAt })) }
      },
    },
    {
      name: "upsert_lead",
      description:
        "Add a lead or update one. Only business contact details published by the business itself (its website or official listing), and say where you found them in `source`. Leads are deduplicated by email and by website.",
      input_schema: obj(
        {
          id: str("Existing lead id, to update"),
          org: str("Business or organisation name"),
          orgZh: str("Chinese name, if it has one"),
          type: { type: "string", enum: LEAD_TYPES },
          website: str("https URL"),
          email: str("A business email published by the business"),
          phone: str("Business phone, if published"),
          area: str("Neighbourhood or address, e.g. Chinatown"),
          source: str("URL where you found the details"),
          notes: str("Why this lead fits; what to mention"),
          status: { type: "string", enum: LEAD_STATUSES },
        },
        ["org", "type", "source"],
      ),
      run: (input) => {
        if (input.email && !EMAIL.test(input.email)) throw new Error("That email address doesn't look valid.")
        if (input.website && !/^https?:\/\//.test(input.website)) throw new Error("website must be a URL.")
        const all = leads()
        const domain = input.website ? domainOf(input.website) : null
        const existing =
          (input.id && all.find((l) => l.id === input.id)) ||
          (input.email && all.find((l) => l.email?.toLowerCase() === input.email.toLowerCase())) ||
          (domain && all.find((l) => l.website && domainOf(l.website) === domain))
        const id = existing?.id ?? `L${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
        const fields = Object.fromEntries(Object.entries(input).filter(([k, v]) => k !== "id" && v !== undefined && v !== ""))
        ctx.changes.private("leads", LEADS_FALLBACK, (v) => {
          const i = v.leads.findIndex((l) => l.id === id)
          const now = new Date().toISOString()
          if (i >= 0) v.leads[i] = { ...v.leads[i], ...fields, updatedAt: now }
          else v.leads.push({ id, status: "new", ...fields, createdAt: now, updatedAt: now, by: ctx.agent })
        })
        ctx.run.stats[existing ? "leadsUpdated" : "leadsAdded"] = (ctx.run.stats[existing ? "leadsUpdated" : "leadsAdded"] ?? 0) + 1
        return { id, created: !existing }
      },
    },
    {
      name: "queue_email",
      description: `Draft an email to a lead. "first" for the first contact, "follow-up" after the follow-up interval (${ctx.config.limits.followUpDays.join(" and ")} days, at most ${ctx.config.limits.followUps}). Short, personal, plain text, from James; the opt-out line is added if missing. ${auto ? "Emails go out automatically within the daily cap." : "James approves each draft on Telegram before it's sent."}`,
      input_schema: obj(
        {
          leadId: str("Lead id"),
          kind: { type: "string", enum: ["first", "follow-up"] },
          lang: { type: "string", enum: ["zh", "en"] },
          subject: str("Subject line, specific and plain"),
          body: str("Plain-text body, under 1,200 characters, signed by James, HerbalBath"),
        },
        ["leadId", "kind", "lang", "subject", "body"],
      ),
      run: ({ leadId, kind, lang, subject, body }) => {
        const lead = leads().find((l) => l.id === leadId)
        if (!lead) throw new Error(`No lead ${leadId}.`)
        if (!lead.email) throw new Error("This lead has no email address.")
        if (CLOSED.has(lead.status)) throw new Error(`This lead is ${lead.status}; don't email it.`)
        const emails = outbox().filter((e) => e.leadId === leadId)
        if (emails.some((e) => ["pending", "approved"].includes(e.status))) throw new Error("An email to this lead is already waiting.")
        const sent = emails.filter((e) => e.status === "sent").sort((a, b) => a.sentAt.localeCompare(b.sentAt))
        if (kind === "first" && sent.length) throw new Error("This lead has been emailed already; use a follow-up.")
        if (kind === "follow-up") {
          if (!sent.length) throw new Error("Nothing sent yet; send a first email.")
          if (sent.length > ctx.config.limits.followUps) throw new Error("This lead has had all its follow-ups.")
          const wait = ctx.config.limits.followUpDays[Math.min(sent.length - 1, ctx.config.limits.followUpDays.length - 1)]
          const since = daysBetween(sent.at(-1).sentAt.slice(0, 10), ctx.today.date)
          if (since < wait) throw new Error(`Too soon: ${since} days since the last email, the rule is ${wait}.`)
        }
        const queuedThisRun = ctx.run.stats.emailsQueued ?? 0
        if (queuedThisRun >= ctx.config.limits.emailsPerDay * 2) throw new Error("Enough drafts for this run.")
        let text = body.trim()
        if (text.length > 1500) throw new Error("Keep it under 1,500 characters.")
        const problems = claimProblems([subject, text], lang, rules)
        if (problems.length) throw new Error(`Claims rules:\n- ${problems.join("\n- ")}`)
        if (!/退订|unsubscribe/i.test(text)) text = `${text}\n\n${OPT_OUT[lang]}`
        const id = `E${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
        ctx.changes.private("outbox", OUTBOX_FALLBACK, (v) => {
          v.emails = capped([...v.emails, { id, leadId, to: lead.email, org: lead.org, kind, lang, subject: subject.trim(), body: text, status: auto ? "approved" : "pending", createdAt: new Date().toISOString(), by: ctx.agent }], 1000)
        })
        ctx.run.stats.emailsQueued = queuedThisRun + 1
        ctx.run.emailsForApproval.push({ id, org: lead.org, subject: subject.trim(), body: text })
        return { queued: id, status: auto ? "approved (will send within the daily cap)" : "waiting for James's /approve" }
      },
    },
  ]
}
