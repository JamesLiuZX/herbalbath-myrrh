// Signed-cookie auth for /internal — a single shared password, not a user
// accounts system. Deliberately has no database: the HMAC key is derived
// from the password itself (SHA-256 of it), so a session token is only
// mintable by someone who already passed the password check, and it's
// verifiable in Edge middleware with zero network calls. Uses Web Crypto
// (globalThis.crypto.subtle) rather than Node's `crypto` module so the same
// code runs in both the Edge middleware and the Node route handler.

export const INTERNAL_SESSION_COOKIE = "hb_internal_session"
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function hmacKeyFromPassword(password: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))
  return crypto.subtle.importKey("raw", digest, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
}

async function sign(password: string, message: string): Promise<string> {
  const key = await hmacKeyFromPassword(password)
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
  return bufferToHex(sig)
}

/** Builds a signed "<expiryMs>.<hmac>" token good for 30 days. */
export async function createSessionToken(password: string): Promise<string> {
  const expires = Date.now() + SESSION_DURATION_MS
  const sig = await sign(password, String(expires))
  return `${expires}.${sig}`
}

export async function verifySessionToken(
  token: string | undefined,
  password: string,
): Promise<boolean> {
  if (!token) return false
  const [expiresStr, sig] = token.split(".")
  if (!expiresStr || !sig) return false
  const expires = Number(expiresStr)
  if (!Number.isFinite(expires) || expires < Date.now()) return false
  const expected = await sign(password, expiresStr)
  return timingSafeEqual(sig, expected)
}

export function verifyPassword(candidate: string, actual: string): boolean {
  return candidate.length > 0 && timingSafeEqual(candidate, actual)
}
