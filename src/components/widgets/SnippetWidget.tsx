"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Code2, Copy, Check, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const SnippetWidget: React.FC = () => {
  const { state, addSnippet, deleteSnippet } = useHyprStore();
  const { snippets } = state;

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("bash");
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    addSnippet(title.trim(), code.trim(), lang);
    setTitle("");
    setCode("");
    setLang("bash");
    setShowForm(false);
  };

  return (
    <div className="select-none">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer"
      >
        <Code2 size={14} />
        <span>{snippets.length} snippet{snippets.length !== 1 ? "s" : ""}</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 w-80 bg-card-bg/90 backdrop-blur-xl border border-card-border rounded-xl p-3 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-foreground/60">Snippets</span>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-[11px] text-foreground/40 hover:text-foreground/70 cursor-pointer transition-colors"
              >
                {showForm ? "Cancel" : "+ New"}
              </button>
            </div>

            {/* Add form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-3 pb-3 border-b border-white/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-white/20"
                    required
                  />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="bash">bash</option>
                    <option value="jsx">jsx</option>
                    <option value="css">css</option>
                    <option value="json">json</option>
                    <option value="ts">ts</option>
                  </select>
                </div>
                <textarea
                  placeholder="Code..."
                  rows={3}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none resize-none focus:border-white/20"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            {/* List */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {snippets.length > 0 ? (
                snippets.map((s) => (
                  <div key={s.id} className="bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden group">
                    <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px]">
                      <span className="text-foreground/60 truncate font-medium">{s.title}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground/20 text-[10px]">{s.lang}</span>
                        <button
                          onClick={() => handleCopy(s.id, s.code)}
                          className="text-foreground/30 hover:text-foreground/60 cursor-pointer transition-colors"
                        >
                          {copiedId === s.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        </button>
                        <button
                          onClick={() => deleteSnippet(s.id)}
                          className="text-foreground/30 hover:text-red-400 cursor-pointer transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                    <pre className="px-2.5 pb-2 text-[10px] text-foreground/40 font-mono whitespace-pre overflow-x-auto max-h-16">
                      <code>{s.code}</code>
                    </pre>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-foreground/25 text-center py-3">No snippets yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
