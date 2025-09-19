"use client";

import React, { useEffect, useState } from "react";
import { client } from "./client/client";
import { formatEther } from "viem";

interface EthBalanceProps {
  address: `0x${string}`;
  show: boolean;
}

export const EthBalance = ({ address, show }: EthBalanceProps) => {
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    if (!show) return;

    const fetchBalance = async () => {
      try {
        const bal = await client.getBalance({ address });
        setBalance(formatEther(bal));
      } catch (err) {
        console.error(err);
        setBalance("Error fetching balance");
      }
    };

    fetchBalance();
  }, [address, show]);

  if (!show) return null;

  return (
    <p className="text-green-300">
      ETH Balance for {address}: {balance} ETH
    </p>
  );
};
