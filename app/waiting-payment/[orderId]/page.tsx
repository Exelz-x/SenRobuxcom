// app/waiting-payment/[orderId]/page.tsx
import Link from "next/link";

interface PageProps {
  params: { orderId: string };
}

export default function WaitingPaymentPage({ params }: PageProps) {
  const { orderId } = params;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="border-b border-green-500/20 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500">
              🎮
            </div>
            <span className="text-lg font-semibold text-green-400">
              SenRobux
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 text-3xl text-yellow-400">
          ⏳
        </div>
        <h1 className="text-xl font-bold">Menunggu Pembayaran</h1>
        <p className="mt-2 text-sm text-gray-300">
          Order ID:{" "}
          <span className="font-mono text-xs text-gray-200">{orderId}</span>
        </p>
        <p className="mt-3 text-sm text-gray-300">
          Pembayaran anda sedang dicek oleh admin.{" "}
          <br />
          Jika anda <span className="font-semibold">belum membayar</span>, harap
          segera melunaskan pembayaran menggunakan metode yang telah dipilih.
          Jika anda sudah membayar, silakan tunggu admin mengirim Robux melalui
          Gamepass.
        </p>

        <Link
          href={`/checkout/${orderId}`}
          className="mt-6 w-full rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-sm font-semibold text-gray-200 hover:border-green-500/50 hover:bg-black/80"
        >
          Belum bayar / Kembali ke halaman pembayaran
        </Link>

        <p className="mt-3 text-[11px] text-gray-500">
          Halaman ini tidak otomatis berubah. Status pesanan akan diperbarui
          oleh admin setelah pembayaran dikonfirmasi.
        </p>
      </main>
    </div>
  );
}

