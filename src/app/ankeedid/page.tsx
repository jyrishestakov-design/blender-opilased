import { auth } from "@/lib/auth";

const DEMO_ANKEEDID = [
  {
    id: "1",
    pealkiri: "Sissejuhatav ankeet",
    kirjeldus: "Räägi meile oma eesmärkidest ja kogemustest Blenderiga.",
    kuupaev: "2026-05-15",
    vastatud: true,
    kysimused: 6,
  },
  {
    id: "2",
    pealkiri: "Modelleerimise ülesanne #1",
    kirjeldus: "Hinda oma tööd ja kirjuta, mis läks hästi ning mis vajab parandust.",
    kuupaev: "2026-05-18",
    vastatud: false,
    kysimused: 4,
  },
  {
    id: "3",
    pealkiri: "Vahetagasiside",
    kirjeldus: "Kursuse keskel tagasiside — mis on selge, mis mitte?",
    kuupaev: "2026-05-20",
    vastatud: false,
    kysimused: 8,
  },
];

export default async function AnkeedidPage() {
  const session = await auth();
  const isOpetaja = session?.user.role === "opetaja";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ankeedid</h1>
          <p className="text-zinc-400 mt-1">
            {isOpetaja ? "Halda ankeedid ja vaata vastuseid." : "Vasta õpetaja koostatud ankeetidele."}
          </p>
        </div>
        {isOpetaja && (
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Uus ankeet
          </button>
        )}
      </div>

      <div className="space-y-4">
        {DEMO_ANKEEDID.map((ankeet) => (
          <div key={ankeet.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-white">{ankeet.pealkiri}</h3>
                  {ankeet.vastatud ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Vastatud
                    </span>
                  ) : (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                      Ootel
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mb-3">{ankeet.kirjeldus}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>📅 {ankeet.kuupaev}</span>
                  <span>❓ {ankeet.kysimused} küsimust</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isOpetaja ? (
                  <button className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors">
                    Vaata vastuseid
                  </button>
                ) : ankeet.vastatud ? (
                  <button className="text-sm text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-lg cursor-default">
                    Muuda
                  </button>
                ) : (
                  <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                    Vasta
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {DEMO_ANKEEDID.filter((a) => !a.vastatud).length === 0 && !isOpetaja && (
        <div className="text-center py-12 text-zinc-500">
          <div className="text-4xl mb-3">✓</div>
          <p>Kõik ankeedid on vastatud!</p>
        </div>
      )}
    </div>
  );
}
