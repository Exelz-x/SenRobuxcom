"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: any) => void;
    };
  }
}

type CheckoutClientProps = {
  orderId: string;
  username: string;
  robuxAmount: number;
};

export function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/midtrans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          username,
          robuxAmount,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Gagal membuat transaksi pembayaran.");
        setLoading(false);
        return;
      }

      const snapToken = data.snapToken as string;

      if (!window.snap || !snapToken) {
        setError("Snap JS belum siap atau token tidak valid.");
        setLoading(false);
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: function () {
          window.location.href = `/success/${orderId}`;
        },
        onPending: function () {
          window.location.href = `/success/${orderId}`;
        },
        onError: function () {
          setError("Terjadi error pada pembayaran.");
        },
        onClose: function () {
          // user nutup popup tanpa bayar
        },
      });
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Script Midtrans Snap */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Pembayaran Pesanan</h1>
          <p className="text-sm text-gray-300">
            ID Pesanan: <span className="font-mono">#{orderId}</span>
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
          <p className="text-gray-200">Ringkasan pesanan:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>
              Username Roblox:{" "}
              <span className="font-semibold">{username}</span>
            </li>
            <li>
              Jumlah Robux:{" "}
              <span className="font-semibold">
                {robuxAmount || "-"}
              </span>
            </li>
            <li>
              Metode bayar:{" "}
              <span className="font-semibold">
                QRIS / E-Wallet / VA (via Midtrans)
              </span>
            </li>
          </ul>
          <p className="text-xs text-gray-400">
            Setelah klik &quot;Bayar Sekarang&quot;, akan muncul popup pembayaran
            Midtrans (QRIS / e-wallet / dll).
          </p>
        </section>

        {error && (
          <p className="text-xs text-red-400 whitespace-pre-line">
            {error}
          </p>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
        >
          {loading ? "Membuat transaksi..." : "Bayar Sekarang"}
        </button>
      </div>
    </main>
  );
}
