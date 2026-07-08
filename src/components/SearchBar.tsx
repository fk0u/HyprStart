"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, TrendingUp, ArrowUpLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions from our Next.js API proxy
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
      const data: string[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
      setSelectedIdx(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced input handler (300ms)
  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // Handle search submission
  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    window.open(
      `https://google.com/search?q=${encodeURIComponent(searchQuery.trim())}`,
      "_blank"
    );
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        executeSearch(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIdx((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIdx((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIdx >= 0 && selectedIdx < suggestions.length) {
          executeSearch(suggestions[selectedIdx]);
        } else {
          executeSearch(query);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIdx(-1);
        break;
      case "Tab":
        // Tab-complete the selected suggestion into the input
        if (selectedIdx >= 0 && selectedIdx < suggestions.length) {
          e.preventDefault();
          setQuery(suggestions[selectedIdx]);
          setShowSuggestions(false);
        }
        break;
    }
  };

  // Fill suggestion text into input when pressing the arrow icon
  const fillSuggestion = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
    // Re-fetch suggestions for the filled text
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 300);
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search the web..."
          className={`w-full bg-white/[0.06] backdrop-blur-md border border-white/[0.06] py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white/[0.1] focus:border-white/[0.12] transition-all duration-300 placeholder:text-foreground/20 ${
            showSuggestions
              ? "rounded-t-2xl rounded-b-none border-b-transparent"
              : "rounded-2xl"
          }`}
          autoComplete="off"
        />
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25"
        />
        {/* Subtle loading indicator */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-foreground/15 border-t-foreground/40 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 bg-white/[0.06] backdrop-blur-md border border-white/[0.06] border-t-0 rounded-b-2xl overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => executeSearch(s)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  selectedIdx === i
                    ? "bg-white/[0.08] text-foreground/90"
                    : "text-foreground/55 hover:bg-white/[0.04]"
                }`}
              >
                <TrendingUp
                  size={12}
                  className="text-foreground/20 shrink-0"
                />
                <span className="flex-1 truncate">{s}</span>
                {/* Fill button — puts the suggestion text into the input */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fillSuggestion(s);
                  }}
                  className="p-1 text-foreground/15 hover:text-foreground/40 transition-colors cursor-pointer"
                  title="Fill into search"
                >
                  <ArrowUpLeft size={12} />
                </button>
              </button>
            ))}

            {/* Footer hint */}
            <div className="px-4 py-2 text-[10px] text-foreground/15 border-t border-white/[0.04] flex justify-between">
              <span>↑↓ navigate · Enter search · Tab complete</span>
              <span>Google Suggest</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
