"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = { id: string; pealkiri: string; kirjeldus: string; youtube_id: string; kategooria: string };

const KATEGOORIAD = ["Kõik", "Algtase", "Kesktase", "Edasijõudnu"];

export default function VideodPage() {
  const [videod, setVideod] = useState<Video[]>([]);
  const [filter, setFilter] = useState("Kõik");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("youtube_videod").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setVideod(data ?? []); setLoading(false); });
  }, []);

  const filtered = filter === "Kõik" ? videod : videod.filter((v) => v.kategooria === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Õpetuse videod</h1>
        <p className="text-zinc-400 mt-1">Blenderi õpetused YouTube'ist</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
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

      {loading ? (
        <p className="text-zinc-500">Laadin...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-zinc-500">Ühtegi videot pole veel lisatud.</p>
          <p className="text-zinc-600 text-sm mt-1">Õpetaja lisab videod peagi!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => (
            <div key={v.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden transition-colors">
              <div className="aspect-video bg-zinc-800">
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
                {v.kirjeldus && <p className="text-zinc-500 text-xs leading-relaxed">{v.kirjeldus}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
