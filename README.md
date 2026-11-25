# NusaStat — Portal Statistik Indonesia

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kunala23/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kunala23/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An original, fully offline national statistics site for Indonesia, built for the
make.fun bounty **"Make the best national statistics site"** ($50 reward pool).

## What it is

NusaStat presents Indonesia's key national statistics — population, economy,
prices, employment and regions — as a working static site: every page is
reached by a link, every chart is drawn from the site's own data files, every
table sorts, and every figure carries its source and year.

## Run it

```sh
python3 -m http.server 8080 --directory app
# open http://localhost:8080/
```

No build step, no network request, no dependencies. `app/` is plain static
files; `main.ts` hands the site in by copying `app/` and `screenshots/` to
`/output` and writing `/output/dossier.json` with the vendored make.fun
library.

## Pages

- **Overview** (`#/`) — headline indicators and trend charts
- **Population** (`#/population`) — population trend, age structure, top provinces
- **Economy** (`#/economy`) — GDP growth, nominal GDP, sector shares
- **Prices** (`#/prices`) — consumer price inflation trend
- **Employment** (`#/employment`) — unemployment and poverty trends
- **Regions** (`#/regions`) — searchable, sortable province table
- **Methods** (`#/methods`) — sources, notes and how figures are rounded

## Data

Figures are rounded values from published releases of Statistics Indonesia
(BPS) and the World Bank, each labelled with its source and year on the page
that shows it. NusaStat is an independent presentation and is not affiliated
with BPS or the World Bank.
