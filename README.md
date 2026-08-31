# aaryanpanchal.com

Personal site for **Aaryan Panchal** — mechanical engineer, founder of **EpiSafe**
(an epinephrine auto-injector thin enough to live in a phone case), and
Co-Marketing Chair of WPI's Student Government.

Two things live here. A bright editorial portfolio, and **Becoming** — a
twenty-chapter autobiography reached straight from the navigation, about a
seven-year-old who decided his heart had become stone and everything that
happened afterwards.

> The visual system and the thinking behind it live in **[DESIGN.md](./DESIGN.md)**.
> How to add writing, and the rules about names, live in **[content/README.md](./content/README.md)**.

---

## Stack

Next.js App Router + TypeScript + Tailwind v4 + MDX, built with `output: 'export'`
— so it compiles to plain static HTML and deploys anywhere the old site did.

```
app/                  routes; app/globals.css is the whole design system
components/ui/        Monument, Ledger, Piece, Redacted, Plate, ChapterShell…
components/scenes/    one bespoke interaction per chapter
content/becoming/     the 20 chapters + 6 side chapters (MDX)
content/writing/      the archive — one file per piece
lib/palette.ts        the colour arc: every chapter as one setting of one system
lib/content.ts        build-time content loading, Zod-validated frontmatter
public/               static assets + the three "after hours" rooms
source-images/        full-resolution originals — never deployed
scripts/              check-names, images, archive-index
```

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # → out/  (name check → archive index → next build)
npm start            # serve the built output
npm run images       # regenerate responsive WebP after adding a photo
```

## Deploy

Any static host — Vercel, Netlify, Cloudflare Pages, GitHub Pages. Publish `out/`.
No server, no env vars.

---

## What's signature here

- **One dial, twenty-six settings.** Every chapter sets `--chroma` (0 → 1), which
  scales the saturation of the entire chapter. Stone is bright but chromaless;
  Flesh and Becoming are full spectrum. Same stylesheet throughout.
- **The typeface performs the story.** Fraunces' variable `SOFT` and `WONK` axes
  are driven from the same per-chapter number, so the letterforms travel from
  geometric and flat-terminaled in Stone to soft and organic by Flesh.
- **`<Ledger>`** — memory / fact / feeling / question / poem / prayer / anger /
  interpretation / later. Something written in pain is not automatically history,
  and the site keeps the distinction on the page. The same values are the
  archive's filter facets.
- **Eight scenes**, one per chapter, each making its chapter's argument before the
  chapter states it — including **Open Hands**, where holding the object does
  nothing at all and the page opens only when you let go.
- **The instrument** at `/writing` — press a letter, get a shape, a synthesised
  tone and a poem. No audio files; oscillators only, silent until asked.
- **Names are enforced, not just intended.** `npm run build` fails if a private
  name reaches `content/`. See [content/README.md](./content/README.md).

## The rooms that stayed dark

`/play.html` (Beat Lab, arcade, Darkroom) and `/void.html` (a text terminal, now
with an `archive` command that queries the writing) are deliberately still dark.
They're the after-hours part of the site, not an oversight. `/crm.html` is a
passcode-gated lead tracker whose data never leaves the browser.

## Verified

Static export of 60 pages. No 404s, console errors, or horizontal overflow at
1440px or 390px. Every scene keeps its meaning under `prefers-reduced-motion` and
is operable by keyboard alone. Text contrast passes WCAG AA on every chapter
including the twilight and night ones (body 8:1–12:1).
