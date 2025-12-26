/* global ol */

(function () {
  // -----------------------------
  // 0) Helpers
  // -----------------------------
  const $ = (id) => document.getElementById(id);

  function showStatus(msg, type = "info") {
    const el = $("status");
    el.textContent = msg;
    el.classList.remove("status--hidden");
    el.style.borderColor =
      type === "error"
        ? "rgba(255,77,77,0.45)"
        : type === "ok"
        ? "rgba(46,229,157,0.45)"
        : "rgba(255,255,255,0.18)";
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => el.classList.add("status--hidden"), 3500);
  }

  async function fetchJson(url) {
    const res = await fetch(url, {
      headers: {
        // برای بعضی سرویس‌ها مهمه که UA مشخص باشه
        // (اینجا Open-Meteo معمولاً حساس نیست ولی خوبه)
        "Accept": "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${text.slice(0, 140)}`);
    }
    return res.json();
  }

  function fmtCoord([lon, lat]) {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }

  // Weather Code to Text (Open-Meteo)
  // لیست کامل خیلی طولانیه؛ این مپ کوتاه برای “خفن‌تر شدن UI” کافی است.
  function weatherCodeText(code) {
    const m = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Snow",
      75: "Heavy snow",
      80: "Rain showers",
      81: "Rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm + hail",
      99: "Thunderstorm + heavy hail",
    };
    return m[code] ?? `Weather code: ${code}`;
  }

  // -----------------------------
  // 1) Init Map (OpenLayers)
  // -----------------------------
  const osm = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: "OpenStreetMap",
    type: "base",
  });

  const markerSource = new ol.source.Vector();
  const markerLayer = new ol.layer.Vector({
    source: markerSource,
    title: "Markers",
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: "rgba(46,229,157,0.9)" }),
        stroke: new ol.style.Stroke({ color: "rgba(0,0,0,0.6)", width: 2 }),
      }),
    }),
  });

  const view = new ol.View({
    center: ol.proj.fromLonLat([24.941, 60.171]), // Helsinki default
    zoom: 11,
  });

  const map = new ol.Map({
    target: "map",
    layers: [osm, markerLayer],
    view,
  });

  // کنترل‌ها دستی (سازگار با همه باندل‌ها)
  map.addControl(new ol.control.FullScreen());
  map.addControl(new ol.control.ScaleLine());
  map.addControl(
    new ol.control.MousePosition({
      coordinateFormat: (c) => ol.coordinate.format(c, "{x}, {y}", 6),
      projection: "EPSG:4326",
    })
  );

  function setSingleMarkerLonLat(lon, lat, label = "") {
    markerSource.clear();
    const f = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
      label,
    });
    markerSource.addFeature(f);
  }

  // -----------------------------
  // 2) Part 1 - Geocoding Search (Open-Meteo Geocoding)
  // Docs: https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json
  // -----------------------------
  async function geocodeOpenMeteo(placeText) {
    const url =
      "https://geocoding-api.open-meteo.com/v1/search" +
      `?name=${encodeURIComponent(placeText)}` +
      `&count=1&language=en&format=json`;

    const data = await fetchJson(url);
    const r = data?.results?.[0];
    if (!r) throw new Error("No results found");

    const lat = r.latitude;
    const lon = r.longitude;

    return {
      lat,
      lon,
      display: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
      timezone: r.timezone || "",
    };
  }

  async function onSearch() {
    const q = $("searchInput").value.trim();
    if (!q) return showStatus("Type something to search.", "error");

    $("dbgSearch").textContent = q;
    showStatus("Searching…");

    try {
      const r = await geocodeOpenMeteo(q);

      setSingleMarkerLonLat(r.lon, r.lat, "search");

      view.animate(
        { center: ol.proj.fromLonLat([r.lon, r.lat]), duration: 650 },
        { zoom: 14, duration: 650 }
      );

      showStatus(`Found: ${r.display} | ${fmtCoord([r.lon, r.lat])}`, "ok");
    } catch (e) {
      console.error(e);
      showStatus(`Geocoding failed: ${e.message}`, "error");
    }
  }

  $("searchBtn").addEventListener("click", onSearch);
  $("searchInput").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") onSearch();
  });

  // -----------------------------
  // 3) Part 2 - Weather on Map Click (Open-Meteo Forecast API)
  // Docs: /v1/forecast with current=...
  // -----------------------------
  function openWeatherCard() {
    $("weatherCard").classList.remove("weather--hidden");
  }
  function closeWeatherCard() {
    $("weatherCard").classList.add("weather--hidden");
  }
  $("weatherClose").addEventListener("click", closeWeatherCard);

  async function fetchWeatherOpenMeteo(lat, lon) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&timezone=auto`;

    return fetchJson(url);
  }

  function renderWeather(data, lon, lat) {
    const cur = data?.current;
    const units = data?.current_units;

    const temp = cur?.temperature_2m;
    const feels = cur?.apparent_temperature;
    const hum = cur?.relative_humidity_2m;
    const wind = cur?.wind_speed_10m;
    const code = cur?.weather_code;
    const time = cur?.time;

    $("weatherTitle").textContent = "Weather (Open-Meteo)";
    $("weatherMeta").textContent = [
      `Lat/Lon: ${fmtCoord([lon, lat])}`,
      time ? `Time: ${time}` : null,
      data?.timezone ? `TZ: ${data.timezone}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    $("weatherBody").innerHTML = `
      <div>
        <span class="badge">Current</span>
        <b>${weatherCodeText(code)}</b>
      </div>

      <div class="row">
        <div class="stat">
          <div class="stat__k">Temperature</div>
          <div class="stat__v">${temp ?? "—"} ${units?.temperature_2m ?? "°C"}</div>
        </div>
        <div class="stat">
          <div class="stat__k">Feels like</div>
          <div class="stat__v">${feels ?? "—"} ${units?.apparent_temperature ?? "°C"}</div>
        </div>
        <div class="stat">
          <div class="stat__k">Humidity</div>
          <div class="stat__v">${hum ?? "—"} ${units?.relative_humidity_2m ?? "%"}</div>
        </div>
        <div class="stat">
          <div class="stat__k">Wind</div>
          <div class="stat__v">${wind ?? "—"} ${units?.wind_speed_10m ?? "km/h"}</div>
        </div>
      </div>
    `;
  }

  async function onMapClick(evt) {
    const [lon, lat] = ol.proj.toLonLat(evt.coordinate);
    $("dbgClick").textContent = fmtCoord([lon, lat]);

    setSingleMarkerLonLat(lon, lat, "weather");
    openWeatherCard();
    $("weatherTitle").textContent = "Weather";
    $("weatherMeta").textContent = `Loading… (${fmtCoord([lon, lat])})`;
    $("weatherBody").textContent = "Fetching weather data…";

    try {
      const data = await fetchWeatherOpenMeteo(lat, lon);
      renderWeather(data, lon, lat);
      showStatus("Weather loaded.", "ok");
    } catch (e) {
      console.error(e);
      $("weatherTitle").textContent = "Weather";
      $("weatherMeta").textContent = fmtCoord([lon, lat]);
      $("weatherBody").innerHTML = `<span style="color: rgba(255,77,77,0.9)"><b>Error:</b> ${e.message}</span>`;
      showStatus(`Weather failed: ${e.message}`, "error");
    }
  }

  map.on("click", onMapClick);

  showStatus("Ready. Search or click on the map.", "ok");
})();