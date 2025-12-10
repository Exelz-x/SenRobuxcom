// src/app/api/payment/ipaymu/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Contoh field yang mungkin: referenceId, status, amount, etc.
  const { referenceId, status } = body;

  // TODO: verify signature sesuai docs Ipaymu

  // TODO: update order di DB berdasarkan referenceId (orderId)
  // if (status === "success") set status = PAID / WAITING_CONFIRMATION

  return NextResponse.json({ ok: true });
}
