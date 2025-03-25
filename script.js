const visitedCountries = new Set(JSON.parse(localStorage.getItem("visitedCountries") || "[]"));
const visitedCountEl = document.getElementById("visitedCount");
const totalCountEl = document.getElementById("totalCount");
const percentageEl = document.getElementById("percentage");
const resetButton = document.getElementById("reset");

let allCountryPaths = []; // store D3 paths for quick lookup

const width = document.getElementById("map").clientWidth;
const height = 500;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");
const projection = d3.geoNaturalEarth1().scale(width / 6.5).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then(worldData => {
    const geoFeatures = topojson.feature(worldData, worldData.objects.countries);
    const rawGeometries = worldData.objects.countries.geometries;
    
    geoFeatures.features.forEach((feature, i) => {
      feature.properties = rawGeometries[i].properties;
    });
    
    const countries = geoFeatures.features;
    allCountryPaths = countries; // save for use in manual add

    totalCountEl.textContent = countries.length;

  svg.selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr("class", d => visitedCountries.has(d.id) ? "country visited" : "country")
    .attr("d", path)
    .on("click", function (event, d) {
      if (visitedCountries.has(d.id)) {
        visitedCountries.delete(d.id);
        d3.select(this).classed("visited", false);
      } else {
        visitedCountries.add(d.id);
        d3.select(this).classed("visited", true);
      }
      updateStats();
      localStorage.setItem("visitedCountries", JSON.stringify(Array.from(visitedCountries)));
    })
    .on("mouseover", function (event, d) {
        tooltip
            .style("opacity", 1)
            .text(d.properties.name);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

  updateStats();
});

function updateStats() {
  const total = parseInt(totalCountEl.textContent);
  const visited = visitedCountries.size;
  visitedCountEl.textContent = visited;
  percentageEl.textContent = ((visited / total) * 100).toFixed(1) + "%";
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
      }
    }
  
    return matrix[b.length][a.length];
  }

resetButton.addEventListener("click", () => {
  visitedCountries.clear();
  d3.selectAll(".country").classed("visited", false);
  updateStats();
  localStorage.removeItem("visitedCountries");
});

document.getElementById("addCountry").addEventListener("click", () => {
    const input = document.getElementById("countryInput").value.trim().toLowerCase();
    if (!input) return;
  
    let bestMatch = null;
    let bestScore = Infinity;
    
    allCountryPaths.forEach(d => {
      const name = d.properties.name.toLowerCase();
      const score = levenshtein(name, input);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = d;
      }
    });
    
    if (!bestMatch || bestScore > 3) {
      alert("Country not found (or typo too big)");
      return;
    }
  
    if (!visitedCountries.has(bestMatch.id)) {
      visitedCountries.add(bestMatch.id);
      d3.selectAll(".country")
        .filter(d => d.id === bestMatch.id)
        .classed("visited", true);
      localStorage.setItem("visitedCountries", JSON.stringify(Array.from(visitedCountries)));
      updateStats();
    }
    document.getElementById("countryInput").value = "";
  });

  document.getElementById("removeCountry").addEventListener("click", () => {
    const input = document.getElementById("countryInput").value.trim().toLowerCase();
    if (!input) return;
  
    let bestMatch = null;
    let bestScore = Infinity;
    
    allCountryPaths.forEach(d => {
      const name = d.properties.name.toLowerCase();
      const score = levenshtein(name, input);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = d;
      }
    });
    
    if (!bestMatch || bestScore > 3) {
      alert("Country not found (or typo too big)");
      return;
    }
  
    if (visitedCountries.has(bestMatch.id)) {
      visitedCountries.delete(bestMatch.id);
      d3.selectAll(".country")
        .filter(d => d.id === bestMatch.id)
        .classed("visited", false);
  
      localStorage.setItem("visitedCountries", JSON.stringify(Array.from(visitedCountries)));
      updateStats();
    }
    document.getElementById("countryInput").value = "";
  });