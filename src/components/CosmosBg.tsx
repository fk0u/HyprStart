"use client";

import React from "react";
import { useHyprStore } from "@/hooks/useHyprStore";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Mountain sunrise
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2070&auto=format&fit=crop", // Misty forest
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop", // Beach
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop", // Valley sunrise
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop", // Starry mountain
];

export const CosmosBg: React.FC = () => {
  const { state } = useHyprStore();
  const { showCosmosParticles } = state;

  // Use a seeded index based on the current date so it changes daily
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % BG_IMAGES.length;
  const bgUrl = BG_IMAGES[dayIndex];

  return (
    <div className="fixed inset-0 -z-10">
      {/* Solid color base */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* Background photo — toggleable */}
      {showCosmosParticles && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: 0.35 }}
            loading="eager"
          />
          {/* Darken vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </>
      )}
    </div>
  );
};
