// How Autopilot talks to James: a Telegram bot in a private chat. Reports and
// files go out; commands, approvals and bank exports come back (inbox.mjs polls
// for them, so no server is needed). Only messages from TELEGRAM_CHAT_ID count.

import { readFileSync } from "node:fs"
import path from "node:path"

const MAX = 3900

export class Telegram {
  constructor({ token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID, fetchImpl = fetch } = {}) {
    this.token = token
    this.chatId = chatId ? String(chatId) : ""
    this.fetch = fetchImpl
  }

  get available() {
    return !!(this.token && this.chatId)
  }

  async call(method, body) {
    const res = await this.fetch(`https://api.telegram.org/bot${this.token}/${method}`, body instanceof FormData ? { method: "POST", body } : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) })
    const json = await res.json().catch(() => ({}))
    if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description ?? res.status}`)
    return json.result
  }

  /** Sends Markdown-ish text as Telegram HTML, split to fit the message limit. */
  async send(markdown) {
    if (!this.available) return false
    for (const chunk of split(toHtml(markdown))) {
      await this.call("sendMessage", { chat_id: this.chatId, text: chunk, parse_mode: "HTML", disable_web_page_preview: true })
    }
    return true
  }

  async sendFile(file, caption = "") {
    if (!this.available) return false
    const form = new FormData()
    form.append("chat_id", this.chatId)
    if (caption) form.append("caption", caption.slice(0, 1000))
    form.append("document", new Blob([readFileSync(file)]), path.basename(file))
    await this.call("sendDocument", form)
    return true
  }

  /** Unconfirmed updates; confirm(lastId) marks them handled so they don't come back. */
  updates() {
    return this.call("getUpdates", { timeout: 0, allowed_updates: ["message"] })
  }

  confirm(lastUpdateId) {
    return this.call("getUpdates", { offset: lastUpdateId + 1, limit: 1, timeout: 0 })
  }

  async download(fileId) {
    const { file_path } = await this.call("getFile", { file_id: fileId })
    const res = await this.fetch(`https://api.telegram.org/file/bot${this.token}/${file_path}`)
    if (!res.ok) throw new Error(`Couldn't download the file (${res.status}).`)
    return Buffer.from(await res.arrayBuffer())
  }
}

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** The Markdown agents write, as the small HTML subset Telegram accepts. */
export function toHtml(markdown) {
  return String(markdown)
    .split("\n")
    .map((line) => {
      let l = escape(line)
      const heading = l.match(/^#{1,6}\s+(.*)$/)
      if (heading) return `<b>${heading[1]}</b>`
      l = l.replace(/^\s*[-*]\s+/, "• ")
      l = l.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      l = l.replace(/`([^`]+)`/g, "<code>$1</code>")
      l = l.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
      return l
    })
    .join("\n")
}

function split(text) {
  if (text.length <= MAX) return [text]
  const out = []
  let current = ""
  for (const para of text.split("\n\n")) {
    if ((current + "\n\n" + para).length > MAX && current) {
      out.push(current)
      current = para
    } else current = current ? `${current}\n\n${para}` : para
    while (current.length > MAX) {
      out.push(current.slice(0, MAX))
      current = current.slice(MAX)
    }
  }
  if (current) out.push(current)
  return out
}
