import { Address } from "viem";
import { useBalance } from "wagmi";

function WalletBalance(params: { address: Address }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <p>
      Balance: {data?.formatted} {data?.symbol}
    </p>
  );
}

export default WalletBalance;
