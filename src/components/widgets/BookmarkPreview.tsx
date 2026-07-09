"use client";

import React from "react";
import { Link2, Globe, Wifi } from "lucide-react";

interface BookmarkPreviewProps {
  url: string;
  title: string;
}

export const BookmarkPreview: React.FC<BookmarkPreviewProps> = ({ url, title }) => {
  // Extract hostname
  let hostname = "localhost";
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = url;
  }

  // Generates a mock but realistic description based on the URL/Title
  const getMockDescription = () => {
    const lTitle = title.toLowerCase();
    if (lTitle.includes("youtube")) return "Platform berbagi video terbesar. Tonton musik, video, dan live streaming.";
    if (lTitle.includes("spotify")) return "Layanan streaming musik digital. Dapatkan akses ke jutaan lagu dan podcast.";
    if (lTitle.includes("netflix")) return "Layanan streaming film dan serial TV terpopuler di dunia.";
    if (lTitle.includes("reddit")) return "Kumpulan forum diskusi, berita hangat, dan tren internet global.";
    if (lTitle.includes("github")) return "Pusat hosting kode kolaboratif developer dunia. Open source hub.";
    if (lTitle.includes("instagram")) return "Bagikan foto, cerita, video, dan terhubung dengan komunitas kreatif.";
    if (lTitle.includes("twitter") || lTitle.includes("x.com")) return "Layanan jejaring sosial microblogging realtime untuk berita terhangat.";
    return `Tautan cepat menuju ${title}. Akses cepat portal workstation media dan hiburan Anda.`;
  };

  // Generate a random stable ping based on URL hash
  const getMockPing = () => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = url.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ping = 10 + Math.abs(hash % 45);
    return `${ping}ms`;
  };

  return (
    <div className="w-56 p-4 rounded-2xl bg-card-bg/95 backdrop-blur-xl border border-card-border shadow-2xl text-left pointer-events-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-mono">
          <Globe size={11} />
          <span className="truncate max-w-[110px]">{hostname}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-green-400/80 bg-green-500/5 px-1.5 py-0.5 rounded-lg border border-green-500/10">
          <Wifi size={10} />
          <span>{getMockPing()}</span>
        </div>
      </div>

      <h4 className="text-xs font-bold text-foreground/80 mb-1 flex items-center gap-1">
        <Link2 size={12} className="text-sky-400" />
        {title}
      </h4>

      <p className="text-[10px] text-foreground/45 leading-relaxed mb-3">
        {getMockDescription()}
      </p>

      <div className="pt-2.5 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-foreground/30">
        <span>STATUS: ONLINE</span>
        <span>SSL SECURE</span>
      </div>
    </div>
  );
};
