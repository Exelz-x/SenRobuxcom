import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { ok: false, error: "Username tidak valid" },
        { status: 400 }
      );
    }

    // 1. Dapatkan userId dari username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true,
      }),
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Gagal menghubungi API Roblox" },
        { status: 502 }
      );
    }

    const userData = await userRes.json();
    const first = userData?.data?.[0];

    if (!first) {
      return NextResponse.json(
        { ok: false, error: "Username tidak ditemukan" },
        { status: 404 }
      );
    }

    const userId = first.id;

    // 2. Ambil avatar headshot
    const thumbUrl =
      `https://thumbnails.roblox.com/v1/users/avatar-headshot` +
      `?userIds=${userId}&size=150x150&format=Png&isCircular=true`;

    const thumbRes = await fetch(thumbUrl);
    let avatarUrl: string | null = null;

    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      avatarUrl = thumbData?.data?.[0]?.imageUrl ?? null;
    }

    return NextResponse.json({
      ok: true,
      userId,
      name: first.name,
      displayName: first.displayName,
      avatarUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Error tak terduga" },
      { status: 500 }
    );
  }
}