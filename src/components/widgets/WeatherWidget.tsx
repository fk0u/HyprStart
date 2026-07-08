"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { CloudRain, Wind, Droplets, Sun, Cloud } from "lucide-react";

export const WeatherWidget: React.FC = () => {
  const { state, setWeatherCity } = useHyprStore();
  const { weatherCity } = state;
  const [cityInput, setCityInput] = useState(weatherCity);
  const [isEditing, setIsEditing] = useState(false);

  // Sync state if weatherCity updates from store
  const [prevCity, setPrevCity] = useState(weatherCity);
  if (weatherCity !== prevCity) {
    setCityInput(weatherCity);
    setPrevCity(weatherCity);
  }

  // Derive weather telemetry values synchronously during render
  const seed = weatherCity.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const temp = 15 + (seed % 20); // 15 to 35 C
  const humidity = 40 + (seed % 50); // 40% to 90%
  const windSpeed = 5 + (seed % 25); // 5 to 30 km/h
  const conditions = ["ACID_RAIN", "CLEAR_DUST", "OVERCAST_CHROME", "NEON_FOG", "SOLAR_GLARE"];
  const condition = conditions[seed % conditions.length];

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const currentDayIdx = typeof window !== "undefined" ? new Date().getDay() : 1;

  const forecast = Array.from({ length: 3 }).map((_, idx) => {
    const forecastSeed = seed + idx;
    const forecastTemp = temp + (forecastSeed % 6) - 3;
    const forecastCond = conditions[forecastSeed % conditions.length];
    return {
      day: days[(currentDayIdx + idx + 1) % 7],
      temp: forecastTemp,
      icon: forecastCond,
    };
  });

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setWeatherCity(cityInput.trim());
    setIsEditing(false);
  };

  const getWeatherIcon = (cond: string, size = 16) => {
    switch (cond) {
      case "ACID_RAIN":
        return <CloudRain size={size} className="text-accent" />;
      case "NEON_FOG":
        return <Droplets size={size} className="text-accent/80" />;
      case "SOLAR_GLARE":
        return <Sun size={size} className="text-amber-400 shadow-[0_0_8px_rgba(250,189,47,0.4)]" />;
      case "OVERCAST_CHROME":
        return <Cloud size={size} className="text-text-muted" />;
      case "CLEAR_DUST":
      default:
        return <Wind size={size} className="text-accent/60" />;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between font-mono text-xs select-none">
      {/* Telemetry Header */}
      <div className="flex justify-between items-center text-[10px] text-text-muted border-b border-card-border/30 pb-2">
        {isEditing ? (
          <form onSubmit={handleCitySubmit} className="flex gap-1 items-center w-full">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="bg-black/60 border border-card-border/50 rounded px-1.5 py-0.5 text-foreground text-[9px] w-24 outline-none focus:border-accent"
              autoFocus
            />
            <button type="submit" className="text-accent hover:underline text-[9px] cursor-pointer">[SET]</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-text-muted hover:underline text-[9px] cursor-pointer">[ESC]</button>
          </form>
        ) : (
          <>
            <span
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 uppercase font-bold text-accent/90 cursor-pointer hover:text-accent"
              title="Click to change location"
            >
              LOC::{weatherCity.toUpperCase()} ✎
            </span>
            <span className="text-[9px] text-text-muted">ATMOSPHERE_STATS</span>
          </>
        )}
      </div>

      {/* Temperature Display */}
      <div className="flex items-center justify-between py-2 select-text">
        <div className="flex flex-col">
          <span className="text-[9px] text-text-muted">SURFACE_TEMP</span>
          <div className="flex items-baseline text-2xl font-bold text-foreground">
            {temp}
            <span className="text-xs text-accent font-light ml-0.5">°C</span>
          </div>
        </div>

        {/* Condition Icon Block */}
        <div className="flex flex-col items-center gap-1 bg-black/40 border border-card-border/20 px-2.5 py-1.5 rounded">
          {getWeatherIcon(condition, 24)}
          <span className="text-[8px] font-bold text-accent tracking-wider">
            {condition}
          </span>
        </div>
      </div>

      {/* Atmospheric specs */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-text-muted py-1.5 border-t border-b border-card-border/10 bg-slate-900/10 rounded px-2">
        <div className="flex items-center gap-1.5">
          <Droplets size={10} className="text-accent/60" />
          <span>HUMIDITY: <span className="text-foreground">{humidity}%</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind size={10} className="text-accent/60" />
          <span>WIND: <span className="text-foreground">{windSpeed}KM/H</span></span>
        </div>
      </div>

      {/* Forecast row */}
      <div className="flex justify-between items-center pt-2">
        {forecast.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1 rounded bg-black/30 border border-card-border/10 text-[9px] text-text-muted flex-1 mx-0.5 justify-center"
          >
            <span className="font-bold">{f.day}</span>
            {getWeatherIcon(f.icon, 10)}
            <span className="text-foreground">{f.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
