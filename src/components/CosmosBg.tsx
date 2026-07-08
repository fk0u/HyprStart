/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useEffect } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useHyprStore();
  const { showCosmosParticles, backgroundUrl, backgroundIndex, weatherCondition } = state;

  const bgSrc = backgroundUrl || BG_GALLERY[backgroundIndex % BG_GALLERY.length]?.url;

  const condition = weatherCondition || "Clear";

  // Dynamic Weather Canvas Backdrops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface WeatherParticle {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
    }

    // Weather particles initialization
    const particles: WeatherParticle[] = [];
    const particleCount = condition === "Rain" ? 90 : condition === "Fog" ? 30 : condition === "Cloudy" ? 6 : 40; // cap count for performance

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        if (condition === "Rain") {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height - height,
            len: Math.random() * 20 + 15,
            speed: Math.random() * 12 + 10,
            angle: Math.random() * 2 - 1, // falling drift
            r: 0,
            vx: 0,
            vy: 0,
            alpha: 0,
            size: 0,
          });
        } else if (condition === "Fog") {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 150 + 80,
            vx: Math.random() * 0.2 - 0.1,
            vy: Math.random() * 0.1 - 0.05,
            alpha: Math.random() * 0.08 + 0.02,
            len: 0,
            speed: 0,
            angle: 0,
            size: 0,
          });
        } else if (condition === "Cloudy") {
          particles.push({
            x: Math.random() * width * 1.5 - width * 0.25,
            y: Math.random() * height * 0.4,
            r: Math.random() * 200 + 100,
            speed: Math.random() * 0.15 + 0.05,
            alpha: Math.random() * 0.06 + 0.02,
            len: 0,
            angle: 0,
            vx: 0,
            vy: 0,
            size: 0,
          });
        } else {
          // Clear / Sunny Stars
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005,
            len: 0,
            angle: 0,
            r: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initParticles();

    // Solar flares/rays variables
    let rayAngle = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with transparent overlays to allow background image to bleed through
      ctx.clearRect(0, 0, width, height);

      if (condition === "Rain") {
        ctx.strokeStyle = "rgba(174, 219, 240, 0.22)";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";

        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.angle, p.y + p.len);
          ctx.stroke();

          p.y += p.speed;
          p.x += p.angle;

          if (p.y > height) {
            p.y = -p.len;
            p.x = Math.random() * width;
          }
        });
      } else if (condition === "Fog") {
        particles.forEach((p) => {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.r > width) p.x = -p.r;
          if (p.x + p.r < 0) p.x = width + p.r;
          if (p.y - p.r > height) p.y = -p.r;
          if (p.y + p.r < 0) p.y = height + p.r;
        });
      } else if (condition === "Cloudy") {
        particles.forEach((p) => {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(0.5, `rgba(255, 255, 255, ${p.alpha * 0.4})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speed;
          if (p.x - p.r > width) {
            p.x = -p.r;
            p.y = Math.random() * height * 0.4;
          }
        });
      } else if (condition === "Sunny") {
        // Soft pulsing solar light rays in the top-right corner
        rayAngle += 0.002;
        const centerX = width * 0.85;
        const centerY = height * 0.15;
        const maxRadius = Math.max(width, height) * 0.45;

        // Draw radial warm sun glow
        const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        glowGrad.addColorStop(0, "rgba(253, 224, 71, 0.06)");
        glowGrad.addColorStop(0.5, "rgba(253, 224, 71, 0.01)");
        glowGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);

        // Render rotating clean vector light rays
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rayAngle);
        
        ctx.fillStyle = "rgba(253, 224, 71, 0.015)";
        const numRays = 8;
        for (let i = 0; i < numRays; i++) {
          ctx.rotate((Math.PI * 2) / numRays);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-25, maxRadius);
          ctx.lineTo(25, maxRadius);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else {
        // Clear: Soft drifting stars
        particles.forEach((p) => {
          p.alpha += p.speed;
          const currentAlpha = Math.abs(Math.sin(p.alpha)) * 0.6;

          ctx.fillStyle = "rgba(255, 255, 255, " + currentAlpha + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [condition]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* Image layer */}
      {showCosmosParticles && bgSrc && (
        <>
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ opacity: 0.3 }}
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)",
            }}
          />
        </>
      )}

      {/* Dynamic weather canvas animation overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-80" />

      {/* Ambient floating orbs (Only visible on Clear/Sunny/Cloudy) */}
      {condition !== "Rain" && condition !== "Fog" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.035] blur-[100px]"
            style={{
              background: "rgba(var(--accent-rgb), 1)",
              top: "20%",
              left: "15%",
              animation: "float1 25s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-[0.025] blur-[80px]"
            style={{
              background: "rgba(var(--accent-rgb), 1)",
              bottom: "10%",
              right: "10%",
              animation: "float2 30s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(50px, -30px); }
          50% { transform: translate(-20px, 50px); }
          75% { transform: translate(30px, 15px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-40px, 20px); }
          66% { transform: translate(30px, -40px); }
        }
      `}</style>
    </div>
  );
};
