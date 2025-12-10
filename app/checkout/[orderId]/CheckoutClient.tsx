"use client";

import { useState, useMemo } from "react";

type CheckoutClientProps = {
  orderId?: string;      // sekarang OPTIONAL
  username: string;
  robuxAmount: number;
};

export default function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);

  // Kalau orderId dari props kosong / undefined,
  // kita bikin ID sendiri, misalnya: "ORDER-1701234567890"
  const effectiveOrderId = useMemo(() => {
    if (orderId && orderId.trim().length > 0) {
      return orderId;
    }
    return `ORDER-${Date.now()}`;
  }, [orderId]);

  const handlePayWithIpaymu = async () => {
    setLoading(true);
    try {
      console.log("CLIENT - orderId yang DIKIRIM ke API:", effectiveOrderId);

      const res = await fetch("/api/payment/ipaymu/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: effectiveOrderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        alert(data.message ?? "Gagal membuat pembayaran Ipaymu");
        return;
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info order biar kelihatan apa yang dikirim */}
      <div className="rounded-md border p-4 space-y-1 text-sm">
        <p>
          <span className="font-semibold">Order ID:</span>{" "}
          {effectiveOrderId}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {username}
        </p>
        <p>
          <span className="font-semibold">Robux:</span> {robuxAmount}
        </p>
      </div>

      <button
        onClick={handlePayWithIpaymu}
        disabled={loading}
        className="w-full rounded-md px-4 py-2 font-semibold border"
      >
        {loading ? "Mengalihkan ke Ipaymu..." : "Bayar dengan Ipaymu"}
      </button>
    </div>
  );
}




