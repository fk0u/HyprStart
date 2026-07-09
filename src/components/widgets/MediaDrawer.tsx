"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Music, Disc, Tv } from "lucide-react";
import { motion } from "framer-motion";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  cover: string;
  lyrics: { time: number; text: string }[];
}

const PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Synthwave Coding Session",
    artist: "RetroCoder",
    album: "Neon Workstation",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "bg-gradient-to-tr from-purple-600 to-indigo-900",
    lyrics: [
      { time: 0, text: "🎵 [Instrumental Synthwave Intro] 🎵" },
      { time: 8, text: "Menatap layar hitam, baris demi baris..." },
      { time: 15, text: "Mencari logika di tengah malam yang sunyi." },
      { time: 22, text: "Compile sukses, let's ship this code!" },
      { time: 30, text: "HyprStart running on my workstation..." },
      { time: 38, text: "Lampu neon berkedip seirama dengan detak CPU." },
      { time: 46, text: "Offline synths keep me focused all night." },
      { time: 55, text: "🎵 [Synth Wave Guitar Solo] 🎵" },
    ],
  },
  {
    id: "2",
    title: "Sakura Blossom Breeze",
    artist: "Haruto & Lofi Chill",
    album: "Tokyo Station",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "bg-gradient-to-tr from-pink-500 to-rose-700",
    lyrics: [
      { time: 0, text: "🎵 [Relaxing Japanese Lo-Fi Flute] 🎵" },
      { time: 10, text: "Angin musim semi berhembus lembut..." },
      { time: 20, text: "Kelopak bunga sakura berguguran di atas meja." },
      { time: 30, text: "Menikmati secangkir teh hijau hangat." },
      { time: 40, text: "Jejak langkah kaki di gang kecil Shibuya." },
      { time: 50, text: "Waktu seolah melambat di kota ini." },
      { time: 60, text: "🎵 [Smooth Piano Outro] 🎵" },
    ],
  },
  {
    id: "3",
    title: "Indo Pop Chillout Beats",
    artist: "Bintang Senja",
    album: "Cakrawala Rasa",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "bg-gradient-to-tr from-teal-500 to-emerald-800",
    lyrics: [
      { time: 0, text: "🎵 [Acoustic Guitar Intro] 🎵" },
      { time: 7, text: "Melihat jingga meredup di ufuk barat..." },
      { time: 14, text: "Gemercik air hujan mulai membasahi bumi." },
      { time: 21, text: "Bernyanyi pelan ditemani secangkir kopi." },
      { time: 28, text: "Ingatan lama datang mengetuk pintu hati." },
      { time: 35, text: "Biarlah malam ini menjadi melodi kita." },
      { time: 42, text: "Berjalan perlahan menyusuri memori." },
      { time: 50, text: "🎵 [Acoustic Melancholy Bridge] 🎵" },
    ],
  },
];

interface ActiveTabMedia {
  id: number;
  title: string;
  artist: string;
  source: string;
}

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({ isOpen, onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  // Chrome tab media detection state
  const [activeTabMedia, setActiveTabMedia] = useState<ActiveTabMedia | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const track = PLAYLIST[currentTrackIndex];

  // 1. Chrome Tab Media Scanner (audible tabs detection)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkActiveTabs = () => {
      // Check if chrome extension tabs API is available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chrome = (window as any).chrome;
      if (chrome && chrome.tabs && chrome.tabs.query) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chrome.tabs.query({ audible: true }, (tabs: any[]) => {
          if (tabs && tabs.length > 0) {
            const activeTab = tabs[0];
            let rawTitle = activeTab.title || "Unknown Track";
            let artist = "Web Audio Source";
            let title = rawTitle;
            let source = "Browser Tab";

            // Parse common sources
            if (activeTab.url?.includes("youtube.com")) {
              source = "YouTube";
              rawTitle = rawTitle.replace(" - YouTube", "");
              if (rawTitle.includes(" - ")) {
                const parts = rawTitle.split(" - ");
                artist = parts[0];
                title = parts[1];
              }
            } else if (activeTab.url?.includes("spotify.com")) {
              source = "Spotify";
              rawTitle = rawTitle.replace(" - Spotify", "");
              if (rawTitle.includes(" - ")) {
                const parts = rawTitle.split(" - ");
                title = parts[0];
                artist = parts[1];
              }
            }

            setActiveTabMedia({
              id: activeTab.id,
              title: title,
              artist: artist,
              source: source,
            });
            
            // Sync play state to active tab playing
            setIsPlaying(true);
          } else {
            setActiveTabMedia(null);
          }
        });
      }
    };

    checkActiveTabs();
    const interval = setInterval(checkActiveTabs, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. Control tab media via Chrome scripting API injection
  const controlTabMedia = (action: "play" | "pause" | "next" | "prev") => {
    if (!activeTabMedia) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chrome = (window as any).chrome;
    if (chrome && chrome.scripting && chrome.tabs) {
      chrome.scripting.executeScript({
        target: { tabId: activeTabMedia.id },
        func: (act: string) => {
          const media = document.querySelector("video, audio") as HTMLMediaElement;
          if (media) {
            if (act === "play") media.play().catch(() => {});
            if (act === "pause") media.pause();
          }

          // Simulate next/prev click on YouTube or Spotify buttons
          if (act === "next") {
            const nextBtn = document.querySelector(".ytp-next-button, [data-testid='control-button-skip-forward'], button[aria-label='Next']") as HTMLButtonElement;
            if (nextBtn) nextBtn.click();
          }
          if (act === "prev") {
            const prevBtn = document.querySelector(".ytp-prev-button, [data-testid='control-button-skip-back'], button[aria-label='Previous']") as HTMLButtonElement;
            if (prevBtn) prevBtn.click();
          }
        },
        args: [action],
      });
      
      if (action === "play") setIsPlaying(true);
      if (action === "pause") setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (activeTabMedia) {
      controlTabMedia("next");
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    }
  };

  const handlePrev = () => {
    if (activeTabMedia) {
      controlTabMedia("prev");
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    }
  };

  const togglePlay = () => {
    if (activeTabMedia) {
      if (isPlaying) {
        controlTabMedia("pause");
      } else {
        controlTabMedia("play");
      }
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  // 3. Sync state with HTML5 Audio element
  useEffect(() => {
    // If active tab media is playing, disable local playback
    if (activeTabMedia) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track.url);
    audioRef.current = audio;
    audio.volume = volume;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
      // Sync lyrics
      const time = audio.currentTime;
      const lyrics = track.lyrics;
      let activeIndex = -1;
      for (let i = 0; i < lyrics.length; i++) {
        if (time >= lyrics[i].time) {
          activeIndex = i;
        } else {
          break;
        }
      }
      setCurrentLyricIndex(activeIndex);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, activeTabMedia]);

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-scroll lyrics container
  useEffect(() => {
    if (lyricsContainerRef.current && currentLyricIndex !== -1) {
      const activeEl = lyricsContainerRef.current.children[currentLyricIndex] as HTMLElement;
      if (activeEl) {
        lyricsContainerRef.current.scrollTo({
          top: activeEl.offsetTop - lyricsContainerRef.current.clientHeight / 2 + activeEl.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentLyricIndex]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTabMedia) return; // Cannot seek external active tab directly
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const pct = clickX / width;
    audioRef.current.currentTime = pct * duration;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? "0%" : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-card-bg/95 backdrop-blur-2xl border-l border-card-border p-6 shadow-2xl flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex justify-between items-center shrink-0 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-foreground/80 font-semibold text-xs tracking-wider uppercase">
          <Music size={14} className="text-sky-400" />
          Media Center
        </div>
        <button
          onClick={onClose}
          className="text-foreground/30 hover:text-foreground/60 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Now Playing Area */}
      <div className="flex-1 flex flex-col justify-center py-6">
        {/* Cover Art Vinyl */}
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Disc Shadow */}
            <div className="absolute inset-0 bg-black/40 rounded-full blur-xl" />
            
            {/* The Vinyl Disc */}
            <div
              className={`absolute inset-0 rounded-full bg-neutral-900 border-4 border-neutral-800 flex items-center justify-center ${
                isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
              }`}
            >
              {/* Grooves */}
              <div className="absolute inset-2 rounded-full border border-neutral-800/50" />
              <div className="absolute inset-6 rounded-full border border-neutral-800/50" />
              <div className="absolute inset-10 rounded-full border border-neutral-800/50" />

              {/* Album Art Core */}
              <div className={`w-16 h-16 rounded-full ${activeTabMedia ? "bg-gradient-to-tr from-cyan-500 to-blue-800" : track.cover} flex items-center justify-center overflow-hidden border border-black/40`}>
                <Disc size={20} className="text-white/60 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Header Badge for active tab connection */}
        {activeTabMedia && (
          <div className="mx-auto mb-2 flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/10 border border-sky-500/15 rounded-full text-[9px] font-mono text-sky-400 font-bold uppercase tracking-wider shrink-0">
            <Tv size={10} />
            Tab Connected: {activeTabMedia.source}
          </div>
        )}

        {/* Info */}
        <div className="text-center mb-5 shrink-0">
          <h3 className="text-sm font-bold text-foreground/80 truncate px-2">
            {activeTabMedia ? activeTabMedia.title : track.title}
          </h3>
          <p className="text-[11px] text-foreground/45 mt-1 font-mono">
            {activeTabMedia ? activeTabMedia.artist : `${track.artist} — ${track.album}`}
          </p>
        </div>

        {/* Dynamic Lyrics / Status Container */}
        <div className="flex-1 min-h-[140px] relative overflow-hidden bg-black/15 border border-white/[0.03] rounded-2xl mb-5 px-4 py-6">
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card-bg/95 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card-bg/95 to-transparent pointer-events-none z-10" />

          {activeTabMedia ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-3 px-2">
              <span className="text-[20px] animate-bounce">📻</span>
              <p className="text-[11px] text-foreground/85 leading-relaxed font-mono font-semibold">
                Streaming Realtime dari Tab Aktif Browser Anda
              </p>
              <p className="text-[10px] text-foreground/40 leading-relaxed max-w-[200px]">
                Mengontrol audio tab secara langsung. Lirik otomatis tersembunyi untuk mode tab eksternal.
              </p>
            </div>
          ) : (
            <div
              ref={lyricsContainerRef}
              className="h-full overflow-y-auto space-y-4 pr-1 text-center scroll-smooth scrollbar-thin select-none"
              style={{ scrollbarWidth: "none" }}
            >
              {track.lyrics.map((lyr, index) => {
                const isActive = index === currentLyricIndex;
                return (
                  <div
                    key={index}
                    className={`text-[11px] leading-relaxed transition-all duration-300 font-mono ${
                      isActive
                        ? "text-sky-400 font-bold scale-105 opacity-100"
                        : "text-foreground/30 opacity-40"
                    }`}
                  >
                    {lyr.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Media Progress Tracker */}
        <div className="mb-4 shrink-0">
          <div
            onClick={handleProgressBarClick}
            className={`w-full h-1 bg-white/10 rounded-full overflow-hidden relative ${activeTabMedia ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <div
              className="h-full bg-sky-400 transition-all duration-100"
              style={{ width: `${activeTabMedia ? 100 : (duration ? (progress / duration) * 100 : 0)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-foreground/35 mt-1.5">
            <span>{activeTabMedia ? "LIVE" : formatTime(progress)}</span>
            <span>{activeTabMedia ? "TAB AUDIO" : formatTime(duration)}</span>
          </div>
        </div>

        {/* Audio Controller Bar */}
        <div className="flex justify-center items-center gap-5 shrink-0 mb-4">
          <button
            onClick={handlePrev}
            className="text-foreground/45 hover:text-foreground cursor-pointer transition-colors p-1.5 hover:bg-white/5 rounded-full"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 bg-sky-500 hover:bg-sky-400 text-white rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md shadow-sky-500/10"
          >
            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="text-foreground/45 hover:text-foreground cursor-pointer transition-colors p-1.5 hover:bg-white/5 rounded-full"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Volume Selector */}
      <div className="border-t border-white/5 pt-4 flex items-center gap-3 shrink-0">
        <Volume2 size={13} className="text-foreground/35" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          disabled={!!activeTabMedia}
          className={`flex-1 h-1 bg-white/10 rounded-full appearance-none accent-sky-400 ${activeTabMedia ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        />
      </div>
    </motion.div>
  );
};
