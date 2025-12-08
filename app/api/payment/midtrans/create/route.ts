export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";

function getPriceFromRobux(robuxAmount: number): number {
  // SILAKAN EDIT: ini contoh saja
  if (robuxAmount === 100) return 20000;
  if (robuxAmount === 200) return 38000;
  if (robuxAmount === 400) return 75000;
  if (robuxAmount === 800) return 145000;

  return robuxAmount * 180;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body.orderId as string | undefined;
    const username = (body.username as string | undefined) ?? "Customer";
    const robuxAmount = Number(body.robuxAmount || 0);

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "orderId wajib diisi" },
        { status: 400 }
      );
    }

    if (!robuxAmount || Number.isNaN(robuxAmount)) {
      return NextResponse.json(
        { ok: false, error: "Jumlah Robux tidak valid" },
        { status: 400 }
      );
    }

    const amount = getPriceFromRobux(robuxAmount);
    if (amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Harga tidak valid" },
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
        order_id: `senrobux-${orderId}-${Date.now()}`,
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