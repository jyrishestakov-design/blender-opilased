"use client";

import { useEffect, useState } from "react";
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
  { id: "16", nimi: "Arabella Altrof",          grupp: "G2-5a", slug: "arabella-altrof" },
];

type FileType = "blend" | "storyboard" | "video";
type Portfoolio = { id: string; blend_url: string | null; storyboard_url: string | null; video_url: string | null };
type UploadingKey = `${string}-${"blend" | "storyboard" | "video"}`;

function detectType(file: File): FileType | null {
  const name = file.name.toLowerCase();
  const mime = file.type;
  if (name.endsWith(".blend")) return "blend";
  if (mime.startsWith("image/")) return "storyboard";
  if (mime.startsWith("video/")) return "video";
  return null;
}

function DropZone({
  opilane,
  type,
  url,
  uploading,
  onFile,
}: {
  opilane: typeof OPILASED[0];
  type: FileType;
  url: string | null;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const [over, setOver] = useState(false);
  const icon = type === "blend" ? "🟠" : type === "storyboard" ? "🖼️" : "🎬";
  const label = type === "blend" ? "Blend" : type === "storyboard" ? "Storyboard" : "Video";
  const accept = type === "blend" ? ".blend" : type === "storyboard" ? "image/*" : "video/*";

  return (
    <label
      className={`relative flex flex-col items-center justify-center gap-1 h-20 rounded-lg border-2 border-dashed cursor-pointer transition-all select-none
        ${uploading ? "opacity-50 pointer-events-none" : ""}
        ${over ? "border-orange-400 bg-orange-500/10" : url ? "border-green-700 bg-green-900/10 hover:border-green-500" : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      <span className="text-xl">{uploading ? "⏳" : icon}</span>
      <span className="text-xs text-zinc-400">{uploading ? "Laadin..." : url ? label + " ✓" : label}</span>
      {url && !uploading && (
        <span className="text-[10px] text-green-500">kliki uuendamiseks</span>
      )}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export default function AdminPortfooliodPage() {
  const [portfooliod, setPortfooliod] = useState<Portfoolio[]>([]);
  const [uploading, setUploading] = useState<Set<UploadingKey>>(new Set());
  const [dragOver, setDragOver] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("portfooliod").select("id, blend_url, storyboard_url, video_url");
    setPortfooliod(data ?? []);
  }

  function getP(id: string) { return portfooliod.find((p) => p.id === id); }

  async function uploadFile(opilane: typeof OPILASED[0], type: FileType, file: File) {
    const key: UploadingKey = `${opilane.id}-${type}`;
    setUploading((s) => new Set(s).add(key));

    const form = new FormData();
    form.append("file", file);
    form.append("slug", opilane.slug);
    form.append("id", opilane.id);
    form.append("nimi", opilane.nimi);
    form.append("grupp", opilane.grupp);
    form.append("type", type);

    const res = await fetch("/api/upload-portfoolio", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      alert("Upload ebaõnnestus: " + data.error);
    } else {
      await load();
    }
    setUploading((s) => { const n = new Set(s); n.delete(key); return n; });
  }

  function handleCardDrop(e: React.DragEvent, opilane: typeof OPILASED[0]) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const type = detectType(file);
    if (!type) { alert(`Tundmatu failitüüp: ${file.name}\nKasuta .blend, pilti või videot.`); return; }
    uploadFile(opilane, type, file);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://blender-opilased.vercel.app";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Portfooliod</h1>
        <p className="text-zinc-400 mt-1 text-sm">Lohista fail kaardi peale — tüüp tuvastatakse automaatselt (.blend / pilt / video)</p>
      </div>

      <div className="space-y-3">
        {OPILASED.map((op) => {
          const p = getP(op.id);
          const isCardOver = dragOver === op.id;
          const anyUploading = (["blend","storyboard","video"] as FileType[]).some((t) => uploading.has(`${op.id}-${t}` as UploadingKey));

          return (
            <div
              key={op.id}
              className={`bg-zinc-900 border-2 rounded-xl p-4 transition-all ${isCardOver ? "border-orange-400 bg-orange-500/5" : "border-zinc-800"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(op.id); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
              onDrop={(e) => handleCardDrop(e, op)}
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {isCardOver && <span className="text-orange-400 text-sm">Lase lahti →</span>}
                  {!isCardOver && <span className="font-semibold text-white">{op.nimi}</span>}
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{op.grupp}</span>
                  {anyUploading && <span className="text-xs text-orange-400">laadin...</span>}
                </div>
                <a href={`${baseUrl}/portfoolio/${op.slug}`} target="_blank" rel="noreferrer"
                  className="text-xs text-zinc-500 hover:text-orange-400 font-mono transition-colors">
                  /portfoolio/{op.slug} ↗
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["blend", "storyboard", "video"] as FileType[]).map((type) => (
                  <DropZone
                    key={type}
                    opilane={op}
                    type={type}
                    url={type === "blend" ? p?.blend_url ?? null : type === "storyboard" ? p?.storyboard_url ?? null : p?.video_url ?? null}
                    uploading={uploading.has(`${op.id}-${type}` as UploadingKey)}
                    onFile={(file) => uploadFile(op, type, file)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
