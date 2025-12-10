// app/success/[orderId]/page.tsx
import Link from "next/link";

interface PageProps {
  params: { orderId: string };
}

export default function SuccessPage({ params }: PageProps) {
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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-400">
          ✅
        </div>
        <h1 className="text-xl font-bold">Pesanan Berhasil Dibuat</h1>
        <p className="mt-2 text-sm text-gray-300">
          Order ID:{" "}
          <span className="font-mono text-xs text-gray-200">{orderId}</span>
        </p>
        <p className="mt-3 text-sm text-gray-300">
          Terima kasih! Pesanan kamu telah tercatat di sistem kami. Robux akan
          dikirim melalui Gamepass ke akun Roblox kamu maksimal{" "}
          <span className="font-semibold text-green-400">5 hari kerja</span>.
        </p>

        <Link
          href="/"
          className="mt-6 w-full rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400"
        >
          Kembali ke Beranda
        </Link>
      </main>
    </div>
  );
}
