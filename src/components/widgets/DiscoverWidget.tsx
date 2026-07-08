"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { Compass, ExternalLink, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FeedItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  source: string;
  url: string;
  image: string;
}

const FEED_DATABASE: FeedItem[] = [
  // K-Pop
  {
    id: "kp1",
    category: "kpop",
    categoryLabel: "K-Pop",
    title: "NewJeans Announces Worldwide 'Bunnies Camp' Arena Tour",
    source: "KpopStarz",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "kp2",
    category: "kpop",
    categoryLabel: "K-Pop",
    title: "AESPA Hits #1 on Global Charts with Synth-heavy Album 'Whiplash'",
    source: "Soompi",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop",
  },
  // Anime
  {
    id: "an1",
    category: "anime",
    categoryLabel: "Anime",
    title: "Demon Slayer: Infinity Castle Movie Trilogy Teaser Drops",
    source: "AnimeNewsNetwork",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "an2",
    category: "anime",
    categoryLabel: "Anime",
    title: "Chainsaw Man Reze Arc Movie Confirmed for Winter Release",
    source: "Crunchyroll",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
  },
  // Japanese
  {
    id: "jp1",
    category: "japanese",
    categoryLabel: "Japanese",
    title: "Kyoto's Hidden Bamboo Path: A Midnight Stroll Through Arashiyama",
    source: "JapanTravel",
    url: "https://google.com",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "jp2",
    category: "japanese",
    categoryLabel: "Japanese",
    title: "Tokyo Minimalist Desk Setups: Blending Zen Aesthetics with Modern Workstation",
    source: "JapanDesign",
    url: "https://google.com",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
  },
  // Tech
  {
    id: "tc1",
    category: "tech",
    categoryLabel: "Tech",
    title: "Next.js 16 Drops Compilation Time by 40% with Rust-based Turbopack",
    source: "Vercel Blog",
    url: "https://nextjs.org",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "tc2",
    category: "tech",
    categoryLabel: "Tech",
    title: "Procedural Audio in Web Browser: Using Web Audio API Nodes Without Audio Assets",
    source: "Medium Tech",
    url: "https://medium.com",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  },
  // Indonesian Pop
  {
    id: "id1",
    category: "indopop",
    categoryLabel: "Indo Pop",
    title: "Tulus Releases Soulful New Single 'Interaksi' Under Warm Acoustic Light",
    source: "Spotify Indo",
    url: "https://spotify.com",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "id2",
    category: "indopop",
    categoryLabel: "Indo Pop",
    title: "Bernadya's Debut Album Reaches #1 Spot on Spotify Indonesia Charts",
    source: "Billboard Indo",
    url: "https://spotify.com",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
  },
  // Hipdut
  {
    id: "hd1",
    category: "hipdut",
    categoryLabel: "Hipdut",
    title: "NDX AKA Mixes Hip-Hop Beats and Javanese Dangdut Koplo Live in Concert",
    source: "KonserKita",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "hd2",
    category: "hipdut",
    categoryLabel: "Hipdut",
    title: "Guyon Waton's Viral Javanese Trap-Dangdut Hit Hits 10M Views",
    source: "KoploWave",
    url: "https://youtube.com",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
  },
  // Global Pop
  {
    id: "gp1",
    category: "globalpop",
    categoryLabel: "Global Pop",
    title: "Billie Eilish Dominates Summer Music Festival Lineups Worldwide",
    source: "Rolling Stone",
    url: "https://spotify.com",
    image: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=600&auto=format&fit=crop",
  },
  // Fashion
  {
    id: "fs1",
    category: "fashion",
    categoryLabel: "Fashion",
    title: "Harajuku Street Wear: Bolder Color Gradients and Oversized Outerwear",
    source: "Vogue Tokyo",
    url: "https://google.com",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
  },
  // Nature
  {
    id: "nt1",
    category: "nature",
    categoryLabel: "Nature",
    title: "Chasing Waterfalls: The Hidden Paradise of Lombok, Indonesia",
    source: "ExploreIndo",
    url: "https://google.com",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop",
  },
];

export const DiscoverWidget: React.FC = () => {
  const { state } = useHyprStore();
  const { interests } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter feed database by user's active interests
  const activeFeed = FEED_DATABASE.filter((item) => {
    // Matches active interest categories
    const isCategoryMatched = interests.includes(item.category);
    
    // Matches search filter
    const matchesSearch = searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return isCategoryMatched && matchesSearch;
  });

  return (
    <div className="select-none">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer"
      >
        <Compass size={14} />
        <span>Discover Feed</span>
      </button>

      {/* Discover Hub Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 w-96 bg-card-bg/95 backdrop-blur-xl border border-card-border rounded-2xl p-4 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-foreground/75 flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent/60 animate-pulse" />
                Discover Feed
              </span>
              <span className="text-[10px] text-foreground/30">Based on your interests</span>
            </div>

            {/* Quick Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feed topics..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs outline-none focus:border-white/20 placeholder:text-foreground/20"
              />
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/20" />
            </div>

            {/* Content list */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-0.5">
              {activeFeed.length > 0 ? (
                activeFeed.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-2 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-xl transition-all group overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Category label */}
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[9px] uppercase font-bold text-accent/70 tracking-wider">
                            {item.categoryLabel}
                          </span>
                          <span className="text-[9px] text-foreground/20">{item.source}</span>
                        </div>
                        {/* Title */}
                        <h4 className="text-[11px] text-foreground/80 leading-relaxed font-medium line-clamp-2 group-hover:text-foreground transition-colors pr-3">
                          {item.title}
                        </h4>
                      </div>
                      
                      {/* Hover action icon */}
                      <div className="text-[9px] text-foreground/30 flex items-center gap-1 group-hover:text-accent/60 transition-colors mt-1">
                        <span>View content</span>
                        <ExternalLink size={8} className="translate-y-[-0.5px]" />
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-xs text-foreground/30 font-medium">No matches in your feed</p>
                  <p className="text-[10px] text-foreground/20 mt-1 max-w-[200px]">
                    Go to Settings → Wallpaper & Interests to check more topics!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
