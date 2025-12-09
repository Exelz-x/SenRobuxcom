interface PageProps {
  params: { orderId: string };
}

export default function WaitingPaymentPage({ params }: PageProps) {
  const { orderId } = params;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-gray-700 rounded-xl p-4 bg-[#020617]">
        <h1 className="text-xl font-bold mb-2">Menunggu Pembayaran</h1>

        <p className="text-sm text-gray-400 mb-2">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>

        <p className="text-sm mb-3">
          Pembayaran anda sedang dicek oleh admin.{" "}
          <br />
          <br />
          Jika anda <span className="font-semibold">belum membayar</span>, harap
          segera melunaskan pembayaran anda menggunakan QRIS yang tersedia.
          <br />
          <br />
          Jika anda <span className="font-semibold">sudah membayar</span>, maka
          silakan tunggu admin kami mengirim Robux anda menggunakan gamepass.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={`/checkout/${orderId}`}
            className="w-full text-center py-2 rounded-lg border border-gray-600 text-sm hover:bg-white/5"
          >
            Belum bayar / Kembali ke pembayaran
          </a>
        </div>

        <p className="mt-3 text-[11px] text-gray-500">
          Catatan: Halaman ini tidak otomatis berubah. Admin akan mengubah
          status pesanan anda setelah pembayaran dikonfirmasi dan Robux
          dikirimkan.
        </p>
      </div>
    </div>
  );
}
