/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useHyprStore } from "@/hooks/useHyprStore";

export const BG_GALLERY = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", label: "Mountain Sunrise" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2070&auto=format&fit=crop", label: "Misty Forest" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop", label: "Tropical Beach" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop", label: "Starry Peaks" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", label: "Alpine Ridge" },
  { url: "https://images.unsplash.com/photo-1500534314263-0869cef25888?q=80&w=2070&auto=format&fit=crop", label: "Golden Desert" },
  { url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2070&auto=format&fit=crop", label: "Green Valley" },
  { url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop", label: "Aurora Night" },
];

export const CosmosBg: React.FC = () => {
  const { state } = useHyprStore();
  const { showCosmosParticles, backgroundUrl, backgroundIndex } = state;

  const bgSrc = backgroundUrl || BG_GALLERY[backgroundIndex % BG_GALLERY.length]?.url;

  return (
    <div className="fixed inset-0 -z-10">
      {/* Solid base */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* Background photo */}
      {showCosmosParticles && bgSrc && (
        <>
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.3 }}
            loading="eager"
          />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)",
            }}
          />
        </>
      )}

      {/* Ambient floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{
            background: "rgba(var(--accent-rgb), 1)",
            top: "20%",
            left: "15%",
            animation: "float1 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[80px]"
          style={{
            background: "rgba(var(--accent-rgb), 1)",
            bottom: "10%",
            right: "10%",
            animation: "float2 30s ease-in-out infinite",
          }}
        />
      </div>

      {/* Keyframes for floating orbs */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(60px, -40px); }
          50% { transform: translate(-30px, 60px); }
          75% { transform: translate(40px, 20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-50px, 30px); }
          66% { transform: translate(40px, -50px); }
        }
      `}</style>
    </div>
  );
};
