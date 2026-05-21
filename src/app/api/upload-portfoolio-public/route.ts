import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const VALID_SLUGS = [
  "aleksandr-baburin","sixten-bergmann","alari-inno","janne-katt",
  "karoli-laanemagi","karmo-lill","jakov-nahkurev","karoliina-nasikovski",
  "evelina-pesehodko","karoliina-pihlak","eliise-poolma","marta-renser",
  "neleli-timmer","teele-tint","rasmus-veevali","arabella-altrof",
];

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const files = form.getAll("files") as File[];
  const slug = form.get("slug") as string;
  const type = form.get("type") as "blend" | "storyboard" | "video";

  if (!files.length || !slug || !type) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (!VALID_SLUGS.includes(slug)) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

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

    results.push({ url: urlData.publicUrl, file: file.name });
  }

  return NextResponse.json({ results });
}
