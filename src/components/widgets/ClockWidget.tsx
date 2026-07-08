"use client";

import React, { useState, useEffect } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";

export const ClockWidget: React.FC = () => {
  const { state, setUse24hFormat } = useHyprStore();
  const { use24hFormat } = state;
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTimeout(() => setTime(new Date()), 0);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const hoursVal = time.getHours();
  const ampm = hoursVal >= 12 ? "PM" : "AM";
  let displayHours = hoursVal;
  if (!use24hFormat) {
    displayHours = hoursVal % 12;
    if (displayHours === 0) displayHours = 12;
  }

  const hours = displayHours.toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  // Greeting based on time of day
  const getGreeting = () => {
    if (hoursVal < 6) return "Good Night";
    if (hoursVal < 12) return "Good Morning";
    if (hoursVal < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={() => setUse24hFormat(!use24hFormat)}
      className="flex flex-col items-center select-none cursor-pointer"
    >
      {/* Big time */}
      <div className="flex items-baseline">
        <span className="text-[7rem] md:text-[8.5rem] font-extralight leading-none tracking-tighter">
          {hours}:{minutes}
        </span>
        {!use24hFormat && (
          <span className="text-lg font-light text-foreground/50 ml-2 self-start mt-6">
            {ampm}
          </span>
        )}
      </div>

      {/* Greeting */}
      <p className="text-xl md:text-2xl font-light text-foreground/70 mt-2">
        {getGreeting()}
      </p>

      {/* Date */}
      <p className="text-sm text-foreground/40 mt-1">{dateStr}</p>
    </div>
  );
};
