import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  console.log("Contract Address:", contractAddress);

  const VoteAllowanceToken = await ethers.getContractAt("VoteAllowanceToken", contractAddress);
  console.log("Contract Instance:", VoteAllowanceToken);

  try {
    const name = await VoteAllowanceToken.name();
    console.log("Token Name:", name);
  } catch (error) {
    console.error("Error fetching token name:", error);
  }
}

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exitCode = 1;
});