"use client";

import React from "react";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { EyeOff, GripHorizontal } from "lucide-react";
import { useHyprStore } from "@/hooks/useHyprStore";

interface WidgetContainerProps {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  x,
  y,
  w,
  h,
  children,
}) => {
  const { updateWidgetPosition, toggleWidget } = useHyprStore();
  const dragControls = useDragControls();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Calculate new position bounded to screen edges
    const newX = Math.max(10, Math.min(window.innerWidth - w - 10, x + info.offset.x));
    const newY = Math.max(10, Math.min(window.innerHeight - h - 10, y + info.offset.y));
    updateWidgetPosition(id, newX, newY, w, h);
  };

  return (
    <motion.div
      // Use coordinate key to reset motion translate values after drop
      key={`${id}-${x}-${y}-${w}-${h}`}
      drag
      dragControls={dragControls}
      dragListener={false} // Only drag using the title bar handle
      dragMomentum={false}
      dragElastic={0.05}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        position: "absolute",
        zIndex: id === "clock" ? 10 : 20, // default layering
      }}
      onDragEnd={handleDragEnd}
      className="glass-panel glow-bar-top flex flex-col rounded-sm border border-card-border bg-card-bg text-foreground overflow-hidden pointer-events-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Title Bar / Drag Handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-card-border/60 cursor-grab active:cursor-grabbing select-none text-[10px] font-mono tracking-wider text-text-muted hover:text-foreground transition-colors group"
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal size={10} className="text-accent/50 group-hover:text-accent transition-colors" />
          <span className="font-semibold text-accent/80 group-hover:text-accent transition-colors">
            HYPR::{id.toUpperCase()}
          </span>
          <span className="opacity-40">|</span>
          <span className="opacity-60">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick status decoration */}
          <span className="w-1.5 h-1.5 rounded-full bg-accent/80 animate-pulse shadow-[0_0_6px_var(--accent)]" />
          
          <button
            onClick={() => toggleWidget(id)}
            title="Minimize Widget"
            className="p-0.5 rounded hover:bg-white/10 hover:text-accent transition-all cursor-pointer pointer-events-auto"
          >
            <EyeOff size={11} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden min-h-0 select-text">
        {children}
      </div>

      {/* Resize Indicator (Visual decor only - fully modular resize is custom per-widget settings) */}
      <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize flex items-end justify-end p-0.5 opacity-30 hover:opacity-100 transition-opacity">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M6 0L0 6M6 3L3 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </motion.div>
  );
};
