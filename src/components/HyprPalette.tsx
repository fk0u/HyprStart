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
    state,
    setTheme,
    toggleWidget,
    addBookmark,
    addTodo,
    exportConfig,
    importConfig,
    resetConfig,
    toggleCosmosParticles
  } = useHyprStore();

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };



  // Setter helper for widget state
  const setWidgetVisibility = (widgetId: string, visible: boolean, name: string) => {
    if (widgetId === "cosmos") {
      if (state.showCosmosParticles !== visible) {
        toggleCosmosParticles();
      }
      showMessage(`${name} background ${visible ? "enabled" : "disabled"}`, "info");
      return;
    }

    const widget = state.widgets.find((w) => w.id === widgetId);
    if (widget && widget.visible !== visible) {
      toggleWidget(widgetId);
      showMessage(`Widget "${name}" ${visible ? "revealed" : "hidden"}`, "success");
    } else {
      showMessage(`Widget "${name}" is already ${visible ? "visible" : "hidden"}`, "info");
    }
  };

  // Suggestion Definitions
  const suggestions: CommandSuggestion[] = [
    {
      id: "theme-tokyo",
      name: "/theme tokyonight",
      desc: "Switch accent colors to Tokyo Night style",
      example: "/theme tokyonight",
      icon: <Palette size={14} className="text-cyan-400" />,
      action: () => { setTheme("tokyo-night"); showMessage("Theme: Tokyo Night active", "success"); }
    },
    {
      id: "theme-nord",
      name: "/theme nord",
      desc: "Switch accent colors to icy arctic Nord architecture",
      example: "/theme nord",
      icon: <Palette size={14} className="text-blue-300" />,
      action: () => { setTheme("nord"); showMessage("Theme: Nord active", "success"); }
    },
    {
      id: "theme-cyber",
      name: "/theme cybercyan",
      desc: "Switch accent colors to neon Cyan high-contrast theme",
      example: "/theme cybercyan",
      icon: <Palette size={14} className="text-cyan-300" />,
      action: () => { setTheme("cyber-cyan"); showMessage("Theme: Cyber-Cyan active", "success"); }
    },
    {
      id: "theme-gruvbox",
      name: "/theme gruvbox",
      desc: "Switch accent colors to vintage gold Gruvbox theme",
      example: "/theme gruvbox",
      icon: <Palette size={14} className="text-amber-400" />,
      action: () => { setTheme("gruvbox"); showMessage("Theme: Gruvbox active", "success"); }
    },
    {
      id: "widget-add-clock",
      name: "/widget add clock",
      desc: "Reveal digital millisecond clock widget",
      example: "/widget add clock",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("clock", true, "Clock")
    },
    {
      id: "widget-remove-clock",
      name: "/widget remove clock",
      desc: "Hide digital millisecond clock widget",
      example: "/widget remove clock",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("clock", false, "Clock")
    },
    {
      id: "widget-add-todo",
      name: "/widget add todo",
      desc: "Reveal tasks checklist manager widget",
      example: "/widget add todo",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("todo", true, "Checklist")
    },
    {
      id: "widget-remove-todo",
      name: "/widget remove todo",
      desc: "Hide tasks checklist manager widget",
      example: "/widget remove todo",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("todo", false, "Checklist")
    },
    {
      id: "widget-add-bookmarks",
      name: "/widget add bookmarks",
      desc: "Reveal Quick Links bookmarks tile launcher",
      example: "/widget add bookmarks",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("bookmarks", true, "Bookmarks")
    },
    {
      id: "widget-remove-bookmarks",
      name: "/widget remove bookmarks",
      desc: "Hide Quick Links bookmarks tile launcher",
      example: "/widget remove bookmarks",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("bookmarks", false, "Bookmarks")
    },
    {
      id: "widget-add-snippets",
      name: "/widget add snippets",
      desc: "Reveal developer code snippets storage notes",
      example: "/widget add snippets",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("snippets", true, "Snippets")
    },
    {
      id: "widget-remove-snippets",
      name: "/widget remove snippets",
      desc: "Hide developer code snippets storage notes",
      example: "/widget remove snippets",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("snippets", false, "Snippets")
    },
    {
      id: "widget-add-crypto",
      name: "/widget add crypto",
      desc: "Reveal live simulated crypto sparkline chart",
      example: "/widget add crypto",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("crypto", true, "Crypto Sparklines")
    },
    {
      id: "widget-remove-crypto",
      name: "/widget remove crypto",
      desc: "Hide live simulated crypto sparkline chart",
      example: "/widget remove crypto",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("crypto", false, "Crypto Sparklines")
    },
    {
      id: "widget-add-weather",
      name: "/widget add weather",
      desc: "Reveal local meteorology climate report widget",
      example: "/widget add weather",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("weather", true, "Weather")
    },
    {
      id: "widget-remove-weather",
      name: "/widget remove weather",
      desc: "Hide local meteorology climate report widget",
      example: "/widget remove weather",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("weather", false, "Weather")
    },
    {
      id: "widget-add-cosmos",
      name: "/widget add cosmos",
      desc: "Enable starry background drift particles engine",
      example: "/widget add cosmos",
      icon: <Layout size={14} className="text-accent" />,
      action: () => setWidgetVisibility("cosmos", true, "Cosmos Engine")
    },
    {
      id: "widget-remove-cosmos",
      name: "/widget remove cosmos",
      desc: "Disable starry background drift particles engine",
      example: "/widget remove cosmos",
      icon: <Layout size={14} className="text-accent/60" />,
      action: () => setWidgetVisibility("cosmos", false, "Cosmos Engine")
    },
    {
      id: "add-todo-item",
      name: "/add-todo [text]",
      desc: "Insert new target item into checklist",
      example: "/add-todo Sync dotfiles",
      icon: <HelpCircle size={14} className="text-emerald-400" />,
      action: (args) => {
        if (!args) { showMessage("Syntax: /add-todo <task name>", "error"); return; }
        addTodo(args);
        showMessage(`Added task: "${args}"`, "success");
      }
    },
    {
      id: "add-bookmark-item",
      name: "/add-bookmark [title] [url]",
      desc: "Insert quick-link bookmark launcher tile",
      example: "/add-bookmark GitHub github.com",
      icon: <HelpCircle size={14} className="text-emerald-400" />,
      action: (args) => {
        if (!args) { showMessage("Syntax: /add-bookmark <title> <url>", "error"); return; }
        const parts = args.split(" ");
        if (parts.length < 2) { showMessage("Provide both Title and URL", "error"); return; }
        const title = parts[0];
        const url = parts.slice(1).join("");
        addBookmark(title, url);
        showMessage(`Saved bookmark "${title}"`, "success");
      }
    },
    {
      id: "import-dotfiles",
      name: "/import-config",
      desc: "Restore workspace layout config from JSON dotfile",
      example: "/import-config",
      icon: <FileInput size={14} className="text-orange-400" />,
      action: () => {
        const el = document.getElementById("hypr-import-file-input") as HTMLInputElement | null;
        el?.click();
      }
    },
    {
      id: "export-dotfiles",
      name: "/export-config",
      desc: "Download current layout coordinates config as JSON",
      example: "/export-config",
      icon: <FileOutput size={14} className="text-sky-400" />,
      action: () => {
        exportConfig();
        showMessage("Configuration downloaded", "success");
      }
    },
    {
      id: "clear-all-reset",
      name: "/clear-all",
      desc: "Clear local settings and restore default startpage configuration",
      example: "/clear-all",
      icon: <ShieldAlert size={14} className="text-rose-400 animate-pulse" />,
      action: () => {
        resetConfig();
        showMessage("Workspace restored to factory layouts", "info");
      }
    },
    {
      id: "search-google",
      name: "/g [query]",
      desc: "Initiate search query in separate Google tab",
      example: "/g tailwindcss documentation v4",
      icon: <Search size={14} className="text-teal-400" />,
      action: (args) => {
        if (!args) { showMessage("Enter search query", "error"); return; }
        window.open(`https://google.com/search?q=${encodeURIComponent(args)}`, "_blank");
      }
    },
    {
      id: "search-github",
      name: "/git [query]",
      desc: "Query repositories on GitHub Search tab",
      example: "/git hyprland dotfiles",
      icon: <Search size={14} className="text-slate-300" />,
      action: (args) => {
        if (!args) { showMessage("Enter repository search text", "error"); return; }
        window.open(`https://github.com/search?q=${encodeURIComponent(args)}`, "_blank");
      }
    }
  ];

  // Advanced Fuzzy Search Filtering
  const filteredSuggestions = suggestions.filter((s) => {
    if (!inputVal) return true;
    const query = inputVal.toLowerCase().trim();

    // Strip starting "/" or ":" characters
    const normalizedQuery = query.replace(/^[\/:]/, "").replace(/\s+/g, " ");
    const normalizedName = s.name.replace(/^[\/:]/, "").replace(/-/g, "").trim();

    // Direct substring checks
    if (normalizedName.includes(normalizedQuery) || s.desc.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Split words for fuzzy matching
    const queryWords = normalizedQuery.split(" ");
    return queryWords.every((word) => 
      s.name.toLowerCase().includes(word) ||
      s.desc.toLowerCase().includes(word)
    );
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

    if (filteredSuggestions.length > 0 && selectedIndex < filteredSuggestions.length) {
      const selected = filteredSuggestions[selectedIndex];
      
      // Determine arguments
      let args = "";
      const cmdNameWords = selected.name.split(" ");
      const cmdBasePrefix = cmdNameWords[0]; // e.g. "/theme" or "/widget"
      
      // Handle multi-word commands (like "/widget add clock" or "/widget remove clock")
      if (cmdNameWords.length > 1 && cmdNameWords[1] !== "[text]" && cmdNameWords[1] !== "[title]") {
        const fullPrefix = cmdNameWords.slice(0, -1).join(" "); // e.g. "/widget add" or "/widget remove"
        const normalizedInput = trimmed.replace(/^[:\/]/, "/");
        if (normalizedInput.startsWith(fullPrefix)) {
          args = normalizedInput.slice(fullPrefix.length).trim();
        }
      } else {
        // Single word command prefix (e.g. "/g" or "/add-todo")
        const normalizedInput = trimmed.replace(/^[:\/]/, "/");
        if (normalizedInput.startsWith(cmdBasePrefix)) {
          args = normalizedInput.slice(cmdBasePrefix.length).trim();
        } else {
          args = trimmed;
        }
      }
      
      selected.action(args);
      setInputVal("");
      setIsOpen(false);
      return;
    }

    // Default Fallback: Search Google
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
        showMessage("Failed to parse configuration file.", "error");
      }
    };
    reader.readAsText(file);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hidden File Input for config imports */}
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
                  placeholder="Type a command (/theme, /widget) or search query..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-xs placeholder:text-text-muted focus:ring-0 select-text"
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
                        setTimeout(() => {
                          const cmdPrefix = s.name.split(" ").slice(0, -1).join(" ");
                          const suffix = s.name.split(" ").pop();
                          const isPlaceholder = suffix?.startsWith("[");
                          
                          // If placeholder like "/add-todo [text]", set only prefix, else set full command
                          setInputVal(isPlaceholder ? cmdPrefix + " " : s.name + " ");
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
