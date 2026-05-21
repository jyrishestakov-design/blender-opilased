"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = { id: string; pealkiri: string; kirjeldus: string; youtube_id: string; kategooria: string; kestus_minutid: number | null };

const KATEGOORIAD = ["Kõik", "Algtase", "Kesktase", "Edasijõudnu"];
const PIKKUSED = [
  { label: "Kõik pikkused", min: 0, max: Infinity },
  { label: "Lühike (< 15 min)", min: 0, max: 15 },
  { label: "Keskmine (15–30 min)", min: 15, max: 30 },
  { label: "Pikk (> 30 min)", min: 30, max: Infinity },
];

function kestusLabel(min: number | null) {
  if (!min) return null;
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}t ${m}min` : `${h}t`;
}

export default function VideodPage() {
  const [videod, setVideod] = useState<Video[]>([]);
  const [filter, setFilter] = useState("Kõik");
  const [pikkus, setPikkus] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("youtube_videod").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setVideod(data ?? []); setLoading(false); });
  }, []);

  const filtered = videod
    .filter((v) => filter === "Kõik" || v.kategooria === filter)
    .filter((v) => {
      const { min, max } = PIKKUSED[pikkus];
      if (min === 0 && max === Infinity) return true;
      if (!v.kestus_minutid) return true;
      return v.kestus_minutid >= min && v.kestus_minutid < max;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Õpetuse videod</h1>
        <p className="text-zinc-400 mt-1">Blenderi õpetused YouTube'ist</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {KATEGOORIAD.map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filter === k
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="w-px bg-zinc-700 mx-1 hidden sm:block" />

        <div className="flex gap-2 flex-wrap">
          {PIKKUSED.map((p, i) => (
            <button
              key={i}
              onClick={() => setPikkus(i)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                pikkus === i
                  ? "bg-zinc-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-zinc-600 text-xs mb-4">{filtered.length} videot</p>

      {loading ? (
        <p className="text-zinc-500">Laadin...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-zinc-500">Ühtegi videot pole selle filtriga.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => (
            <div key={v.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden transition-colors">
              <div className="aspect-video bg-zinc-800 relative">
                <iframe
                  src={`https://www.youtube.com/embed/${v.youtube_id}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm leading-snug">{v.pealkiri}</h3>
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded flex-shrink-0">{v.kategooria}</span>
                </div>
                {v.kirjeldus && <p className="text-zinc-500 text-xs leading-relaxed mb-2">{v.kirjeldus}</p>}
                {v.kestus_minutid && (
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    🕐 {kestusLabel(v.kestus_minutid)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
