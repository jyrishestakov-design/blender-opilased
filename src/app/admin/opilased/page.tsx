import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Imported directly so we have a single source of truth
const DEMO_USERS = [
  { id: "1",  name: "Aleksandr Baburin",        email: "aleksandr.baburin@kool.ee",        password: "Baburin2025",    grupp: "G2-5a" },
  { id: "2",  name: "Sixten Bergmann",          email: "sixten.bergmann@kool.ee",          password: "Bergmann2025",   grupp: "G2-1a" },
  { id: "3",  name: "Alari Inno",               email: "alari.inno@kool.ee",               password: "Inno2025",       grupp: "G2-3a" },
  { id: "4",  name: "Janne Katt",               email: "janne.katt@kool.ee",               password: "Katt2025",       grupp: "G2-1b" },
  { id: "5",  name: "Käroli Laanemägi",         email: "karoli.laanemagi@kool.ee",         password: "Laanemagi2025",  grupp: "G2-3b" },
  { id: "6",  name: "Karmo Lill",               email: "karmo.lill@kool.ee",               password: "Lill2025",       grupp: "G2-5b" },
  { id: "7",  name: "Jakov Nahkurev",           email: "jakov.nahkurev@kool.ee",           password: "Nahkurev2025",   grupp: "G2-2a" },
  { id: "8",  name: "Karoliina Nasikovski",     email: "karoliina.nasikovski@kool.ee",     password: "Nasikovski2025", grupp: "G2-4b" },
  { id: "9",  name: "Evelina Pešehodko",        email: "evelina.pesehodko@kool.ee",        password: "Pesehodko2025",  grupp: "G2-2b" },
  { id: "10", name: "Karoliina Pihlak",         email: "karoliina.pihlak@kool.ee",         password: "Pihlak2025",     grupp: "G2-1b" },
  { id: "11", name: "Eliise Poolma",            email: "eliise.poolma@kool.ee",            password: "Poolma2025",     grupp: "G2-1a" },
  { id: "12", name: "Marta Liina Renser",       email: "marta.renser@kool.ee",             password: "Renser2025",     grupp: "G2-2b" },
  { id: "13", name: "Neleli Lisbet Timmer",     email: "neleli.timmer@kool.ee",            password: "Timmer2025",     grupp: "G2-1b" },
  { id: "14", name: "Teele Ann Tint",           email: "teele.tint@kool.ee",               password: "Tint2025",       grupp: "G2-2a" },
  { id: "15", name: "Rasmus Veeväli",           email: "rasmus.veevali@kool.ee",           password: "Veevali2025",    grupp: "G2-5a" },
  { id: "16", name: "Arabella Altrof",          email: "arabella.altrof@kool.ee",          password: "Altrof2025",     grupp: "" },
];

const RÜHMAD = [...new Set(DEMO_USERS.map((u) => u.grupp))].sort();

export default async function OpilasedPage() {
  const session = await auth();
  if (session?.user.role !== "opetaja") redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <a href="/admin" className="text-zinc-500 hover:text-zinc-300 text-sm">← Admin</a>
        <h1 className="text-2xl font-bold text-white mt-2">Õpilased</h1>
        <p className="text-zinc-400 mt-1 text-sm">{DEMO_USERS.length} õpilast</p>
      </div>

      <div className="space-y-6">
        {RÜHMAD.map((ryhm) => (
          <div key={ryhm}>
            <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">{ryhm}</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-2 text-zinc-500 font-medium">Nimi</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-medium">E-post</th>
                    <th className="text-left px-4 py-2 text-zinc-500 font-medium">Parool</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_USERS.filter((u) => u.grupp === ryhm).map((u, i, arr) => (
                    <tr key={u.id} className={i < arr.length - 1 ? "border-b border-zinc-800/50" : ""}>
                      <td className="px-4 py-2.5 text-white">{u.name}</td>
                      <td className="px-4 py-2.5 text-zinc-400 font-mono text-xs">{u.email}</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs">{u.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
