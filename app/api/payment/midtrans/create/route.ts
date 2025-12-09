export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";

// Aturan harga dari jumlah Robux (silakan sesuaikan nanti)
function getPriceFromRobux(robuxAmount: number): number {
  if (robuxAmount === 100) return 20000;
  if (robuxAmount === 200) return 38000;
  if (robuxAmount === 400) return 75000;
  if (robuxAmount === 800) return 145000;

  // fallback, misal 1 Robux = 180 rupiah
  return robuxAmount * 180;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawOrderId = body.orderId as string | undefined;
    const username = (body.username as string | undefined) ?? "Customer";

    // Ambil robux dari body.robuxAmount ATAU body.robux (jaga-jaga)
    const rawRobux =
      body.robuxAmount !== undefined ? body.robuxAmount : body.robux;

    let robuxAmount = Number(rawRobux ?? 0);

    // Fallback kalau frontend ngaco / 0 / NaN
    if (Number.isNaN(robuxAmount) || robuxAmount <= 0) {
      console.warn(
        "robuxAmount tidak valid dari client, pakai default 100. Value:",
        rawRobux
      );
      robuxAmount = 100;
    }

    // Kalau frontend nggak kirim orderId, kita bikin sendiri (biar nggak error)
    const safeOrderId =
      rawOrderId && rawOrderId.trim().length > 0
        ? rawOrderId.trim()
        : `auto-${Date.now()}`;

    const amount = getPriceFromRobux(robuxAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Harga tidak valid di server." },
        { status: 400 }
      );
    }

    if (!process.env.MIDTRANS_SERVER_KEY) {
      console.error("MIDTRANS_SERVER_KEY tidak di-set di environment");
      return NextResponse.json(
        {
          ok: false,
          error:
            "Konfigurasi pembayaran belum lengkap (server key kosong). Hubungi admin.",
        },
        { status: 500 }
      );
    }

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: `senrobux-${safeOrderId}-${Date.now()}`,
        gross_amount: amount,
      },
      customer_details: {
        first_name: username,
        email: "customer@example.com",
      },
      item_details: [
        {
          id: `robux-${robuxAmount}`,
          price: amount,
          quantity: 1,
          name: `${robuxAmount} Robux via Gamepass`,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (err) {
    console.error("Error create midtrans transaction:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Gagal membuat transaksi Midtrans di server. Detail error sudah dicatat.",
      },
      { status: 500 }
    );
  }
}