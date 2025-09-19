"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Cursor } from "./Cursor";
import { EthGasPrice } from "./web3/eth-gas-price";
import { EthBalance } from "./web3/eth-balance";
import { LatestBlock } from "./web3/eth-latest-block";

interface TerminalLine {
  type: "command" | "output" | "prompt";
  content: React.ReactNode;
}

const fortunes = [
  {
    text: "If you dont like your destiny, dont accept it.",
    img: "/images/naruto.png",
  },
  {
    text: "A dropout will beat a genius through hard work.",
    img: "/images/rocklee.png",
  },
  {
    text: "If you really want to be strong… Stop caring about what others think!",
    img: "/images/saitama.png",
  },
  {
    text: "Power comes in response to a need, not a desire.",
    img: "/images/goku.png",
  },
  {
    text: "How can you move forward if you keep regretting the past?",
    img: "/images/edward.png",
  },
];

const commands: Record<string, any> = {
  help: `Available commands: help, date, fortune, about, flip, ethgas, ethbalance [address], ethlatestblock, exit, clear`,
  date: () => new Date().toLocaleString(),
  fortune: () => {
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    return (
      <div className="flex items-center gap-2">
        <span>{random.text}</span>
        <Image src={random.img} alt="author" width={32} height={32} />
      </div>
    );
  },
  about: () => "Just a terminal website",
  "rm -rf /": () => "Nice try! This is a web terminal, not your actual system",
  ethgas: () => <EthGasPrice show={true} key={Date.now()} />,
  ethlatestblock: () => <LatestBlock show={true} key={Date.now()} />,
  ethbalance: (args: string[]) => {
    if (!args[0]) return "Usage: ethbalance [address]";
    return (
      <EthBalance
        address={args[0] as `0x${string}`}
        show={true}
        key={Date.now()}
      />
    );
  },
  flip: () => {
    const coins = [
      {
        name: "$Bonk",
        address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      },
      { name: "$WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
      {
        name: "$POPCAT",
        address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      },
    ];
    const random = coins[Math.floor(Math.random() * coins.length)];
    return (
      <div>
        <span>{random.name}</span>
        <br />
        <code>{random.address}</code>
      </div>
    );
  },
  exit: () => "There is no escape from the terminal...",
};

export const Terminal = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "prompt", content: "Ξ ~ → input 'help' command" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (cmdInput: string) => {
    const trimmed = cmdInput.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory: TerminalLine[] = [
      ...history,
      { type: "command", content: `Ξ ~ → ${trimmed}` },
    ];

    if (cmd === "clear") {
      setHistory([{ type: "prompt", content: "Ξ ~ → input 'help' command" }]);
      return;
    }

    if (commands[cmd]) {
      const result =
        typeof commands[cmd] === "function"
          ? commands[cmd](args)
          : commands[cmd];
      newHistory.push({ type: "output", content: result });
    } else if (cmd === "exit") {
      newHistory.push({ type: "output", content: commands.exit() });
    } else {
      newHistory.push({ type: "output", content: `Command not found: ${cmd}` });
    }

    newHistory.push({ type: "prompt", content: "Ξ ~ → " });
    setHistory(newHistory);
  };

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto bg-black border border-green-500/40 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.3)] overflow-hidden">
      <div className="bg-black px-4 py-3 flex items-center gap-2 border-b border-green-500/40">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#00FF41]"></div>
          <div className="w-3 h-3 bg-green-700 rounded-full shadow-[0_0_10px_#00FF41]"></div>
          <div className="w-3 h-3 bg-green-300 rounded-full shadow-[0_0_10px_#00FF41]"></div>
        </div>
        <div className="text-green-400 text-[10px] font-mono">
          kaize-matrix-terminal
        </div>
      </div>

      <div
        ref={terminalRef}
        className="bg-black text-sm font-mono p-4 h-96 overflow-y-auto cursor-text text-green-400"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, idx) => (
          <div key={idx} className="mb-1">
            {line.type === "command" && (
              <div className="text-green-500">{line.content}</div>
            )}
            {line.type === "output" && (
              <div className="text-green-300 whitespace-pre-line">
                {line.content}
              </div>
            )}
            {line.type === "prompt" && idx === history.length - 1 && (
              <div className="flex items-center gap-1">
                <span className="text-green-500">{line.content}</span>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-0 flex items-center">
                    <span className="text-green-400">{currentInput}</span>
                    <Cursor />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (handleCommand(currentInput), setCurrentInput(""))
                    }
                    className="bg-transparent border-none outline-none text-transparent caret-transparent flex-1"
                    autoFocus
                  />
                </div>
              </div>
            )}
            {line.type === "prompt" && idx !== history.length - 1 && (
              <div className="text-green-500">{line.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
