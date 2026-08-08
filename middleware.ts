import { NextResponse, type NextRequest } from "next/server"
import { INTERNAL_SESSION_COOKIE, verifySessionToken } from "@/app/lib/internal-auth"

// Gates everything under /internal behind INTERNAL_SITE_PASSWORD. The login
// page itself has to stay reachable, otherwise there's no way to authenticate.
export async function middleware(request: NextRequest) {
  const password = process.env.INTERNAL_SITE_PASSWORD
  const { pathname } = request.nextUrl

  if (pathname === "/internal/login") {
    return NextResponse.next()
  }

  // Fail closed: no password configured means nobody gets in, rather than
  // the section sitting open because a env var was never set.
  if (!password) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const token = request.cookies.get(INTERNAL_SESSION_COOKIE)?.value
  const authed = await verifySessionToken(token, password)

  if (!authed) {
    const loginUrl = new URL("/internal/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/internal/:path*"],
}
