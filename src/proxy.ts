import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/ankeedid", "/opetused", "/failid", "/sonumid"];

export async function proxy(request: NextRequest) {
  const session = await auth();
  const isProtected = PROTECTED.some((path) => request.nextUrl.pathname.startsWith(path));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
