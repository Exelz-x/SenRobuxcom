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
  const robux = Number(searchParams.robux || "0");

  return (
    <CheckoutClient
      orderId={orderId}
      username={username}
      robuxAmount={robux}
    />
  );
}
