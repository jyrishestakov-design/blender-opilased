"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Fail = {
  id: string;
  nimi: string;
  suurus: string;
  kuupaev: string;
  staatus: string;
  path: string;
};

const STAATUSED = ["Üleslaaditud", "Ootel", "Ülevaadatud", "Tagasi lükatud"];

export default function AdminFailidPage() {
  const [failid, setFailid] = useState<Fail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { laadiFailid(); }, []);

  async function laadiFailid() {
    const { data } = await supabase.from("failid").select("*").order("created_at", { ascending: false });
    setFailid((data ?? []).map((f) => ({ ...f, kuupaev: f.created_at?.slice(0, 10) })));
    setLoading(false);
  }

  async function muutaStaatus(id: string, staatus: string) {
    await supabase.from("failid").update({ staatus }).eq("id", id);
    setFailid((prev) => prev.map((f) => f.id === id ? { ...f, staatus } : f));
  }

  async function kustutaFail(fail: Fail) {
    await supabase.storage.from("blender-failid").remove([fail.path]);
    await supabase.from("failid").delete().eq("id", fail.id);
    setFailid((prev) => prev.filter((f) => f.id !== fail.id));
  }

  const staatusColor: Record<string, string> = {
    "Üleslaaditud": "bg-blue-500/20 text-blue-400",
    "Ootel": "bg-zinc-700 text-zinc-400",
    "Ülevaadatud": "bg-green-500/20 text-green-400",
    "Tagasi lükatud": "bg-red-500/20 text-red-400",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Failide haldus</h1>
        <p className="text-zinc-400 text-sm mt-1">Kõigi õpilaste üleslaaditud failid</p>
      </div>

      {loading ? (
        <p className="text-zinc-500">Laadin...</p>
      ) : failid.length === 0 ? (
        <p className="text-zinc-500">Ühtegi faili pole üles laaditud.</p>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {failid.map((fail) => (
              <div key={fail.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {fail.nimi.endsWith(".blend") ? "🟠" : fail.nimi.match(/\.(png|jpg)$/) ? "🖼️" : "📄"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{fail.nimi}</p>
                    <p className="text-xs text-zinc-500">{fail.suurus} · {fail.kuupaev}</p>
                  </div>
                </div>
                <select
                  value={fail.staatus}
                  onChange={(e) => muutaStaatus(fail.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${staatusColor[fail.staatus] ?? "bg-zinc-700 text-zinc-400"}`}
                >
                  {STAATUSED.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => kustutaFail(fail)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  Kustuta
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
