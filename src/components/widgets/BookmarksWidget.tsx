"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { ExternalLink, Plus, Edit2, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const BookmarksWidget: React.FC = () => {
  const { state, addBookmark, editBookmark, deleteBookmark } = useHyprStore();
  const { bookmarks } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleOpenAdd = () => {
    setTitle("");
    setUrl("");
    setEditingId(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (id: string, currentTitle: string, currentUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTitle(currentTitle);
    setUrl(currentUrl);
    setEditingId(id);
    setIsOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Delete this bookmark?")) {
      deleteBookmark(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    if (editingId) {
      editBookmark(editingId, title.trim(), url.trim());
    } else {
      addBookmark(title.trim(), url.trim());
    }
    setIsOpen(false);
  };

  // Get favicon URL from bookmark domain
  const getFavicon = (targetUrl: string) => {
    try {
      const domain = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center relative select-none">
      {bookmarks.map((b) => {
        const favicon = getFavicon(b.url);
        return (
          <div
            key={b.id}
            className="group relative flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
          >
            <a
              href={b.url.startsWith("http") ? b.url : `https://${b.url}`}
              target="_blank"
              rel="noopener noreferrer"
              title={b.title}
              className="flex flex-col items-center gap-1.5"
            >
              {favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={favicon}
                  alt={b.title}
                  width={28}
                  height={28}
                  className="rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <ExternalLink size={14} className="text-foreground/45" />
                </div>
              )}
              <span className="text-[10px] text-foreground/40 group-hover:text-foreground/75 transition-colors max-w-[65px] truncate text-center font-medium">
                {b.title}
              </span>
            </a>

            {/* Floating edit/delete controls on hover */}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/5 transition-opacity shadow-lg">
              <button
                onClick={(e) => handleOpenEdit(b.id, b.title, b.url, e)}
                className="text-foreground/40 hover:text-sky-400 p-0.5 transition-colors cursor-pointer"
                title="Edit Shortcut"
              >
                <Edit2 size={10} />
              </button>
              <button
                onClick={(e) => handleDelete(b.id, e)}
                className="text-foreground/40 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                title="Delete Shortcut"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Add Shortcut button */}
      <button
        onClick={handleOpenAdd}
        className="flex flex-col items-center justify-center w-10 h-10 rounded-xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.02] text-foreground/30 hover:text-foreground/60 transition-all cursor-pointer"
        title="Add new shortcut"
      >
        <Plus size={16} />
      </button>

      {/* Glassmorphic Edit/Add Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-foreground/30 hover:text-foreground/65 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground/80 mb-5">
                {editingId ? "Edit Shortcut" : "Add Shortcut"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-foreground/45 uppercase tracking-wider mb-1.5 font-mono">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="YouTube"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-white/15 focus:bg-white/[0.04] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-foreground/45 uppercase tracking-wider mb-1.5 font-mono">
                    URL
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-white/15 focus:bg-white/[0.04] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 bg-transparent border border-white/5 hover:border-white/10 rounded-xl text-xs text-foreground/60 hover:text-foreground/85 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs text-foreground font-medium transition-all cursor-pointer"
                  >
                    {editingId ? "Save Changes" : "Add Bookmark"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
