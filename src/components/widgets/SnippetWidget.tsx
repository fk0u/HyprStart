"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Terminal, Copy, Check, Trash2, Code2 } from "lucide-react";

export const SnippetWidget: React.FC = () => {
  const { state, addSnippet, deleteSnippet } = useHyprStore();
  const { snippets } = state;

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("bash");
  const [showAddForm, setShowAddForm] = useState(false);
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
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs justify-between gap-2 select-none">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-card-border/30 pb-1.5 mb-1 text-[10px] text-text-muted">
        <span className="flex items-center gap-1.5 uppercase font-bold text-accent/90">
          <Code2 size={10} />
          WIDGET::CODE_SNIPPETS
        </span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="cursor-pointer hover:text-accent transition-colors"
        >
          {showAddForm ? "[LIST_VIEW]" : "[+ SNIPPET]"}
        </button>
      </div>

      {/* Snippet Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0 select-text">
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2 bg-black/40 border border-card-border/30 rounded select-none">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Title/Alias"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-black/60 border border-card-border/50 rounded px-2.5 py-1 text-foreground focus:outline-none focus:border-accent text-[10px]"
                required
              />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-black/60 border border-card-border/50 rounded px-1.5 py-1 text-foreground focus:outline-none focus:border-accent text-[9px] cursor-pointer"
              >
                <option value="bash">BASH</option>
                <option value="jsx">JSX</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="ts">TS</option>
              </select>
            </div>
            <textarea
              placeholder="Paste code blocks here..."
              rows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black/60 border border-card-border/50 rounded px-2.5 py-1.5 text-foreground focus:outline-none focus:border-accent text-[10px] font-mono resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-1 bg-accent/10 border border-accent/40 rounded hover:bg-accent/20 text-accent text-[10px] font-bold cursor-pointer"
            >
              SAVE SNIPPET
            </button>
          </form>
        ) : snippets.length > 0 ? (
          snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border border-card-border/20 rounded bg-black/40 flex flex-col overflow-hidden"
            >
              {/* Snippet Header */}
              <div className="flex items-center justify-between px-2.5 py-1 bg-black/30 border-b border-card-border/10 text-[9px] text-text-muted">
                <span className="font-semibold text-foreground/80 truncate uppercase flex items-center gap-1.5">
                  <Terminal size={9} className="text-accent" />
                  {snippet.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-accent-dim text-accent px-1 rounded uppercase">
                    {snippet.lang}
                  </span>
                  <button
                    onClick={() => handleCopy(snippet.id, snippet.code)}
                    className="hover:text-accent transition-colors cursor-pointer pointer-events-auto p-0.5"
                    title="Copy Code"
                  >
                    {copiedId === snippet.id ? (
                      <Check size={10} className="text-emerald-400" />
                    ) : (
                      <Copy size={10} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteSnippet(snippet.id)}
                    className="hover:text-rose-400 transition-colors cursor-pointer pointer-events-auto p-0.5"
                    title="Delete"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>

              {/* Snippet Preview Code */}
              <pre className="p-2 overflow-x-auto text-[9px] leading-relaxed text-foreground/75 bg-slate-950/20 max-h-[80px] font-mono whitespace-pre select-all select-none scrollbar-thin">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-muted/50 py-8 gap-2">
            <Terminal size={20} className="opacity-30" />
            <span className="text-[10px]">SNIPPETS MODULE EMPTY</span>
          </div>
        )}
      </div>
    </div>
  );
};
