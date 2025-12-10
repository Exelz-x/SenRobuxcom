"use client";

import { useState } from "react";

type CheckoutClientProps = {
  orderId: string;
  username: string;
  robuxAmount: number;
};

export default function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);

  const handlePayWithIpaymu = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/ipaymu/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
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
      {/* Info order */}
      <div className="rounded-md border p-4 space-y-1 text-sm">
        <p>
          <span className="font-semibold">Order ID:</span> {orderId}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {username}
        </p>
        <p>
          <span className="font-semibold">Robux:</span> {robuxAmount}
        </p>
      </div>

      {/* Tombol bayar */}
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



