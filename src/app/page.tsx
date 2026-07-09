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
import { AmbientSound } from "@/components/widgets/AmbientSound";
import { DiscoverWidget } from "@/components/widgets/DiscoverWidget";
import { SystemTelemetry } from "@/components/widgets/SystemTelemetry";
import { CinematicIntro } from "@/components/CinematicIntro";

import { Settings, X, Image as ImageIcon, Palette, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const {
    state, setTheme, toggleCosmosParticles,
    setBackgroundIndex, setBackgroundUrl, setInterests, resetConfig,
  } = useHyprStore();
  const { theme, showCosmosParticles, backgroundIndex, backgroundUrl, interests } = state;
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [customBgInput, setCustomBgInput] = useState(backgroundUrl);
  const [settingsTab, setSettingsTab] = useState<"theme" | "wallpaper">("theme");
  const [showStartupInstructions, setShowStartupInstructions] = useState(false);
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowIntro(false);
  };

  const interestOptions = [
    { id: "kpop", label: "🎵 K-Pop" },
    { id: "anime", label: "🌸 Anime" },
    { id: "japanese", label: "🎌 Japanese" },
    { id: "tech", label: "💻 Tech" },
    { id: "indopop", label: "🇮🇩 Indo Pop" },
    { id: "hipdut", label: "🔥 Hipdut" },
    { id: "globalpop", label: "🌍 Global Pop" },
    { id: "fashion", label: "🧥 Fashion" },
    { id: "nature", label: "🌲 Nature" },
  ];

  const handleToggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((x) => x !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  interface SystemNotification {
    id: string;
    message: string;
    type: "info" | "success" | "warn";
  }

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const addNotification = (message: string, type: "info" | "success" | "warn" = "info") => {
    const id = Math.random().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Simulated notifications triggers
  useEffect(() => {
    // Welcome notification
    const t1 = setTimeout(() => {
      addNotification("HyprStart OS initialized successfully.", "success");
    }, 1200);

    const t2 = setTimeout(() => {
      addNotification("Welcome back! Press '?' for the hotkeys cheatsheet.", "info");
    }, 2800);

    // Periodic Reminders (Hydration, focus)
    const interval = setInterval(() => {
      const reminders = [
        "Focus reminder: Sit straight and stretch your back!",
        "Health tip: Drink a glass of water to stay hydrated.",
        "System telemetry: Ambient soundscapes procedurally active.",
        "Ricing tip: Customize your background image in Settings → Wallpaper & Feed.",
      ];
      const randomMsg = reminders[Math.floor(Math.random() * reminders.length)];
      addNotification(randomMsg, "info");
    }, 120000); // 2 minutes

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.getAttribute("contenteditable") === "true"
      );

      if (e.key === "?" && !isTyping) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      }
      if (e.key === "g" && !isTyping) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search the web..."]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === "Escape") {
        if (focusMode) setFocusMode(false);
        if (showSettings) setShowSettings(false);
        if (showHelp) setShowHelp(false);
      }
      if (e.key === "f" && e.altKey) {
        e.preventDefault();
        setFocusMode((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusMode, showSettings, showHelp]);



  const themes = [
    { id: "tokyo-night", label: "Tokyo Night", color: "#7aa2f7" },
    { id: "nord", label: "Nord", color: "#88c0d0" },
    { id: "cyber-cyan", label: "Mint", color: "#06d6a0" },
    { id: "gruvbox", label: "Gruvbox", color: "#fabd2f" },
  ];

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center select-none overflow-hidden">
      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {introComplete && (
        <>
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

      {/* ─── Top bar ─── */}
      <AnimatePresence>
        {!focusMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-20 px-6 py-3 bg-white/[0.01] border-b border-white/[0.03] backdrop-blur-[2px]"
          >
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {/* Left side: Brand + Weather + Telemetry */}
              <div className="flex items-center gap-5">
                <span className="text-[11px] font-semibold tracking-wider text-foreground/50 uppercase select-none font-mono">
                  🌀 HyprStart
                </span>
                <span className="h-3 w-[1px] bg-white/10" />
                <WeatherWidget />
                <span className="h-3 w-[1px] bg-white/10" />
                <SystemTelemetry />
              </div>

              {/* Right side: Crypto + Controls */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CryptoWidget />
                </div>
                <span className="h-3 w-[1px] bg-white/10" />

                {/* Focus mode toggle */}
                <button
                  onClick={() => setFocusMode(true)}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors cursor-pointer"
                  title="Focus mode (Alt+F)"
                >
                  <Eye size={14} />
                </button>

                {/* Settings */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-foreground/25 hover:text-foreground/50 transition-colors cursor-pointer"
                  title="Settings"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
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
            <div className="flex items-center justify-center max-w-5xl mx-auto gap-4">
              <div className="relative">
                <TodoWidget />
              </div>
              <div className="relative">
                <SnippetWidget />
              </div>
              <div className="relative">
                <AmbientSound />
              </div>
              <div className="relative">
                <DiscoverWidget />
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
              className="bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-5 shrink-0">
                <h2 className="text-lg font-medium">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-foreground/30 hover:text-foreground/60 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setSettingsTab("theme")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settingsTab === "theme"
                      ? "bg-white/10 text-foreground/80"
                      : "text-foreground/35 hover:text-foreground/60"
                  }`}
                >
                  <Palette size={13} /> Themes
                </button>
                <button
                  onClick={() => setSettingsTab("wallpaper")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    settingsTab === "wallpaper"
                      ? "bg-white/10 text-foreground/80"
                      : "text-foreground/35 hover:text-foreground/60"
                  }`}
                >
                  <ImageIcon size={13} /> Wallpaper & Feed
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                {/* Theme tab */}
                {settingsTab === "theme" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[11px] text-foreground/30">Theme Preset</p>
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
                    </div>

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
                      Ctrl+K → command palette &nbsp;·&nbsp; Alt+F → focus mode &nbsp;·&nbsp; ? → hotkeys guide
                    </p>
                  </div>
                )}

                {/* Wallpaper & Interests tab */}
                {settingsTab === "wallpaper" && (
                  <div className="space-y-5">
                    {/* Gallery grid */}
                    <div>
                      <p className="text-[11px] text-foreground/30 mb-2">Select Wallpaper</p>
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
                    </div>

                    {/* Custom URL */}
                    <div className="pt-3 border-t border-white/5">
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

                    {/* Feed Interests */}
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-[11px] text-foreground/30 mb-2.5">Discover Feed Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((opt) => {
                          const active = interests.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleToggleInterest(opt.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                                active
                                  ? "bg-white/10 border-white/10 text-foreground"
                                  : "bg-transparent border-white/5 text-foreground/35 hover:text-foreground/50 hover:border-white/10"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset configuration footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setShowStartupInstructions(true)}
                  className="px-2.5 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl text-[11px] text-foreground/80 transition-all cursor-pointer font-medium"
                >
                  🚀 Set as Startup Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Restore factory settings and clear all configurations? This cannot be undone.")) {
                      resetConfig();
                      setShowSettings(false);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-red-950/20 border border-red-500/15 rounded-xl text-[11px] text-red-400 hover:bg-red-950/40 hover:border-red-500/30 transition-all cursor-pointer font-medium"
                >
                  Reset Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Keyboard shortcuts guide overlay ─── */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground/75">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-foreground/30 hover:text-foreground/60 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Shortcut rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-foreground/50">Focus Search Input</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 font-bold border border-white/10">g</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-foreground/50">Toggle Focus Mode</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 font-bold border border-white/10">Alt + F</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-foreground/50">Command Palette</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 font-bold border border-white/10">Ctrl + K / Alt + D</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-foreground/50">Exit Panel / Focus Mode</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 font-bold border border-white/10">Esc</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/50">Toggle this Guide</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/80 font-bold border border-white/10">?</kbd>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Set as Startup Page Instructions Overlay ─── */}
      <AnimatePresence>
        {showStartupInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowStartupInstructions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowStartupInstructions(false)}
                className="absolute top-4 right-4 text-foreground/30 hover:text-foreground/65 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground/80 mb-4">
                🚀 Set as Startup Page
              </h2>

              <p className="text-xs text-foreground/50 leading-relaxed mb-4">
                Untuk alasan keamanan, browser modern melarang website mengubah halaman startup Anda secara otomatis. Anda dapat mengaturnya secara manual dengan 3 langkah mudah:
              </p>

              <div className="space-y-3.5 text-xs text-foreground/75 font-mono mb-5">
                <div className="flex gap-2">
                  <span className="text-sky-400 font-bold">1.</span>
                  <span>Buka menu pengaturan startup browser Anda di <span className="text-foreground/90 font-semibold bg-white/5 px-1 py-0.5 rounded">chrome://settings/onStartup</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sky-400 font-bold">2.</span>
                  <span>Pilih opsi <strong>&ldquo;Open a specific page or set of pages&rdquo;</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sky-400 font-bold">3.</span>
                  <span>Klik <strong>&ldquo;Add a new page&rdquo;</strong> dan masukkan tautan halaman di bawah ini:</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded-xl mb-6">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.origin : "http://localhost:8174"}
                  className="flex-1 bg-transparent text-[10px] font-mono text-foreground/60 outline-none select-all px-1"
                />
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(window.location.origin);
                      addNotification("Link copied to clipboard!", "success");
                    }
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-[10px] rounded-lg text-foreground font-semibold cursor-pointer transition-colors"
                >
                  Copy
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowStartupInstructions(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs text-foreground font-medium cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toast Notifications ─── */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl pointer-events-auto flex items-start gap-3 w-72 ${
                n.type === "success"
                  ? "bg-green-950/20 border-green-500/15 text-green-400"
                  : n.type === "warn"
                  ? "bg-yellow-950/20 border-yellow-500/15 text-yellow-400"
                  : "bg-white/[0.04] border-white/5 text-foreground/80"
              }`}
            >
              <div className="flex-1 text-xs leading-relaxed font-medium">
                {n.message}
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
                className="text-foreground/30 hover:text-foreground/60 cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </>
      )}
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
