"use client";

import React, { useState, useEffect, useRef } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Terminal, Search, HelpCircle, Layout, Palette, FileInput, FileOutput, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CommandSuggestion {
  id: string;
  name: string;
  desc: string;
  example: string;
  icon: React.ReactNode;
  action: (args?: string) => void;
}

export const HyprPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setTheme,
    toggleWidget,
    addBookmark,
    addTodo,
    exportConfig,
    importConfig,
    resetConfig,
    toggleCosmosParticles
  } = useHyprStore();

  // Suggestion Definitions
  const suggestions: CommandSuggestion[] = [
    {
      id: "theme-tokyo",
      name: ":theme tokyo-night",
      desc: "Switch accent and background colors to Tokyo Night style",
      example: ":theme tokyo-night",
      icon: <Palette size={14} className="text-cyan-400" />,
      action: () => { setTheme("tokyo-night"); showMessage("Theme set: Tokyo Night", "success"); }
    },
    {
      id: "theme-nord",
      name: ":theme nord",
      desc: "Switch colors to icy frost Nord architecture",
      example: ":theme nord",
      icon: <Palette size={14} className="text-blue-300" />,
      action: () => { setTheme("nord"); showMessage("Theme set: Nord", "success"); }
    },
    {
      id: "theme-cyber",
      name: ":theme cyber-cyan",
      desc: "Switch colors to neon Cyan high contrast terminal",
      example: ":theme cyber-cyan",
      icon: <Palette size={14} className="text-cyan-300" />,
      action: () => { setTheme("cyber-cyan"); showMessage("Theme set: Cyber-Cyan", "success"); }
    },
    {
      id: "theme-gruvbox",
      name: ":theme gruvbox",
      desc: "Switch colors to vintage gold Gruvbox terminal",
      example: ":theme gruvbox",
      icon: <Palette size={14} className="text-amber-400" />,
      action: () => { setTheme("gruvbox"); showMessage("Theme set: Gruvbox", "success"); }
    },
    {
      id: "toggle-clock",
      name: ":widget clock",
      desc: "Toggle digital millisecond clock widget visibility",
      example: ":widget clock",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("clock")
    },
    {
      id: "toggle-todo",
      name: ":widget todo",
      desc: "Toggle task manager checklist widget visibility",
      example: ":widget todo",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("todo")
    },
    {
      id: "toggle-bookmarks",
      name: ":widget bookmarks",
      desc: "Toggle Quick Links bookmark launcher widget",
      example: ":widget bookmarks",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("bookmarks")
    },
    {
      id: "toggle-snippets",
      name: ":widget snippets",
      desc: "Toggle Code Snippets board widget visibility",
      example: ":widget snippets",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("snippets")
    },
    {
      id: "toggle-crypto",
      name: ":widget crypto",
      desc: "Toggle real-time simulated crypto sparklines widget",
      example: ":widget crypto",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("crypto")
    },
    {
      id: "toggle-weather",
      name: ":widget weather",
      desc: "Toggle meteorological forecast weather widget",
      example: ":widget weather",
      icon: <Layout size={14} className="text-accent" />,
      action: () => toggleWidget("weather")
    },
    {
      id: "toggle-cosmos",
      name: ":widget cosmos",
      desc: "Toggle Canvas background stars and nebula parallax",
      example: ":widget cosmos",
      icon: <Layout size={14} className="text-accent" />,
      action: () => { toggleCosmosParticles(); showMessage("Toggled background engine", "info"); }
    },
    {
      id: "add-todo",
      name: ":add-todo [text]",
      desc: "Insert new target item into your checklist",
      example: ":add-todo Code next module",
      icon: <HelpCircle size={14} className="text-emerald-400" />,
      action: (args) => {
        if (!args) { showMessage("Syntax: :add-todo <task name>", "error"); return; }
        addTodo(args);
        showMessage(`Task added: "${args}"`, "success");
      }
    },
    {
      id: "add-bookmark",
      name: ":add-bookmark [title] [url]",
      desc: "Insert quick-link bookmark launcher shortcut",
      example: ":add-bookmark Google google.com",
      icon: <HelpCircle size={14} className="text-emerald-400" />,
      action: (args) => {
        if (!args) { showMessage("Syntax: :add-bookmark <title> <url>", "error"); return; }
        const parts = args.split(" ");
        if (parts.length < 2) { showMessage("Provide both Title and URL", "error"); return; }
        const title = parts[0];
        const url = parts.slice(1).join("");
        addBookmark(title, url);
        showMessage(`Bookmark "${title}" saved`, "success");
      }
    },
    {
      id: "import-dotfiles",
      name: ":import",
      desc: "Restore workspace layout using config.json file",
      example: ":import",
      icon: <FileInput size={14} className="text-orange-400" />,
      action: () => {
        const el = document.getElementById("hypr-import-file-input") as HTMLInputElement | null;
        el?.click();
      }
    },
    {
      id: "export-dotfiles",
      name: ":export",
      desc: "Download current workspace layout configuration",
      example: ":export",
      icon: <FileOutput size={14} className="text-sky-400" />,
      action: () => {
        exportConfig();
        showMessage("Configuration downloaded", "success");
      }
    },
    {
      id: "reset-system",
      name: ":reset",
      desc: "Clear local storage config and reload factory presets",
      example: ":reset",
      icon: <ShieldAlert size={14} className="text-rose-400 animate-pulse" />,
      action: () => {
        resetConfig();
        showMessage("Workspace restored to default", "info");
      }
    },
    {
      id: "search-google",
      name: "/g [query]",
      desc: "Initiate Google search in a new web workspace tab",
      example: "/g nextjs route handlers",
      icon: <Search size={14} className="text-teal-400" />,
      action: (args) => {
        if (!args) { showMessage("Enter search query", "error"); return; }
        window.open(`https://google.com/search?q=${encodeURIComponent(args)}`, "_blank");
      }
    },
    {
      id: "search-github",
      name: "/git [query]",
      desc: "Query repository codebases on GitHub search tab",
      example: "/git ant-design",
      icon: <Search size={14} className="text-slate-300" />,
      action: (args) => {
        if (!args) { showMessage("Enter repository search text", "error"); return; }
        window.open(`https://github.com/search?q=${encodeURIComponent(args)}`, "_blank");
      }
    }
  ];

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Filtered Suggestions based on input
  const filteredSuggestions = suggestions.filter((s) => {
    if (!inputVal) return true;
    const query = inputVal.toLowerCase().trim();
    if (query.startsWith(":")) {
      return s.name.startsWith(":") && s.name.toLowerCase().includes(query.split(" ")[0]);
    }
    if (query.startsWith("/")) {
      return s.name.startsWith("/") && s.name.toLowerCase().includes(query.split(" ")[0]);
    }
    return s.name.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query);
  });

  // Handle hotkeys (Ctrl + K, Alt + D, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.altKey && e.key.toLowerCase() === "d")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setInputVal("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommandRun = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Check if the current query maps to a selected suggestion
    if (filteredSuggestions.length > 0 && selectedIndex < filteredSuggestions.length) {
      const selected = filteredSuggestions[selectedIndex];
      
      // Extract arguments if query matches command name prefix
      let args = "";
      const cmdNamePrefix = selected.name.split(" ")[0]; // e.g., ":theme" or ":add-todo"
      if (trimmed.startsWith(cmdNamePrefix)) {
        args = trimmed.slice(cmdNamePrefix.length).trim();
      } else {
        // Fallback: if user typed something custom, treat the query as arguments
        args = trimmed;
      }
      
      selected.action(args);
      setInputVal("");
      setIsOpen(false);
      return;
    }

    // Default Fallback: If no matches, search Google
    window.open(`https://google.com/search?q=${encodeURIComponent(trimmed)}`, "_blank");
    setInputVal("");
    setIsOpen(false);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredSuggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredSuggestions.length) % Math.max(1, filteredSuggestions.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleCommandRun();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importConfig(content);
      if (success) {
        showMessage("Configuration imported successfully!", "success");
      } else {
        showMessage("Failed to parse config file.", "error");
      }
    };
    reader.readAsText(file);
    setIsOpen(false);
  };

  return (
    <>
      <input
        id="hypr-import-file-input"
        type="file"
        accept=".json"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Floating Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-sm border font-mono text-xs shadow-lg backdrop-blur-md ${
              message.type === "success"
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                : message.type === "error"
                ? "bg-rose-950/80 text-rose-400 border-rose-500/40"
                : "bg-slate-900/80 text-cyan-400 border-cyan-500/40"
            }`}
          >
            <span className="font-bold">SYSTEM:: </span>
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-auto">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />

            {/* Core Modal Shell */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-sm border border-card-border bg-black/90 shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)] overflow-hidden flex flex-col font-mono relative glow-bar-top"
            >
              {/* Shell Prompt Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-card-border/50 bg-slate-900/30">
                <Terminal size={16} className="text-accent animate-pulse" />
                <span className="text-accent font-bold text-xs select-none">hypr::&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDownInput}
                  placeholder="Type a command (:theme, :widget) or search query..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-xs placeholder:text-text-muted focus:ring-0"
                />
                <span className="text-[9px] text-text-muted select-none border border-card-border/50 px-1.5 py-0.5 rounded bg-black/20">
                  ESC
                </span>
              </div>

              {/* Suggestions Area */}
              <div className="max-h-[300px] overflow-y-auto divide-y divide-card-border/30 bg-black/30">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedIndex(idx);
                        // Trigger next tick to get correct selected index action
                        setTimeout(() => {
                          setInputVal(s.name.split(" ")[0] + " ");
                          inputRef.current?.focus();
                        }, 0);
                      }}
                      className={`flex items-start gap-3.5 px-4 py-2.5 cursor-pointer transition-all select-none ${
                        idx === selectedIndex
                          ? "bg-accent-dim border-l-2 border-accent text-foreground"
                          : "text-foreground/80 hover:bg-slate-900/20"
                      }`}
                    >
                      <div className="mt-0.5">{s.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${idx === selectedIndex ? "text-accent" : "text-foreground"}`}>
                            {s.name}
                          </span>
                          <span className="text-[9px] text-text-muted opacity-60">
                            {s.example}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-text-muted text-xs select-none flex flex-col items-center gap-2">
                    <Search size={20} className="opacity-40" />
                    <span>No matches found. Press Enter to search Google.</span>
                  </div>
                )}
              </div>

              {/* Palette Footer */}
              <div className="flex justify-between items-center px-4 py-2 border-t border-card-border/30 bg-slate-950/70 text-[9px] text-text-muted select-none">
                <div className="flex items-center gap-3">
                  <span><span className="text-foreground">↑↓</span> Move</span>
                  <span><span className="text-foreground">Enter</span> Run</span>
                </div>
                <span>Ctrl+K / Alt+D to toggle workspace shell</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
