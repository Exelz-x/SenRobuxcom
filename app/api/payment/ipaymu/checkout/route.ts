// src/app/api/payment/ipaymu/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createIpaymuPayment } from "@/lib/ipaymu";
// import getOrderById, getPriceFromRobux, etc.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { ok: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    // TODO: fetch order from DB by orderId
    // const order = await getOrderById(orderId);
    // if (!order) ...

    // Misal order punya field: robuxAmount, username, email, phone
    // const total = getPriceFromRobux(order.robuxAmount);

    const total = 20000; // sementara hardcoded buat test

    const payment = await createIpaymuPayment({
      orderId,
      total,
      buyerName: "Nama Buyer", // ganti dari order.username atau form
      buyerEmail: "email@example.com",
      buyerPhone: "08xxxx",
      product: `Pembelian Robux #${orderId}`,
    });

    if (!payment.ok || !payment.paymentUrl) {
      return NextResponse.json(
        { ok: false, message: "Failed to create Ipaymu payment", data: payment.data },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, paymentUrl: payment.paymentUrl },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
