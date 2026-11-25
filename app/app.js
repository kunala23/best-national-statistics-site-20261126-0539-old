// NusaStat app: hash router + page renderers. All data lives in data.js,
// all charts in charts.js; this file only wires pages, links and controls.

import { YEARS, INDICATORS, SERIES, AGE_GROUPS, SECTORS, PROVINCES, RELEASES } from "./data.js";
import { lineChart, barChart } from "./charts.js";

const root = document.getElementById("app");
const navLinks = [...document.querySelectorAll("nav.main a")];

const ROUTES = {
  "": renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  prices: renderPrices,
  employment: renderEmployment,
  regions: renderRegions,
  methods: renderMethods,
};

function sourceNote(text) {
  return `<p class="source">Sumber: ${text}. Angka dibulatkan; lihat halaman Metode untuk catatan.</p>`;
}

function indicatorCards(keys) {
  return `<div class="cards">${keys.map((k) => {
    const d = INDICATORS.find((i) => i.key === k);
    return `<div class="card"><div class="label">${d.label}</div>
      <div class="value">${d.value}</div><div class="change">${d.change}</div>
      <div class="src">Sumber: ${d.source} — ${d.note}</div></div>`;
  }).join("")}</div>`;
}

function chartPanel(title, sub, chartEl) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  const h = document.createElement("h3");
  h.textContent = title;
  const p = document.createElement("p");
  p.className = "sub";
  p.textContent = sub;
  wrap.append(h, p, chartEl);
  return wrap;
}

// Overview: headline cards, two trend charts with a year-range switch,
// and the latest releases list.
function renderOverview() {
  root.innerHTML = `
    <h1>Statistik Indonesia, dalam satu tempat</h1>
    <p class="lede">NusaStat merangkum angka-angka utama Indonesia — penduduk, ekonomi,
    harga, pekerjaan, dan daerah — dari rilis resmi, dengan sumber dan tahun
    pada setiap angka.</p>
    ${indicatorCards(["population", "gdp", "growth", "inflation", "unemployment", "poverty", "hdi", "gini"])}
    <h2>Tren utama</h2>
    <div class="controls" role="group" aria-label="Rentang tahun">
      <label>Rentang tahun:</label>
      <button class="chip" data-range="all" aria-pressed="true">2019–2024</button>
      <button class="chip" data-range="recent" aria-pressed="false">2022–2024</button>
    </div>
    <div id="trend-charts"></div>
    <h2>Rilis terbaru</h2>
    <ul class="releases">${RELEASES.map((r) => `<li><span class="date">${r.date}</span><span>${r.title} <span class="source">(${r.source})</span></span></li>`).join("")}</ul>
    <p class="source">Rilis di atas adalah judul rilis BPS; angka lengkapnya ada di halaman masing-masing.</p>`;

  const draw = (range) => {
    const idx = range === "recent" ? [3, 4, 5] : [0, 1, 2, 3, 4, 5];
    const years = idx.map((i) => YEARS[i]);
    const box = document.getElementById("trend-charts");
    box.innerHTML = "";
    box.appendChild(chartPanel(
      SERIES.population.title, `${SERIES.population.unit} · ${SERIES.population.source}`,
      lineChart({ years, values: idx.map((i) => SERIES.population.values[i]), unit: SERIES.population.unit }),
    ));
    box.appendChild(chartPanel(
      SERIES.inflation.title, `${SERIES.inflation.unit} · ${SERIES.inflation.source}`,
      lineChart({ years, values: idx.map((i) => SERIES.inflation.values[i]), unit: SERIES.inflation.unit, color: "#e36414" }),
    ));
  };
  draw("all");
  root.querySelectorAll("button.chip").forEach((b) => {
    b.addEventListener("click", () => {
      root.querySelectorAll("button.chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      draw(b.dataset.range);
    });
  });
}

function renderPopulation() {
  root.innerHTML = `
    <h1>Penduduk</h1>
    <p class="lede">Indonesia berpenduduk 281,6 juta jiwa pada 2024 — negara keempat
    terpadat di dunia — dengan struktur umur yang masih didominasi usia produktif.</p>
    ${indicatorCards(["population", "hdi"])}
    <div id="pop-chart"></div>
    <h2>Struktur umur, 2024</h2>
    <div id="age-chart"></div>
    <h2>Sepuluh provinsi terpadat</h2>
    <p class="lede">Klik judul kolom untuk mengurutkan tabel.</p>
    <div class="tablewrap"><table id="prov-table">
      <thead><tr>
        <th><button data-sort="name">Provinsi</button></th>
        <th class="num"><button data-sort="population">Penduduk (juta)</button></th>
        <th class="num"><button data-sort="density">Kepadatan (/km²)</button></th>
        <th>Ibu kota</th>
      </tr></thead><tbody></tbody></table></div>
    ${sourceNote("BPS, 2019–2024; kepadatan dihitung dari luas wilayah BPS")}`;
  document.getElementById("pop-chart").appendChild(chartPanel(
    SERIES.population.title, `${SERIES.population.unit} · ${SERIES.population.source}`,
    lineChart({ years: YEARS, values: SERIES.population.values, unit: SERIES.population.unit }),
  ));
  document.getElementById("age-chart").appendChild(chartPanel(
    "Penduduk menurut kelompok umur", "Persen dari total penduduk · BPS, 2024",
    barChart({ rows: AGE_GROUPS.map((a) => ({ label: a.group, value: a.share })), unit: "% penduduk" }),
  ));
  sortTable(document.getElementById("prov-table"), PROVINCES, "population", false);
}

function renderEconomy() {
  root.innerHTML = `
    <h1>Ekonomi</h1>
    <p class="lede">PDB Indonesia tumbuh 5,03% pada 2024 menjadi Rp22.139 triliun,
    dengan industri pengolahan sebagai penyumbang terbesar.</p>
    ${indicatorCards(["gdp", "growth"])}
    <div id="growth-chart"></div>
    <div id="gdp-chart"></div>
    <h2>PDB menurut lapangan usaha, 2024</h2>
    <div id="sector-chart"></div>
    ${sourceNote("BPS, 2019–2024; pangsa sektor dibulatkan dan dijumlahkan ≈100%")}`;
  document.getElementById("growth-chart").appendChild(chartPanel(
    SERIES.growth.title, `${SERIES.growth.unit} · ${SERIES.growth.source}`,
    lineChart({ years: YEARS, values: SERIES.growth.values, unit: SERIES.growth.unit, color: "#e36414" }),
  ));
  document.getElementById("gdp-chart").appendChild(chartPanel(
    SERIES.gdpNominal.title, `${SERIES.gdpNominal.unit} · ${SERIES.gdpNominal.source}`,
    lineChart({ years: YEARS, values: SERIES.gdpNominal.values, unit: SERIES.gdpNominal.unit }),
  ));
  document.getElementById("sector-chart").appendChild(chartPanel(
    "Pangsa PDB menurut sektor", "% dari PDB · BPS, 2024",
    barChart({ rows: SECTORS.map((s) => ({ label: s.name, value: s.share })), unit: "% dari PDB", color: "#e36414" }),
  ));
}

function renderPrices() {
  root.innerHTML = `
    <h1>Harga</h1>
    <p class="lede">Inflasi tahunan turun ke 1,57% pada 2024 — terendah dalam enam tahun —
    setelah lonjakan 5,51% pada 2022 saat harga BBM bersubsidi disesuaikan.</p>
    ${indicatorCards(["inflation"])}
    <div id="inf-chart"></div>
    <div class="note"><strong>Yang menggerakkan harga pada 2022:</strong> penyesuaian
    harga BBM bersubsidi pada September 2022 mendorong inflasi ke atas 5%.
    Sejak itu inflasi kembali ke kisaran sasaran Bank Indonesia, 1,5%–3,5%.</div>
    <h2>Membaca angka ini</h2>
    <p>Inflasi diukur dari Indeks Harga Konsumen (IHK) di 90 kota. Angka tahunan
    membandingkan IHK Desember dengan Desember tahun sebelumnya.</p>
    ${sourceNote("BPS, IHK 2019–2024; sasaran inflasi Bank Indonesia 2024: 1,5%–3,5%")}`;
  document.getElementById("inf-chart").appendChild(chartPanel(
    SERIES.inflation.title, `${SERIES.inflation.unit} · ${SERIES.inflation.source}`,
    lineChart({ years: YEARS, values: SERIES.inflation.values, unit: SERIES.inflation.unit, color: "#e36414" }),
  ));
}

function renderEmployment() {
  root.innerHTML = `
    <h1>Pekerjaan</h1>
    <p class="lede">Pengangguran terbuka turun ke 4,91% pada Agustus 2024 dan kemiskinan
    ke 8,57% pada September 2024 — keduanya terendah sejak sebelum pandemi.</p>
    ${indicatorCards(["unemployment", "poverty", "gini"])}
    <div id="unemp-chart"></div>
    <div id="pov-chart"></div>
    ${sourceNote("BPS Sakernas dan Survei Sosial Ekonomi Nasional, 2019–2024")}`;
  document.getElementById("unemp-chart").appendChild(chartPanel(
    SERIES.unemployment.title, `${SERIES.unemployment.unit} · ${SERIES.unemployment.source}`,
    lineChart({ years: YEARS, values: SERIES.unemployment.values, unit: SERIES.unemployment.unit }),
  ));
  document.getElementById("pov-chart").appendChild(chartPanel(
    SERIES.poverty.title, `${SERIES.poverty.unit} · ${SERIES.poverty.source}`,
    lineChart({ years: YEARS, values: SERIES.poverty.values, unit: SERIES.poverty.unit, color: "#e36414" }),
  ));
}

function renderRegions() {
  root.innerHTML = `
    <h1>Daerah</h1>
    <p class="lede">Sepuluh provinsi terpadat menampung lebih dari separuh penduduk
    Indonesia. Cari provinsi, atau klik judul kolom untuk mengurutkan.</p>
    <div class="controls">
      <label for="q">Cari provinsi:</label>
      <input type="search" id="q" placeholder="mis. Jawa, Sumatera…" aria-label="Cari provinsi">
      <button class="chip" id="csv-btn" type="button">Unduh CSV</button>
    </div>
    <div class="tablewrap"><table id="prov-table">
      <thead><tr>
        <th><button data-sort="name">Provinsi</button></th>
        <th class="num"><button data-sort="population">Penduduk (juta)</button></th>
        <th class="num"><button data-sort="density">Kepadatan (/km²)</button></th>
        <th>Ibu kota</th>
      </tr></thead><tbody></tbody></table></div>
    <p id="count" class="source"></p>
    ${sourceNote("BPS, estimasi pertengahan tahun 2024, dibulatkan")}`;
  const table = document.getElementById("prov-table");
  let shown = PROVINCES;
  const draw = (rows) => {
    shown = rows;
    table.querySelector("tbody").innerHTML = rows.map((p) => `<tr>
      <td>${p.name}</td><td class="num">${String(p.population).replace(".", ",")}</td>
      <td class="num">${p.density.toLocaleString("id-ID")}</td><td>${p.capital}</td></tr>`).join("");
    document.getElementById("count").textContent = `${rows.length} dari ${PROVINCES.length} provinsi ditampilkan.`;
  };
  sortTable(table, PROVINCES, "population", false, draw);
  document.getElementById("q").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    draw(PROVINCES.filter((p) => p.name.toLowerCase().includes(q)));
  });
  // Download exactly the rows currently shown, as CSV.
  document.getElementById("csv-btn").addEventListener("click", () => {
    const lines = ["Provinsi,Penduduk (juta),Kepadatan (/km2),Ibu kota",
      ...shown.map((p) => `${p.name},${p.population},${p.density},${p.capital}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "provinsi-terpadat-2024.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function renderMethods() {
  root.innerHTML = `
    <h1>Metode &amp; sumber</h1>
    <p class="lede">Cara angka-angka di situs ini disusun, supaya Anda bisa
    memeriksanya sendiri.</p>
    <h2>Sumber data</h2>
    <p>Semua angka berasal dari rilis publik Badan Pusat Statistik (BPS) —
    Sensus dan Survei Penduduk, Produk Domestik Bruto, Indeks Harga Konsumen,
    Sakernas, dan Survei Sosial Ekonomi Nasional — serta indikator Bank Dunia.
    Setiap angka di situs ini mencantumkan sumber dan tahunnya.</p>
    <h2>Pembulatan</h2>
    <p>Angka ditampilkan dibulatkan ke satu desimal (atau bilangan bulat untuk
    jumlah besar) agar mudah dibaca. Pembulatan dapat membuat jumlah pangsa
    tidak tepat 100%.</p>
    <h2>Kemandirian</h2>
    <p>NusaStat adalah presentasi independen dan tidak berafiliasi dengan BPS,
    Bank Indonesia, atau Bank Dunia. Nama, desain, dan teks situs ini asli.</p>
    <h2>Cara mengutip</h2>
    <p>Contoh: “Penduduk Indonesia 281,6 juta jiwa (BPS, 2024), dikutip dari
    NusaStat, diakses November 2026.”</p>`;
}

// Sortable table: click a header button to sort by that column.
function sortTable(table, rows, initialKey, initialAsc, drawFn) {
  let key = initialKey, asc = initialAsc;
  const draw = drawFn || ((sorted) => {
    table.querySelector("tbody").innerHTML = sorted.map((p) => `<tr>
      <td>${p.name}</td><td class="num">${String(p.population).replace(".", ",")}</td>
      <td class="num">${p.density.toLocaleString("id-ID")}</td><td>${p.capital}</td></tr>`).join("");
  });
  const apply = () => {
    const sorted = [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      const c = typeof av === "string" ? av.localeCompare(bv, "id") : av - bv;
      return asc ? c : -c;
    });
    draw(sorted);
  };
  table.querySelectorAll("th button").forEach((b) => {
    b.addEventListener("click", () => {
      if (key === b.dataset.sort) asc = !asc;
      else { key = b.dataset.sort; asc = true; }
      apply();
    });
  });
  apply();
}

function route() {
  const name = location.hash.replace(/^#\/?/, "").split("/")[0];
  const render = ROUTES[name] || ROUTES[""];
  navLinks.forEach((a) => {
    const href = a.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
    a.classList.toggle("active", href === name);
  });
  render();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
