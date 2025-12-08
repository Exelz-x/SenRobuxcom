import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, userId, robuxAmount } = await req.json();

    if (!username || !userId || !robuxAmount) {
      return NextResponse.json(
        { ok: false, error: "Data pesanan kurang lengkap" },
        { status: 400 }
      );
    }

    // base URL server (untuk dipakai saat dev & production)
    const origin = req.nextUrl.origin;

    // Panggil API cek gamepass
    const checkRes = await fetch(`${origin}/api/roblox/check-gamepass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        targetRobux: robuxAmount,
      }),
    });

    const checkData = await checkRes.json();

    if (!checkData.ok) {
      return NextResponse.json(
        { ok: false, error: checkData.error || "Gagal cek gamepass" },
        { status: 500 }
      );
    }

    // sementara, orderId pake timestamp
    const fakeOrderId = Date.now().toString();

    if (checkData.hasPass) {
      // Sudah punya gamepass dengan harga sesuai
      return NextResponse.json({
        ok: true,
        next: "checkout",
        orderId: fakeOrderId,
        debug: checkData,
      });
    } else {
      // Belum punya gamepass
      return NextResponse.json({
        ok: true,
        next: "create-gamepass",
        orderId: fakeOrderId,
        debug: checkData,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Error tak terduga" },
      { status: 500 }
    );
  }
}