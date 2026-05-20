"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ülevaade" },
  { href: "/ankeedid", label: "Ankeedid" },
  { href: "/opetused", label: "Õpetused" },
  { href: "/failid", label: "Minu failid" },
  { href: "/sonumid", label: "Sõnumid" },
];

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-orange-500 font-bold text-lg tracking-tight">
            Blender Kool
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 hidden sm:block">
            {session.user.name}
            <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
              {session.user.role === "opetaja" ? "Õpetaja" : "Õpilane"}
            </span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Logi välja
          </button>
        </div>
      </div>
    </nav>
  );
}
