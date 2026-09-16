#!/usr/bin/env node
/**
 * Responsive WebP for the photography-heavy bright surface.
 *
 * Sources stay untouched in public/assets/img (the legacy dark rooms still
 * reference them directly). Derivatives land in public/assets/opt as
 * <name>-<width>.webp, and <Plate> assembles the srcset from them.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIRS = [
  path.join(process.cwd(), 'source-images'),
  path.join(process.cwd(), 'source-images/img'),
  // Icons stay in public because the dark rooms reference them directly.
  path.join(process.cwd(), 'public/assets/img'),
];
const OUT = path.join(process.cwd(), 'public/assets/opt');
const WIDTHS = [640, 1024, 1600, 2400];

fs.mkdirSync(OUT, { recursive: true });

const sources = SRC_DIRS.flatMap((dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir)
        .filter((f) => /\.(jpe?g|png)$/i.test(f))
        .map((f) => path.join(dir, f))
    : []
);

let made = 0, skipped = 0, savedBytes = 0;
const manifest = {};

for (const file of sources) {
  const base = path
    .basename(file)
    .replace(/\.(jpe?g|png)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const srcStat = fs.statSync(file);
  const meta = await sharp(file).metadata();

  for (const w of WIDTHS) {
    if (meta.width && meta.width < w * 0.9) continue; // don't upscale
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs > srcStat.mtimeMs) { skipped++; continue; }
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(out);
    made++;
  }

  manifest[base] = {
    widths: WIDTHS.filter((w) => !meta.width || meta.width >= w * 0.9),
    w: meta.width ?? null,
    h: meta.height ?? null,
  };
  if (!manifest[base].widths.length) manifest[base].widths = [WIDTHS[0]];

  // Always emit the smallest as the fallback `src`.
  const widest = WIDTHS.filter((w) => !meta.width || meta.width >= w * 0.9).pop() ?? WIDTHS[0];
  const outStat = fs.existsSync(path.join(OUT, `${base}-${widest}.webp`))
    ? fs.statSync(path.join(OUT, `${base}-${widest}.webp`)).size
    : 0;
  savedBytes += Math.max(0, srcStat.size - outStat);
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 0));

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`images: ${made} written, ${skipped} up to date, ~${mb(savedBytes)} MB lighter at the widest size`);
