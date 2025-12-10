// app/admin/page.tsx
"use client";

import { useState } from "react";

type OrderStatus = "UNPAID" | "WAITING" | "PAID" | "DONE";

interface Order {
  id: string;
  username: string;
  robux: number;
  price: number;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "SRX-001",
    username: "PlayerSatu",
    robux: 100,
    price: 20000,
    status: "WAITING",
  },
  {
    id: "SRX-002",
    username: "NoobPro",
    robux: 400,
    price: 75000,
    status: "UNPAID",
  },
  {
    id: "SRX-003",
    username: "RobuxKing",
    robux: 800,
    price: 145000,
    status: "PAID",
  },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  function statusLabel(status: OrderStatus) {
    if (status === "UNPAID") return "Belum Dibayar";
    if (status === "WAITING") return "Menunggu Konfirmasi";
    if (status === "PAID") return "Siap Dikirim";
    return "Selesai";
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="border-b border-green-500/20 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-green-400">
            Admin · SenRobux
          </h1>
          <p className="text-xs text-gray-400">Panel Pesanan</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Daftar Pesanan</h2>
          <div className="flex gap-2 text-xs">
            {["ALL", "UNPAID", "WAITING", "PAID", "DONE"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`rounded-full px-3 py-1 ${
                  filter === s
                    ? "bg-green-500 text-black"
                    : "bg-black/60 text-gray-300"
                }`}
              >
                {s === "ALL" ? "Semua" : statusLabel(s as OrderStatus)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/60 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Robux</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-xs text-gray-500"
                  >
                    Belum ada pesanan dengan filter ini.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-800/80 text-xs text-gray-200"
                >
                  <td className="px-4 py-3 font-mono">{order.id}</td>
                  <td className="px-4 py-3">{order.username}</td>
                  <td className="px-4 py-3">{order.robux} R$</td>
                  <td className="px-4 py-3">
                    Rp {order.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-800 px-2 py-1 text-[11px]">
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.status === "UNPAID" && (
                      <button
                        onClick={() => updateStatus(order.id, "WAITING")}
                        className="rounded-full bg-yellow-500/20 px-3 py-1 text-[11px] text-yellow-300 hover:bg-yellow-500/30"
                      >
                        Tandai Menunggu
                      </button>
                    )}
                    {order.status === "WAITING" && (
                      <button
                        onClick={() => updateStatus(order.id, "PAID")}
                        className="rounded-full bg-green-500/20 px-3 py-1 text-[11px] text-green-300 hover:bg-green-500/30"
                      >
                        Konfirmasi Dibayar
                      </button>
                    )}
                    {order.status === "PAID" && (
                      <button
                        onClick={() => updateStatus(order.id, "DONE")}
                        className="rounded-full bg-blue-500/20 px-3 py-1 text-[11px] text-blue-300 hover:bg-blue-500/30"
                      >
                        Tandai Selesai
                      </button>
                    )}
                    {order.status === "DONE" && (
                      <span className="text-[11px] text-gray-500">
                        Selesai
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] text-gray-500">
          Ini baru UI dummy. Nanti sambungkan ke database & API pesanan milik
          kamu sendiri (misalnya Supabase / Prisma).
        </p>
      </main>
    </div>
  );
}

