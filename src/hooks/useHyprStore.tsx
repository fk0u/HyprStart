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
  showCosmosParticles: boolean;
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
  toggleCosmosParticles: () => void;
  importConfig: (config: string) => boolean;
  exportConfig: () => void;
  resetConfig: () => void;
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
  { id: "3", title: "Tailwind Docs", url: "https://tailwindcss.com/docs" },
  { id: "4", title: "Next.js Docs", url: "https://nextjs.org/docs" },
  { id: "5", title: "Arch Wiki", url: "https://wiki.archlinux.org" },
];

const DEFAULT_TODOS: TodoItem[] = [
  { id: "1", text: "Configure Nord theme parameters", completed: false },
  { id: "2", text: "Commit dotfiles to GitHub repo", completed: true },
  { id: "3", text: "Rearrange layout windows", completed: false },
];

const DEFAULT_SNIPPETS: CodeSnippet[] = [
  { id: "1", title: "Arch System Update", code: "sudo pacman -Syu", lang: "bash" },
  { id: "2", title: "Tailwind Gradient Button", code: "<button className=\"bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-4 py-2 rounded shadow-lg transition-all duration-300\">Launch</button>", lang: "jsx" },
];

const INITIAL_STATE: HyprState = {
  theme: "tokyo-night",
  widgets: DEFAULT_WIDGETS,
  bookmarks: DEFAULT_BOOKMARKS,
  todoList: DEFAULT_TODOS,
  snippets: DEFAULT_SNIPPETS,
  weatherCity: "Neo-Tokyo",
  showCosmosParticles: true,
};

const HyprContext = createContext<HyprContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "hyprstart_dotfiles";

export const HyprProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HyprState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge logic to prevent crashes if schemas change
        setTimeout(() => {
          setState({
            theme: parsed.theme || INITIAL_STATE.theme,
            widgets: parsed.widgets?.length ? parsed.widgets : INITIAL_STATE.widgets,
            bookmarks: parsed.bookmarks || INITIAL_STATE.bookmarks,
            todoList: parsed.todoList || INITIAL_STATE.todoList,
            snippets: parsed.snippets || INITIAL_STATE.snippets,
            weatherCity: parsed.weatherCity || INITIAL_STATE.weatherCity,
            showCosmosParticles: parsed.showCosmosParticles !== undefined ? parsed.showCosmosParticles : INITIAL_STATE.showCosmosParticles,
          });
          setIsLoaded(true);
        }, 0);
        return;
      }
    } catch (e) {
      console.error("Failed to load local config", e);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  // Save state to localStorage and document element attributes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      // Update data-theme on html element
      document.documentElement.setAttribute("data-theme", state.theme);
    } catch (e) {
      console.error("Failed to save local config", e);
    }
  }, [state, isLoaded]);

  const setTheme = (theme: string) => {
    setState((prev) => ({ ...prev, theme }));
  };

  const toggleWidget = (id: string) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    }));
  };

  const updateWidgetPosition = (id: string, x: number, y: number, w?: number, h?: number) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w_item) =>
        w_item.id === id
          ? {
              ...w_item,
              x,
              y,
              w: w !== undefined ? w : w_item.w,
              h: h !== undefined ? h : w_item.h,
            }
          : w_item
      ),
    }));
  };

  const addBookmark = (title: string, url: string) => {
    let cleanUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      cleanUrl = `https://${url}`;
    }
    setState((prev) => ({
      ...prev,
      bookmarks: [
        ...prev.bookmarks,
        { id: Date.now().toString(), title, url: cleanUrl },
      ],
    }));
  };

  const deleteBookmark = (id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id),
    }));
  };

  const addTodo = (text: string) => {
    setState((prev) => ({
      ...prev,
      todoList: [
        ...prev.todoList,
        { id: Date.now().toString(), text, completed: false },
      ],
    }));
  };

  const toggleTodo = (id: string) => {
    setState((prev) => ({
      ...prev,
      todoList: prev.todoList.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const deleteTodo = (id: string) => {
    setState((prev) => ({
      ...prev,
      todoList: prev.todoList.filter((t) => t.id !== id),
    }));
  };

  const addSnippet = (title: string, code: string, lang: string) => {
    setState((prev) => ({
      ...prev,
      snippets: [
        ...prev.snippets,
        { id: Date.now().toString(), title, code, lang: lang || "txt" },
      ],
    }));
  };

  const deleteSnippet = (id: string) => {
    setState((prev) => ({
      ...prev,
      snippets: prev.snippets.filter((s) => s.id !== id),
    }));
  };

  const setWeatherCity = (weatherCity: string) => {
    setState((prev) => ({ ...prev, weatherCity }));
  };

  const toggleCosmosParticles = () => {
    setState((prev) => ({ ...prev, showCosmosParticles: !prev.showCosmosParticles }));
  };

  const importConfig = (configJson: string): boolean => {
    try {
      const parsed = JSON.parse(configJson);
      // Basic validation
      if (typeof parsed !== "object" || parsed === null) return false;
      
      setState({
        theme: parsed.theme || INITIAL_STATE.theme,
        widgets: Array.isArray(parsed.widgets) ? parsed.widgets : INITIAL_STATE.widgets,
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : INITIAL_STATE.bookmarks,
        todoList: Array.isArray(parsed.todoList) ? parsed.todoList : INITIAL_STATE.todoList,
        snippets: Array.isArray(parsed.snippets) ? parsed.snippets : INITIAL_STATE.snippets,
        weatherCity: parsed.weatherCity || INITIAL_STATE.weatherCity,
        showCosmosParticles: parsed.showCosmosParticles !== undefined ? parsed.showCosmosParticles : INITIAL_STATE.showCosmosParticles,
      });
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
      
      const exportFileDefaultName = `hyprstart_config_${state.theme}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } catch (e) {
      console.error("Failed to export config", e);
    }
  };

  const resetConfig = () => {
    setState(INITIAL_STATE);
  };

  // Wait until state has loaded from localStorage to prevent flash of initial values
  if (!isLoaded) {
    return null; 
  }

  return (
    <HyprContext.Provider
      value={{
        state,
        setTheme,
        toggleWidget,
        updateWidgetPosition,
        addBookmark,
        deleteBookmark,
        addTodo,
        toggleTodo,
        deleteTodo,
        addSnippet,
        deleteSnippet,
        setWeatherCity,
        toggleCosmosParticles,
        importConfig,
        exportConfig,
        resetConfig,
      }}
    >
      {children}
    </HyprContext.Provider>
  );
};

export const useHyprStore = () => {
  const context = useContext(HyprContext);
  if (context === undefined) {
    throw new Error("useHyprStore must be used within a HyprProvider");
  }
  return context;
};
