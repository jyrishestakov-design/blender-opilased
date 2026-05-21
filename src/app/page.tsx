import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

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

type Portfoolio = { slug: string; blend_url: string | null; storyboard_url: string | null; video_url: string | null };

export default async function HomePage() {
  const supabase = supabaseServer();
  const { data } = await supabase.from("portfooliod").select("slug, blend_url, storyboard_url, video_url");
  const portfooliod: Portfoolio[] = data ?? [];

  function getP(slug: string) { return portfooliod.find((p) => p.slug === slug); }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-400 text-sm font-medium mb-1">Blender Kool</p>
            <h1 className="text-3xl font-bold">Õpilaste portfooliod</h1>
          </div>
          <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Õpetaja sisselogimine →
          </Link>
        </div>

        <div className="space-y-8">
          {RÜHMAD.map((ryhm) => (
            <div key={ryhm}>
              <h2 className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">{ryhm || "Rühm määramata"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {OPILASED.filter((o) => o.grupp === ryhm).map((op) => {
                  const p = getP(op.slug);
                  const hasBlend = !!p?.blend_url;
                  const hasStoryboard = !!p?.storyboard_url;
                  const hasVideo = !!p?.video_url;
                  const hasAny = hasBlend || hasStoryboard || hasVideo;

                  return (
                    <Link
                      key={op.id}
                      href={`/portfoolio/${op.slug}`}
                      className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl p-4 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">{op.nimi}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{op.grupp}</p>
                        </div>
                        <span className="text-zinc-600 group-hover:text-orange-400 transition-colors text-sm">↗</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { label: "Blend", has: hasBlend, icon: "🟠" },
                          { label: "Storyboard", has: hasStoryboard, icon: "🖼️" },
                          { label: "Video", has: hasVideo, icon: "🎬" },
                        ].map(({ label, has, icon }) => (
                          <span key={label} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${has ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-zinc-800 text-zinc-600 border border-zinc-700"}`}>
                            {icon} {label}
                          </span>
                        ))}
                      </div>
                      {!hasAny && (
                        <p className="text-xs text-zinc-600 mt-2">Failid pole veel lisatud</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
