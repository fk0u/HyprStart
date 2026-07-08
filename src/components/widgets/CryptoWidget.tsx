"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, BarChart2 } from "lucide-react";

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  history: number[];
  change: number;
}

export const CryptoWidget: React.FC = () => {
  const [activeSymbol, setActiveSymbol] = useState("BTC");
  const [coins, setCoins] = useState<Record<string, CoinData>>({
    BTC: { symbol: "BTC", name: "Bitcoin", price: 58430, history: [58200, 58150, 58300, 58240, 58410, 58350, 58430], change: 1.25 },
    ETH: { symbol: "ETH", name: "Ethereum", price: 3120, history: [3150, 3140, 3110, 3125, 3105, 3115, 3120], change: -0.85 },
    SOL: { symbol: "SOL", name: "Solana", price: 142.5, history: [138.2, 139.5, 141.0, 140.2, 142.0, 141.8, 142.5], change: 3.12 },
  });

  // Simulating real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((symbol) => {
          const coin = next[symbol];
          const currentPrice = coin.price;
          // Fluctuates +/- 0.2%
          const changePercent = (Math.random() * 0.4 - 0.2) / 100;
          const delta = currentPrice * changePercent;
          const newPrice = Math.round((currentPrice + delta) * 100) / 100;

          // Update historical logs, keep max 12
          const newHistory = [...coin.history.slice(1), newPrice];
          
          // Calculate overall change compared to initial history value
          const basePrice = coin.history[0];
          const change = Math.round(((newPrice - basePrice) / basePrice) * 10000) / 100;

          next[symbol] = {
            ...coin,
            price: newPrice,
            history: newHistory,
            change,
          };
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activeCoin = coins[activeSymbol];

  // Helper to generate SVG path string from history values
  const getSvgPath = (history: number[]) => {
    if (history.length === 0) return "";
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min === 0 ? 1 : max - min;
    
    const width = 280;
    const height = 65;
    const padding = 5;

    const points = history.map((val, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="flex flex-col h-full justify-between font-mono text-xs select-none">
      {/* Coin Selector Tabs */}
      <div className="flex justify-between items-center border-b border-card-border/30 pb-1.5 mb-1 text-[10px] text-text-muted">
        <span className="flex items-center gap-1.5 uppercase font-bold text-accent/90">
          <BarChart2 size={10} />
          TELEMETRY::CRYPTO_FEED
        </span>
        <div className="flex gap-1.5 bg-black/40 p-0.5 rounded border border-card-border/20">
          {Object.keys(coins).map((symbol) => (
            <button
              key={symbol}
              onClick={() => setActiveSymbol(symbol)}
              className={`px-1.5 py-0.5 rounded-[2px] transition-all text-[8px] font-bold cursor-pointer ${
                activeSymbol === symbol
                  ? "bg-accent text-black font-extrabold shadow-[0_0_6px_var(--accent)]"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Price Telemetry */}
      <div className="flex justify-between items-end py-1">
        <div className="flex flex-col">
          <span className="text-[8px] text-text-muted uppercase tracking-wider">{activeCoin.name}</span>
          <span className="text-xl font-bold tracking-tight text-foreground select-text">
            ${activeCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        {/* Trend Indicator */}
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold ${
          activeCoin.change >= 0 
            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" 
            : "bg-rose-950/40 text-rose-400 border-rose-500/20"
        }`}>
          {activeCoin.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{activeCoin.change >= 0 ? "+" : ""}{activeCoin.change.toFixed(2)}%</span>
        </div>
      </div>

      {/* Interactive Sparkline SVG Graph */}
      <div className="relative h-18 bg-black/45 border border-card-border/10 rounded flex items-center justify-center p-1 overflow-hidden">
        {/* SVG Sparkline drawing */}
        <svg className="w-full h-full" viewBox="0 0 280 65">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path
            d={`${getSvgPath(activeCoin.history)} L 275,60 L 5,60 Z`}
            fill="url(#chartGradient)"
            className="transition-all duration-300"
          />

          {/* Line Path */}
          <path
            d={getSvgPath(activeCoin.history)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{
              filter: "drop-shadow(0px 0px 4px var(--accent-glow))"
            }}
          />

          {/* Drifting grid-helper line decorators */}
          <line x1="0" y1="15" x2="280" y2="15" stroke="var(--card-border)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
          <line x1="0" y1="35" x2="280" y2="35" stroke="var(--card-border)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
          <line x1="0" y1="55" x2="280" y2="55" stroke="var(--card-border)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
        </svg>

        {/* Pulse grid points */}
        <div className="absolute right-2 top-2 flex items-center gap-1.5 text-[8px] text-text-muted opacity-60">
          <RefreshCw size={8} className="animate-spin text-accent" />
          <span>LIVE_FEED</span>
        </div>
      </div>
    </div>
  );
};
