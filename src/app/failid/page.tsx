"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Fail = {
  id: string;
  nimi: string;
  suurus: string;
  kuupaev: string;
  staatus: string;
  path: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FailidPage() {
  const [failid, setFailid] = useState<Fail[]>([]);
  const [lohistatakse, setLohistatakse] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    laadiFailid();
  }, []);

  async function laadiFailid() {
    const { data, error } = await supabase
      .from("failid")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failide laadimine ebaõnnestus.");
      return;
    }

    setFailid(
      (data ?? []).map((f) => ({
        id: f.id,
        nimi: f.nimi,
        suurus: f.suurus,
        kuupaev: f.created_at?.slice(0, 10),
        staatus: f.staatus,
        path: f.path,
      }))
    );
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const path = `uploads/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("blender-failid")
        .upload(path, file);

      if (uploadError) {
        setError(`Faili "${file.name}" üleslaadimine ebaõnnestus.`);
        continue;
      }

      await supabase.from("failid").insert({
        nimi: file.name,
        suurus: formatBytes(file.size),
        staatus: "Üleslaaditud",
        path,
      });
    }

    await laadiFailid();
    setUploading(false);
  }

  async function kustutaFail(fail: Fail) {
    await supabase.storage.from("blender-failid").remove([fail.path]);
    await supabase.from("failid").delete().eq("id", fail.id);
    setFailid((prev) => prev.filter((f) => f.id !== fail.id));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setLohistatakse(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Minu failid</h1>
        <p className="text-zinc-400 mt-1">Laadi üles oma Blenderi tööd õpetajale vaatamiseks.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setLohistatakse(true); }}
        onDragLeave={() => setLohistatakse(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 ${
          lohistatakse
            ? "border-orange-500 bg-orange-500/5"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".blend,.obj,.fbx,.glb,.gltf,.png,.jpg,.mp4,.zip"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="text-4xl mb-3">{uploading ? "⏳" : "📁"}</div>
        {uploading ? (
          <p className="text-zinc-400">Laadin üles...</p>
        ) : (
          <>
            <p className="text-white font-medium mb-1">Lohista failid siia või klõpsa</p>
            <p className="text-zinc-500 text-sm">.blend, .obj, .fbx, .glb, .png, .jpg, .mp4, .zip</p>
          </>
        )}
      </div>

      {failid.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-300">Üleslaaditud failid</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {failid.map((fail) => (
              <div key={fail.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">
                    {fail.nimi.endsWith(".blend") ? "🟠" : fail.nimi.match(/\.(png|jpg)$/) ? "🖼️" : "📄"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{fail.nimi}</p>
                    <p className="text-xs text-zinc-500">{fail.suurus} · {fail.kuupaev}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    fail.staatus === "Ülevaadatud"
                      ? "bg-green-500/20 text-green-400"
                      : fail.staatus === "Üleslaaditud"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-zinc-700 text-zinc-400"
                  }`}>
                    {fail.staatus}
                  </span>
                  <button
                    onClick={() => kustutaFail(fail)}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Kustuta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {failid.length === 0 && !uploading && (
        <p className="text-center text-zinc-600 text-sm mt-4">Ühtegi faili pole veel üles laaditud.</p>
      )}
    </div>
  );
}
