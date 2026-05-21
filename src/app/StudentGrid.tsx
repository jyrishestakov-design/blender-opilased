"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

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

const RÜHMAD = [...new Set(OPILASED.map((o) => o.grupp))].sort();

type Counts = Record<string, { blend: boolean; storyboard: boolean; video: boolean }>;
type FileType = "blend" | "storyboard" | "video";

function detectType(file: File): FileType | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["blend","obj","fbx","gltf","glb","stl","dae","3ds","ply"].includes(ext)) return "blend";
  if (file.type.startsWith("image/")) return "storyboard";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function StudentGrid({ initialCounts }: { initialCounts: Counts }) {
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const refreshCounts = useCallback(async () => {
    const res = await fetch("/api/portfoolio-counts");
    if (res.ok) setCounts(await res.json());
  }, []);

  async function handleDrop(e: React.DragEvent, opilane: typeof OPILASED[0]) {
    e.preventDefault();
    setDragOver(null);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const grouped: Record<FileType, File[]> = { blend: [], storyboard: [], video: [] };
    for (const file of files) {
      const t = detectType(file);
      if (!t) { alert(`Tundmatu failitüüp: ${file.name}`); continue; }
      grouped[t].push(file);
    }

    for (const [type, fs] of Object.entries(grouped) as [FileType, File[]][]) {
      if (!fs.length) continue;
      setUploading(opilane.slug);
      const form = new FormData();
      fs.forEach((f) => form.append("files", f));
      form.append("slug", opilane.slug);
      form.append("type", type);
      await fetch("/api/upload-portfoolio-public", { method: "POST", body: form });
    }

    setUploading(null);
    setDone(opilane.slug);
    setTimeout(() => setDone(null), 2000);
    await refreshCounts();
  }

  return (
    <div className="space-y-8">
      {RÜHMAD.map((ryhm) => (
        <div key={ryhm}>
          <h2 className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">{ryhm || "Rühm määramata"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OPILASED.filter((o) => o.grupp === ryhm).map((op) => {
              const p = counts[op.slug];
              const isOver = dragOver === op.slug;
              const isUploading = uploading === op.slug;
              const isDone = done === op.slug;

              return (
                <div
                  key={op.id}
                  className={`relative rounded-xl border-2 transition-all ${
                    isOver ? "border-orange-400 bg-orange-500/10 scale-[1.02]" :
                    isUploading ? "border-orange-500/50 bg-orange-500/5" :
                    isDone ? "border-green-500/50 bg-green-500/5" :
                    "border-zinc-800 bg-zinc-900"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(op.slug); }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
                  onDrop={(e) => handleDrop(e, op)}
                >
                  <Link href={`/portfoolio/${op.slug}`} className="block p-4 group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={`font-semibold transition-colors ${isOver ? "text-orange-400" : "text-white group-hover:text-orange-400"}`}>
                          {isOver ? "↓ Lase lahti" : isUploading ? "Laadin..." : isDone ? "✓ Lisatud!" : op.nimi}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">{op.grupp}</p>
                      </div>
                      <span className="text-zinc-600 group-hover:text-orange-400 transition-colors text-sm">↗</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label: "Blend", has: !!p?.blend, icon: "🟠" },
                        { label: "Storyboard", has: !!p?.storyboard, icon: "🖼️" },
                        { label: "Video", has: !!p?.video, icon: "🎬" },
                      ].map(({ label, has, icon }) => (
                        <span key={label} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${has ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-zinc-800 text-zinc-600 border border-zinc-700"}`}>
                          {icon} {label}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
