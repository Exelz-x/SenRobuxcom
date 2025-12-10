import CheckoutClient from "./CheckoutClient";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

interface PageProps {
  params: { orderId?: string }; // boleh undefined, kita tangani di bawah
  searchParams: SearchParams;
}

export default function CheckoutPage({ params, searchParams }: PageProps) {
  // 1. coba ambil dari folder dinamis /checkout/[orderId]
  const orderIdFromParams = params?.orderId;

  // 2. kalau nggak ada, coba ambil dari query string ?orderId=xxx
  const rawOrderIdFromSearch = searchParams.orderId;
  const orderIdFromSearch =
    typeof rawOrderIdFromSearch === "string"
      ? rawOrderIdFromSearch
      : Array.isArray(rawOrderIdFromSearch)
      ? rawOrderIdFromSearch[0]
      : "";

  // 3. pilih yang ada
  const orderId = orderIdFromParams || orderIdFromSearch || "";

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





