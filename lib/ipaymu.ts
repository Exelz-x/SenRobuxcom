// src/lib/ipaymu.ts
import crypto from "crypto";

const IPAYMU_BASE_URL = process.env.IPAYMU_BASE_URL!;
const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY!;
const IPAYMU_VA = process.env.IPAYMU_VA!;

interface CreatePaymentParams {
  orderId: string;
  total: number;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  product: string;
}

export async function createIpaymuPayment(params: CreatePaymentParams) {
  if (!IPAYMU_BASE_URL || !IPAYMU_API_KEY || !IPAYMU_VA) {
    throw new Error("IPAYMU env not set");
  }

  const body: Record<string, any> = {
    key: IPAYMU_API_KEY,
    va: IPAYMU_VA,
    amount: params.total,
    product: [params.product],
    qty: [1],
    referenceId: params.orderId,
    buyerName: params.buyerName,
    notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipaymu/callback`,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/waiting-payment/${params.orderId}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/${params.orderId}`,
  };

  // Contoh jika butuh signature (cek di docs Ipaymu)
  // const bodyString = JSON.stringify(body);
  // const signature = crypto
  //   .createHmac("sha256", IPAYMU_API_KEY)
  //   .update(bodyString)
  //   .digest("hex");

  const res = await fetch(`${IPAYMU_BASE_URL}/v2/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "signature": signature,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Ipaymu error", data);
    return {
      ok: false,
      status: res.status,
      data,
    };
  }

  // Biasanya Ipaymu mengembalikan URL payment
  const paymentUrl = data?.Url || data?.url;

  return {
    ok: true,
    status: res.status,
    data,
    paymentUrl,
  };
}
