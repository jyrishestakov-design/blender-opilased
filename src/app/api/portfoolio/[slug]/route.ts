import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("portfoolio_failid")
    .select("id, tyyp, url, failinimi, created_at")
    .eq("slug", slug)
    .order("created_at", { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { id } = await request.json();
  const supabase = supabaseServer();
  await supabase.from("portfoolio_failid").delete().eq("id", id).eq("slug", slug);
  return NextResponse.json({ ok: true });
}
