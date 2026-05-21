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
type UploadingKey = `${string}-${FileType}`;
type Counts = Record<string, { blend: number; storyboard: number; video: number }>;

const SLOTS: { type: FileType; icon: string; label: string; accept: string }[] = [
  { type: "blend",      icon: "🟠", label: "3D failid",  accept: ".blend,.obj,.fbx,.gltf,.glb,.stl,.dae,.3ds,.ply" },
  { type: "storyboard", icon: "🖼️", label: "Pildid",     accept: "image/*" },
  { type: "video",      icon: "🎬", label: "Videod",     accept: "video/*" },
];

function detectType(file: File): FileType | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["blend","obj","fbx","gltf","glb","stl","dae","3ds","ply"].includes(ext)) return "blend";
  if (file.type.startsWith("image/")) return "storyboard";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function AdminPortfooliodPage() {
  const [counts, setCounts] = useState<Counts>({});
  const [uploading, setUploading] = useState<Set<UploadingKey>>(new Set());
  const [dragOver, setDragOver] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("portfoolio_failid")
      .select("slug, tyyp");
    const c: Counts = {};
    for (const row of data ?? []) {
      if (!c[row.slug]) c[row.slug] = { blend: 0, storyboard: 0, video: 0 };
      c[row.slug][row.tyyp as FileType] = (c[row.slug][row.tyyp as FileType] ?? 0) + 1;
    }
    setCounts(c);
  }

  async function uploadFiles(opilane: typeof OPILASED[0], type: FileType, files: File[]) {
    if (!files.length) return;
    const key: UploadingKey = `${opilane.id}-${type}`;
    setUploading((s) => new Set(s).add(key));
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("slug", opilane.slug);
    form.append("id", opilane.id);
    form.append("nimi", opilane.nimi);
    form.append("grupp", opilane.grupp);
    form.append("type", type);
    const res = await fetch("/api/upload-portfoolio", { method: "POST", body: form });
    if (!res.ok) { const d = await res.json(); alert("Upload ebaõnnestus: " + d.error); }
    else await load();
    setUploading((s) => { const n = new Set(s); n.delete(key); return n; });
  }

  function handleDrop(files: FileList | null, opilane: typeof OPILASED[0], fixedType?: FileType) {
    if (!files) return;
    const grouped: Record<FileType, File[]> = { blend: [], storyboard: [], video: [] };
    for (const file of Array.from(files)) {
      const t = fixedType ?? detectType(file);
      if (!t) { alert(`Tundmatu failitüüp: ${file.name}`); continue; }
      grouped[t].push(file);
    }
    for (const [t, fs] of Object.entries(grouped) as [FileType, File[]][]) {
      if (fs.length) uploadFiles(opilane, t, fs);
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://blender-opilased.vercel.app";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Portfooliod</h1>
        <p className="text-zinc-400 mt-1 text-sm">Lohista failid kaardi peale — tüüp tuvastatakse automaatselt. Mitu faili korraga.</p>
      </div>

      <div className="space-y-3">
        {OPILASED.map((op) => {
          const c = counts[op.slug] ?? { blend: 0, storyboard: 0, video: 0 };
          const isCardOver = dragOver === op.id;
          const anyUploading = SLOTS.some(({ type }) => uploading.has(`${op.id}-${type}` as UploadingKey));

          return (
            <div key={op.id}
              className={`bg-zinc-900 border-2 rounded-xl p-4 transition-all ${isCardOver ? "border-orange-400 bg-orange-500/5" : "border-zinc-800"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(op.id); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
              onDrop={(e) => { e.preventDefault(); setDragOver(null); handleDrop(e.dataTransfer.files, op); }}
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{isCardOver ? "↓ Lase lahti" : op.nimi}</span>
                  {op.grupp && <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{op.grupp}</span>}
                  {anyUploading && <span className="text-xs text-orange-400 animate-pulse">laadin...</span>}
                </div>
                <a href={`${baseUrl}/portfoolio/${op.slug}`} target="_blank" rel="noreferrer"
                  className="text-xs text-zinc-500 hover:text-orange-400 font-mono transition-colors">
                  /portfoolio/{op.slug} ↗
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map(({ type, icon, label, accept }) => {
                  const count = c[type];
                  const busy = uploading.has(`${op.id}-${type}` as UploadingKey);
                  return (
                    <label key={type}
                      className={`flex flex-col items-center gap-1 h-20 rounded-lg border-2 border-dashed cursor-pointer transition-all
                        ${busy ? "opacity-50 pointer-events-none border-zinc-700" : count > 0 ? "border-green-700 bg-green-900/10 hover:border-green-500" : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-500"}`}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e.dataTransfer.files, op, type); }}
                    >
                      <span className="text-xl mt-3">{busy ? "⏳" : icon}</span>
                      <span className="text-xs text-zinc-400">{busy ? "Laadin..." : count > 0 ? `${label} (${count})` : label}</span>
                      <input type="file" multiple accept={accept} className="hidden" disabled={busy}
                        onChange={(e) => { handleDrop(e.target.files, op, type); e.target.value = ""; }} />
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
