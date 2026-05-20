import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <div className="inline-block bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm px-4 py-1.5 rounded-full mb-6">
            3D Blenderi õpikeskkond
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Õpi Blenderit<br />
            <span className="text-orange-500">professionaalselt</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Interaktiivne keskkond 3D modelleerimise, animatsiooni ja renderdamise õppimiseks.
            Laadi üles töid, vasta ankeetidele ja suhtle oma õpetajaga.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Logi sisse
            </Link>
            <Link
              href="/auth/register"
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-3 rounded-lg transition-colors border border-zinc-700"
            >
              Registreeru
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "📋", title: "Ankeedid", desc: "Tagasiside ja ülesanded" },
            { icon: "📁", title: "Failid", desc: "Laadi üles oma tööd" },
            { icon: "📚", title: "Õpetused", desc: "Laadi alla materjalid" },
            { icon: "💬", title: "Sõnumid", desc: "Suhtlemine õpetajaga" },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
