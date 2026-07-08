"use client";

import React, { useState, useEffect } from "react";
import { useHyprStore } from "@/hooks/useHyprStore";
import { CloudRain, Wind, Droplets, Sun, Cloud, Navigation, RotateCw } from "lucide-react";

export const WeatherWidget: React.FC = () => {
  const { state, fetchWeather } = useHyprStore();
  const { weatherCity, weatherTemp, weatherCondition, weatherHumidity, weatherWind } = state;
  const [cityInput, setCityInput] = useState(weatherCity);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(weatherTemp === null);

  // Initial fetch on mount if needed
  useEffect(() => {
    let active = true;
    if (weatherTemp === null) {
      fetchWeather(weatherCity).then(() => {
        if (active) setLoading(false);
      });
    }
    return () => {
      active = false;
    };
  }, [weatherCity, weatherTemp, fetchWeather]);

  const getIcon = (cond: string | null) => {
    switch (cond) {
      case "Rain": return <CloudRain size={16} />;
      case "Fog": return <Droplets size={16} />;
      case "Sunny": return <Sun size={16} />;
      case "Cloudy": return <Cloud size={16} />;
      default: return <Wind size={16} />;
    }
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setLoading(true);
    fetchWeather(cityInput.trim()).finally(() => {
      setLoading(false);
      setIsEditing(false);
    });
  };

  const triggerGpsLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }).then(() => {
          setLoading(false);
        });
      },
      (err) => {
        console.error("GPS location permission denied", err);
        setLoading(false);
      }
    );
  };

  const triggerRefresh = () => {
    setLoading(true);
    fetchWeather(weatherCity).finally(() => setLoading(false));
  };

  const toggleEditing = () => {
    setCityInput(weatherCity);
    setIsEditing((p) => !p);
  };

  return (
    <div className="flex items-center gap-3 select-none text-xs">
      <div className="text-foreground/60 shrink-0">
        {loading ? (
          <RotateCw size={16} className="animate-spin text-accent/60" />
        ) : (
          getIcon(weatherCondition)
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-medium">
          <span>
            {weatherTemp !== null ? `${weatherTemp}°C` : "--°C"}
          </span>
          <span className="opacity-40">·</span>
          <span className="text-foreground/60">
            {weatherCondition || "Loading..."}
          </span>
          {weatherHumidity !== null && (
            <>
              <span className="opacity-40">·</span>
              <span className="text-foreground/50" title="Humidity">{weatherHumidity}% RH</span>
            </>
          )}
          {weatherWind !== null && (
            <>
              <span className="opacity-40">·</span>
              <span className="text-foreground/50" title="Wind speed">{weatherWind} km/h</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-foreground/40 mt-0.5">
          {isEditing ? (
            <form onSubmit={handleCitySubmit} className="flex gap-1.5 items-center">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 outline-none w-20 text-[10px]"
                autoFocus
              />
              <button type="submit" className="text-[10px] text-accent/80 hover:text-accent cursor-pointer">Set</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-[10px] hover:text-foreground/60 cursor-pointer">Esc</button>
            </form>
          ) : (
            <>
              <button
                onClick={toggleEditing}
                className="hover:text-foreground/60 cursor-pointer transition-colors max-w-[80px] truncate"
                title="Change location"
              >
                {weatherCity}
              </button>
              <span className="opacity-50">·</span>
              <button
                onClick={triggerGpsLocate}
                className="hover:text-foreground/60 cursor-pointer transition-colors"
                title="Locate via GPS"
              >
                <Navigation size={10} />
              </button>
              <span className="opacity-50">·</span>
              <button
                onClick={triggerRefresh}
                className="hover:text-foreground/60 cursor-pointer transition-colors"
                title="Refresh weather"
              >
                <RotateCw size={10} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
