"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Materjal = { id: string; pealkiri: string; kirjeldus: string; fail: string; suurus: string; kuupaev: string; kategooria: string; tyyp: string };

const KATEGOORIAD = ["Algtase", "Kesktase", "Edasijõudnu"];

export default function AdminOpetusedPage() {
  const [materjalid, setMaterjalid] = useState<Materjal[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ pealkiri: "", kirjeldus: "", kategooria: "Algtase" });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { laadiMaterjalid(); }, []);

  async function laadiMaterjalid() {
    const { data } = await supabase.from("materjalid").select("*").order("created_at", { ascending: false });
    setMaterjalid(data ?? []);
  }

  async function lisaMaterjal(e: React.FormEvent) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file || !form.pealkiri) return;
    setUploading(true);

    const path = `materjalid/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("blender-failid").upload(path, file);
    if (error) { setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from("blender-failid").getPublicUrl(path);

    await supabase.from("materjalid").insert({
      pealkiri: form.pealkiri,
      kirjeldus: form.kirjeldus,
      fail: publicUrl,
      suurus: `${(file.size / 1024).toFixed(0)} KB`,
      kuupaev: new Date().toISOString().slice(0, 10),
      kategooria: form.kategooria,
      tyyp: "PDF",
    });

    setForm({ pealkiri: "", kirjeldus: "", kategooria: "Algtase" });
    if (inputRef.current) inputRef.current.value = "";
    await laadiMaterjalid();
    setUploading(false);
  }

  async function kustutaMaterjal(id: string) {
    await supabase.from("materjalid").delete().eq("id", id);
    setMaterjalid((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Õpetuste haldus</h1>
      </div>

      <form onSubmit={lisaMaterjal} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-white mb-2">Lisa uus materjal</h2>
        <input
          required
          value={form.pealkiri}
          onChange={(e) => setForm((f) => ({ ...f, pealkiri: e.target.value }))}
          placeholder="Pealkiri"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
        />
        <input
          value={form.kirjeldus}
          onChange={(e) => setForm((f) => ({ ...f, kirjeldus: e.target.value }))}
          placeholder="Kirjeldus (valikuline)"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
        />
        <div className="flex gap-3">
          <select
            value={form.kategooria}
            onChange={(e) => setForm((f) => ({ ...f, kategooria: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
          >
            {KATEGOORIAD.map((k) => <option key={k}>{k}</option>)}
          </select>
          <input ref={inputRef} type="file" accept=".pdf" required className="flex-1 text-sm text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-orange-500 file:text-white file:text-sm cursor-pointer" />
        </div>
        <button type="submit" disabled={uploading} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          {uploading ? "Laadin üles..." : "+ Lisa materjal"}
        </button>
      </form>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {materjalid.map((m) => (
            <div key={m.id} className="px-5 py-4 flex items-center gap-4">
              <span className="text-xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{m.pealkiri}</p>
                <p className="text-xs text-zinc-500">{m.kategooria} · {m.suurus}</p>
              </div>
              <a href={m.fail} target="_blank" className="text-xs text-zinc-500 hover:text-white transition-colors">Vaata</a>
              <button onClick={() => kustutaMaterjal(m.id)} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">Kustuta</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
