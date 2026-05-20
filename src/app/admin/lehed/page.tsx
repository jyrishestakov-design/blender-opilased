"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Leht = { id: string; slug: string; pealkiri: string; nahtav: boolean };

export default function AdminLehedPage() {
  const [lehed, setLehed] = useState<Leht[]>([]);

  useEffect(() => { laadiLehed(); }, []);

  async function laadiLehed() {
    const { data } = await supabase.from("lehed").select("*").order("pealkiri");
    setLehed(data ?? []);
  }

  async function toggleNahtav(leht: Leht) {
    const uusNahtav = !leht.nahtav;
    await supabase.from("lehed").update({ nahtav: uusNahtav }).eq("id", leht.id);
    setLehed((prev) => prev.map((l) => l.id === leht.id ? { ...l, nahtav: uusNahtav } : l));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Lehtede nähtavus</h1>
        <p className="text-zinc-400 text-sm mt-1">Peida või tee lehed nähtavaks. Peidetud lehed on ainult õpetajale nähtavad.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {lehed.map((leht) => (
            <div key={leht.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">{leht.pealkiri}</p>
                <p className="text-xs text-zinc-500">/{leht.slug}</p>
              </div>
              <button
                onClick={() => toggleNahtav(leht)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${leht.nahtav ? "bg-orange-500" : "bg-zinc-700"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${leht.nahtav ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-zinc-600 text-xs mt-4">Muutused rakenduvad kohe — lehekülje värskendamine pole vajalik.</p>
    </div>
  );
}
