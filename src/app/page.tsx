"use client";

import React, { useState } from "react";
import { HyprProvider, useHyprStore } from "@/hooks/useHyprStore";
import { CosmosBg } from "@/components/CosmosBg";
import { HyprPalette } from "@/components/HyprPalette";

import { ClockWidget } from "@/components/widgets/ClockWidget";
import { BookmarksWidget } from "@/components/widgets/BookmarksWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { TodoWidget } from "@/components/widgets/TodoWidget";
import { SnippetWidget } from "@/components/widgets/SnippetWidget";
import { CryptoWidget } from "@/components/widgets/CryptoWidget";

import { Search, Settings } from "lucide-react";

const Dashboard: React.FC = () => {
  const { state, setTheme } = useHyprStore();
  const { theme } = state;
  const [searchVal, setSearchVal] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    window.open(
      `https://google.com/search?q=${encodeURIComponent(searchVal.trim())}`,
      "_blank"
    );
    setSearchVal("");
  };

  const themes = [
    { id: "tokyo-night", label: "Tokyo Night" },
    { id: "nord", label: "Nord" },
    { id: "cyber-cyan", label: "Mint" },
    { id: "gruvbox", label: "Gruvbox" },
  ];

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center select-none">
      <CosmosBg />
      <HyprPalette />

      {/* ─── Center content ─── */}
      <div className="z-10 flex flex-col items-center gap-8 px-4">
        {/* Clock + Greeting */}
        <ClockWidget />

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-md"
        >
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search the web..."
            className="w-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white/[0.1] focus:border-white/[0.15] transition-all duration-200 placeholder:text-foreground/25"
          />
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
          />
        </form>

        {/* Bookmarks row */}
        <BookmarksWidget />
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4">
        <div className="flex items-end justify-between max-w-5xl mx-auto">
          {/* Left: Weather + Todo */}
          <div className="flex items-center gap-6">
            <WeatherWidget />
            <div className="relative">
              <TodoWidget />
            </div>
            <div className="relative">
              <SnippetWidget />
            </div>
          </div>

          {/* Right: Crypto + Settings */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <CryptoWidget />
            </div>

            {/* Settings gear */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer"
              >
                <Settings size={16} />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-card-bg/90 backdrop-blur-xl border border-card-border rounded-xl p-3 shadow-2xl w-44">
                  <p className="text-[11px] text-foreground/40 mb-2">Theme</p>
                  <div className="flex flex-col gap-1">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setShowSettings(false);
                        }}
                        className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          theme === t.id
                            ? "bg-white/10 text-foreground/80"
                            : "text-foreground/40 hover:text-foreground/70 hover:bg-white/5"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-foreground/25 mt-3">
                    Ctrl+K for command palette
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <HyprProvider>
      <Dashboard />
    </HyprProvider>
  );
}
