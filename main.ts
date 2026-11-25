// NusaStat hand-in (Node 22, standard library only).
//
// The site is plain static files under app/ next to this file, with 3 or 4
// screenshots of it under screenshots/. This program copies both into the
// output directory and writes dossier.json there, using the vendored make.fun
// library to build the dossier — the same dossier the scorer rebuilds, so
// the two must match byte for byte.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it with /output as the target instead.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  // Sorted entries keep the copy order (and any error order) deterministic,
  // so two runs of this program write the same bytes.
  for (const name of readdirSync(from).sort()) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) copyTree(src, dst);
    else cpSync(src, dst);
  }
}

function countShots(dir) {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((n) => !n.startsWith(".") && statSync(join(dir, n)).isFile()).length;
}

mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, "app"), join(outDir, "app"));

const shotsDir = join(repoRoot, "screenshots");
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) copyTree(shotsDir, join(outDir, "screenshots"));

// The gate needs 3 or 4 screenshots; fail loudly here instead of handing
// in a dossier the scorer would refuse.
const shotCount = countShots(join(outDir, "screenshots"));
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shotCount}`);
}

writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
