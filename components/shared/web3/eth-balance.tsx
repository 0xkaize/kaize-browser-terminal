"use client";

import React from "react";
import { client } from "./client/client";
import { formatEther } from "viem";

interface EthBalanceProps {
  address: `0x${string}`;
  show: boolean;
}

export const EthBalance = ({ address, show }: EthBalanceProps) => {
  const [balance, setBalance] = React.useState<string>("");

  React.useEffect(() => {
    if (!show) return;

    const fetchBalance = async () => {
      try {
        const bal = await client.getBalance({ address });
        setBalance(formatEther(bal));
      } catch (_err) {
        setBalance("Error fetching balance");
      }
    };

    fetchBalance();
  }, [address, show]);

  if (!show) return null;

  return (
    <p>
      ETH Balance for {address}: {balance} ETH
    </p>
  );
};
