import { CreateGamepassClient } from "./CreateGamepassClient";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default function CreateGamepassPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const orderId = (searchParams.orderId as string) || "";
  const username = (searchParams.username as string) || "";
  const userId = Number(searchParams.userId || "0");
  const robux = Number(searchParams.robux || "0");
  const requiredPrice = Number(searchParams.requiredPrice || "0");

  return (
    <CreateGamepassClient
      orderId={orderId}
      username={username}
      userId={userId}
      robux={robux}
      requiredPrice={requiredPrice}
    />
  );
}

