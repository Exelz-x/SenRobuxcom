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

function generateDokuSignature(
  body: unknown,
  requestId: string,
  timestamp: string,
  requestTarget = "/checkout/v1/payment"
) {
  const jsonBody = JSON.stringify(body);

  const hash = crypto.createHash("sha256").update(jsonBody, "utf8").digest();
  const digestBase64 = hash.toString("base64");

  const signatureComponents =
    `Client-Id:${DOKU_CLIENT_ID}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${timestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digestBase64}`;

  const hmac = crypto.createHmac("sha256", DOKU_SECRET_KEY);
  hmac.update(signatureComponents);
  const signatureBase64 = hmac.digest("base64");

  return {
    digestBase64,
    signatureHeader: `HMACSHA256=${signatureBase64}`,
    jsonBody,
  };
}

export async function createDokuCheckoutPayment(opts: {
  amount: number;
  invoiceNumber: string;
}) {
  const { amount, invoiceNumber } = opts;

  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const body = {
    order: {
      amount,
      invoice_number: invoiceNumber,
    },
    payment: {
      payment_due_date: 60,
    },
  };

  const { digestBase64, signatureHeader, jsonBody } = generateDokuSignature(
    body,
    requestId,
    timestamp
  );

  try {
    const res = await fetch(`${DOKU_BASE_URL}/checkout/v1/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": DOKU_CLIENT_ID,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: signatureHeader,
        Digest: `SHA-256=${digestBase64}`,
      },
      body: jsonBody,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.error("DOKU Checkout error:", res.status, data);
      return {
        ok: false,
        status: res.status,
        data,
      };
    }

    const paymentUrl = (data as any)?.payment?.url;

    if (!paymentUrl) {
      console.error("Response DOKU tidak punya payment.url:", data);
      return {
        ok: false,
        status: res.status,
        data,
        error: "payment.url tidak ditemukan di response DOKU",
      };
    }

    return {
      ok: true,
      status: res.status,
      data,
      paymentUrl,
    };
  } catch (err: any) {
    console.error("Error network/unknown saat call DOKU:", err);
    return {
      ok: false,
      status: 0,
      data: { error: String(err?.message || err) },
    };
  }
}


