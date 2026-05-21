import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user.role !== "opetaja") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files") as File[];
  const slug = form.get("slug") as string;
  const id = form.get("id") as string;
  const nimi = form.get("nimi") as string;
  const grupp = form.get("grupp") as string;
  const type = form.get("type") as "blend" | "storyboard" | "video";

  if (!files.length || !slug || !id || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = supabaseServer();
  const results = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const path = `${slug}/${type}/${unique}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from("portfooliod")
      .upload(path, Buffer.from(bytes), { upsert: false, contentType: file.type });

    if (error) { results.push({ error: error.message, file: file.name }); continue; }

    const { data: urlData } = supabase.storage.from("portfooliod").getPublicUrl(path);

    await supabase.from("portfoolio_failid").insert({
      slug, tyyp: type, url: urlData.publicUrl, failinimi: file.name,
    });

    // Keep portfooliod table in sync (latest file per type)
    await supabase.from("portfooliod").upsert({
      id, opilane_nimi: nimi, grupp, slug,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    results.push({ url: urlData.publicUrl, file: file.name });
  }

  return NextResponse.json({ results });
}
