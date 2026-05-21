"use client";

import { useState } from "react";

type FileType = "blend" | "storyboard" | "video";

function detectType(file: File): FileType | null {
  if (file.name.toLowerCase().endsWith(".blend")) return "blend";
  if (file.type.startsWith("image/")) return "storyboard";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function UploadSection({ slug, onDone }: { slug: string; onDone: () => void }) {
  const [uploading, setUploading] = useState<FileType | null>(null);
  const [over, setOver] = useState(false);

  async function upload(file: File, type: FileType) {
    setUploading(type);
    const form = new FormData();
    form.append("file", file);
    form.append("slug", slug);
    form.append("type", type);
    const res = await fetch("/api/upload-portfoolio-public", { method: "POST", body: form });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) { alert("Upload ebaõnnestus: " + data.error); return; }
    onDone();
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const type = detectType(file);
      if (!type) { alert(`Tundmatu failitüüp: ${file.name}\nKasuta .blend, pilti või videot.`); continue; }
      upload(file, type);
    }
  }

  const SLOTS: { type: FileType; icon: string; label: string; accept: string }[] = [
    { type: "blend",      icon: "🟠", label: "Blend fail",      accept: ".blend" },
    { type: "storyboard", icon: "🖼️", label: "Storyboard",      accept: "image/*" },
    { type: "video",      icon: "🎬", label: "Renderdatud video", accept: "video/*" },
  ];

  return (
    <div className="mt-10 border-t border-zinc-800 pt-8">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Laadi üles oma failid</h2>

      {/* Big drag zone */}
      <label
        className={`flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all mb-4
          ${over ? "border-orange-400 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500"}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <span className="text-3xl">{uploading ? "⏳" : "📂"}</span>
        <span className="text-sm text-zinc-400">
          {uploading ? `Laadin ${uploading}...` : "Lohista siia või kliki — .blend, pilt või video"}
        </span>
        <input type="file" multiple accept=".blend,image/*,video/*" className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      </label>

      {/* Individual slots */}
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(({ type, icon, label, accept }) => (
          <label key={type}
            className={`flex flex-col items-center gap-1 py-3 rounded-lg border cursor-pointer transition-colors
              ${uploading === type ? "opacity-50 pointer-events-none border-zinc-700" : "border-zinc-700 hover:border-orange-500 bg-zinc-800/50"}`}
          >
            <span className="text-lg">{uploading === type ? "⏳" : icon}</span>
            <span className="text-xs text-zinc-400">{uploading === type ? "Laadin..." : label}</span>
            <input type="file" accept={accept} className="hidden"
              disabled={!!uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, type); e.target.value = ""; }} />
          </label>
        ))}
      </div>
    </div>
  );
}
