"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Stage 1: Fade in logo text quickly
    const logoTimeout = setTimeout(() => setShowLogo(true), 200);

    // Stage 2: Fill progress bar smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Complete intro shortly after reaching 100%
          setTimeout(onComplete, 500);
          return 100;
        }
        // Accelerate/Decelerate progress naturally
        const diff = Math.random() * 8 + 4;
        return Math.min(prev + diff, 100);
      });
    }, 120);

    return () => {
      clearTimeout(logoTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  // Framer Motion variant for letter-by-letter reveal
  const titleLetters = "HYPRSTART".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07080a] select-none overflow-hidden"
    >
      {/* Immersive background soft radial pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,162,247,0.06)_0%,transparent_70%)] animate-pulse-slow" />

      {/* Main Branding Logo & Title */}
      <div className="flex flex-col items-center text-center z-10 px-4">
        {/* Abstract floating ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" }
          }}
          className="w-16 h-16 rounded-full border border-dashed border-sky-400/20 mb-8 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center font-mono text-foreground/40 text-xs">
            HS
          </div>
        </motion.div>

        {/* Rising glowing title */}
        {showLogo && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-1.5 tracking-[0.3em] font-extralight text-3xl md:text-4xl text-foreground/90 font-sans"
          >
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-[10px] uppercase tracking-[0.4em] text-foreground font-mono mt-3"
        >
          Minimalist Workstation Environment
        </motion.p>

        {/* Thin elegant progress bar */}
        <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden mt-10 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500/80 to-indigo-500/80 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        {/* Boot message */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.6 }}
          className="text-[9px] font-mono text-foreground/80 mt-3 h-4"
        >
          {progress < 30
            ? "analyzing telemetry..."
            : progress < 70
            ? "loading ambient soundscapes..."
            : progress < 100
            ? "compiling widgets..."
            : "ready."}
        </motion.span>
      </div>

      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </motion.div>
  );
};
