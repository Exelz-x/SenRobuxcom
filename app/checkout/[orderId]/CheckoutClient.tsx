"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutClientProps {
  orderId: string;
  username: string;
  robuxAmount: number;
}

type PaymentMethod = "qris" | "member" | null;

export function CheckoutClient({
  orderId,
  username,
  robuxAmount,
}: CheckoutClientProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showQrisPopup, setShowQrisPopup] = useState(false);

  // Nanti kalau mau dipakai lagi untuk Midtrans / member, bisa tambah state lain di sini

  function handleChooseQris() {
    setPaymentMethod("qris");
    setShowQrisPopup(true);
  }

  function handleAlreadyPaidQris() {
    // Di sini kita belum cek apa-apa, cuma pindah ke halaman "Menunggu Pembayaran"
    router.push(`/waiting-payment/${orderId}`);
  }

  function handleGoBackFromPopup() {
    setShowQrisPopup(false);
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
      </div>

      {/* PILIH METODE PEMBAYARAN */}
      <div className="border rounded-lg p-3 bg-white/5 space-y-2">
        <h2 className="font-semibold mb-1">Metode Pembayaran</h2>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleChooseQris}
            className={`w-full px-3 py-2 rounded-lg border text-left ${
              paymentMethod === "qris"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-600 hover:bg-white/5"
            }`}
          >
            <div className="font-semibold">QRIS</div>
            <div className="text-xs text-gray-400">
              Scan barcode QRIS untuk membayar
            </div>
          </button>

          <button
            type="button"
            disabled
            className="w-full px-3 py-2 rounded-lg border border-gray-700 text-left opacity-60 cursor-not-allowed"
          >
            <div className="font-semibold">Pembayaran Member</div>
            <div className="text-xs text-gray-400">
              (Segera hadir — belum bisa digunakan)
            </div>
          </button>
        </div>
      </div>

      {/* INFO TAMBAHAN */}
      <p className="text-xs text-gray-400">
        Setelah kamu memilih metode pembayaran, ikuti instruksi yang muncul.
        Untuk saat ini pembayaran otomatis belum aktif, jadi admin akan mengecek
        pembayaran kamu secara manual.
      </p>

      {/* POPUP / MODAL QRIS */}
      {showQrisPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#111827] border border-gray-700 rounded-xl p-4 w-full max-w-sm relative">
            <button
              type="button"
              onClick={handleGoBackFromPopup}
              className="absolute right-3 top-2 text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-2">Bayar dengan QRIS</h2>
            <p className="text-xs text-gray-400 mb-3">
              Silakan scan barcode QRIS di bawah ini menggunakan aplikasi
              pembayaran (Dana, OVO, GoPay, ShopeePay, dll) lalu bayar sesuai
              nominal.
            </p>

            <div className="flex justify-center mb-3">
              {/* Ganti /qris.png dengan file QRIS kamu di folder /public */}
              <img
                src="/qris.png"
                alt="QRIS SenRobux"
                className="w-48 h-48 border border-gray-600 rounded-lg bg-white"
              />
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Setelah kamu membayar, tekan tombol{" "}
              <span className="font-semibold">"Sudah dibayar"</span> di bawah
              ini.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleAlreadyPaidQris}
                className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-semibold"
              >
                Sudah dibayar
              </button>
              <button
                type="button"
                onClick={handleGoBackFromPopup}
                className="w-full py-2 rounded-lg border border-gray-600 text-sm hover:bg-white/5"
              >
                Belum bayar / Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
