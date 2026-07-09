"use client";

import React, { useState, useEffect, useRef } from "react";
import { Battery, Cpu, Activity, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface BatteryStatus {
  charging: boolean;
  level: number;
}

export const SystemTelemetry: React.FC = () => {
  const [battery, setBattery] = useState<BatteryStatus | null>(null);
  const [ramUsage, setRamUsage] = useState<string>("3.2 GB");
  const [showPopup, setShowPopup] = useState(false);
  const [uptime, setUptime] = useState("00:00");
  const [currentCpu, setCurrentCpu] = useState(25);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cpuHistoryRef = useRef<number[]>([15, 22, 18, 30, 25, 40, 35, 28, 42, 38, 45, 52, 48, 50, 55]);
  const startTimeRef = useRef<number>(0);

  // 1. Uptime Counter
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const diffSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const mins = Math.floor(diffSecs / 60).toString().padStart(2, "0");
      const secs = (diffSecs % 60).toString().padStart(2, "0");
      setUptime(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Battery Status API
  useEffect(() => {
    const getBatteryInfo = async () => {
      interface NavigatorWithBattery extends Navigator {
        getBattery?: () => Promise<{
          charging: boolean;
          level: number;
          onchargingchange: (() => void) | null;
          onlevelchange: (() => void) | null;
        }>;
      }
      const nav = navigator as NavigatorWithBattery;
      if (nav.getBattery) {
        try {
          const batt = await nav.getBattery();
          
          const updateBattery = () => {
            setBattery({
              charging: batt.charging,
              level: batt.level * 100,
            });
          };

          updateBattery();
          batt.onchargingchange = updateBattery;
          batt.onlevelchange = updateBattery;

          return () => {
            batt.onchargingchange = null;
            batt.onlevelchange = null;
          };
        } catch (e) {
          console.warn("Battery status API failed", e);
        }
      } else {
        // Fallback for Firefox/Safari
        setBattery({ charging: false, level: 82 });
      }
    };

    getBatteryInfo();
  }, []);

  // 3. RAM Heap & Canvas CPU Graph drawer
  useEffect(() => {
    const updateRamAndCpu = () => {
      // RAM Calculation
      interface PerformanceWithMemory extends Performance {
        memory?: {
          usedJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
      const perf = (performance as PerformanceWithMemory).memory;
      let ratio = 0.2;
      if (perf) {
        const usedJSHeap = perf.usedJSHeapSize;
        const limit = perf.jsHeapSizeLimit;
        const totalSim = 16;
        ratio = usedJSHeap / limit;
        const simulatedUsed = (4.0 + ratio * 6).toFixed(1);
        setRamUsage(`${simulatedUsed} GB / ${totalSim} GB`);
      } else {
        const randomUsed = (4.1 + Math.random() * 0.4).toFixed(1);
        setRamUsage(`${randomUsed} GB / 16 GB`);
      }

      // CPU Simulation fluctuation
      const newCpuValue = Math.round(15 + Math.random() * 45 + ratio * 20);
      const history = cpuHistoryRef.current;
      history.push(newCpuValue);
      if (history.length > 20) {
        history.shift();
      }
      setCurrentCpu(newCpuValue);

      // Draw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
          ctx.lineWidth = 1;
          for (let i = 1; i < 4; i++) {
            const yLine = (h / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, yLine);
            ctx.lineTo(w, yLine);
            ctx.stroke();
          }

          // Path line
          const points = cpuHistoryRef.current;
          ctx.beginPath();
          const step = w / (points.length - 1);
          
          points.forEach((val, idx) => {
            // CPU value mapped: 0% is bottom (h), 100% is top (0)
            const x = idx * step;
            const y = h - (val / 100) * h;
            if (idx === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });

          // Glow stroke
          ctx.strokeStyle = "rgba(122, 162, 247, 0.65)"; // Accent tokyo night style
          ctx.lineWidth = 2;
          ctx.stroke();

          // Gradient fill
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          const gradient = ctx.createLinearGradient(0, 0, 0, h);
          gradient.addColorStop(0, "rgba(122, 162, 247, 0.15)");
          gradient.addColorStop(1, "rgba(122, 162, 247, 0.0)");
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    };

    updateRamAndCpu();
    const interval = setInterval(updateRamAndCpu, 2000);
    return () => clearInterval(interval);
  }, [showPopup]);

  return (
    <div className="relative select-none z-30">
      {/* Mini status indicator bar */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="flex items-center gap-3 text-xs text-foreground/45 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl hover:bg-white/[0.05] hover:text-foreground/75 cursor-pointer transition-all"
        title="View System Monitor"
      >
        {/* Battery status */}
        {battery && (
          <div className="flex items-center gap-1.5" title={battery.charging ? "Battery Charging" : "Battery Discharging"}>
            <Battery size={13} className={battery.charging ? "text-green-400/80 animate-pulse" : "text-foreground/40"} />
            <span className="font-medium text-[11px]">{Math.round(battery.level)}%</span>
          </div>
        )}

        <span className="opacity-30">·</span>

        {/* RAM Heap usage */}
        <div className="flex items-center gap-1.5">
          <Cpu size={13} className="text-foreground/40" />
          <span className="font-medium text-[11px]">{ramUsage.split(" / ")[0]}</span>
        </div>
      </button>

      {/* Floating System Monitor Popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Click outside backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowPopup(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-3.5 z-50 bg-card-bg/95 backdrop-blur-xl border border-card-border p-4 rounded-2xl shadow-2xl w-60"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/60 flex items-center gap-1.5">
                  <Activity size={12} className="text-sky-400" />
                  System Monitor
                </span>
                <span className="text-[9px] font-mono text-foreground/35 flex items-center gap-1">
                  <Clock size={10} />
                  UP: {uptime}
                </span>
              </div>

              {/* Real-time Line Graph Canvas */}
              <div className="bg-black/25 rounded-xl border border-white/[0.03] p-2 mb-3.5 flex items-center justify-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={60}
                  className="w-full h-[60px]"
                />
              </div>

              {/* Performance details */}
              <div className="space-y-2 text-[10px] font-mono text-foreground/50">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>RAM Usage</span>
                  <span className="text-foreground/80 font-bold">{ramUsage}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>CPU Load (Sim)</span>
                  <span className="text-foreground/80 font-bold">
                    {currentCpu}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Workers</span>
                  <span className="text-foreground/80 font-bold">4 Threads</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
