import { NextResponse, type NextRequest } from "next/server"
import { INTERNAL_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/app/lib/internal-auth"

export async function POST(request: NextRequest) {
  const configured = process.env.INTERNAL_SITE_PASSWORD
  if (!configured) {
    return NextResponse.json(
      { error: "INTERNAL_SITE_PASSWORD is not set — nothing to log in to yet." },
      { status: 503 },
    )
  }

  const form = await request.formData()
  const password = String(form.get("password") ?? "")
  const from = String(form.get("from") ?? "/internal")
  const redirectTo = from.startsWith("/internal") ? from : "/internal"

  if (!verifyPassword(password, configured)) {
    const url = new URL("/internal/login", request.url)
    url.searchParams.set("error", "1")
    url.searchParams.set("from", redirectTo)
    return NextResponse.redirect(url, { status: 303 })
  }

  const token = await createSessionToken(configured)
  const response = NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 })
  response.cookies.set(INTERNAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })
  return response
}
