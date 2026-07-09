<h1 align="center">
  Hyprstart </h1>
  <p align="center">
    HyprStart is an immersive, keyboard-driven, database-free start page designed for power users, ricing enthusiasts, and minimalist desktop fans. It replicates the functionality of a lightweight desktop environment or a tiling window manager inside the web browser.
</p>

<p align="center">
  <a href="https://github.com/fk0u/hyprstart/stargazers">
    <img src="https://img.shields.io/github/stars/fk0u/hyprstart?style=for-the-badge&logo=starship&color=a6e3a1&logoColor=D9E0EE&labelColor=302D41">
  </a>
  <a href="https://github.com/fk0u/hyprstart/issues">
    <img src="https://img.shields.io/github/issues/fk0u/hyprstart?style=for-the-badge&logo=gitbook&color=fab387&logoColor=D9E0EE&labelColor=302D41">
  </a>
  <a href="https://github.com/fk0u/hyprstart/contributors">
    <img src="https://img.shields.io/github/contributors/fk0u/hyprstart?style=for-the-badge&logo=github&color=f38ba8&logoColor=D9E0EE&labelColor=302D41">
  </a>
</p>

<p align="center">
  <img src="public\Macbook-Air-localhost.webp"/>
</p>

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

## 🚀 Running & Building as Browser Extension

### Running Locally (Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run dev server**:
   ```bash
   npm run dev
   ```
   _Secara default, dev server akan berjalan di port `8174` (`http://localhost:8174`)._

---

## 🖥️ Windows Startup Background Service (Auto-Start)

Agar dev server HyprStart otomatis menyala di latar belakang pada port `8174` setiap kali komputer dinyalakan (booting), gunakan script launcher bawaan:

1. **Pasang Startup Service**:
   - Double-click file **`install_startup.bat`** di folder root project.
   - Script akan otomatis menyusun file launcher VBS tersembunyi ke folder Windows Startup.
   - Server akan berjalan secara silent di latar belakang (tanpa memunculkan jendela Command Prompt hitam yang mengganggu desktop).

2. **Copot Startup Service**:
   - Jika ingin mematikan autostart, cukup double-click file **`uninstall_startup.bat`**. Ini akan menghapus script startup dan menghentikan proses server port 8174 secara bersih.

---

## 📦 How to Build & Install Browser Extension (Chrome/Edge/Firefox)

1. **Build & Auto-Package to ZIP**:

   ```bash
   npm run build:extension
   ```

   Command ini akan meng-compile Next.js sebagai static export ke folder `out/` lalu otomatis membungkusnya menjadi file **`hyprstart-extension.zip`** di root folder.

2. **Load Unpacked (Recommended for development)**:
   - Buka browser (Chrome/Edge/Brave).
   - Masuk ke menu Extensions (`chrome://extensions/`).
   - Aktifkan **Developer mode** di pojok kanan atas.
   - Klik **Load unpacked** dan arahkan ke folder **`out/`** hasil build di dalam directory project.
   - Selesai! Halaman Tab Baru (New Tab) lo sekarang digantikan secara otomatis oleh HyprStart (mengarahkan otomatis ke port `8174` jika dev server aktif, atau memuat local file jika offline).

3. **Install from ZIP Package**:
   - Ekstrak file `hyprstart-extension.zip` ke sebuah folder.
   - Masuk ke menu Extensions, klik **Load unpacked** dan arahkan ke folder ekstrak tersebut.
