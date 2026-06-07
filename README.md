# aaryanpanchal.com

Personal site for **Aaryan Panchal** — mechanical engineer, medical-device
founder (EpiSafe), WPI. A fast, minimal, editorial single-page site with a
warm-dark aesthetic.

> Design rationale, layouts, the visual system, and the component inventory
> live in **[DESIGN.md](./DESIGN.md)**.

---

## Stack

Zero build step. Just static files — open `index.html` and it runs.

```
index.html              # markup + all section copy
assets/css/main.css     # design tokens + every style
assets/js/main.js       # interactions (no dependencies)
assets/img/             # photos, OG image (add yours here)
DESIGN.md               # architecture, design system, roadmap
```

Fonts (Fraunces · Inter · JetBrains Mono) load from Google Fonts.

---

## Run it locally

Open the file directly, or serve it (recommended, so relative paths behave):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Edit the content

| To change… | Edit… |
|---|---|
| Any words on the page | `index.html` (copy is inline, by section) |
| Colours, type, spacing, motion | the tokens at the top of `assets/css/main.css` |
| Behaviour (cursor, reveal, theme) | `assets/js/main.js` |

Switch the default theme by changing `data-theme="dark"` on `<html>` (a
visitor's saved choice still wins via `localStorage`).

---

## Before you launch — checklist

- [x] **Logo** wired in (`logoaaryanwhite.png` on dark, `logoaaryanblack.png` on light) — nav + preloader.
- [x] **EpiSafe case-study page** (`episafe.html`) built and linked.
- [ ] Drop **EpiSafe photos** into `assets/img/` and swap the `.media .ph`
      placeholders in `episafe.html` (and the `.feature-visual` on the homepage)
      for `<img>` tags. Each placeholder says exactly what image goes there.
- [ ] Replace the **two placeholder project cards** in the Work section.
- [ ] Set your **GitHub** and **Resume** links (Connect section + footer).
- [ ] Add an **OG image** at `assets/img/og.png` (1200×630) for link previews.
- [ ] Confirm the **LinkedIn** URL is correct.
- [ ] (Optional) export a proper **favicon** from your logo (the current one is a
      self-contained SVG stand-in so it's always visible).

### Swapping an image slot
Find a placeholder like this and replace the inner `.ph` div with your photo:
```html
<div class="media" data-cursor="view">
  <img src="assets/img/episafe-hero.jpg" alt="EpiSafe device in context" />
</div>
```
The reveal + zoom animation works automatically.

---

## Deploy

Any static host works. Easiest paths:

1. **GitHub Pages** — push to `main`, enable Pages, point the `aaryanpanchal.com`
   DNS at it.
2. **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or connect this repo;
   add the custom domain in the dashboard.

No environment variables, no server, no database.

---

## Roadmap

**Phase 1 — Launch-ready (now → ~1 week)**
- Replace placeholders, add EpiSafe photo, wire real links.
- Add OG image + favicon. Deploy to the custom domain. Run Lighthouse.

**Phase 2 — Depth (weeks 2–4)**
- [x] Full **EpiSafe case study** page (`episafe.html`): problem → discovery →
  prototypes → how-it-works → what's next. *Add the real images.*
- Add a one-click **resume download** in the nav.

**Phase 3 — Voice (ongoing)**
- A lightweight **Writing / Notes** section — short posts on what you're
  learning (biosensing, FDA pathways, building hardware). This is what turns a
  portfolio into a reason to follow you.
- Real metrics in the stat counters as the project grows.

**Phase 4 — Polish**
- Custom OG image per page, analytics (privacy-friendly, e.g. Plausible),
  and an accessibility + performance audit pass.
