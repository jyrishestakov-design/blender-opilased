"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import UploadSection from "./UploadSection";

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

type Portfoolio = { blend_url: string | null; storyboard_url: string | null; video_url: string | null };

export default function PortfoolioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const opilane = OPILASED.find((o) => o.slug === slug);
  const [data, setData] = useState<Portfoolio | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/portfoolio/${slug}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (!opilane) return null;

  const hasAny = data?.blend_url || data?.storyboard_url || data?.video_url;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <a href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">← Kõik õpilased</a>
          <p className="text-orange-400 text-sm font-medium mt-3 mb-1">Blender Kool · {opilane.grupp}</p>
          <h1 className="text-3xl font-bold">{opilane.nimi}</h1>
          <p className="text-zinc-500 mt-1">Portfoolio</p>
        </div>

        {loading ? (
          <p className="text-zinc-600">Laadin...</p>
        ) : !hasAny ? (
          <div className="text-center py-16 text-zinc-600">
            <p className="text-4xl mb-3">🎨</p>
            <p>Failid pole veel lisatud.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.storyboard_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="text-lg">🖼️</span>
                  <h2 className="font-semibold">Storyboard</h2>
                </div>
                <div className="p-4">
                  <img src={data.storyboard_url} alt="Storyboard" className="w-full rounded-lg" />
                </div>
              </div>
            )}

            {data?.video_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="text-lg">🎬</span>
                  <h2 className="font-semibold">Renderdatud video</h2>
                </div>
                <div className="p-4">
                  <video src={data.video_url} controls className="w-full rounded-lg" />
                </div>
              </div>
            )}

            {data?.blend_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟠</span>
                  <div>
                    <p className="font-semibold">Blender fail</p>
                    <p className="text-zinc-500 text-sm">.blend</p>
                  </div>
                </div>
                <a href={data.blend_url} download className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  ↓ Laadi alla
                </a>
              </div>
            )}
          </div>
        )}

        <UploadSection slug={slug} onDone={load} />
      </div>
    </div>
  );
}
