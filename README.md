# 🌀 HyprStart

HyprStart is an immersive, keyboard-driven, database-free start page designed for power users, ricing enthusiasts, and minimalist desktop fans. It replicates the functionality of a lightweight desktop environment or a tiling window manager inside the web browser.

---

## ✨ Features

### 1. Keyless Real-time API Weather & GPS Locating
- **No API Keys Required**: Seamlessly query coordinates using the free, high-performance **Open-Meteo API**.
- **GPS Integration**: Retrieve your physical location with HTML5 Geolocation API, with reverse geocoding to city names via **OpenStreetMap Nominatim**.
- **Live Backdrop Sync**: The background canvas reacts live to current weather conditions (falling rain, solar rays, drifting mist, moving clouds, or clear starry skies).

### 2. Procedural Ambient Soundscapes (Web Audio API)
- **Mathematical Sound Synthesis**: Generates sound mathematically using Brownian and Pink noise buffers. Works completely offline.
- **Atmospheric Options**: Select between procedurally synthesized **Rain patters**, **Wind gusts**, or **Ocean waves**.
- **Visual Waveform**: Built-in volume slider and bouncing CSS equalizer bar visualizer.

### 3. Autocomplete Suggest Search Bar
- **Debounced Google Suggest API**: As you type, the search bar queries a server-side proxy route to provide search suggestions.
- **Keyboard Navigation**: Press `Arrow Down` / `Arrow Up` to navigate suggestions, `Tab` to complete the query, `Enter` to search, and `Esc` to close.
- **Copy Query Shortcut**: Fill suggestion text into the input field instantly using the arrow-up-left icon.

### 4. Fuzzy Command Palette (Levenshtein Distance)
- **Fuzzy Filtering**: The command palette (`Ctrl + K` or `Alt + D`) uses a space-optimized Levenshtein distance algorithm to find commands even with typos (e.g. `/them gruvbox` matches `/theme`).

### 5. Personalized Discover Feed
- **Interest-Based Curation**: Toggle topics you love (Anime, K-Pop, Japanese culture, Tech, Indonesian Pop, Javanese Hipdut, Global Pop, Fashion, Nature) and view curated cards.
- **Searchable List**: Quickly filter active topics using the in-widget search bar.

### 6. System Telemetry & Calendar Popups
- **Battery Status**: Exposes live laptop battery charging status and level via HTML5 Battery Status API.
- **RAM Heap Tracker**: Tracks active JavaScript heap size to estimate system memory load.
- **Clickable Calendar**: Click the date in the center Clock widget to reveal a custom pixel-perfect calendar grid.

---

## ⌨️ Vim-like Keyboard Shortcuts

Press **`?`** on your dashboard (when not typing in an input field) to reveal the shortcuts panel:
- `g` : Focus search input
- `Alt + F` : Toggle Focus Mode (minimalist Clock-only view)
- `Ctrl + K` / `Alt + D` : Open/Close Command Palette
- `Esc` : Exit settings, focus mode, palette, or help guide
- `?` : Toggle keyboard shortcuts helper

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js (App Router, Turbopack compile)
- **Styling**: Tailwind CSS & Vanilla CSS Transitions
- **State Management**: React Context & local config engine persisted in `localStorage` (No external database, offline first).
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Build production bundle**:
   ```bash
   npm run build
   ```
