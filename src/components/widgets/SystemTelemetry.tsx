"use client";

import React, { useState, useEffect } from "react";
import { Battery, Cpu } from "lucide-react";

interface BatteryStatus {
  charging: boolean;
  level: number;
}

export const SystemTelemetry: React.FC = () => {
  const [battery, setBattery] = useState<BatteryStatus | null>(null);
  const [ramUsage, setRamUsage] = useState<string>("3.2 GB");

  useEffect(() => {
    // 1. Get Battery Status (supported in Chrome/Edge/Opera/Android)
    const getBatteryInfo = async () => {
      interface NavigatorWithBattery extends Navigator {
        getBattery?: () => Promise<{
          charging: boolean;
          level: number;
          addEventListener: (type: string, listener: () => void) => void;
          removeEventListener: (type: string, listener: () => void) => void;
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
          batt.addEventListener("chargingchange", updateBattery);
          batt.addEventListener("levelchange", updateBattery);

          return () => {
            batt.removeEventListener("chargingchange", updateBattery);
            batt.removeEventListener("levelchange", updateBattery);
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

  useEffect(() => {
    // 2. RAM Heap usage (supported in Chrome/Blink browsers via performance.memory)
    const updateRamUsage = () => {
      interface PerformanceWithMemory extends Performance {
        memory?: {
          usedJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
      const perf = (performance as PerformanceWithMemory).memory;
      if (perf) {
        const usedJSHeap = perf.usedJSHeapSize; // bytes
        const limit = perf.jsHeapSizeLimit;
        // Scale to simulate total RAM usage based on heap activity (e.g. 4.2 GB used of 16 GB)
        const totalSim = 16;
        const ratio = usedJSHeap / limit;
        const simulatedUsed = (4.0 + ratio * 6).toFixed(1);
        setRamUsage(`${simulatedUsed} GB / ${totalSim} GB`);
      } else {
        // Fallback simulation
        const randomUsed = (4.1 + Math.random() * 0.4).toFixed(1);
        setRamUsage(`${randomUsed} GB / 16 GB`);
      }
    };

    updateRamUsage();
    const interval = setInterval(updateRamUsage, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs text-foreground/45 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl">
      {/* Battery status */}
      {battery && (
        <div className="flex items-center gap-1.5" title={battery.charging ? "Battery Charging" : "Battery Discharging"}>
          <Battery size={13} className={battery.charging ? "text-green-400/80 animate-pulse" : "text-foreground/40"} />
          <span className="font-medium text-[11px]">{Math.round(battery.level)}%</span>
        </div>
      )}

      <span className="opacity-30">·</span>

      {/* RAM Heap usage */}
      <div className="flex items-center gap-1.5" title="Simulated RAM memory usage">
        <Cpu size={13} className="text-foreground/40" />
        <span className="font-medium text-[11px]">{ramUsage}</span>
      </div>
    </div>
  );
};
