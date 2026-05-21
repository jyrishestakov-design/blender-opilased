import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "opetaja") redirect("/dashboard");

  const supabase = supabaseServer();
  const [{ count: failidCount }, { count: materjalidCount }, { count: videoCount }] = await Promise.all([
    supabase.from("failid").select("*", { count: "exact", head: true }),
    supabase.from("materjalid").select("*", { count: "exact", head: true }),
    supabase.from("youtube_videod").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/admin/failid", icon: "📁", title: "Failide haldus", desc: "Õpilaste üleslaaditud failid ja staatused", count: failidCount ?? 0, label: "faili" },
    { href: "/admin/opetused", icon: "📄", title: "Õpetused", desc: "Lisa ja kustuta PDF materjale", count: materjalidCount ?? 0, label: "materjali" },
    { href: "/admin/videod", icon: "🎬", title: "YouTube videod", desc: "Lisa ja kustuta õpetusvideoeid", count: videoCount ?? 0, label: "videot" },
    { href: "/admin/lehed", icon: "🗂️", title: "Lehtede haldus", desc: "Tee lehed nähtavaks või peida need", count: null, label: "" },
    { href: "/admin/opilased", icon: "👥", title: "Õpilased", desc: "Vaata õpilaste sisselogimisandmeid", count: 15, label: "õpilast" },
    { href: "/admin/portfooliod", icon: "🎨", title: "Portfooliod", desc: "Laadi üles blend, storyboard ja video", count: null, label: "" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin paneel</h1>
        <p className="text-zinc-400 mt-1">Tere tulemast, {session.user.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl p-6 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{c.icon}</span>
              {c.count !== null && (
                <span className="text-2xl font-bold text-orange-400">{c.count}</span>
              )}
            </div>
            <h2 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{c.title}</h2>
            <p className="text-zinc-500 text-sm mt-1">{c.desc}</p>
            {c.count !== null && (
              <p className="text-zinc-600 text-xs mt-2">{c.count} {c.label}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
