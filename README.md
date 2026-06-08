# aaryanpanchal.com

Personal site for **Aaryan Panchal** — mechanical engineer, founder of
**EpiSafe** (an epinephrine auto-injector thin enough to live in a phone case),
and Co-Marketing Chair of WPI's Student Government.

A fast, editorial, dark single-page site with a signature **scroll-driven phone
dock**, a **per-role theme-morph** (EpiSafe orange ↔ SGA crimson ↔ neutral),
and a dedicated EpiSafe case-study page.

> Architecture, the visual system, and the component inventory live in
> **[DESIGN.md](./DESIGN.md)**.

---

## Stack

Zero build step — static files. Open `index.html` and it runs.

```
index.html              # homepage
episafe.html            # EpiSafe case study
assets/css/main.css     # design tokens + every style
assets/js/main.js       # interactions (no dependencies)
assets/fonts/           # Paul Grotesk (Thin / Regular / Bold)
assets/img/             # real product renders, photos, logos
DESIGN.md               # architecture, design system, roadmap
```

JetBrains Mono loads from Google Fonts; Paul Grotesk is bundled locally.

---

## Run it locally

Serve it (so relative font/image paths resolve):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

---

## What's signature here

- **Fly-down phone dock** — the hero phone (EpiSafe on the back of a phone)
  detaches and flies down the page as you scroll, docking precisely into the
  EpiSafe card. One shared element driven by scroll progress.
- **Per-role theme-morph** — the whole palette tweens from **EpiSafe orange**
  to **WPI crimson** in the SGA section, then a **neutral** close. The nav pill
  tracks the active role.
- **Polish layer** — scroll-progress bar, section index rail, custom cursor
  with a "View" label, 3D-tilt media cards, count-up stats, scatter→assemble
  headlines, a preloader, plus aurora / film-grain / vignette background FX.

Everything degrades gracefully and is disabled under `prefers-reduced-motion`.

---

## Editing

| To change… | Edit… |
|---|---|
| Copy / sections / stats | `index.html` and `episafe.html` |
| Colours, type, motion, theme-morph | tokens at the top of `assets/css/main.css` |
| Behaviour (dock, cursor, reveal, theme) | `assets/js/main.js` |
| Background FX default | the inline `<script>` in each page head (`data-bg`, `--fx-intensity`, `--fx-speed`) |

The background FX (`aurora` by default, dialed to a subtle ~0.6 intensity) can be
set to `mesh`, `grid`, `spotlight`, or `void` by changing `data-bg` in the head.

---

## Before you launch — checklist

- [x] Real product renders, team/lab photos, awards, Paul Grotesk, logo — all wired in.
- [x] EpiSafe case-study page built and linked.
- [ ] Confirm award/stat wording (Demo Day placement, $6.6B market, 11.4 mm, 0.3 mg, 56%).
- [ ] Add **GitHub** and a **resume** link (Connect + nav) if you want them.
- [ ] Optimise `demoday.jpg` (~10 MB) and other large renders before launch (e.g. to WebP).
- [ ] Confirm the **LinkedIn** URL.

---

## Deploy

Any static host. Easiest: **GitHub Pages**, **Netlify**, **Vercel**, or
**Cloudflare Pages** — push the repo, point `aaryanpanchal.com` at it. No server,
no env vars.

---

## Roadmap

- **Now:** confirm copy/stats, add GitHub + resume links, compress large images.
- **Next:** a third role/theme as Aaryan adds work (just another
  `data-section-theme` block); real SGA reach numbers; interview pull-quotes in
  the case study.
- **Later:** custom OG image, privacy-friendly analytics, performance pass.
