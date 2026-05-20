import { auth } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";

type Materjal = { id: string; pealkiri: string; kirjeldus: string; fail: string; suurus: string; kuupaev: string; kategooria: string; tyyp: string };

const KATEGOORIAD = ["Kõik", "Algtase", "Kesktase", "Edasijõudnu"];

function TypIcon({ tyyp }: { tyyp: string }) {
  if (tyyp === "PDF") return <span className="text-red-400 text-xs font-bold bg-red-400/10 px-2 py-0.5 rounded">PDF</span>;
  if (tyyp === "VIDEO") return <span className="text-blue-400 text-xs font-bold bg-blue-400/10 px-2 py-0.5 rounded">VIDEO</span>;
  return <span className="text-orange-400 text-xs font-bold bg-orange-400/10 px-2 py-0.5 rounded">BLEND</span>;
}

export default async function OpetusedPage() {
  const session = await auth();
  const isOpetaja = session?.user.role === "opetaja";
  const supabase = supabaseServer();
  const { data: materjalid } = await supabase.from("materjalid").select("*").order("created_at", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Õpetused</h1>
          <p className="text-zinc-400 mt-1">
            {isOpetaja ? "Halda kursuse materjale." : "Laadi alla kursuse materjalid."}
          </p>
        </div>
        {isOpetaja && (
          <a href="/admin/opetused" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Lisa materjal
          </a>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {KATEGOORIAD.map((k) => (
          <button key={k} className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${k === "Kõik" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"}`}>
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(materjalid ?? []).map((o: Materjal) => (
          <div key={o.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-start gap-4 transition-colors">
            <div className="text-3xl flex-shrink-0">
              {o.tyyp === "PDF" ? "📄" : o.tyyp === "VIDEO" ? "🎬" : "🟠"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-white">{o.pealkiri}</h3>
                <TypIcon tyyp={o.tyyp} />
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{o.kategooria}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-2">{o.kirjeldus}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>📅 {o.kuupaev}</span>
                {o.suurus && <span>💾 {o.suurus}</span>}
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <a href={o.fail} download className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-zinc-700 flex items-center gap-1">
                ↓ Laadi alla
              </a>
            </div>
          </div>
        ))}
        {(materjalid ?? []).length === 0 && (
          <p className="text-center text-zinc-600 py-10">Materjale pole veel lisatud.</p>
        )}
      </div>
    </div>
  );
}
