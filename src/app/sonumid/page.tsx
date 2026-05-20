"use client";

import { useState } from "react";

const DEMO_SONUMID = [
  {
    id: "1",
    saatja: "Jüri Kask",
    roll: "opetaja",
    tekst: "Tere! Sinu esimene modelleerimine on väga hea start. Proovi järgmiseks lisada mõned detailid aknakosele.",
    aeg: "2026-05-18 14:30",
    mina: false,
  },
  {
    id: "2",
    saatja: "Mina",
    roll: "opilane",
    tekst: "Aitäh! Püüan rohkem detaile lisada. Mul on küsimus — kuidas ma saan aknaraami täpselt joondada?",
    aeg: "2026-05-18 15:10",
    mina: true,
  },
  {
    id: "3",
    saatja: "Jüri Kask",
    roll: "opetaja",
    tekst: "Hea küsimus! Kasuta 'S' klahvi ja seejärel 'X', 'Y' või 'Z' — see lukustab skaleerimise ühele teljele. Või proovi Grid Snap funktsiooni.",
    aeg: "2026-05-18 15:45",
    mina: false,
  },
  {
    id: "4",
    saatja: "Mina",
    roll: "opilane",
    tekst: "Perfektne, see toimis! Tänan.",
    aeg: "2026-05-19 10:20",
    mina: true,
  },
];

export default function SonumidPage() {
  const [sonumid, setSonumid] = useState(DEMO_SONUMID);
  const [tekst, setTekst] = useState("");

  function saadaSonum(e: React.FormEvent) {
    e.preventDefault();
    if (!tekst.trim()) return;
    setSonumid((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        saatja: "Mina",
        roll: "opilane",
        tekst: tekst.trim(),
        aeg: new Date().toISOString().slice(0, 16).replace("T", " "),
        mina: true,
      },
    ]);
    setTekst("");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Sõnumid</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <p className="text-zinc-400 text-sm">Jüri Kask (Õpetaja) · aktiivne</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {sonumid.map((s) => (
          <div key={s.id} className={`flex ${s.mina ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${s.mina ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!s.mina && (
                <span className="text-xs text-zinc-500 px-1">{s.saatja}</span>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  s.mina
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                }`}
              >
                {s.tekst}
              </div>
              <span className="text-xs text-zinc-600 px-1">{s.aeg}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={saadaSonum} className="flex gap-3">
        <input
          type="text"
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          placeholder="Kirjuta sõnum..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!tekst.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          Saada
        </button>
      </form>
    </div>
  );
}
