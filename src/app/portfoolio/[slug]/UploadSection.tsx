"use client";

import { useState, useRef } from "react";

type FileType = "blend" | "storyboard" | "video";

const SLOTS: { type: FileType; icon: string; label: string; accept: string; exts: string[] }[] = [
  { type: "blend",      icon: "🟠", label: "3D failid",     accept: ".blend,.obj,.fbx,.gltf,.glb,.stl,.dae,.3ds,.ply", exts: ["blend","obj","fbx","gltf","glb","stl","dae","3ds","ply"] },
  { type: "storyboard", icon: "🖼️", label: "Pildid",        accept: "image/*", exts: [] },
  { type: "video",      icon: "🎬", label: "Videod",        accept: "video/*", exts: [] },
];

function detectType(file: File): FileType | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["blend","obj","fbx","gltf","glb","stl","dae","3ds","ply"].includes(ext)) return "blend";
  if (file.type.startsWith("image/")) return "storyboard";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function UploadSection({ slug, onDone }: { slug: string; onDone: () => void }) {
  const [uploading, setUploading] = useState<Record<FileType, number>>({ blend: 0, storyboard: 0, video: 0 });
  const [over, setOver] = useState<FileType | "all" | null>(null);

  async function uploadFiles(files: File[], type: FileType) {
    if (!files.length) return;
    setUploading((u) => ({ ...u, [type]: u[type] + files.length }));
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("slug", slug);
    form.append("type", type);
    const res = await fetch("/api/upload-portfoolio-public", { method: "POST", body: form });
    const data = await res.json();
    setUploading((u) => ({ ...u, [type]: Math.max(0, u[type] - files.length) }));
    if (!res.ok) { alert("Upload ebaõnnestus: " + data.error); return; }
    onDone();
  }

  function handleDrop(files: FileList | null, fixedType?: FileType) {
    if (!files) return;
    const grouped: Record<FileType, File[]> = { blend: [], storyboard: [], video: [] };
    for (const file of Array.from(files)) {
      const t = fixedType ?? detectType(file);
      if (!t) { alert(`Tundmatu failitüüp: ${file.name}`); continue; }
      grouped[t].push(file);
    }
    for (const [t, fs] of Object.entries(grouped) as [FileType, File[]][]) {
      if (fs.length) uploadFiles(fs, t);
    }
  }

  const totalUploading = Object.values(uploading).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-10 border-t border-zinc-800 pt-8">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Laadi üles oma failid</h2>

      {/* Big combined drop zone */}
      <label
        className={`flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all mb-4
          ${over === "all" ? "border-orange-400 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-500"}`}
        onDragOver={(e) => { e.preventDefault(); setOver("all"); }}
        onDragLeave={() => setOver(null)}
        onDrop={(e) => { e.preventDefault(); setOver(null); handleDrop(e.dataTransfer.files); }}
      >
        <span className="text-3xl">{totalUploading > 0 ? "⏳" : "📂"}</span>
        <span className="text-sm text-zinc-400">
          {totalUploading > 0 ? `Laadin ${totalUploading} faili...` : "Lohista siia — tüüp tuvastatakse automaatselt"}
        </span>
        <span className="text-xs text-zinc-600">blend · obj · fbx · glb · pildid · videod</span>
        <input type="file" multiple accept=".blend,.obj,.fbx,.gltf,.glb,.stl,.dae,.3ds,.ply,image/*,video/*"
          className="hidden"
          onChange={(e) => { handleDrop(e.target.files); e.target.value = ""; }} />
      </label>

      {/* Per-category slots */}
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(({ type, icon, label, accept }) => {
          const count = uploading[type];
          const isOver = over === type;
          return (
            <label key={type}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-lg border-2 border-dashed cursor-pointer transition-all
                ${isOver ? "border-orange-400 bg-orange-500/10" : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/30"}`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setOver(type); }}
              onDragLeave={(e) => { e.stopPropagation(); setOver(null); }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setOver(null); handleDrop(e.dataTransfer.files, type); }}
            >
              <span className="text-xl">{count > 0 ? "⏳" : icon}</span>
              <span className="text-xs font-medium text-zinc-300">{label}</span>
              <span className="text-[10px] text-zinc-600">{count > 0 ? `${count} laadin...` : "mitu faili korraga"}</span>
              <input type="file" multiple accept={accept} className="hidden"
                disabled={count > 0}
                onChange={(e) => { handleDrop(e.target.files, type); e.target.value = ""; }} />
            </label>
          );
        })}
      </div>
    </div>
  );
}
