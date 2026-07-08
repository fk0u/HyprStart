"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Trash2, ExternalLink, Globe } from "lucide-react";

export const BookmarksWidget: React.FC = () => {
  const { state, addBookmark, deleteBookmark } = useHyprStore();
  const { bookmarks } = state;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    addBookmark(title.trim(), url.trim());
    setTitle("");
    setUrl("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs justify-between gap-2 select-none">
      {/* Tab controls */}
      <div className="flex justify-between items-center border-b border-card-border/30 pb-1.5 mb-1 text-[10px] text-text-muted">
        <span className="flex items-center gap-1.5 uppercase font-bold text-accent/90">
          <Globe size={10} />
          LAUNCHER::BOOKMARKS
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setIsEditMode(false);
            }}
            className={`cursor-pointer hover:text-accent transition-colors ${showAddForm ? "text-accent" : ""}`}
          >
            [+ ADD]
          </button>
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setShowAddForm(false);
            }}
            className={`cursor-pointer hover:text-accent transition-colors ${isEditMode ? "text-accent font-bold" : ""}`}
          >
            [EDIT]
          </button>
        </div>
      </div>

      {/* Bookmarks Grid / List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-0 select-text">
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2 bg-black/40 border border-card-border/30 rounded select-none">
            <input
              type="text"
              placeholder="Alias (e.g. GitHub)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/60 border border-card-border/50 rounded px-2.5 py-1 text-foreground focus:outline-none focus:border-accent text-[10px]"
              required
            />
            <input
              type="text"
              placeholder="Target URL (e.g. github.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-black/60 border border-card-border/50 rounded px-2.5 py-1 text-foreground focus:outline-none focus:border-accent text-[10px]"
              required
            />
            <div className="flex gap-2 justify-end mt-1 text-[9px]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2 py-1 border border-card-border/30 rounded hover:bg-white/5 text-text-muted cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-2 py-1 bg-accent/10 border border-accent/40 rounded hover:bg-accent/20 text-accent cursor-pointer"
              >
                CONFIRM
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {bookmarks.map((bookmark, idx) => (
              <div
                key={bookmark.id}
                className="group relative flex items-center justify-between border border-card-border/20 rounded bg-black/40 hover:bg-accent-dim/20 hover:border-accent/40 transition-all overflow-hidden"
              >
                {/* Visual number indicator for quick reference */}
                <span className="absolute left-0 top-0 bottom-0 w-4 bg-black/30 text-text-muted/40 group-hover:text-accent/40 text-[8px] flex items-center justify-center font-bold border-r border-card-border/10 select-none">
                  {idx + 1}
                </span>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 pl-6 pr-2 truncate text-[10px] text-foreground/80 hover:text-foreground font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{bookmark.title.toUpperCase()}</span>
                  <ExternalLink size={8} className="opacity-0 group-hover:opacity-60 transition-opacity ml-1 text-accent" />
                </a>

                {isEditMode && (
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="h-full px-2 border-l border-rose-500/20 text-text-muted hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer pointer-events-auto"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Launcher Helper Note */}
      <div className="text-[8px] text-text-muted shrink-0 text-right opacity-60">
        * BOOKMARKS OPEN IN A SECURE SEPARATE SANDBOX TAB
      </div>
    </div>
  );
};
