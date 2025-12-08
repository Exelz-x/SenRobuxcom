"use client";

import { useState, useEffect } from "react";

type RobloxUser = {
  userId: number;
  name: string;
  displayName: string;
  avatarUrl?: string | null;
};

const PACKAGES = [100, 200, 400, 800];

export default function HomePage() {
  const [selectedRobux, setSelectedRobux] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // debounce: cek username 600ms setelah user berhenti mengetik
  useEffect(() => {
    if (!username) {
      setRobloxUser(null);
      setErrorUser(null);
      return;
    }

    const t = setTimeout(async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const res = await fetch("/api/roblox/resolve-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (!data.ok) {
          setErrorUser(data.error || "Username tidak ditemukan");
          setRobloxUser(null);
        } else {
          setRobloxUser(data);
        }
      } catch (e) {
        setErrorUser("Gagal menghubungi server");
        setRobloxUser(null);
      } finally {
        setLoadingUser(false);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [username]);

  async function handleBuy() {
    if (!selectedRobux || !robloxUser) return;
    setCreatingOrder(true);
    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robuxAmount: selectedRobux,
          username: robloxUser.name,
          userId: robloxUser.userId,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || "Gagal membuat pesanan");
        return;
      }

      if (data.next === "create-gamepass") {
        const params = new URLSearchParams({
          orderId: data.orderId,
          username: robloxUser.name,
          userId: String(robloxUser.userId),
          robux: String(selectedRobux),
          requiredPrice: String(data.requiredPrice ?? data.debug?.requiredPrice ?? ""),
        });
        window.location.href = `/create-gamepass?${params.toString()}`;
      } else if (data.next === "checkout") {
        const params = new URLSearchParams({
          username: robloxUser.name,
          robux: String(selectedRobux),
        });
        window.location.href = `/checkout/${data.orderId}?${params.toString()}`;
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
        {/* Banner SenRobux */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            SenRobux
            <span className="block text-emerald-400 text-xl md:text-2xl">
              Top Up Robux via Gamepass – Aman &amp; Terarah
            </span>
          </h1>
          <p className="text-sm text-gray-300">
            Pilih paket Robux, masukkan username Roblox, dan ikuti panduan kami untuk membuat gamepass.
          </p>
        </header>

        {/* List harga Robux */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pilih paket Robux</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PACKAGES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRobux(r)}
                className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                  selectedRobux === r
                    ? "border-emerald-400 bg-emerald-500/20"
                    : "border-white/10 bg-white/5 hover:border-emerald-400/70"
                }`}
              >
                {r.toLocaleString("id-ID")} Robux
              </button>
            ))}
          </div>
        </section>

        {/* Input Username + Avatar */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Username Roblox</h2>
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-2xl border border-white/15 bg-black/40 px-4 py-2 text-sm outline-none focus:border-emerald-400"
              placeholder="Masukkan username Roblox kamu"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-xs text-gray-400">
              {robloxUser?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={robloxUser.avatarUrl}
                  alt={robloxUser.displayName || robloxUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>Avatar</span>
              )}
            </div>
          </div>
          {loadingUser && <p className="text-xs text-gray-400">Mengecek username...</p>}
          {errorUser && <p className="text-xs text-red-400">{errorUser}</p>}
          {robloxUser && !errorUser && (
            <p className="text-xs text-emerald-300">
              Ditemukan: <b>{robloxUser.displayName}</b> ({robloxUser.name})
            </p>
          )}
        </section>

        {/* Tombol Beli Robux */}
        <section className="space-y-2">
          <button
            disabled={!selectedRobux || !robloxUser || creatingOrder}
            onClick={handleBuy}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-400 transition"
          >
            {creatingOrder ? "Memproses..." : "Beli Robux"}
          </button>
          <p className="text-xs text-gray-400">
            Sistem akan mengecek otomatis apakah kamu sudah punya gamepass dengan harga yang sesuai.
          </p>
        </section>

        {/* TODO: FAQ, CS, dll */}
      </div>
    </main>
  );
}
