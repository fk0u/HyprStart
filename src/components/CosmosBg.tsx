"use client";

import React, { useRef, useEffect, useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  twinkleSpeed: number;
}

export const CosmosBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useHyprStore();
  const { theme, showCosmosParticles } = state;
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle mouse move for parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouse((prev) => ({ ...prev, targetX: x, targetY: y }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate mouse coordinates for smooth parallax inertia
  useEffect(() => {
    if (!showCosmosParticles) return;
    let animationFrameId: number;
    
    const updateMouse = () => {
      setMouse((prev) => {
        const dx = prev.targetX - prev.x;
        const dy = prev.targetY - prev.y;
        return {
          ...prev,
          x: prev.x + dx * 0.05,
          y: prev.y + dy * 0.05,
        };
      });
      animationFrameId = requestAnimationFrame(updateMouse);
    };

    updateMouse();
    return () => cancelAnimationFrame(animationFrameId);
  }, [showCosmosParticles]);

  // Star initialization and canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const density = Math.floor((canvas.width * canvas.height) / 10000);
      const starCount = Math.min(density, 150); // Cap star count for performance
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.05 + 0.02,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Get color theme overrides for nebula accents
    const getNebulaColors = (t: string) => {
      switch (t) {
        case "nord":
          return {
            nebulaA: "rgba(136, 192, 208, 0.04)", // frost blue
            nebulaB: "rgba(76, 86, 106, 0.03)",
            starColor: "#d8dee9",
          };
        case "cyber-cyan":
          return {
            nebulaA: "rgba(0, 255, 255, 0.05)", // pure neon cyan
            nebulaB: "rgba(0, 139, 139, 0.03)",
            starColor: "#00ffff",
          };
        case "gruvbox":
          return {
            nebulaA: "rgba(250, 189, 47, 0.04)", // amber/gold
            nebulaB: "rgba(168, 153, 132, 0.03)",
            starColor: "#ebdbb2",
          };
        case "tokyo-night":
        default:
          return {
            nebulaA: "rgba(6, 182, 212, 0.05)", // blue cyan
            nebulaB: "rgba(15, 23, 42, 0.05)",
            starColor: "#c0caf5",
          };
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;

      const colors = getNebulaColors(theme);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showCosmosParticles) return;

      // 1. Draw Nebula Glows (Shifting radial gradients representing gas clouds)
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3 + mouse.x * 50,
        canvas.height * 0.4 + mouse.y * 50,
        10,
        canvas.width * 0.3 + mouse.x * 50,
        canvas.height * 0.4 + mouse.y * 50,
        Math.max(canvas.width, canvas.height) * 0.6
      );
      gradient.addColorStop(0, colors.nebulaA);
      gradient.addColorStop(0.5, colors.nebulaB);
      gradient.addColorStop(1, "transparent");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 - mouse.x * 60,
        canvas.height * 0.6 - mouse.y * 60,
        50,
        canvas.width * 0.7 - mouse.x * 60,
        canvas.height * 0.6 - mouse.y * 60,
        Math.max(canvas.width, canvas.height) * 0.5
      );
      gradient2.addColorStop(0, colors.nebulaA);
      gradient2.addColorStop(0.5, "transparent");
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Stars with Parallax
      stars.forEach((star) => {
        // Apply parallax offset based on star size (larger = closer = more parallax)
        const parallaxFactor = star.size * 12;
        let starX = star.x - mouse.x * parallaxFactor;
        let starY = star.y - mouse.y * parallaxFactor;

        // Wrap stars around bounds
        if (starX < 0) starX += canvas.width;
        if (starX > canvas.width) starX -= canvas.width;
        if (starY < 0) starY += canvas.height;
        if (starY > canvas.height) starY -= canvas.height;

        // Twinkle effect (sine wave alpha transition)
        star.alpha += star.twinkleSpeed;
        const currentAlpha = Math.abs(Math.sin(star.alpha));

        ctx.fillStyle = colors.starColor;
        ctx.globalAlpha = currentAlpha;
        
        ctx.beginPath();
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0; // Reset alpha
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme, showCosmosParticles, mouse.x, mouse.y]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Background radial gradient mesh */}
      <div className="absolute inset-0 bg-background transition-colors duration-500 ease-in-out" />
      
      {/* Dynamic starfield canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      
      {/* Scanline mesh pattern layer */}
      <div className="absolute inset-0 scanline-grid pointer-events-none opacity-80" />

      {/* Cybernetic HUD layout accents */}
      <div className="absolute inset-x-8 top-8 h-[1px] bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-20 pointer-events-none" />
      <div className="absolute inset-x-8 bottom-8 h-[1px] bg-gradient-to-r from-transparent via-accent-glow to-transparent opacity-20 pointer-events-none" />
    </div>
  );
};
