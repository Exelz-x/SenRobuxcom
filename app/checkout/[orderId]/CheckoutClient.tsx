"use client";

import { useState } from "react";

// 👉 Tambah type props (kalau file kamu .tsx / TypeScript)
type CheckoutClientProps = {
  orderId: string;
};

export default function CheckoutClient({ orderId }: CheckoutClientProps) {
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
      {/* detail order bisa kamu taruh di sini */}

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

