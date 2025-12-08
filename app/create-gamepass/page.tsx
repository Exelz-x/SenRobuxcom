import { Suspense } from "react";
import { CreateGamepassClient } from "./CreateGamepassClient";

export default function CreateGamepassPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
          <p className="text-sm text-gray-300">Memuat halaman pembuatan gamepass...</p>
        </main>
      }
    >
      <CreateGamepassClient />
    </Suspense>
  );
}
