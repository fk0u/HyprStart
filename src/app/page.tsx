"use client";

import React from "react";
import { HyprProvider, useHyprStore } from "@/hooks/useHyprStore";
import { CosmosBg } from "@/components/CosmosBg";
import { WidgetContainer } from "@/components/WidgetContainer";
import { HyprPalette } from "@/components/HyprPalette";

// Import all modular widgets
import { ClockWidget } from "@/components/widgets/ClockWidget";
import { TodoWidget } from "@/components/widgets/TodoWidget";
import { BookmarksWidget } from "@/components/widgets/BookmarksWidget";
import { SnippetWidget } from "@/components/widgets/SnippetWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { CryptoWidget } from "@/components/widgets/CryptoWidget";

// Import technical icons
import { Terminal, Shield, Cpu } from "lucide-react";

const Dashboard: React.FC = () => {
  const { state, toggleWidget } = useHyprStore();
  const { widgets, theme } = state;

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case "clock":
        return <ClockWidget />;
      case "todo":
        return <TodoWidget />;
      case "bookmarks":
        return <BookmarksWidget />;
      case "snippets":
        return <SnippetWidget />;
      case "weather":
        return <WeatherWidget />;
      case "crypto":
        return <CryptoWidget />;
      default:
        return null;
    }
  };

  const getWidgetTitle = (id: string) => {
    switch (id) {
      case "clock":
        return "Digital Clock System";
      case "todo":
        return "Checklist Task Manager";
      case "bookmarks":
        return "Bookmarks Launcher Linker";
      case "snippets":
        return "Dev Snippet Repository";
      case "weather":
        return "Atmosphere Climate Telemetry";
      case "crypto":
        return "Simulated Asset Sparklines";
      default:
        return "Modular Node";
    }
  };

  return (
    <div className="relative flex flex-col w-screen h-screen overflow-hidden font-mono text-foreground select-none">
      {/* 1. Starry Canvas Background */}
      <CosmosBg />

      {/* 2. HyprPalette Command Overlay */}
      <HyprPalette />

      {/* 3. Cosmic Technical Background Glyph Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 className="text-[10vw] font-black tracking-[0.3em] text-accent opacity-[0.04] cyber-glitch-text font-mono select-none">
          HYPRSTART
        </h1>
      </div>

      {/* 4. Top Technical Status Bar (Waybar style) */}
      <header className="z-40 w-full bg-black/55 backdrop-blur-md border-b border-card-border/40 px-6 py-1.5 flex justify-between items-center text-[10px] tracking-wide text-text-muted select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-accent">
            <Terminal size={12} className="animate-pulse" />
            ⧉ HYPRSTART::ENV_SYS
          </span>
          <span className="opacity-40">|</span>
          
          {/* Active Toggles */}
          <div className="flex gap-2">
            {widgets.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`px-1.5 py-0.5 rounded-[2px] transition-all hover:bg-white/5 cursor-pointer ${
                  w.visible
                    ? "text-accent border border-accent/20 bg-accent-dim"
                    : "text-text-muted/50 border border-transparent line-through"
                }`}
              >
                {w.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* System telemetry indicators */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 select-all">
            <Shield size={10} className="text-accent" />
            THEME: <span className="text-foreground font-bold uppercase">{theme}</span>
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1">
            <Cpu size={10} className="text-accent" />
            RAM: 3.42GB / 16.00GB
          </span>
          <span className="opacity-40">|</span>
          <span className="text-accent-glow font-bold animate-pulse">
            PRESS [CTRL+K] FOR COMMAND PROMPT
          </span>
        </div>
      </header>

      {/* 5. Workstation Floating Widget Desktop Area */}
      <main className="flex-1 relative w-full h-full p-6 overflow-hidden z-10 pointer-events-none">
        {widgets.map(
          (w) =>
            w.visible && (
              <WidgetContainer
                key={w.id}
                id={w.id}
                title={getWidgetTitle(w.id)}
                x={w.x}
                y={w.y}
                w={w.w}
                h={w.h}
              >
                {renderWidgetContent(w.id)}
              </WidgetContainer>
            )
        )}
      </main>

      {/* 6. Technical HUD Grid-Border Overlay & Footer */}
      <footer className="z-40 w-full bg-black/45 backdrop-blur-sm border-t border-card-border/20 px-6 py-1 flex justify-between items-center text-[8px] text-text-muted/60 select-none">
        <span>CONFIG::INDEXED_DB::LOCAL_STORAGE_OK</span>
        <span>HYPRSTART v2.1.0 // NO_DATABASE_ACTIVE // POWERED_BY_NEXT</span>
      </footer>
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
