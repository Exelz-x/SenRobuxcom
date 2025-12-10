// app/create-gamepass/page.tsx
"use client";

import Link from "next/link";

export default function CreateGamepassPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="border-b border-green-500/20 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500">
              🎮
            </div>
            <span className="text-lg font-semibold text-green-400">
              SenRobux
            </span>
          </Link>
          <p className="text-xs text-gray-400">Langkah 3 · Buat Gamepass</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">
          Buat Gamepass di Roblox
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Ikuti panduan di bawah ini untuk membuat Gamepass dengan harga yang
          sudah ditentukan oleh sistem. Gamepass akan digunakan sebagai media
          pengiriman Robux.
        </p>

        {/* VIDEO TUTORIAL */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800 bg-black/60 p-3">
          <div className="aspect-video w-full rounded-xl bg-gray-900">
            {/* Ganti iframe ini dengan link YouTube asli kamu */}
            <iframe
              className="h-full w-full rounded-xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial Membuat Gamepass Roblox"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* INSTRUKSI */}
        <div className="mt-6 rounded-2xl border border-green-500/20 bg-black/60 p-5">
          <h2 className="text-lg font-semibold text-green-400">
            Instruksi Singkat
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-gray-200">
            <li>Buka halaman create.roblox.com dan pilih pengalaman (game). </li>
            <li>Buat Gamepass baru dan upload icon (bebas).</li>
            <li>
              Atur harga Gamepass sesuai nominal yang tertera di halaman
              sebelumnya (sudah menghitung pajak Roblox 30%).
            </li>
            <li>Pastikan Gamepass sudah di-set ke <b>Public / For Sale</b>.</li>
          </ol>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://create.roblox.com/"
              target="_blank"
              className="flex-1 rounded-2xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-black shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400"
            >
              Buka Halaman Pembuatan Gamepass
            </a>
            <Link
              href="/checkout/temp-order-id"
              className="flex-1 rounded-2xl border border-green-500/40 px-4 py-3 text-center text-sm font-semibold text-green-400 hover:bg-green-500/10"
            >
              Saya Sudah Membuat Gamepass
            </Link>
          </div>

          <p className="mt-3 text-[11px] text-gray-500">
            Saat kamu menekan “Saya Sudah Membuat Gamepass”, sistem akan
            mencoba mengecek apakah Gamepass-mu sudah sesuai. Jika belum,
            kamu akan diminta memperbaiki kembali.
          </p>
        </div>
      </main>
    </div>
  );
}

