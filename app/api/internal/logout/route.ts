import { NextResponse, type NextRequest } from "next/server"
import { INTERNAL_SESSION_COOKIE } from "@/app/lib/internal-auth"

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/internal/login", request.url), { status: 303 })
  response.cookies.delete(INTERNAL_SESSION_COOKIE)
  return response
}
