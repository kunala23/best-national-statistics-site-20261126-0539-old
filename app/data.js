// NusaStat data: rounded published figures for Indonesia, each with its
// source and year. Values are rounded from Statistics Indonesia (BPS)
// releases and World Bank indicators; see the Methods page for notes.
// Nothing here is fetched at run time: the site is fully offline.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const INDICATORS = [
  { key: "population", label: "Population", value: "281.6 jt", change: "+1.4% / thn", source: "BPS, 2024", note: "Mid-year estimate, rounded" },
  { key: "gdp", label: "PDB nominal", value: "Rp22.139 T", change: "+5,9% nominal", source: "BPS, 2024", note: "Current prices" },
  { key: "growth", label: "Pertumbuhan ekonomi", value: "5,03%", change: "vs 5,05% (2023)", source: "BPS, 2024", note: "Real GDP growth, yoy" },
  { key: "inflation", label: "Inflasi (IHK)", value: "1,57%", change: "vs 2,61% (2023)", source: "BPS, 2024", note: "Year-on-year, December" },
  { key: "unemployment", label: "Pengangguran terbuka", value: "4,91%", change: "vs 5,32% (2023)", source: "BPS, Agu 2024", note: "Sakernas, August" },
  { key: "poverty", label: "Kemiskinan", value: "8,57%", change: "vs 9,36% (2023)", source: "BPS, Sep 2024", note: "Share of population" },
  { key: "hdi", label: "Indeks Pembangunan Manusia", value: "75,02", change: "+0,68 poin", source: "BPS, 2024", note: "IPM, scale 0–100" },
  { key: "gini", label: "Rasio Gini", value: "0,381", change: "vs 0,379 (2023)", source: "BPS, 2024", note: "0 = equal, 1 = unequal" },
];

export const SERIES = {
  population: {
    title: "Penduduk Indonesia",
    unit: "juta jiwa",
    source: "BPS, 2019–2024",
    values: [268.1, 270.2, 272.2, 274.9, 277.7, 281.6],
  },
  growth: {
    title: "Pertumbuhan PDB riil",
    unit: "% per tahun",
    source: "BPS, 2019–2024",
    values: [5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
  },
  gdpNominal: {
    title: "PDB nominal",
    unit: "Rp triliun",
    source: "BPS, 2019–2024",
    values: [15833, 15434, 16976, 19588, 20892, 22139],
  },
  inflation: {
    title: "Inflasi tahunan (IHK)",
    unit: "% yoy",
    source: "BPS, 2019–2024",
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  },
  unemployment: {
    title: "Tingkat pengangguran terbuka",
    unit: "% angkatan kerja",
    source: "BPS Sakernas, 2019–2024",
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  },
  poverty: {
    title: "Tingkat kemiskinan",
    unit: "% penduduk",
    source: "BPS, 2019–2024",
    values: [9.41, 10.19, 9.71, 9.57, 9.36, 8.57],
  },
};

// Age structure, 2024 (BPS, share of population, rounded)
export const AGE_GROUPS = [
  { group: "0–14 tahun", share: 24.5 },
  { group: "15–24 tahun", share: 16.9 },
  { group: "25–54 tahun", share: 41.2 },
  { group: "55–64 tahun", share: 9.6 },
  { group: "65+ tahun", share: 7.8 },
];

// GDP by sector, 2024 shares (BPS, rounded; shares sum to ~100)
export const SECTORS = [
  { name: "Industri pengolahan", share: 18.9 },
  { name: "Perdagangan", share: 13.0 },
  { name: "Pertanian, kehutanan, perikanan", share: 12.5 },
  { name: "Konstruksi", share: 9.9 },
  { name: "Pertambangan dan penggalian", share: 9.4 },
  { name: "Transportasi dan pergudangan", share: 5.8 },
  { name: "Informasi dan komunikasi", share: 4.2 },
  { name: "Jasa keuangan", share: 4.2 },
  { name: "Jasa lainnya", share: 22.1 },
];

// Ten largest provinces, 2024 mid-year estimates in millions (BPS, rounded)
export const PROVINCES = [
  { name: "Jawa Barat", population: 49.9, density: 1413, capital: "Bandung" },
  { name: "Jawa Timur", population: 41.8, density: 873, capital: "Surabaya" },
  { name: "Jawa Tengah", population: 38.0, density: 1163, capital: "Semarang" },
  { name: "Sumatera Utara", population: 15.6, density: 214, capital: "Medan" },
  { name: "Banten", population: 12.4, density: 1284, capital: "Serang" },
  { name: "DKI Jakarta", population: 10.6, density: 16022, capital: "Jakarta" },
  { name: "Sulawesi Selatan", population: 9.5, density: 204, capital: "Makassar" },
  { name: "Lampung", population: 9.4, density: 272, capital: "Bandar Lampung" },
  { name: "Sumatera Selatan", population: 9.0, density: 98, capital: "Palembang" },
  { name: "Riau", population: 7.0, density: 80, capital: "Pekanbaru" },
];

export const RELEASES = [
  { date: "Nov 2025", title: "PDB kuartal III-2025 tumbuh 5,04% (yoy)", source: "BPS" },
  { date: "Nov 2025", title: "Inflasi November 2025: 0,17% (mtm)", source: "BPS" },
  { date: "Nov 2025", title: "TPT Agustus 2025: 4,85%", source: "BPS" },
  { date: "Sep 2025", title: "Kemiskinan Maret 2025: 8,47%", source: "BPS" },
  { date: "Jun 2025", title: "Sensus Penduduk: proyeksi 2025 diterbitkan", source: "BPS" },
];
