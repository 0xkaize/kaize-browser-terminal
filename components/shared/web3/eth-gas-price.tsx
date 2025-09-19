"use client";

import React from "react";
import { client } from "./client/client";
import { formatEther } from "viem";

interface GasProps {
  show: boolean;
}

export const EthGasPrice = ({ show }: GasProps) => {
  const [gasPrice, setGasPrice] = React.useState<string>("");

  React.useEffect(() => {
    if (!show) return;

    const fetchGas = async () => {
      const gas = await client.getGasPrice();
      setGasPrice(formatEther(gas));
    };

    fetchGas();
  }, [show]);

  if (!show) return null;

  return <p>Ethereum gas price: {gasPrice} ETH</p>;
};
