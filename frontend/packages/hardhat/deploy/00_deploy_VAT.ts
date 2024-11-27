import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const voteToken = await deploy("VoteAllowanceToken", {
    from: deployer,
    log: true,
  });

  console.log("VoteToken deployed to:", voteToken.address);
};

export default func;
func.tags = ["VoteAllowanceToken"];
