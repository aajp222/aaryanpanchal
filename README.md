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

- [ ] Replace the **two placeholder project cards** in the Work section.
- [ ] Add a real **EpiSafe photo** (swap the animated placeholder in `.feature-visual`).
- [ ] Set your **GitHub** and **Resume** links (Connect section + footer).
- [ ] Add an **OG image** at `assets/img/og.png` (1200×630) for link previews.
- [ ] Confirm the **LinkedIn** URL is correct.
- [ ] (Optional) design a real **favicon**.

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
- Build a full **EpiSafe case study** page (`/episafe`): problem → research →
  prototypes → what's next, with real images.
- Add a one-click **resume download** in the nav.

**Phase 3 — Voice (ongoing)**
- A lightweight **Writing / Notes** section — short posts on what you're
  learning (biosensing, FDA pathways, building hardware). This is what turns a
  portfolio into a reason to follow you.
- Real metrics in the stat counters as the project grows.

**Phase 4 — Polish**
- Custom OG image per page, analytics (privacy-friendly, e.g. Plausible),
  and an accessibility + performance audit pass.
