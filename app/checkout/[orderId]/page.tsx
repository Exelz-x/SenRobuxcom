interface CheckoutPageProps {
  params: { orderId: string };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = params;

  // Nanti kalau sudah ada database, kita ambil detail order dari server.
  // Untuk sekarang, ini cuma tampilan placeholder.

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Pembayaran</h1>
          <p className="text-sm text-gray-300">
            Pesanan #{orderId}. Di sini nanti akan ada QRIS dan metode pembayaran lainnya (Midtrans).
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
          <p>Ringkasan pesanan (contoh):</p>
          <ul className="list-disc list-inside text-gray-200">
            <li>Username Roblox: (nanti dari database)</li>
            <li>Jumlah Robux: (nanti dari database)</li>
            <li>Harga Rupiah: (nanti dari database)</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-200">
          <p>
            Tahap ini baru tampilan saja. Di langkah berikutnya, kita akan sambungkan ke Midtrans
            supaya kamu bisa menerima pembayaran via QRIS, e-wallet, dan gerai retail.
          </p>
        </section>

        <section>
          <a
            href={`/success/${orderId}`}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition"
          >
            (Dummy) Tandai sebagai sudah dibayar
          </a>
        </section>
      </div>
    </main>
  );
}