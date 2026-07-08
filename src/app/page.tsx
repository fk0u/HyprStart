/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { HyprProvider, useHyprStore } from "@/hooks/useHyprStore";
import { CosmosBg, BG_GALLERY } from "@/components/CosmosBg";
import { HyprPalette } from "@/components/HyprPalette";
import { SearchBar } from "@/components/SearchBar";

import { ClockWidget } from "@/components/widgets/ClockWidget";
import { BookmarksWidget } from "@/components/widgets/BookmarksWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { TodoWidget } from "@/components/widgets/TodoWidget";
import { SnippetWidget } from "@/components/widgets/SnippetWidget";
import { CryptoWidget } from "@/components/widgets/CryptoWidget";

import { Settings, X, Image as ImageIcon, Palette, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const {
    state, setTheme, toggleCosmosParticles,
    setBackgroundIndex, setBackgroundUrl,
  } = useHyprStore();
  const { theme, showCosmosParticles, backgroundIndex, backgroundUrl } = state;
  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [customBgInput, setCustomBgInput] = useState(backgroundUrl);
  const [settingsTab, setSettingsTab] = useState<"theme" | "wallpaper">("theme");

  // Escape key exits focus mode or settings
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (focusMode) setFocusMode(false);
        if (showSettings) setShowSettings(false);
      }
      if (e.key === "f" && e.altKey) {
        e.preventDefault();
        setFocusMode((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusMode, showSettings]);



  const themes = [
    { id: "tokyo-night", label: "Tokyo Night", color: "#7aa2f7" },
    { id: "nord", label: "Nord", color: "#88c0d0" },
    { id: "cyber-cyan", label: "Mint", color: "#06d6a0" },
    { id: "gruvbox", label: "Gruvbox", color: "#fabd2f" },
  ];

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center select-none overflow-hidden">
      <CosmosBg />
      <HyprPalette />

      {/* ─── Center content ─── */}
      <AnimatePresence mode="wait">
        {!focusMode ? (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="z-10 flex flex-col items-center gap-6 px-4"
          >
            <ClockWidget />

            {/* Search bar with Google Suggest type-ahead */}
            <SearchBar />

            {/* Bookmarks row */}
            <BookmarksWidget />
          </motion.div>
        ) : (
          <motion.div
            key="focus"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="z-10 flex flex-col items-center"
          >
            <ClockWidget />
            <p className="text-[11px] text-foreground/15 mt-8">Press Esc or Alt+F to exit focus mode</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom bar ─── */}
      <AnimatePresence>
        {!focusMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4"
          >
            <div className="flex items-end justify-between max-w-5xl mx-auto">
              {/* Left side */}
              <div className="flex items-center gap-6">
                <WeatherWidget />
                <div className="relative">
                  <TodoWidget />
                </div>
                <div className="relative">
                  <SnippetWidget />
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CryptoWidget />
                </div>

                {/* Focus mode toggle */}
                <button
                  onClick={() => setFocusMode(true)}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors cursor-pointer"
                  title="Focus mode (Alt+F)"
                >
                  <Eye size={15} />
                </button>

                {/* Settings */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors cursor-pointer"
                >
                  <Settings size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Settings panel overlay ─── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-medium">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-foreground/30 hover:text-foreground/60 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1">
                <button
                  onClick={() => setSettingsTab("theme")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settingsTab === "theme"
                      ? "bg-white/10 text-foreground/80"
                      : "text-foreground/35 hover:text-foreground/60"
                  }`}
                >
                  <Palette size={13} /> Themes
                </button>
                <button
                  onClick={() => setSettingsTab("wallpaper")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settingsTab === "wallpaper"
                      ? "bg-white/10 text-foreground/80"
                      : "text-foreground/35 hover:text-foreground/60"
                  }`}
                >
                  <ImageIcon size={13} /> Wallpaper
                </button>
              </div>

              {/* Theme tab */}
              {settingsTab === "theme" && (
                <div className="space-y-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        theme === t.id
                          ? "bg-white/10 border border-white/10"
                          : "hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-sm">{t.label}</span>
                      {theme === t.id && (
                        <span className="text-[10px] text-foreground/30 ml-auto">Active</span>
                      )}
                    </button>
                  ))}

                  {/* Background toggle */}
                  <div className="pt-3 border-t border-white/5">
                    <button
                      onClick={toggleCosmosParticles}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        {showCosmosParticles ? <Eye size={14} /> : <EyeOff size={14} />}
                        Background photo
                      </div>
                      <span className="text-[11px] text-foreground/30">
                        {showCosmosParticles ? "On" : "Off"}
                      </span>
                    </button>
                  </div>

                  {/* Keyboard hint */}
                  <p className="text-[10px] text-foreground/20 text-center pt-2">
                    Ctrl+K → command palette &nbsp;·&nbsp; Alt+F → focus mode
                  </p>
                </div>
              )}

              {/* Wallpaper tab */}
              {settingsTab === "wallpaper" && (
                <div className="space-y-4">
                  {/* Gallery grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {BG_GALLERY.map((bg, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setBackgroundIndex(i);
                          setBackgroundUrl("");
                          setCustomBgInput("");
                        }}
                        className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group transition-all ${
                          !backgroundUrl && backgroundIndex === i
                            ? "ring-2 ring-accent ring-offset-1 ring-offset-background"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        title={bg.label}
                      >
                        <img
                          src={bg.url}
                          alt={bg.label}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Custom URL */}
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[11px] text-foreground/30 mb-2">Or paste a custom image URL</p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customBgInput.trim()) {
                          setBackgroundUrl(customBgInput.trim());
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={customBgInput}
                        onChange={(e) => setCustomBgInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-white/20"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                    {backgroundUrl && (
                      <button
                        onClick={() => {
                          setBackgroundUrl("");
                          setCustomBgInput("");
                        }}
                        className="text-[11px] text-foreground/30 mt-2 hover:text-foreground/50 cursor-pointer transition-colors"
                      >
                        ← Reset to gallery
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
