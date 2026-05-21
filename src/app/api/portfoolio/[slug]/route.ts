import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("portfooliod")
    .select("blend_url, storyboard_url, video_url")
    .eq("slug", slug)
    .single();
  return NextResponse.json(data ?? { blend_url: null, storyboard_url: null, video_url: null });
}
