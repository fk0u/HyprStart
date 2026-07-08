"use client";

import React, { useState } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { CloudRain, Wind, Droplets, Sun, Cloud } from "lucide-react";

export const WeatherWidget: React.FC = () => {
  const { state, setWeatherCity } = useHyprStore();
  const { weatherCity } = state;
  const [cityInput, setCityInput] = useState(weatherCity);
  const [isEditing, setIsEditing] = useState(false);

  const [prevCity, setPrevCity] = useState(weatherCity);
  if (weatherCity !== prevCity) {
    setCityInput(weatherCity);
    setPrevCity(weatherCity);
  }

  const seed = weatherCity.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempF = 50 + (seed % 30);
  const conditions = ["Rain", "Clear", "Cloudy", "Fog", "Sunny"];
  const condition = conditions[seed % conditions.length];

  const getIcon = (cond: string) => {
    switch (cond) {
      case "Rain": return <CloudRain size={18} />;
      case "Fog": return <Droplets size={18} />;
      case "Sunny": return <Sun size={18} />;
      case "Cloudy": return <Cloud size={18} />;
      default: return <Wind size={18} />;
    }
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setWeatherCity(cityInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className="text-foreground/60">{getIcon(condition)}</div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{tempF}°F · {condition}</span>
        {isEditing ? (
          <form onSubmit={handleCitySubmit} className="flex gap-1 mt-0.5">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[11px] outline-none w-20"
              autoFocus
            />
            <button type="submit" className="text-[11px] text-accent/70 cursor-pointer">OK</button>
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[11px] text-foreground/40 text-left cursor-pointer hover:text-foreground/60 transition-colors"
          >
            {weatherCity}
          </button>
        )}
      </div>
    </div>
  );
};
