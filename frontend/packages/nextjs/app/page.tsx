"use client";

import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import VoteAllowanceTokenABI from "../../hardhat/artifacts/contracts/VoteAllowanceToken.sol/VoteAllowanceToken.json";
import type { NextPage } from "next";
import { useAccount, useBalance, useReadContract, useSignMessage } from "wagmi";
import { useState } from "react";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">fang10000</span>
            <span className="block text-4xl font-bold">EnCode Project 4</span>
          </h1>
          {/* <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p> */}
          <PageBody />
          <WalletInfo />
          {/* <ExampleContractRead /> */}
        </div>
      </div>
    </>
  );
};

// function PageBody() {
//   return (
//     <>
//       <p className="text-center text-lg">Here we are!</p>
//     </>
//   );
// }

function PageBody() {
  const [voteCounter, setVoteCounter] = useState({ vanilla: 0, chocolate: 0, strawberry: 0 });
  const [message, setMessage] = useState("");

  const handleButtonClick = (option: number) => {
    setMessage("Thanks for your vote!");

    setVoteCounter((prevCounter) => {
      switch (option) {
        case 1:
          return { ...prevCounter, vanilla: prevCounter.vanilla + 1 };
        case 2:
          return { ...prevCounter, chocolate: prevCounter.chocolate + 1 };
        case 3:
          return { ...prevCounter, strawberry: prevCounter.strawberry + 1 };
        default:
          return prevCounter;
      }
    });
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold mb-4">Vote Options:</h2>
      <div className="flex flex-col items-center space-y-4">
        <button className="btn btn-primary" onClick={() => handleButtonClick(1)}>
          Vanilla
        </button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(2)}>
          Chocolate
        </button>
        <button className="btn btn-primary" onClick={() => handleButtonClick(3)}>
          Strawberry
        </button>
      </div>
      {message && <p className="text-center mt-4">{message}</p>}
      <div className="text-center mt-4">
        <p>New York Votes: {voteCounter.vanilla}</p>
        <p>Washington D.C. Votes: {voteCounter.chocolate}</p>
        <p>Denver Votes: {voteCounter.strawberry}</p>
      </div>
    </>
  );
}

// Read token name from the contract
function ExampleContractRead() {
  const {
    data: tokenName,
    isPending,
    isError,
    error,
  } = useScaffoldReadContract({
    contractName: "VoteAllowanceToken",
    functionName: "name",
    abi: VoteAllowanceTokenABI.abi, // Ensure the ABI is correctly passed
  });

  console.log("Contract Name:", "VoteAllowanceToken");
  console.log("Function Name:", "name");

  if (isPending) {
    console.log("Fetching token name...");
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (isError) {
    console.error("Error fetching token name:", error);
    return <p className="text-center text-lg">Error getting information from your contract</p>;
  }

  console.log("Token Name:", tokenName);

  return (
    <>
      <p className="text-center text-lg">The name of the token is {tokenName}</p>
    </>
  );
}

// Interacting with the wallet
function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>You are connected to the network {chain?.name}</p>
        {/* <WalletAction></WalletAction> */}
        <WalletBalance address={address as `0x${string}`}></WalletBalance>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

// Interacting with the wallet using wagmi
function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isPending, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useReadContract wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useReadContract({
    address: "0xf08A50178dfcDe18524640EA6618a1f965821715", // USDC
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

  console.log("TokenName data:", data);
  console.log("TokenName isError:", isError);
  console.log("TokenName isLoading:", isLoading);

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0xf08A50178dfcDe18524640EA6618a1f965821715",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}
export default Home;
