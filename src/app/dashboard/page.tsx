import { auth } from "@/lib/auth";
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/ankeedid", icon: "📋", title: "Ankeedid", desc: "Täida õpetaja saadetud ankeedid", badge: "2 uut" },
  { href: "/failid", icon: "📁", title: "Minu failid", desc: "Laadi üles oma Blenderi tööd", badge: null },
  { href: "/opetused", icon: "📚", title: "Õpetused", desc: "Laadi alla kursuse materjalid", badge: "5 faili" },
  { href: "/sonumid", icon: "💬", title: "Sõnumid", desc: "Kirjuta oma õpetajale", badge: "1 uus" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Tere, {session?.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-zinc-400 mt-1">
          {session?.user.role === "opetaja"
            ? "Vaata üle õpilaste tööd ja suhtle nendega."
            : "Jätka õppimist ja lae üles oma tööd."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-start gap-4 transition-colors group"
          >
            <span className="text-3xl">{link.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                  {link.title}
                </h3>
                {link.badge && (
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm">{link.desc}</p>
            </div>
            <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
          </Link>
        ))}
      </div>

      {session?.user.role === "opetaja" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4">Õpetaja tööriistad</h2>
          <div className="flex flex-wrap gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              + Lisa uus ankeet
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-zinc-700">
              + Lisa õpetus
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-zinc-700">
              Vaata kõiki õpilasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
