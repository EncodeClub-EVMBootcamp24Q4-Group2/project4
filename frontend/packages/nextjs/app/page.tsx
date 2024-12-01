"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import type { NextPage } from "next";
import { useAccount, useBalance, useReadContract, useSignMessage } from "wagmi";

//import VoteAllowanceTokenABI from "../../hardhat/artifacts/contracts/VoteAllowanceToken.sol/VoteAllowanceToken.json";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">fang10000</span>
            <span className="block text-4xl font-bold">EnCode Project 4</span>
          </h1>
          <PageBody />
        </div>
      </div>
    </>
  );
};

function PageBody() {
  const [voteCounter, setVoteCounter] = useState({ vanilla: 0, chocolate: 0, strawberry: 0 });
  const [message, setMessage] = useState("");

  const handleButtonClick = (option: number) => {
    setMessage("Not connected to the tokenized ballot contract! Frontend counter only.");

    setVoteCounter(prevCounter => {
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
      {/* Mint Token Section */}
      <MintToken />
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
        <p>Vanilla Votes: {voteCounter.vanilla}</p>
        <p>Chocolate Votes: {voteCounter.chocolate}</p>
        <p>Strawberry Votes: {voteCounter.strawberry}</p>
      </div>
    </>
  );
}

function MintToken() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleMint = async () => {
    try {
      const response = await fetch("http://localhost:3000/mint-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Tokens minted successfully. Transaction hash: ${data.txHash}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("An error occurred while minting tokens.");
    }
  };

  return (
    <div className="mint-token-container mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Mint Tokens</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        className="input input-bordered w-full mb-3"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="input input-bordered w-full mb-3"
      />
      <button onClick={handleMint} className="btn btn-primary w-full">
        Mint Tokens
      </button>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}
export default Home;
