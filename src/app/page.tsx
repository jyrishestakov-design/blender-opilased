import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import StudentGrid from "./StudentGrid";

export default async function HomePage() {
  const supabase = supabaseServer();
  const { data } = await supabase.from("portfoolio_failid").select("slug, tyyp");
  const counts: Record<string, { blend: boolean; storyboard: boolean; video: boolean }> = {};
  for (const row of data ?? []) {
    if (!counts[row.slug]) counts[row.slug] = { blend: false, storyboard: false, video: false };
    counts[row.slug][row.tyyp as "blend" | "storyboard" | "video"] = true;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-400 text-sm font-medium mb-1">Blender Kool</p>
            <h1 className="text-3xl font-bold">Õpilaste portfooliod</h1>
            <p className="text-zinc-600 text-xs mt-1">Lohista fail õpilase kaardi peale — laetakse automaatselt üles</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/videod" className="text-sm text-zinc-400 hover:text-white transition-colors">
              🎬 Õppevideod
            </Link>
            <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Õpetaja sisselogimine →
            </Link>
          </div>
        </div>

        <StudentGrid initialCounts={counts} />
      </div>
    </div>
  );
}
