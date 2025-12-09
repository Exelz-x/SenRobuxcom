import crypto from "crypto";

const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || "";
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || "";
const DOKU_IS_PRODUCTION = process.env.DOKU_IS_PRODUCTION === "true";

if (!DOKU_CLIENT_ID) {
  console.warn("DOKU_CLIENT_ID belum di-set di environment");
}
if (!DOKU_SECRET_KEY) {
  console.warn("DOKU_SECRET_KEY belum di-set di environment");
}

const DOKU_BASE_URL = DOKU_IS_PRODUCTION
  ? "https://api.doku.com"
  : "https://api-sandbox.doku.com";

// Generate signature sesuai dokumentasi DOKU Checkout
// Request-Target untuk Checkout: /checkout/v1/payment
function generateDokuSignature(
  body: unknown,
  requestId: string,
  timestamp: string,
  requestTarget = "/checkout/v1/payment"
) {
  const jsonBody = JSON.stringify(body);

  // Digest = base64(SHA256(body))
  const digest = crypto
    .createHash("sha256")
    .update(jsonBody, "utf8")
    .digest("base64");

  // Susun komponen signature
  const signatureComponents =
    `Client-Id:${DOKU_CLIENT_ID}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${timestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  const hmac = crypto.createHmac("sha256", DOKU_SECRET_KEY);
  hmac.update(signatureComponents);
  const signature = hmac.digest("base64");

  return {
    digest,
    signature: `HMACSHA256=${signature}`,
    jsonBody,
  };
}

export async function createDokuCheckoutPayment(opts: {
  amount: number;
  invoiceNumber: string;
}) {
  if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
    throw new Error("DOKU env belum lengkap (CLIENT_ID / SECRET_KEY)");
  }

  const { amount, invoiceNumber } = opts;

  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString(); // UTC ISO8601

  // Body minimal sesuai docs DOKU Checkout: order + payment.payment_due_date
  const body = {
    order: {
      amount,
      invoice_number: invoiceNumber,
      // currency: "IDR", // optional, default IDR
    },
    payment: {
      payment_due_date: 60, // expired 60 menit
    },
  };

  const { signature, jsonBody } = generateDokuSignature(
    body,
    requestId,
    timestamp
  );

  const res = await fetch(`${DOKU_BASE_URL}/checkout/v1/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": DOKU_CLIENT_ID,
      "Request-Id": requestId,
      "Request-Timestamp": timestamp,
      Signature: signature,
    },
    body: jsonBody,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("DOKU Checkout error:", res.status, data);
    throw new Error(
      `DOKU error ${res.status}: ${
        (data as any)?.error?.message || JSON.stringify(data)
      }`
    );
  }

  // Response standar DOKU Checkout mengandung payment.url
  // lihat docs: Backend Integration → obtain payment.url 
  const paymentUrl = (data as any)?.payment?.url;

  if (!paymentUrl) {
    console.error("Response DOKU tidak punya payment.url:", data);
    throw new Error("payment.url tidak ditemukan di response DOKU");
  }

  return {
    paymentUrl,
    raw: data,
  };
}
