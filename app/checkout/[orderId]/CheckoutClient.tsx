"use client";

import { useState } from "react";

interface CheckoutClientProps {
  orderId: string;
  username: string;
  robuxAmount: number;
}

type PaymentMethod = "doku" | "member" | null;

export function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sementara: hitung harga dari robux (bisa kamu samakan dengan logic sebelumnya)
  function getPriceFromRobux(robux: number): number {
    if (robux === 100) return 20000;
    if (robux === 200) return 38000;
    if (robux === 400) return 75000;
    if (robux === 800) return 145000;
    return robux * 200; // fallback
  }

  const amount = getPriceFromRobux(robuxAmount);

  async function handlePayWithDoku() {
    try {
      setErrorMsg(null);
      setLoading(true);

      const res = await fetch("/api/payment/doku/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(
          data?.error || "Gagal membuat pembayaran DOKU. Coba lagi nanti."
        );
        setLoading(false);
        return;
      }

      const paymentUrl = data.paymentUrl as string | undefined;
      if (!paymentUrl) {
        setErrorMsg("paymentUrl dari DOKU tidak ditemukan.");
        setLoading(false);
        return;
      }

      // Redirect user ke halaman pembayaran DOKU
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Error handlePayWithDoku:", err);
      setErrorMsg("Terjadi kesalahan saat menghubungi server.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Checkout Pesanan</h1>

      <div className="border rounded-lg p-3 bg-white/5">
        <p className="text-sm text-gray-400">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
        <p className="mt-1">
          Username Roblox: <span className="font-semibold">{username}</span>
        </p>
        <p className="mt-1">
          Jumlah Robux:{" "}
          <span className="font-semibold">{robuxAmount} Robux</span>
        </p>
        <p className="mt-1">
          Total Bayar (estimasi):{" "}
          <span className="font-semibold">Rp {amount.toLocaleString("id-ID")}</span>
        </p>
      </div>

      <div className="border rounded-lg p-3 bg-white/5 space-y-2">
        <h2 className="font-semibold mb-1">Metode Pembayaran</h2>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("doku")}
            className={`w-full px-3 py-2 rounded-lg border text-left ${
              paymentMethod === "doku"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-600 hover:bg-white/5"
            }`}
          >
            <div className="font-semibold">DOKU Checkout</div>
            <div className="text-xs text-gray-400">
              Bayar via QRIS / e-wallet / VA di halaman DOKU
            </div>
          </button>

          <button
            type="button"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-gray-700 text-left opacity-60 cursor-not-allowed"
          >
            <div className="font-semibold">Pembayaran Member</div>
            <div className="text-xs text-gray-400">
              (Belum aktif — nanti kita buat)
            </div>
          </button>
        </div>
      </div>

      {paymentMethod === "doku" && (
        <div className="border rounded-lg p-3 bg-white/5 space-y-2">
          <p className="text-sm">
            Klik tombol di bawah untuk membuka halaman pembayaran DOKU.
          </p>
          <button
            type="button"
            onClick={handlePayWithDoku}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Menghubungi DOKU..." : "Bayar dengan DOKU"}
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm text-red-400 whitespace-pre-line">{errorMsg}</p>
      )}

      <p className="text-[11px] text-gray-500">
        Untuk saat ini, status pembayaran masih akan dicek oleh admin secara
        manual di backend. Nanti kalau notifikasi otomatis DOKU sudah
        dikonfigurasi, status akan bisa berubah otomatis.
      </p>
    </div>
  );
}
