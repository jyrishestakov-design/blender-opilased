"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = { id: string; pealkiri: string; kirjeldus: string; youtube_id: string; kategooria: string };

const KATEGOORIAD = ["Algtase", "Kesktase", "Edasijõudnu"];

function youtubeId(input: string) {
  const m = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\s?]+)/);
  return m ? m[1] : input.trim();
}

export default function AdminVideodPage() {
  const [videod, setVideod] = useState<Video[]>([]);
  const [form, setForm] = useState({ pealkiri: "", kirjeldus: "", youtube_id: "", kategooria: "Algtase" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { laadiVideod(); }, []);

  async function laadiVideod() {
    const { data } = await supabase.from("youtube_videod").select("*").order("created_at", { ascending: false });
    setVideod(data ?? []);
  }

  async function lisaVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!form.pealkiri || !form.youtube_id) return;
    setSaving(true);
    await supabase.from("youtube_videod").insert({
      pealkiri: form.pealkiri,
      kirjeldus: form.kirjeldus,
      youtube_id: youtubeId(form.youtube_id),
      kategooria: form.kategooria,
    });
    setForm({ pealkiri: "", kirjeldus: "", youtube_id: "", kategooria: "Algtase" });
    await laadiVideod();
    setSaving(false);
  }

  async function kustutaVideo(id: string) {
    await supabase.from("youtube_videod").delete().eq("id", id);
    setVideod((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">YouTube videote haldus</h1>
      </div>

      <form onSubmit={lisaVideo} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-white mb-2">Lisa uus video</h2>
        <input
          required
          value={form.pealkiri}
          onChange={(e) => setForm((f) => ({ ...f, pealkiri: e.target.value }))}
          placeholder="Pealkiri"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
        />
        <input
          required
          value={form.youtube_id}
          onChange={(e) => setForm((f) => ({ ...f, youtube_id: e.target.value }))}
          placeholder="YouTube URL või video ID (nt https://youtube.com/watch?v=...)"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
        />
        <input
          value={form.kirjeldus}
          onChange={(e) => setForm((f) => ({ ...f, kirjeldus: e.target.value }))}
          placeholder="Kirjeldus (valikuline)"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
        />
        <select
          value={form.kategooria}
          onChange={(e) => setForm((f) => ({ ...f, kategooria: e.target.value }))}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm outline-none"
        >
          {KATEGOORIAD.map((k) => <option key={k}>{k}</option>)}
        </select>
        <button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          {saving ? "Salvestан..." : "+ Lisa video"}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videod.map((v) => (
          <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="aspect-video bg-zinc-800">
              <iframe
                src={`https://www.youtube.com/embed/${v.youtube_id}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-white font-medium">{v.pealkiri}</p>
                <p className="text-xs text-zinc-500">{v.kategooria}</p>
              </div>
              <button onClick={() => kustutaVideo(v.id)} className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0">Kustuta</button>
            </div>
          </div>
        ))}
        {videod.length === 0 && <p className="text-zinc-500 text-sm col-span-2">Ühtegi videot pole lisatud.</p>}
      </div>
    </div>
  );
}
