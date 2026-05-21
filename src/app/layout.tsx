import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import SessionProvider from "@/components/layout/SessionProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Blender Kool",
  description: "3D Blenderi õpikeskkond",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="et" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-zinc-100 antialiased">
        <SessionProvider session={session}>
          <Navbar session={session} />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
