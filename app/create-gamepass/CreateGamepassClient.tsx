"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  orderId: string;
  username: string;
  userId: number;
  robux: number;
  requiredPrice: number;
};

export function CreateGamepassClient({
  orderId,
  username,
  userId,
  robux,
  requiredPrice,
}: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenCreator() {
    window.open("https://create.roblox.com/", "_blank");
  }

  async function handleAlreadyCreated() {
    if (!userId || !robux) {
      setError("Data tidak lengkap. Silakan ulangi dari halaman utama.");
      return;
    }

    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/roblox/check-gamepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          targetRobux: robux,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Gagal mengecek gamepass.");
        return;
      }

      if (!data.hasPass) {
        setError(
          `Belum ditemukan gamepass dengan harga ${data.requiredPrice} Robux yang dibuat akunmu. Pastikan:
- Gamepass sudah dibuat
- Harga pas
- Status For Sale
- Inventory/game kamu publik.`
        );
        return;
      }

      const params = new URLSearchParams({
        username: username || "",
        robux: String(robux || 0),
      });
      router.push(`/checkout/${orderId || "test"}?${params.toString()}`);
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat mengecek gamepass.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Pembuatan Gamepass</h1>
          <p className="text-sm text-gray-300">
            Ikuti langkah di bawah ini untuk membuat gamepass yang akan kami beli
            agar kamu menerima Robux sesuai pesanan.
          </p>
        </header>

        {/* Ringkasan pesanan */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm space-y-2">
          <p>
            Username Roblox:{" "}
            <span className="font-semibold text-emerald-300">
              {username || "-"}
            </span>
          </p>
          <p>
            Robux yang ingin diterima:{" "}
            <span className="font-semibold">
              {robux ? robux.toLocaleString("id-ID") : "-"} Robux
            </span>
          </p>
          <p>
            Harga gamepass yang harus kamu buat:{" "}
            <span className="font-semibold text-emerald-400">
              {requiredPrice
                ? requiredPrice.toLocaleString("id-ID")
                : "-"}{" "}
              Robux
            </span>
          </p>
          <p className="text-xs text-gray-400">
            Catatan: Roblox mengambil pajak sekitar 30% dari penjualan gamepass.
            Karena itu, untuk menerima{" "}
            {robux ? robux.toLocaleString("id-ID") : 0} Robux, kamu perlu membuat
            gamepass dengan harga sekitar{" "}
            {requiredPrice
              ? requiredPrice.toLocaleString("id-ID")
              : 0}{" "}
            Robux.
          </p>
        </section>

        {/* Video tutorial */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Tutorial membuat gamepass</h2>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
            {/* GANTI src dengan video tutorial yang kamu mau */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial membuat gamepass Roblox"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-xs text-gray-400">
            (Silakan ganti video di atas dengan tutorial favoritmu nanti.)
          </p>
        </section>

        {/* Instruksi langkah-langkah */}
        <section className="space-y-3 text-sm text-gray-200">
          <h2 className="text-xl font-semibold">Langkah-langkah</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Buka Roblox Creator lewat tombol &quot;Buat gamepass&quot; di bawah.
            </li>
            <li>Pilih game yang kamu miliki (atau buat game baru jika belum ada).</li>
            <li>
              Buat gamepass baru dan isi harganya menjadi{" "}
              <span className="font-semibold text-emerald-400">
                {requiredPrice
                  ? requiredPrice.toLocaleString("id-ID")
                  : "-"}{" "}
                Robux
              </span>
              .
            </li>
            <li>
              Pastikan gamepass di-set &quot;For Sale&quot; dan sudah di-publish.
            </li>
            <li>
              Setelah selesai, klik tombol &quot;Sudah membuat gamepass&quot; di
              bawah ini.
            </li>
          </ol>
        </section>

        {/* Tombol aksi */}
        <section className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handleOpenCreator}
            className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition"
          >
            Buat gamepass (buka Roblox Creator)
          </button>
          <button
            onClick={handleAlreadyCreated}
            disabled={checking}
            className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? "Mengecek gamepass..." : "Sudah membuat gamepass"}
          </button>
        </section>

        {error && (
          <p className="text-xs text-red-400 whitespace-pre-line">{error}</p>
        )}
      </div>
    </main>
  );
}
