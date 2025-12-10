// app/checkout/[orderId]/CheckoutClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface CheckoutClientProps {
  orderId: string;
  username: string;
  robuxAmount: number;
}

export function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const [method, setMethod] = useState<"doku" | "member" | null>("doku");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function getPriceFromRobux(robux: number) {
    if (robux === 100) return 20000;
    if (robux === 200) return 38000;
    if (robux === 400) return 75000;
    if (robux === 800) return 145000;
    return robux * 200;
  }

  const amount = getPriceFromRobux(robuxAmount);

  async function handlePay() {
    if (!method) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      // di sini nanti sambungkan ke API pembayaran asli kamu (DOKU/QRIS)
      // sementara, contoh redirect ke halaman menunggu pembayaran:
      window.location.href = `/waiting-payment/${orderId}`;
    } catch (err) {
      setErrorMsg("Gagal memproses pembayaran, coba lagi.");
      setLoading(false);
    }
  }

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
          <p className="text-xs text-gray-400">Checkout · {orderId}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Konfirmasi Pesanan</h1>
        <p className="mt-1 text-sm text-gray-400">
          Pastikan data di bawah sudah benar sebelum membayar.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[2fr,1.4fr]">
          {/* DETAIL PESANAN */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-500/20 bg-black/60 p-4">
              <h2 className="text-sm font-semibold text-gray-300">
                Data Pemesanan
              </h2>
              <dl className="mt-3 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Order ID</dt>
                  <dd className="font-mono text-xs text-gray-200">
                    {orderId}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Username Roblox</dt>
                  <dd className="font-semibold text-white">{username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Jumlah Robux</dt>
                  <dd className="font-semibold text-green-400">
                    {robuxAmount} R$
                  </dd>
                </div>
              </dl>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="rounded-2xl border border-green-500/20 bg-black/60 p-4">
              <h2 className="text-sm font-semibold text-gray-300">
                Metode Pembayaran
              </h2>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setMethod("doku")}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    method === "doku"
                      ? "border-green-500 bg-green-500/15"
                      : "border-gray-700 bg-black/70 hover:border-green-500/60"
                  }`}
                >
                  <p className="font-semibold text-white">DOKU / QRIS</p>
                  <p className="text-xs text-gray-400">
                    Bayar via QRIS / VA / e-wallet (nanti dihubungkan)
                  </p>
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-gray-800 bg-black/60 px-4 py-3 text-left text-sm text-gray-500"
                >
                  <p className="font-semibold">Pembayaran Member</p>
                  <p className="text-xs text-gray-500">
                    Segera hadir untuk member tetap.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* RINGKASAN HARGA */}
          <aside className="rounded-2xl border border-green-500/20 bg-black/60 p-4">
            <h2 className="text-sm font-semibold text-gray-300">
              Ringkasan Pembayaran
            </h2>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Harga Robux</span>
                <span>Rp {amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Biaya layanan</span>
                <span>Rp 0</span>
              </div>
              <hr className="my-3 border-gray-800" />
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Bayar</span>
                <span className="text-green-400">
                  Rp {amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={loading || !method}
              className="mt-4 w-full rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(34,197,94,0.7)] transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300 disabled:shadow-none"
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>

            {errorMsg && (
              <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
            )}

            <p className="mt-3 text-[11px] text-gray-500">
              Setelah pembayaran dikonfirmasi, admin akan mengirim Robux ke akun
              kamu melalui Gamepass yang sudah dibuat.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}




