import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user.role !== "opetaja") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const slug = form.get("slug") as string;
  const id = form.get("id") as string;
  const nimi = form.get("nimi") as string;
  const grupp = form.get("grupp") as string;
  const type = form.get("type") as "blend" | "storyboard" | "video";

  if (!file || !slug || !id || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = supabaseServer();
  const ext = file.name.split(".").pop();
  const path = `${slug}/${type}.${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage
    .from("portfooliod")
    .upload(path, buffer, { upsert: true, contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("portfooliod").getPublicUrl(path);
  const field = type === "blend" ? "blend_url" : type === "storyboard" ? "storyboard_url" : "video_url";

  const { error: dbErr } = await supabase.from("portfooliod").upsert({
    id, opilane_nimi: nimi, grupp, slug,
    [field]: urlData.publicUrl,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ url: urlData.publicUrl });
}
