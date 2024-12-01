import { abi as MyTokenAbi } from "../app/assets/MyToken.json";
import { Abi } from "viem";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  11155111: {
    MyToken: {
      address: "0x2282A77eC5577365333fc71adE0b4154e25Bb2fa", // Add the address of the deployed contract
      abi: MyTokenAbi as Abi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
