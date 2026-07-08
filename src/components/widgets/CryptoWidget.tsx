"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export const CryptoWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coins, setCoins] = useState<CoinData[]>([
    { symbol: "BTC", name: "Bitcoin", price: 58430, change: 1.25 },
    { symbol: "ETH", name: "Ethereum", price: 3120, change: -0.85 },
    { symbol: "SOL", name: "Solana", price: 142.5, change: 3.12 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) =>
        prev.map((coin) => {
          const delta = coin.price * ((Math.random() * 0.4 - 0.2) / 100);
          const newPrice = Math.round((coin.price + delta) * 100) / 100;
          const newChange = Math.round((coin.change + (Math.random() * 0.1 - 0.05)) * 100) / 100;
          return { ...coin, price: newPrice, change: newChange };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="select-none">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer"
      >
        <BarChart3 size={14} />
        <span>Crypto</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 w-56 bg-card-bg/90 backdrop-blur-xl border border-card-border rounded-xl p-3 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {coins.map((coin) => (
                <div
                  key={coin.symbol}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground/70">{coin.symbol}</span>
                    <span className="text-[10px] text-foreground/30">{coin.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-foreground/70">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span
                      className={`text-[10px] flex items-center gap-0.5 ${
                        coin.change >= 0 ? "text-green-400/70" : "text-red-400/70"
                      }`}
                    >
                      {coin.change >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
