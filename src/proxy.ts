import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PROTECTED = ["/dashboard", "/ankeedid", "/opetused", "/failid", "/sonumid", "/videod"];
const ADMIN_ONLY = ["/admin"];

export async function proxy(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Admin lehed ainult õpetajale
  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (session?.user.role !== "opetaja") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Kõik kaitstud lehed vajavad sisselogimist
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Kontrolli lehe nähtavust (ainult logitud kasutajatele, mitte õpetajale)
  if (isProtected && session && session.user.role !== "opetaja") {
    const slug = pathname.split("/")[1];
    if (slug) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      );
      const { data } = await supabase.from("lehed").select("nahtav").eq("slug", slug).single();
      if (data && data.nahtav === false) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
