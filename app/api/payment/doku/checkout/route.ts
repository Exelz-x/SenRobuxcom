export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createDokuCheckoutPayment } from "@/lib/doku";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawOrderId = (body.orderId as string | undefined) ?? "";
    const amount = Number(body.amount || 0);

    if (!rawOrderId) {
      return NextResponse.json(
        { ok: false, error: "orderId wajib diisi" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: `Jumlah pembayaran tidak valid: ${amount}` },
        { status: 400 }
      );
    }

    // bikin invoice number unik untuk DOKU
    const invoiceNumber = `SRBX-${rawOrderId}-${Date.now()}`;

    const { paymentUrl, raw } = await createDokuCheckoutPayment({
      amount,
      invoiceNumber,
    });

    return NextResponse.json({
      ok: true,
      paymentUrl,
      dokuRaw: raw,
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
