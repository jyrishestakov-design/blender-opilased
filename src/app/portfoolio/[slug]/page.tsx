import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

type Props = { params: Promise<{ slug: string }> };

export default async function PortfoolioPage({ params }: Props) {
  const { slug } = await params;
  const supabase = supabaseServer();
  const { data } = await supabase.from("portfooliod").select("*").eq("slug", slug).single();

  if (!data) notFound();

  const hasAny = data.blend_url || data.storyboard_url || data.video_url;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <p className="text-orange-400 text-sm font-medium mb-1">Blender Kool · {data.grupp}</p>
          <h1 className="text-3xl font-bold">{data.opilane_nimi}</h1>
          <p className="text-zinc-500 mt-1">Portfoolio</p>
        </div>

        {!hasAny ? (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-4xl mb-3">🎨</p>
            <p>Failid pole veel lisatud.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.storyboard_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="text-lg">🖼️</span>
                  <h2 className="font-semibold">Storyboard</h2>
                </div>
                <div className="p-4">
                  <img
                    src={data.storyboard_url}
                    alt="Storyboard"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}

            {data.video_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="text-lg">🎬</span>
                  <h2 className="font-semibold">Renderdatud video</h2>
                </div>
                <div className="p-4">
                  <video
                    src={data.video_url}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            )}

            {data.blend_url && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟠</span>
                  <div>
                    <p className="font-semibold">Blender fail</p>
                    <p className="text-zinc-500 text-sm">.blend</p>
                  </div>
                </div>
                <a
                  href={data.blend_url}
                  download
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  ↓ Laadi alla
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
