interface SuccessPageProps {
  params: { orderId: string };
}

export default function SuccessPage({ params }: SuccessPageProps) {
  const { orderId } = params;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Lingkaran centang */}
          <div className="flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Pesanan Berhasil Dibuat</h1>
            <p className="text-sm text-gray-300">
              Terima kasih! Pesanan kamu dengan ID{" "}
              <span className="font-semibold text-emerald-300">#{orderId}</span> telah kami terima.
            </p>
            <p className="text-sm text-gray-300">
              Mohon tunggu maksimal <span className="font-semibold">5 hari</span> kerja untuk proses
              pengiriman Robux ke akun Roblox kamu.
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Jika dalam waktu 5 hari Robux belum masuk, silakan hubungi customer service kami
              dengan menyertakan ID pesanan dan username Roblox kamu.
            </p>
          </div>

          <div>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}