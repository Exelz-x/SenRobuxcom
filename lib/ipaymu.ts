// src/lib/ipaymu.ts
import crypto from "crypto";

const IPAYMU_MODE = process.env.IPAYMU_MODE || "sandbox";
const IPAYMU_SANDBOX_URL = process.env.IPAYMU_SANDBOX_URL || "https://sandbox.ipaymu.com/api";
const IPAYMU_PRODUCTION_URL = process.env.IPAYMU_PRODUCTION_URL || "https://ipaymu.com/api";

const IPAYMU_VA = process.env.IPAYMU_VA || "";       // HARUS DIISI
const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY || ""; // HARUS DIISI

const BASE_URL =
  IPAYMU_MODE === "production" ? IPAYMU_PRODUCTION_URL : IPAYMU_SANDBOX_URL;

interface CreatePaymentParams {
  orderId: string;
  total: number;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  product: string;
}

export async function createIpaymuPayment(params: CreatePaymentParams) {
  if (!IPAYMU_VA || !IPAYMU_API_KEY) {
    console.error("IPAYMU_VA atau IPAYMU_API_KEY belum diisi di ENV");
    return {
      ok: false,
      status: 500,
      data: { message: "IPAYMU env not configured" },
      paymentUrl: null as string | null,
    };
  }

  const body: any = {
    key: IPAYMU_API_KEY,
    product: [params.product],
    qty: [1],
    price: [params.total],
    amount: params.total,
    notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipaymu/callback`,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/waiting-payment/${params.orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${params.orderId}`,
    referenceId: params.orderId,
    buyerName: params.buyerName,
    buyerEmail: params.buyerEmail ?? "",
    buyerPhone: params.buyerPhone ?? "",
  };

  // sesuai sample: stringify body untuk signature
  const bodyString = JSON.stringify(body);
  const timestamp = Math.floor(Date.now() / 1000).toString(); // unix timestamp detik

  // signature = HMACSHA256(va + apiKey + body + timestamp)
  const signatureRaw = IPAYMU_VA + IPAYMU_API_KEY + bodyString + timestamp;
  const signature = crypto.createHmac("sha256", IPAYMU_API_KEY).update(signatureRaw).digest("hex");

  const url = `${BASE_URL}/v2/payment`;

  console.log("IPAYMU REQUEST URL:", url);
  console.log("IPAYMU REQUEST BODY:", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      va: IPAYMU_VA,
      signature: signature,
      timestamp: timestamp,
    },
    body: bodyString,
  });

  const data = await res.json().catch(() => ({}));

  console.log("IPAYMU RESPONSE STATUS:", res.status);
  console.log("IPAYMU RESPONSE BODY:", data);

  const paymentUrl = (data && (data.Url || data.url)) ?? null;

  return {
    ok: res.ok && data?.Success !== false,
    status: res.status,
    data,
    paymentUrl,
  };
}

