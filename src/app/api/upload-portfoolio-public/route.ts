import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const VALID_SLUGS = [
  "aleksandr-baburin", "sixten-bergmann", "alari-inno", "janne-katt",
  "karoli-laanemagi", "karmo-lill", "jakov-nahkurev", "karoliina-nasikovski",
  "evelina-pesehodko", "karoliina-pihlak", "eliise-poolma", "marta-renser",
  "neleli-timmer", "teele-tint", "rasmus-veevali", "arabella-altrof",
];

const OPILASED: Record<string, { id: string; nimi: string; grupp: string }> = {
  "aleksandr-baburin":    { id: "1",  nimi: "Aleksandr Baburin",    grupp: "G2-5a" },
  "sixten-bergmann":      { id: "2",  nimi: "Sixten Bergmann",       grupp: "G2-1a" },
  "alari-inno":           { id: "3",  nimi: "Alari Inno",            grupp: "G2-3a" },
  "janne-katt":           { id: "4",  nimi: "Janne Katt",            grupp: "G2-1b" },
  "karoli-laanemagi":     { id: "5",  nimi: "Käroli Laanemägi",      grupp: "G2-3b" },
  "karmo-lill":           { id: "6",  nimi: "Karmo Lill",            grupp: "G2-5b" },
  "jakov-nahkurev":       { id: "7",  nimi: "Jakov Nahkurev",        grupp: "G2-2a" },
  "karoliina-nasikovski": { id: "8",  nimi: "Karoliina Nasikovski",  grupp: "G2-4b" },
  "evelina-pesehodko":    { id: "9",  nimi: "Evelina Pešehodko",     grupp: "G2-2b" },
  "karoliina-pihlak":     { id: "10", nimi: "Karoliina Pihlak",      grupp: "G2-1b" },
  "eliise-poolma":        { id: "11", nimi: "Eliise Poolma",         grupp: "G2-1a" },
  "marta-renser":         { id: "12", nimi: "Marta Liina Renser",    grupp: "G2-2b" },
  "neleli-timmer":        { id: "13", nimi: "Neleli Lisbet Timmer",  grupp: "G2-1b" },
  "teele-tint":           { id: "14", nimi: "Teele Ann Tint",        grupp: "G2-2a" },
  "rasmus-veevali":       { id: "15", nimi: "Rasmus Veeväli",        grupp: "G2-5a" },
  "arabella-altrof":      { id: "16", nimi: "Arabella Altrof",       grupp: "G2-5a" },
};

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file") as File | null;
  const slug = form.get("slug") as string;
  const type = form.get("type") as "blend" | "storyboard" | "video";

  if (!file || !slug || !type) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (!VALID_SLUGS.includes(slug)) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  const opilane = OPILASED[slug];
  const supabase = supabaseServer();
  const ext = file.name.split(".").pop();
  const path = `${slug}/${type}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("portfooliod")
    .upload(path, Buffer.from(bytes), { upsert: true, contentType: file.type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("portfooliod").getPublicUrl(path);
  const field = type === "blend" ? "blend_url" : type === "storyboard" ? "storyboard_url" : "video_url";

  await supabase.from("portfooliod").upsert({
    id: opilane.id, opilane_nimi: opilane.nimi, grupp: opilane.grupp, slug,
    [field]: urlData.publicUrl, updated_at: new Date().toISOString(),
  }, { onConflict: "id" });

  return NextResponse.json({ url: urlData.publicUrl });
}
