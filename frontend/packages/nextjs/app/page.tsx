"use client";

import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import VoteAllowanceTokenABI from "../../hardhat/artifacts/contracts/VoteAllowanceToken.sol/VoteAllowanceToken.json";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody />
          <ExampleContractRead />
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
    </>
  );
}

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

export default Home;
