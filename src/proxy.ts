import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ONLY = ["/admin"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    const session = await auth();
    if (session?.user.role !== "opetaja") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
