"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

const OPILASED = [
  { id: "1",  nimi: "Aleksandr Baburin",        grupp: "G2-5a", slug: "aleksandr-baburin" },
  { id: "2",  nimi: "Sixten Bergmann",          grupp: "G2-1a", slug: "sixten-bergmann" },
  { id: "3",  nimi: "Alari Inno",               grupp: "G2-3a", slug: "alari-inno" },
  { id: "4",  nimi: "Janne Katt",               grupp: "G2-1b", slug: "janne-katt" },
  { id: "5",  nimi: "Käroli Laanemägi",         grupp: "G2-3b", slug: "karoli-laanemagi" },
  { id: "6",  nimi: "Karmo Lill",               grupp: "G2-5b", slug: "karmo-lill" },
  { id: "7",  nimi: "Jakov Nahkurev",           grupp: "G2-2a", slug: "jakov-nahkurev" },
  { id: "8",  nimi: "Karoliina Nasikovski",     grupp: "G2-4b", slug: "karoliina-nasikovski" },
  { id: "9",  nimi: "Evelina Pešehodko",        grupp: "G2-2b", slug: "evelina-pesehodko" },
  { id: "10", nimi: "Karoliina Pihlak",         grupp: "G2-1b", slug: "karoliina-pihlak" },
  { id: "11", nimi: "Eliise Poolma",            grupp: "G2-1a", slug: "eliise-poolma" },
  { id: "12", nimi: "Marta Liina Renser",       grupp: "G2-2b", slug: "marta-renser" },
  { id: "13", nimi: "Neleli Lisbet Timmer",     grupp: "G2-1b", slug: "neleli-timmer" },
  { id: "14", nimi: "Teele Ann Tint",           grupp: "G2-2a", slug: "teele-tint" },
  { id: "15", nimi: "Rasmus Veeväli",           grupp: "G2-5a", slug: "rasmus-veevali" },
];

type Portfoolio = { id: string; blend_url: string | null; storyboard_url: string | null; video_url: string | null };

type UploadState = { [key: string]: { blend?: string; storyboard?: string; video?: string } };

export default function AdminPortfooliodPage() {
  const [portfooliod, setPortfooliod] = useState<Portfoolio[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState<UploadState>({});

  useEffect(() => { laadiPortfooliod(); }, []);

  async function laadiPortfooliod() {
    const { data } = await supabase.from("portfooliod").select("id, blend_url, storyboard_url, video_url");
    setPortfooliod(data ?? []);
  }

  function getPortfoolio(id: string) {
    return portfooliod.find((p) => p.id === id);
  }

  async function uploadFile(opilane: typeof OPILASED[0], type: "blend" | "storyboard" | "video", file: File) {
    const key = `${opilane.id}-${type}`;
    setUploading(key);

    const ext = file.name.split(".").pop();
    const path = `${opilane.slug}/${type}.${ext}`;

    const { error: upErr } = await supabase.storage.from("portfooliod").upload(path, file, { upsert: true });
    if (upErr) { alert("Upload ebaõnnestus: " + upErr.message); setUploading(null); return; }

    const { data: urlData } = supabase.storage.from("portfooliod").getPublicUrl(path);
    const url = urlData.publicUrl;

    const field = type === "blend" ? "blend_url" : type === "storyboard" ? "storyboard_url" : "video_url";
    await supabase.from("portfooliod").upsert({
      id: opilane.id,
      opilane_nimi: opilane.nimi,
      grupp: opilane.grupp,
      slug: opilane.slug,
      [field]: url,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    setSaved((s) => ({ ...s, [key]: { ...s[key] } }));
    await laadiPortfooliod();
    setUploading(null);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://blender-opilased.vercel.app";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Portfooliod</h1>
        <p className="text-zinc-400 mt-1 text-sm">Laadi iga õpilase jaoks üles blend-fail, storyboard ja video</p>
      </div>

      <div className="space-y-3">
        {OPILASED.map((op) => {
          const p = getPortfoolio(op.id);
          const link = `${baseUrl}/portfoolio/${op.slug}`;
          return (
            <div key={op.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-white">{op.nimi}</span>
                  <span className="ml-2 text-xs text-zinc-500">{op.grupp}</span>
                </div>
                <a href={link} target="_blank" rel="noreferrer"
                  className="text-xs text-orange-400 hover:underline font-mono">
                  {link}
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(["blend", "storyboard", "video"] as const).map((type) => {
                  const key = `${op.id}-${type}`;
                  const isUploading = uploading === key;
                  const url = type === "blend" ? p?.blend_url : type === "storyboard" ? p?.storyboard_url : p?.video_url;
                  const accept = type === "blend" ? ".blend" : type === "storyboard" ? "image/*" : "video/*";
                  const icon = type === "blend" ? "🟠" : type === "storyboard" ? "🖼️" : "🎬";
                  const label = type === "blend" ? "Blend fail" : type === "storyboard" ? "Storyboard" : "Video";
                  return (
                    <label key={type} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${url ? "border-green-700 bg-green-900/20 hover:border-green-500" : "border-zinc-700 bg-zinc-800 hover:border-orange-500"}`}>
                      <span>{icon}</span>
                      <span className="text-sm text-zinc-300 flex-1">{isUploading ? "Laadin..." : url ? label + " ✓" : "Lisa " + label}</span>
                      <input
                        type="file"
                        accept={accept}
                        className="hidden"
                        disabled={!!uploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadFile(op, type, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
