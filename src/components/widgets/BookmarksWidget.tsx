"use client";

import React from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { ExternalLink } from "lucide-react";

export const BookmarksWidget: React.FC = () => {
  const { state } = useHyprStore();
  const { bookmarks } = state;

  if (bookmarks.length === 0) return null;

  // Get favicon URL from bookmark domain
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {bookmarks.map((b) => {
        const favicon = getFavicon(b.url);
        return (
          <a
            key={b.id}
            href={b.url.startsWith("http") ? b.url : `https://${b.url}`}
            target="_blank"
            rel="noopener noreferrer"
            title={b.title}
            className="group flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
          >
            {favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt={b.title}
                width={28}
                height={28}
                className="rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <ExternalLink size={14} className="text-foreground/40" />
              </div>
            )}
            <span className="text-[10px] text-foreground/40 group-hover:text-foreground/70 transition-colors max-w-[60px] truncate text-center">
              {b.title}
            </span>
          </a>
        );
      })}
    </div>
  );
};
