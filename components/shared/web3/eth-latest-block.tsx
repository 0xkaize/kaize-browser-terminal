"use client";

import React from "react";
import { client } from "./client/client";

interface LatestBlockProps {
  show: boolean;
}

export const LatestBlock = ({ show }: LatestBlockProps) => {
  const [block, setBlock] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!show) return;

    const fetchBlock = async () => {
      try {
        const latest = await client.getBlockNumber();
        setBlock(Number(latest));
      } catch (err) {
        console.error("Error fetching latest block:", err);
        setBlock(null);
      }
    };

    fetchBlock();
  }, [show]);

  if (!show) return null;

  return <p>Latest Ethereum block: {block}</p>;
};
