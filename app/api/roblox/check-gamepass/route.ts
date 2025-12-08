import { NextRequest, NextResponse } from "next/server";
import { calculateGamepassPrice } from "@/lib/robux";

/**
 * Pakai endpoint resmi Roblox:
 *   https://apis.roblox.com/game-passes/v1/users/{userId}/game-passes?count=100&exclusiveStartId={startId}
 *   https://apis.roblox.com/game-passes/v1/game-passes/{gamePassId}/product-info
 *
 * Body: { userId: number, targetRobux: number }
 */

type GamePassListItem = {
  id?: number;           // kadang "id"
  gamePassId?: number;   // kalau pakai nama lain
};

type GamePassProductInfo = {
  Id: number;
  Name: string;
  PriceInRobux: number | null;
  IsForSale: boolean;
  Creator?: {
    Id: number;
    Name: string;
    CreatorType: string; // "User" / "Group"
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = Number(body.userId);
    const targetRobux = Number(body.targetRobux);

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json(
        { ok: false, error: "userId tidak valid" },
        { status: 400 }
      );
    }

    if (!targetRobux || Number.isNaN(targetRobux)) {
      return NextResponse.json(
        { ok: false, error: "targetRobux tidak valid" },
        { status: 400 }
      );
    }

    const requiredPrice = calculateGamepassPrice(targetRobux);

    let exclusiveStartId: number | null = null;
    const maxPages = 10; // aman: 10 * 100 = 1000 gamepass max
    let page = 0;

    while (page < maxPages) {
      page++;

      const params = new URLSearchParams({
        count: "100",
      });
      if (exclusiveStartId) {
        params.set("exclusiveStartId", String(exclusiveStartId));
      }

      const url = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?${params.toString()}`;

      const listRes = await fetch(url);
      if (!listRes.ok) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Gagal mengambil daftar gamepass user dari API Roblox (users/game-passes).",
            status: listRes.status,
          },
          { status: 502 }
        );
      }

      const listJson: any = await listRes.json();

      // Bisa jadi array langsung, atau object dengan properti "data" / "gamePasses"
      let items: GamePassListItem[] = [];
      if (Array.isArray(listJson)) {
        items = listJson;
      } else if (Array.isArray(listJson.data)) {
        items = listJson.data;
      } else if (Array.isArray(listJson.gamePasses)) {
        items = listJson.gamePasses;
      } else {
        // fallback: kalau structure beda, coba paksa treat sebagai array
        if (listJson && typeof listJson === "object") {
          const maybeArray = (listJson as any).value;
          if (Array.isArray(maybeArray)) {
            items = maybeArray;
          }
        }
      }

      if (!items.length) {
        // Tidak ada item sama sekali di page ini → selesai
        break;
      }

      // Per item, ambil product-info biar dapat harga dan creator
      for (const item of items) {
        const gamePassId =
          (item.id as number | undefined) ??
          (item.gamePassId as number | undefined);

        if (!gamePassId) continue;

        // Simpan sebagai cursor untuk page berikutnya
        exclusiveStartId = gamePassId;

        const infoUrl = `https://apis.roblox.com/game-passes/v1/game-passes/${gamePassId}/product-info`;

        const infoRes = await fetch(infoUrl);
        if (!infoRes.ok) {
          // Skip saja kalau gagal ambil detail pass tertentu
          continue;
        }

        const info = (await infoRes.json()) as GamePassProductInfo;

        const price = info.PriceInRobux ?? null;
        const isForSale = info.IsForSale;
        const creatorId = info.Creator?.Id ?? null;
        const creatorType = info.Creator?.CreatorType ?? null;

        // Filter:
        // - creator user, id sama dengan userId target
        // - harga pas
        // - ForSale true
        if (
          creatorType === "User" &&
          creatorId === userId &&
          price === requiredPrice &&
          isForSale
        ) {
          return NextResponse.json({
            ok: true,
            hasPass: true,
            requiredPrice,
            gamePass: {
              id: info.Id,
              name: info.Name,
              price,
              creatorId,
            },
          });
        }
      }

      // Kalau item < count, berarti sudah habis, tidak ada page berikutnya
      if (items.length < 100) {
        break;
      }
    }

    // Kalau sudah scan semua page tapi tidak ketemu
    return NextResponse.json({
      ok: true,
      hasPass: false,
      requiredPrice,
      message:
        "Belum ditemukan gamepass dengan harga yang sesuai yang dibuat oleh user ini. Pastikan gamepass sudah dibuat, For Sale, dan inventory user/public.",
    });
  } catch (err) {
    console.error("Error /api/roblox/check-gamepass (users endpoint):", err);
    return NextResponse.json(
      { ok: false, error: "Error tak terduga di server saat cek gamepass." },
      { status: 500 }
    );
  }
}
