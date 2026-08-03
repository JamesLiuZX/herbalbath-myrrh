// Captain (代理) codes.
//
// The existing /partner flow generated a URL like
//   https://herbalbathsg.com/?ref=AuntieMary
// and asked the partner to copy it to their clipboard. That is the wrong
// interaction for a 62-year-old on a phone: it requires selecting text,
// copying, switching apps, and pasting — and if any step fails there is no
// error, the share just silently never happens. It is very likely the single
// reason the partner program has no traction.
//
// A code is different. A code can be said out loud over a kopi, written on a
// card, or typed into a WhatsApp message by the *buyer* instead of the
// seller. It survives being screenshotted, forwarded, and re-photographed —
// which is exactly how things actually travel in this demographic.

/**
 * Deliberately excludes 0/O, 1/I/L and 5/S. Codes get read aloud, written by
 * hand on referral cards, and re-typed from a photo of a WhatsApp message —
 * every one of those steps confuses those characters.
 */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXY2346789"
const CODE_LENGTH = 5

export function generateCaptainCode(): string {
  let code = ""
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return code
}

/**
 * Characters that are never issued, mapped to the issued glyph a human most
 * likely misread. Someone typing a code off a photo of a forwarded WhatsApp
 * message will reach for O when they saw Q, or 1 when they saw J.
 */
const CONFUSABLE_TO_ISSUED: Record<string, string> = {
  O: "Q",
  "0": "Q",
  I: "J",
  L: "J",
  "1": "J",
  S: "6",
  "5": "6",
  Z: "2",
}

/**
 * Accepts whatever the buyer actually typed — lowercase, spaced out, with
 * confusable characters substituted the way a human would substitute them.
 * "my code is m4k p2" resolves the same as "M4KP2".
 */
export function normaliseCaptainCode(input: string): string {
  return [...input.toUpperCase().replace(/[^A-Z0-9]/g, "")]
    .map((ch) => CONFUSABLE_TO_ISSUED[ch] ?? ch)
    .join("")
    .slice(0, CODE_LENGTH)
}

export function isValidCaptainCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false
  return [...code].every((ch) => CODE_ALPHABET.includes(ch))
}

export interface Captain {
  code: string
  name: string
  /** Digits only. Used to deduplicate re-registrations and to PayNow them. */
  phone: string
  createdAt: string
}

/**
 * The one-tap share link. Two properties matter and both are easy to get
 * wrong:
 *
 *  1. It opens WhatsApp with the message ALREADY WRITTEN. The captain taps
 *     once and picks a chat — no typing, no clipboard.
 *  2. The attribution rides inside the message text, not in a URL parameter.
 *     Query strings get stripped when a message is forwarded, screenshotted,
 *     or retyped; a code written in Chinese prose survives all three.
 */
export function buildCaptainShareLink(
  whatsappNumber: string,
  code: string,
  captainName: string,
): string {
  const message = `您好！我想订购没药喷雾。我的介绍人是 ${captainName}，介绍码 ${code}。`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

/**
 * What the captain forwards INTO their own groups. Addressed to the group,
 * not to the shop — the captain is recommending something to friends, which
 * is the whole reason this converts better than an advertisement.
 */
export function buildCaptainBroadcastText(
  whatsappNumber: string,
  code: string,
  captainName: string,
  site: string,
): string {
  return [
    "我自己在用的没药喷雾，膝盖和肩膀酸痛擦了很舒服，推荐给大家 🌿",
    "",
    `订购：WhatsApp ${formatPhoneForHumans(whatsappNumber)}`,
    `讲我的介绍码：${code}（${captainName}）`,
    site,
  ].join("\n")
}

/** 6584261225 -> 8426 1225 — how a Singaporean actually reads a number aloud. */
export function formatPhoneForHumans(digits: string): string {
  const local = digits.replace(/^65/, "")
  return local.length === 8 ? `${local.slice(0, 4)} ${local.slice(4)}` : local
}
