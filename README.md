# 🌍 Charted

**Charted** is a minimalist web app that lets you track which countries you've visited on an interactive world map — inspired by physical scratch maps. Click to mark countries, or use the text input for fast searching. Data is saved locally in your browser.

![Screenshot of Charted](screenshot.png)


## ✨ Features

- Click on countries to mark them as visited
- Hover to view country names
- Type a country name to add or remove it (supports fuzzy matching)
- Stats: number and percentage of countries visited
- Data stored in `localStorage`
- Responsive design, works on mobile and desktop


## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/charted.git
cd charted
```

### 2. Open index.html in your browser

You can also use a local web server for best results (due to JSON loading):

With VS Code:
	•	Install the Live Server extension
	•	Right-click index.html → Open with Live Server

Or use Python: python3 -m http.server

Or with npx: Run  npx serve .


## 🧠 Tech Stack
	•	HTML + CSS + Vanilla JavaScript
	•	D3.js for rendering the map
	•	TopoJSON for compressed geographic data
	•	LocalStorage for persistence


## 📄 License

MIT — feel free to use and modify!


## ✈️ Author

Built by Kate – inspired by the joy of tracking travels and dreaming of where to go next.