# Aaryan Panchal — Design & Architecture

The thinking behind the site. It doubles as the brief.

Goal in one line: **help a recruiter, EM, founder, or professor understand who
Aaryan is and what he's built in under 30 seconds — and want to keep scrolling.**

This build combines two iterations: the Claude-Design "sohub-style" direction
(accurate EpiSafe content, real renders, Paul Grotesk, the fly-down phone, the
per-role theme-morph) with the polish layer from the earlier build (cursor,
section rail, scroll progress, 3D tilt, scatter headlines, preloader).

---

## 1. Site Architecture

A **single, vertical, role-driven homepage** + a **deep EpiSafe case study**.

```
/  (index.html)
├── Hero            — "Aaryan" / giant "Panchal" / EpiSafe phone floating in front
├── Marquee         — capability ticker
├── 01 · Work       — EpiSafe feature; the hero phone docks into the card here
├── 02 · Story      — "Discovery first, CAD second" → links to the case study
├── 03 · Proof      — Demo Day photo + real awards
├── SGA             — leadership; palette morphs to WPI crimson
├── 04 · About      — "question behind the question" + facts + photos
└── 05 · Connect    — email + socials, big "Panchal" footer wordmark

/episafe.html
└── Hero → device figure → stats → Problem → Build → gallery → How it works
    → Validation → Next → Connect
```

**Why this order:** proof before story. The work (EpiSafe) leads; the build,
awards, and leadership back it up; About and Connect close. Each role section
carries a `data-section-theme`, which drives the palette morph.

---

## 2. Signature Interactions

| Interaction | What it does |
|---|---|
| **Fly-down phone dock** | The hero phone is `position:fixed`; scroll progress interpolates its position/scale from hero-centre into the `#phoneSlot` in the EpiSafe card. *Note:* the hero's `z-index` is lifted while docking so the fixed phone reliably paints above later sections (a stacking-context fix over the prototype). |
| **Theme-morph** | Registered `@property --accent/--glow` animate; the JS sets `data-theme` to the role nearest mid-viewport. Orange → crimson → neutral, ~0.7 s tween. |
| **Theme-aware nav pill** | Label + link swap per role: Building EpiSafe → SGA Marketing → Open to work. |
| **Background FX** | Fixed, theme-coloured aurora (default, subtle), with mesh/grid/spotlight options, plus film grain + vignette. |
| **Polish** | Scroll-progress bar · section index rail (scroll-spy) · custom cursor + "View" label · 3D-tilt media cards · count-up stats · scatter→assemble headlines · preloader. |

All motion is disabled under `prefers-reduced-motion`; a safety net force-shows
any reveal that a paused-animation environment leaves hidden.

---

## 3. Visual Design System

### Palette — warm near-black, one accent that morphs
| Token | EpiSafe (default) | SGA | Neutral |
|---|---|---|---|
| `--accent` | `#f08a20` (orange) | `#d12a40` (crimson) | `#bdb9b1` |
| `--bg` | `#0a0a0b` | `#0c0708` | `#0a0a0b` |
| `--ink` / `--ink-2` / `--ink-3` | `#f6f5f3` / `#a3a2a8` / `#6a6970` | — | — |

One accent at a time, used sparingly. Low chroma; near-black, not pure black.

### Type
- **Paul Grotesk** (Thin / Regular / Bold, bundled `@font-face`) — the whole
  site, including the giant wordmarks. A heavy grotesque, sohub-adjacent.
- **JetBrains Mono** — eyebrows, labels, stats, meta.

### Texture & motion
Aurora glow (theme-coloured), film grain (~7%), vignette, drop-shadowed product
renders. One easing curve — `cubic-bezier(.22,1,.36,1)` — everywhere.

---

## 4. Component Inventory

`nav` (mix-blend-difference) · availability `pill` · `hero` (eyebrow + wordmark +
floating phone) · `marquee` · `feature` (media ∣ body) with the dockable
`phone-slot` · `stats` + `count` · `chips` · `poster-row` · `proof` + `award` ·
`about-grid` + `facts` · `connect` · `bigfoot` wordmark · `media` (reveal + zoom,
case study) · `cs-section` (sticky heading ∣ body) · `cs-gallery`.

Polish hooks: `#progress`, `#rail`, `#cur-ring`/`#cur-dot`, `.tilt`,
`.split-words`, `.reveal`, `.magnetic`, `[data-cursor="view"]`,
`[data-section-theme]`.

---

## 5. Copy Voice

Plain, confident, slightly literary, never buzzwordy. Lead with the human
problem (people don't carry their injector), let specifics (56%, 11.4 mm,
0.3 mg, $6.6B, real awards) do the proving. The "question behind the question"
line is the spine.

---

## 6. What to confirm / replace

- Award and stat wording (Demo Day placement, market size, dimensions, dose, 56%).
- GitHub + resume links (optional, in Connect / nav).
- Compress large renders (`demoday.jpg` ~10 MB) to WebP before launch.
- A real OG share image if you want richer link previews.

> The React "Tweaks panel" from the design prototype was intentionally dropped —
> it's a design-time control, not production. Its chosen defaults (subtle aurora,
> grain, vignette) are baked into the page head instead.
