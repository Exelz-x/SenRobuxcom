// app/checkout/[orderId]/page.tsx
import { CheckoutClient } from "./CheckoutClient";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface PageProps {
  params: { orderId: string };
  searchParams: SearchParams;
}

export default function CheckoutPage({ params, searchParams }: PageProps) {
  const orderId = params.orderId;
  const username = (searchParams.username as string) || "Customer";

  const robuxParam =
    (searchParams.robux as string | undefined) ??
    (Array.isArray(searchParams.robux)
      ? (searchParams.robux[0] as string)
      : "0");

  const robux = Number.parseInt(robuxParam || "0", 10) || 0;

  return (
    <CheckoutClient
      orderId={orderId}
      username={username}
      robuxAmount={robux}
    />
  );
}






