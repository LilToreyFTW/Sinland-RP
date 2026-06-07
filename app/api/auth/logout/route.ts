import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/session";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set(getSessionCookieName(), "", getSessionCookieOptions(0));
  return response;
}
