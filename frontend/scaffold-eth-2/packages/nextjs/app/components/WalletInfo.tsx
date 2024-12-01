import ApiData from "./ApiData";
import TokenInfo from "./TokenInfo";
// import WalletAction from "./WalletAction";
import WalletBalance from "./WalletBalance";
import { Address } from "viem";
import { useAccount } from "wagmi";

function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletBalance address={address as Address} />
        <TokenInfo address={address as `0x${string}`} />
        <ApiData address={address as `0x${string}`} />
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

export default WalletInfo;
