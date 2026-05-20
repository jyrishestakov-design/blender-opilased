import { auth } from "@/lib/auth";

const DEMO_OPETUSED = [
  {
    id: "1",
    pealkiri: "Blenderi alused — liidese tutvustus",
    kirjeldus: "Tutvu Blenderi põhilise töökeskkonnaga: vaated, tööriistad ja kiirklahvid.",
    fail: "/blenderi_alused.pdf",
    suurus: "3.3 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "2",
    pealkiri: "3D modelleerimine algajatele",
    kirjeldus: "Edit Mode, modelleerimise tööriistad, modifiers ja harjutus: loo lihtne maja.",
    fail: "/modelleerimine_algajatele.pdf",
    suurus: "4.7 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "3",
    pealkiri: "Objektid ja nende muutmine",
    kirjeldus: "Kuidas lisada, liigutada, pöörata ja skaleerida objekte. Harjutus: loo laud.",
    fail: "/objektid_ja_muutmine.pdf",
    suurus: "4.2 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "4",
    pealkiri: "Valgustus algajatele",
    kirjeldus: "Kolme punkti valgustus, HDRI keskkond ja valguse seaded samm-sammult.",
    fail: "/valgustus_algajatele.pdf",
    suurus: "4.1 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "5",
    pealkiri: "Kaamera ja kompositsioon",
    kirjeldus: "Kaamera seadistamine, focal length, sügavusteravus ja kompositsioonireeglid.",
    fail: "/kaamera_ja_kompositsioon.pdf",
    suurus: "4.0 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "6",
    pealkiri: "Materjalid algajatele",
    kirjeldus: "Principled BSDF shader — metall, klaas, plastik, kumm. Mitu materjali ühel objektil.",
    fail: "/materjalid_algajatele.pdf",
    suurus: "4.5 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "7",
    pealkiri: "Animatsiooni alused",
    kirjeldus: "Keyframe-animatsioon, Timeline, interpolatsioonitüübid ja esimene animatsioon.",
    fail: "/animatsiooni_alused.pdf",
    suurus: "4.6 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
  {
    id: "8",
    pealkiri: "Renderdamine Blenderis",
    kirjeldus: "Cycles vs EEVEE võrdlus, materjalid, valgustus ja renderduse seaded.",
    fail: "/renderdamine_blenderis.pdf",
    suurus: "4.8 KB",
    kuupaev: "2026-05-20",
    kategooria: "Kesktase",
    tyyp: "PDF",
  },
  {
    id: "9",
    pealkiri: "Motion Capture animatsioon",
    kirjeldus: "Mixamo ja BVH mocap-andmete kasutamine, NLA Editor ja animatsioonide kombineerimine.",
    fail: "/motion_capture_animatsioon.pdf",
    suurus: "4.4 KB",
    kuupaev: "2026-05-20",
    kategooria: "Kesktase",
    tyyp: "PDF",
  },
  {
    id: "10",
    pealkiri: "Inimtegelane MakeHumaniga",
    kirjeldus: "Realistlike tegelaste loomine MakeHumanis ja importimine Blenderisse MHX2 pluginiga.",
    fail: "/makehuman_modelleerimine.pdf",
    suurus: "4.3 KB",
    kuupaev: "2026-05-20",
    kategooria: "Kesktase",
    tyyp: "PDF",
  },
  {
    id: "11",
    pealkiri: "Grease Pencil — 2D animatsioon",
    kirjeldus: "Joonisfilm Blenderis: Draw Mode, onion skinning, kihid ja 2D/3D hübriidanimatsioon.",
    fail: "/grease_pencil_2d_animatsioon.pdf",
    suurus: "4.5 KB",
    kuupaev: "2026-05-20",
    kategooria: "Algtase",
    tyyp: "PDF",
  },
];

const KATEGOORIAD = ["Kõik", "Algtase", "Kesktase", "Edasijõudnu"];

function TypIcon({ tyyp }: { tyyp: string }) {
  if (tyyp === "PDF") return <span className="text-red-400 text-xs font-bold bg-red-400/10 px-2 py-0.5 rounded">PDF</span>;
  if (tyyp === "VIDEO") return <span className="text-blue-400 text-xs font-bold bg-blue-400/10 px-2 py-0.5 rounded">VIDEO</span>;
  return <span className="text-orange-400 text-xs font-bold bg-orange-400/10 px-2 py-0.5 rounded">BLEND</span>;
}

export default async function OpetusedPage() {
  const session = await auth();
  const isOpetaja = session?.user.role === "opetaja";

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
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Lisa materjal
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {KATEGOORIAD.map((k) => (
          <button
            key={k}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              k === "Kõik"
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {DEMO_OPETUSED.map((o) => (
          <div
            key={o.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-start gap-4 transition-colors"
          >
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
                <span>💾 {o.suurus}</span>
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <a
                href={o.fail}
                download
                className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-zinc-700 flex items-center gap-1"
              >
                ↓ Laadi alla
              </a>
              {isOpetaja && (
                <button className="text-sm text-zinc-500 hover:text-red-400 transition-colors px-2">
                  Kustuta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
