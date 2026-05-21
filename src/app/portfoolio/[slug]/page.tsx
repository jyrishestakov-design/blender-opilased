"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
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

type Fail = { id: string; tyyp: string; url: string; failinimi: string };

const TYYBID = [
  { key: "storyboard", icon: "🖼️", label: "Storyboard / Pildid" },
  { key: "video",      icon: "🎬", label: "Videod" },
  { key: "blend",      icon: "🟠", label: "3D failid" },
];

export default function PortfoolioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const opilane = OPILASED.find((o) => o.slug === slug);
  const [failid, setFailid] = useState<Fail[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/portfoolio/${slug}`);
    if (res.ok) setFailid(await res.json());
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (!opilane) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
      Õpilast ei leitud.
    </div>
  );

  const byType = (t: string) => failid.filter((f) => f.tyyp === t);
  const hasAny = failid.length > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <a href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">← Kõik õpilased</a>
          <p className="text-orange-400 text-sm font-medium mt-3 mb-1">Blender Kool{opilane.grupp ? ` · ${opilane.grupp}` : ""}</p>
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
          <div className="space-y-8">
            {TYYBID.map(({ key, icon, label }) => {
              const fs = byType(key);
              if (!fs.length) return null;
              return (
                <div key={key}>
                  <h2 className="flex items-center gap-2 font-semibold text-zinc-300 mb-3">
                    <span>{icon}</span>{label}
                    <span className="text-xs text-zinc-600 font-normal">{fs.length} faili</span>
                  </h2>
                  <div className="space-y-2">
                    {key === "storyboard" && fs.map((f) => (
                      <div key={f.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <img src={f.url} alt={f.failinimi} className="w-full" />
                        <div className="px-4 py-2 text-xs text-zinc-500">{f.failinimi}</div>
                      </div>
                    ))}
                    {key === "video" && fs.map((f) => (
                      <div key={f.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <video src={f.url} controls className="w-full" />
                        <div className="px-4 py-2 text-xs text-zinc-500">{f.failinimi}</div>
                      </div>
                    ))}
                    {key === "blend" && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
                        {fs.map((f) => (
                          <div key={f.id} className="px-4 py-3 flex items-center justify-between">
                            <span className="text-sm text-zinc-300">{f.failinimi}</span>
                            <a href={f.url} download className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                              ↓ Laadi alla
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <UploadSection slug={slug} onDone={load} />
      </div>
    </div>
  );
}
