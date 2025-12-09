export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createDokuCheckoutPayment } from "@/lib/doku";

// Aturan harga dari jumlah Robux (SAMAKAN dengan yang kamu pakai di frontend)
function getPriceFromRobux(robuxAmount: number): number {
  if (robuxAmount === 100) return 20000;
  if (robuxAmount === 200) return 38000;
  if (robuxAmount === 400) return 75000;
  if (robuxAmount === 800) return 145000;

  // fallback, misal 1 Robux = 200 rupiah
  return robuxAmount * 200;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawOrderId = (body.orderId as string | undefined) ?? "";

    // Ambil robux dari body.robuxAmount atau body.robux
    const rawRobux =
      body.robuxAmount !== undefined ? body.robuxAmount : body.robux;

    let robuxAmount = Number(rawRobux ?? 0);

    // Kalau ngaco / 0 / NaN → fallback ke 100 Robux
    if (Number.isNaN(robuxAmount) || robuxAmount <= 0) {
      console.warn(
        "robuxAmount tidak valid dari client, pakai default 100. Value:",
        rawRobux
      );
      robuxAmount = 100;
    }

    // Bikin orderId aman kalau kosong
    const safeOrderId =
      rawOrderId && rawOrderId.trim().length > 0
        ? rawOrderId.trim()
        : `auto-${Date.now()}`;

    const amount = getPriceFromRobux(robuxAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: `Harga tidak valid di server untuk Robux: ${robuxAmount}`,
        },
        { status: 400 }
      );
    }

    const invoiceNumber = `SRBX-${safeOrderId}-${Date.now()}`;

    const { paymentUrl, raw } = await createDokuCheckoutPayment({
      amount,
      invoiceNumber,
    });

    return NextResponse.json({
      ok: true,
      paymentUrl,
      dokuRaw: raw,
      debug: {
        safeOrderId,
        robuxAmount,
        amount,
        invoiceNumber,
      },
    });
  } catch (err: any) {
    console.error("Error di /api/payment/doku/checkout:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Gagal inisiasi pembayaran DOKU. Cek log server.",
      },
      { status: 500 }
    );
  }
}


