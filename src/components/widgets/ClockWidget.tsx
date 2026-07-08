"use client";

import React, { useState, useEffect } from "react";
import { Clock, Cpu } from "lucide-react";

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [startTime] = useState(() => Date.now());
  const [uptime, setUptime] = useState("00h 00m 00s");

  useEffect(() => {
    const initialTime = new Date();
    setTimeout(() => setTime(initialTime), 0);
    const interval = setInterval(() => {
      setTime(new Date());

      // Calculate simulated uptime
      const elapsed = Date.now() - startTime;
      const secs = Math.floor(elapsed / 1000) % 60;
      const mins = Math.floor(elapsed / (1000 * 60)) % 60;
      const hrs = Math.floor(elapsed / (1000 * 60 * 60));
      
      const pad = (n: number) => n.toString().padStart(2, "0");
      setUptime(`${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`);
    }, 33); // High refresh rate for millisecond tracking

    return () => clearInterval(interval);
  }, [startTime]);

  if (!time) return null;

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ms = time.getMilliseconds().toString().padStart(3, "0");

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = time.toLocaleDateString("en-US", dateOptions).toUpperCase();

  return (
    <div className="flex flex-col h-full justify-between font-mono select-none">
      {/* Date Header */}
      <div className="flex justify-between items-center text-[10px] text-text-muted border-b border-card-border/30 pb-2">
        <span className="flex items-center gap-1.5 uppercase font-bold text-accent/90">
          <Clock size={10} />
          DATETIME::NODE_LOCAL
        </span>
        <span>{formattedDate}</span>
      </div>

      {/* Main Time Counter */}
      <div className="flex items-baseline justify-center py-3 select-all">
        <span className="text-3xl font-black tracking-widest text-accent cyber-glitch-text">
          {hours}:{minutes}:{seconds}
        </span>
        <span className="text-xs font-bold text-text-muted ml-1.5 opacity-80">
          .{ms}
        </span>
      </div>

      {/* Workspace Health Stats / Uptime */}
      <div className="flex justify-between items-center text-[9px] text-text-muted border-t border-card-border/20 pt-2">
        <span className="flex items-center gap-1">
          <Cpu size={9} className="text-accent/60" />
          SYS_UP: {uptime}
        </span>
        <span className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-500/20 text-[8px]">
          STATUS::OK
        </span>
      </div>
    </div>
  );
};
