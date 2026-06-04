# 🎰 FH6 Advanced Challenge Generator

An interactive, web-based race randomizer for **Forza Horizon 6**. Break the analysis paralysis by generating unique driving challenges based on a database of 600+ cars and multiple filtering layers.

> ⏱️ *Developed in a midnight coding session – simple, fast, and works everywhere.*

## 📸 Preview

[App Screenshot – (image.png)

## 🚀 Features

- **Massive car database** – 600+ vehicles loaded from `fh6_cars.json`.
- **Smart filtering** – combine or leave open any category:
  - 🏢 **Manufacturers & Models** (Abarth, Zenvo, etc.)
  - 🌍 **Countries** (automatic from brand-country map)
  - ⏳ **Decades** (1930s – 2020s)
  - 🏎️ **Car Types / Styles** (Hot Hatch, Hypercars, Drift, etc.)
  - 📊 **Performance Classes** (D 500 to X 999)
- **Spin Roulette** – respects all active filters, falls back to "Any ..." for unchecked categories.
- **Clear Filters** – one-click reset of all selections.
- **Smooth animation** – pulsing loading effect while the roulette "thinks".

## 🛠️ Tech Stack

- **Pure HTML5 + CSS3 + Vanilla JavaScript** (no frameworks, no build steps).
- **JSON data files** – easily editable without touching code.
- **Hosting ready** – static files, deployable anywhere (Cloudflare Pages, GitHub Pages, etc.).

## 📂 Project Structure
/
├── index.html
├── style.css
├── script.js
├── fh6_brands_countries.json
├── fh6_cars.json
└── README.md

## 🧹 Future improvements

- Add more car types (if missing in the JSON).
- Improve mobile responsiveness.
- Optional save/load filter presets.

## 📄 License

MIT – free to use and modify.

> **Disclaimer**: This is an unofficial fan-made tool. Not affiliated with Microsoft, Turn 10 Studios, or Forza Horizon.
