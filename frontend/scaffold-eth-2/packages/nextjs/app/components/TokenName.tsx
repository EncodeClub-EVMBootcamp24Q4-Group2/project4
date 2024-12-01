import { useReadContract } from "wagmi";

function TokenName() {
  const { data, isError, isLoading } = useReadContract({
    address: "0x2282A77eC5577365333fc71adE0b4154e25Bb2fa",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

export default TokenName;
