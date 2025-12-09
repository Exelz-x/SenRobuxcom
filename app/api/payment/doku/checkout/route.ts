export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createDokuCheckoutPayment } from "@/lib/doku";

// Aturan harga dari jumlah Robux
function getPriceFromRobux(robuxAmount: number): number {
  if (robuxAmount === 100) return 20000;
  if (robuxAmount === 200) return 38000;
  if (robuxAmount === 400) return 75000;
  if (robuxAmount === 800) return 145000;

  return robuxAmount * 200;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawOrderId = (body.orderId as string | undefined) ?? "";

    const rawRobux =
      body.robuxAmount !== undefined ? body.robuxAmount : body.robux;

    let robuxAmount = Number(rawRobux ?? 0);

    if (Number.isNaN(robuxAmount) || robuxAmount <= 0) {
      console.warn(
        "robuxAmount tidak valid dari client, pakai default 100. Value:",
        rawRobux
      );
      robuxAmount = 100;
    }

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

    const result = await createDokuCheckoutPayment({
      amount,
      invoiceNumber,
    });

    if (!result.ok) {
      // Kirim balik detail error dari DOKU ke frontend
      return NextResponse.json(
        {
          ok: false,
          error: "DOKU mengembalikan error",
          dokuStatus: result.status,
          dokuResponse: result.data,
          debug: {
            safeOrderId,
            robuxAmount,
            amount,
            invoiceNumber,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      paymentUrl: result.paymentUrl,
      debug: {
        safeOrderId,
        robuxAmount,
        amount,
        invoiceNumber,
        dokuStatus: result.status,
      },
    });
  } catch (err) {
    console.error("Error di /api/payment/doku/checkout:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Gagal inisiasi pembayaran DOKU di server (exception di route).",
      },
      { status: 500 }
    );
  }
}



