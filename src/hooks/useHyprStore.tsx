"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WidgetState {
  id: string;
  visible: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  lang: string;
}

export interface HyprState {
  theme: string;
  widgets: WidgetState[];
  bookmarks: Bookmark[];
  todoList: TodoItem[];
  snippets: CodeSnippet[];
  weatherCity: string;
  weatherTemp: number | null;
  weatherCondition: string | null;
  weatherHumidity: number | null;
  weatherWind: number | null;
  showCosmosParticles: boolean;
  use24hFormat: boolean;
  // Personalization
  userName: string;
  focusGoal: string;
  backgroundUrl: string;
  backgroundIndex: number;
}

export interface HyprContextType {
  state: HyprState;
  setTheme: (theme: string) => void;
  toggleWidget: (id: string) => void;
  updateWidgetPosition: (id: string, x: number, y: number, w?: number, h?: number) => void;
  addBookmark: (title: string, url: string) => void;
  deleteBookmark: (id: string) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addSnippet: (title: string, code: string, lang: string) => void;
  deleteSnippet: (id: string) => void;
  setWeatherCity: (city: string) => void;
  fetchWeather: (cityOrCoords: string | { lat: number; lon: number }) => Promise<void>;
  toggleCosmosParticles: () => void;
  setUse24hFormat: (val: boolean) => void;
  importConfig: (config: string) => boolean;
  exportConfig: () => void;
  resetConfig: () => void;
  // Personalization
  setUserName: (name: string) => void;
  setFocusGoal: (goal: string) => void;
  setBackgroundUrl: (url: string) => void;
  setBackgroundIndex: (index: number) => void;
}

const DEFAULT_WIDGETS: WidgetState[] = [
  { id: "clock", visible: true, x: 40, y: 40, w: 340, h: 170 },
  { id: "todo", visible: true, x: 40, y: 230, w: 340, h: 360 },
  { id: "bookmarks", visible: true, x: 400, y: 40, w: 460, h: 220 },
  { id: "snippets", visible: true, x: 400, y: 280, w: 460, h: 310 },
  { id: "crypto", visible: true, x: 880, y: 40, w: 360, h: 270 },
  { id: "weather", visible: true, x: 880, y: 330, w: 360, h: 260 },
];

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: "1", title: "GitHub", url: "https://github.com" },
  { id: "2", title: "Reddit", url: "https://reddit.com" },
  { id: "3", title: "YouTube", url: "https://youtube.com" },
  { id: "4", title: "Twitter", url: "https://twitter.com" },
  { id: "5", title: "Google", url: "https://google.com" },
];

const DEFAULT_TODOS: TodoItem[] = [
  { id: "1", text: "Set up your name (click the greeting!)", completed: false },
  { id: "2", text: "Choose a wallpaper in settings", completed: false },
  { id: "3", text: "Set your daily focus goal", completed: false },
];

const DEFAULT_SNIPPETS: CodeSnippet[] = [];

const INITIAL_STATE: HyprState = {
  theme: "tokyo-night",
  widgets: DEFAULT_WIDGETS,
  bookmarks: DEFAULT_BOOKMARKS,
  todoList: DEFAULT_TODOS,
  snippets: DEFAULT_SNIPPETS,
  weatherCity: "Jakarta",
  weatherTemp: null,
  weatherCondition: null,
  weatherHumidity: null,
  weatherWind: null,
  showCosmosParticles: true,
  use24hFormat: false,
  userName: "",
  focusGoal: "",
  backgroundUrl: "",
  backgroundIndex: 0,
};

const HyprContext = createContext<HyprContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "hyprstart_dotfiles";

const mergeState = (parsed: Record<string, unknown>): HyprState => ({
  theme: (parsed.theme as string) || INITIAL_STATE.theme,
  widgets: Array.isArray(parsed.widgets) && parsed.widgets.length ? parsed.widgets : INITIAL_STATE.widgets,
  bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : INITIAL_STATE.bookmarks,
  todoList: Array.isArray(parsed.todoList) ? parsed.todoList : INITIAL_STATE.todoList,
  snippets: Array.isArray(parsed.snippets) ? parsed.snippets : INITIAL_STATE.snippets,
  weatherCity: (parsed.weatherCity as string) || INITIAL_STATE.weatherCity,
  weatherTemp: typeof parsed.weatherTemp === "number" ? parsed.weatherTemp : INITIAL_STATE.weatherTemp,
  weatherCondition: (parsed.weatherCondition as string) || INITIAL_STATE.weatherCondition,
  weatherHumidity: typeof parsed.weatherHumidity === "number" ? parsed.weatherHumidity : INITIAL_STATE.weatherHumidity,
  weatherWind: typeof parsed.weatherWind === "number" ? parsed.weatherWind : INITIAL_STATE.weatherWind,
  showCosmosParticles: parsed.showCosmosParticles !== undefined ? (parsed.showCosmosParticles as boolean) : INITIAL_STATE.showCosmosParticles,
  use24hFormat: parsed.use24hFormat !== undefined ? (parsed.use24hFormat as boolean) : INITIAL_STATE.use24hFormat,
  userName: (parsed.userName as string) ?? INITIAL_STATE.userName,
  focusGoal: (parsed.focusGoal as string) ?? INITIAL_STATE.focusGoal,
  backgroundUrl: (parsed.backgroundUrl as string) ?? INITIAL_STATE.backgroundUrl,
  backgroundIndex: typeof parsed.backgroundIndex === "number" ? parsed.backgroundIndex : INITIAL_STATE.backgroundIndex,
});

export const HyprProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HyprState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setState(mergeState(parsed));
          setIsLoaded(true);
        }, 0);
        return;
      }
    } catch (e) {
      console.error("Failed to load local config", e);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      document.documentElement.setAttribute("data-theme", state.theme);
    } catch (e) {
      console.error("Failed to save local config", e);
    }
  }, [state, isLoaded]);

  const setTheme = (theme: string) => setState((p) => ({ ...p, theme }));
  const toggleWidget = (id: string) =>
    setState((p) => ({ ...p, widgets: p.widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)) }));
  const updateWidgetPosition = (id: string, x: number, y: number, w?: number, h?: number) =>
    setState((p) => ({
      ...p,
      widgets: p.widgets.map((wi) =>
        wi.id === id ? { ...wi, x, y, w: w !== undefined ? w : wi.w, h: h !== undefined ? h : wi.h } : wi
      ),
    }));
  const addBookmark = (title: string, url: string) => {
    let cleanUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) cleanUrl = `https://${url}`;
    setState((p) => ({ ...p, bookmarks: [...p.bookmarks, { id: Date.now().toString(), title, url: cleanUrl }] }));
  };
  const deleteBookmark = (id: string) => setState((p) => ({ ...p, bookmarks: p.bookmarks.filter((b) => b.id !== id) }));
  const addTodo = (text: string) =>
    setState((p) => ({ ...p, todoList: [...p.todoList, { id: Date.now().toString(), text, completed: false }] }));
  const toggleTodo = (id: string) =>
    setState((p) => ({ ...p, todoList: p.todoList.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) }));
  const deleteTodo = (id: string) => setState((p) => ({ ...p, todoList: p.todoList.filter((t) => t.id !== id) }));
  const addSnippet = (title: string, code: string, lang: string) =>
    setState((p) => ({ ...p, snippets: [...p.snippets, { id: Date.now().toString(), title, code, lang: lang || "txt" }] }));
  const deleteSnippet = (id: string) => setState((p) => ({ ...p, snippets: p.snippets.filter((s) => s.id !== id) }));
  const setWeatherCity = (weatherCity: string) => setState((p) => ({ ...p, weatherCity }));
  const toggleCosmosParticles = () => setState((p) => ({ ...p, showCosmosParticles: !p.showCosmosParticles }));
  const setUse24hFormat = (val: boolean) => setState((p) => ({ ...p, use24hFormat: val }));

  // Personalization
  const setUserName = (userName: string) => setState((p) => ({ ...p, userName }));
  const setFocusGoal = (focusGoal: string) => setState((p) => ({ ...p, focusGoal }));
  const setBackgroundUrl = (backgroundUrl: string) => setState((p) => ({ ...p, backgroundUrl }));
  const setBackgroundIndex = (backgroundIndex: number) => setState((p) => ({ ...p, backgroundIndex }));

  // Helper to map WMO weather codes to our canvas categories
  const mapWmoCodeToCondition = (code: number): string => {
    if (code === 0) return "Sunny";
    if ([1, 2, 3].includes(code)) return "Cloudy";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 85, 86, 95, 96, 99].includes(code)) return "Rain";
    return "Clear";
  };

  const fetchWeather = async (cityOrCoords: string | { lat: number; lon: number }) => {
    let lat: number;
    let lon: number;
    let cityName = typeof cityOrCoords === "string" ? cityOrCoords : "";

    try {
      if (typeof cityOrCoords === "string") {
        // 1. Fetch Geocoding via Open-Meteo (API keyless)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityOrCoords)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("City not found");
        }
        const result = geoData.results[0];
        lat = result.latitude;
        lon = result.longitude;
        cityName = `${result.name}, ${result.country_code?.toUpperCase()}`;
      } else {
        // 2. Coords from GPS, Reverse geocode city name via OSM Nominatim
        lat = cityOrCoords.lat;
        lon = cityOrCoords.lon;
        
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
            { headers: { "User-Agent": "HyprStart/3.0.0" } }
          );
          const revData = await revRes.json();
          cityName = revData.address.city || revData.address.town || revData.address.village || revData.address.county || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        } catch {
          cityName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
      }

      // 3. Fetch Forecast via Open-Meteo
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      const forecastData = await forecastRes.json();
      const current = forecastData.current;

      if (!current) {
        throw new Error("Weather forecast failed");
      }

      setState((prev) => ({
        ...prev,
        weatherCity: cityName,
        weatherTemp: Math.round(current.temperature_2m),
        weatherCondition: mapWmoCodeToCondition(current.weather_code),
        weatherHumidity: Math.round(current.relative_humidity_2m),
        weatherWind: Math.round(current.wind_speed_10m),
      }));

    } catch (err) {
      console.error("Failed to fetch weather telemetry", err);
    }
  };

  const importConfig = (configJson: string): boolean => {
    try {
      const parsed = JSON.parse(configJson);
      if (typeof parsed !== "object" || parsed === null) return false;
      setState(mergeState(parsed));
      return true;
    } catch (e) {
      console.error("Failed to import config", e);
      return false;
    }
  };

  const exportConfig = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", `hyprstart_config_${state.theme}.json`);
      linkElement.click();
    } catch (e) {
      console.error("Failed to export config", e);
    }
  };

  const resetConfig = () => setState(INITIAL_STATE);

  if (!isLoaded) return null;

  return (
    <HyprContext.Provider
      value={{
        state, setTheme, toggleWidget, updateWidgetPosition,
        addBookmark, deleteBookmark, addTodo, toggleTodo, deleteTodo,
        addSnippet, deleteSnippet, setWeatherCity, fetchWeather, toggleCosmosParticles,
        setUse24hFormat, importConfig, exportConfig, resetConfig,
        setUserName, setFocusGoal, setBackgroundUrl, setBackgroundIndex,
      }}
    >
      {children}
    </HyprContext.Provider>
  );
};

export const useHyprStore = () => {
  const context = useContext(HyprContext);
  if (context === undefined) throw new Error("useHyprStore must be used within a HyprProvider");
  return context;
};
