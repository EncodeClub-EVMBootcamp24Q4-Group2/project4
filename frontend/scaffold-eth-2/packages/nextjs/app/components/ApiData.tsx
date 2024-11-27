import RequestTokens from "./RequestToken";

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-full bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Mint Tokens:</h2>
        <RequestTokens address={params.address} />
      </div>
    </div>
  );
}

export default ApiData;
