import TokenAddressFromApi from "./TokenAddressFromApi";
import TokenBalance from "./TokenBalance";
import TokenName from "./TokenName";

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-full bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">MyToken contract details:</h2>
        <TokenName />
        <TokenBalance address={params.address} />
        <TokenAddressFromApi />
      </div>
    </div>
  );
}

export default TokenInfo;
