import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = supabaseServer();
  const { data } = await supabase.from("portfoolio_failid").select("slug, tyyp");
  const counts: Record<string, { blend: boolean; storyboard: boolean; video: boolean }> = {};
  for (const row of data ?? []) {
    if (!counts[row.slug]) counts[row.slug] = { blend: false, storyboard: false, video: false };
    counts[row.slug][row.tyyp as "blend" | "storyboard" | "video"] = true;
  }
  return NextResponse.json(counts);
}
