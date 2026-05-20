"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: ühenda päris registreerimise API-ga
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-white mb-2">Registreerimine saadetud!</h2>
          <p className="text-zinc-400 mb-6">Õpetaja kinnitab sinu konto varsti.</p>
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300">
            Tagasi sisselogimisele
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-orange-500">Loo konto</h1>
          <p className="text-zinc-400 mt-2">Liitu Blenderi kursusega</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nimi</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Sinu täisnimi"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">E-post</label>
            <input
              type="email"
              name="email"
              required
              placeholder="sinu@email.ee"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Parool</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Vähemalt 8 tähemärki"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Blenderi kogemus</label>
            <select
              name="experience"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="algaja">Algaja — pole üldse kasutanud</option>
              <option value="natuke">Natuke — mõned tunnid kogemust</option>
              <option value="keskmine">Kesktase — kasutan regulaarselt</option>
              <option value="edasijounud">Edasijõudnu — kogenud kasutaja</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Registreeru
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          On juba konto?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300">
            Logi sisse
          </Link>
        </p>
      </div>
    </div>
  );
}
