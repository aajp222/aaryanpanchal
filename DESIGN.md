# Aaryan Panchal — Design & Architecture

This is the thinking behind the site. It doubles as the brief: if you ever
hand the project to a designer or developer, this page tells them everything.

The goal in one line: **help a recruiter, EM, founder, or professor understand
who you are and what you've built in under 30 seconds — and want to keep
scrolling.**

---

## 1. Site Architecture

A **single, vertical, story-driven page** — fast, focused, and Apple-like.
One narrative beats a maze of pages for a personal site. The only candidate
for a second page is a deep EpiSafe case study (see roadmap).

```
/  (index.html)
├── Hero            — who you are, one sentence, two CTAs
├── Marquee         — capability ticker (fast credibility scan)
├── 01 · Work       — EpiSafe feature + two project cards
├── 02 · About      — the "question behind the question" narrative + fact list
├── 03 · Approach   — three operating principles
├── 04 · Capabilities — skills as a clean editorial index
├── 05 · Connect    — single clear CTA: email + socials
└── Footer          — status + colophon

Future:
/episafe  (case-study.html)  — full EpiSafe story (problem → research → build → next)
```

**Why this order:** proof before story. Recruiters and founders want to see
*what you built* (Work) before they read *who you are* (About). The Approach
and Capabilities sections then answer "how do you think?" and "what can you
do for me?" — the two questions an EM or collaborator is actually holding.

**Navigation model:** top nav (Work / About / Approach / Connect) for primary
jumps; a right-side index rail mirrors all sections with scroll-spy so the
viewer always knows where they are. Both collapse on mobile.

---

## 2. Page Layouts

Every section sits on a shared **1240px max-width grid** with fluid gutters
(`clamp(1.5rem, 5vw, 4rem)`). Whitespace is the primary design material.

| Section | Layout |
|---|---|
| **Hero** | Bottom-anchored. Content sits low-left over an ambient glow + dot grid. Eyebrow → huge serif name → tagline (max 30ch) → two CTAs. Scroll cue bottom-right. |
| **Marquee** | Full-bleed horizontal ticker, hairline borders top/bottom, mono caps. Pauses on hover. |
| **Work** | Header row (title + count). EpiSafe = 2-column feature card (visual ∣ body). Below it, a 2-up grid of secondary project cards sharing one rounded container. |
| **About** | Asymmetric 1.1fr / 0.9fr. Left: large light-weight narrative with serif pull-quote. Right: a `key → value` fact table. |
| **Approach** | Header + 3-column principle grid (stacks on mobile). |
| **Capabilities** | Editorial index: `number ∣ name ∣ description` rows with a hairline between each. Indents on hover. |
| **Connect** | Centered, single column, glow behind. Eyebrow → big serif headline → sub → email (underlined, magnetic) → socials. |
| **Footer** | Two-up: colophon left, live status badge right. |

**Responsive rules:** below 980px the rail hides and multi-column blocks stack;
below 620px the nav links and scroll cue hide. Type and spacing are fluid via
`clamp()`, so there are very few hard breakpoints to maintain.

---

## 3. Visual Design System

### Palette — warm dark (default)
The signature is **cool mist (`#BCCBCE`) on warm near-black** — soft blue-grey
against warm charcoal reads premium, editorial, and a little arty.

| Token | Dark | Role |
|---|---|---|
| `--bg` | `#0a0908` | page base (warm near-black) |
| `--bg-1 / 2 / 3` | `#100e0b → #1c1813` | surfaces, cards, hovers |
| `--line / --line-soft` | `#2a241c / #1a1611` | borders, hairlines |
| `--ink` | `#f4efe6` | primary text (warm white) |
| `--ink-2` | `#968f82` | secondary text |
| `--ink-3` | `#5b554b` | meta / muted |
| `--accent` | `#bccbce` | accent (links, eyebrows, highlights) |
| `--accent-2` | `#dbe6e8` | accent hover |
| `--on-accent` | `#0d1213` | text on accent fills |

A **warm paper light theme** mirrors every token (the accent darkens to
`#4f6970` for legibility on paper) and is persisted to `localStorage`. Dark is
the default and the star.

### Typography — a deliberate trio
- **Fraunces** (serif, optical) → display & headlines. The "arty / elegant" voice.
- **Inter** (sans) → body & UI. The "modern / clean" voice.
- **JetBrains Mono** → eyebrows, labels, numbers, metadata. The "technical / precise" voice.

That contrast — soft serif + neutral sans + crisp mono — is what makes the
page feel designed rather than templated. Type sizes are a fluid scale
(`--step--1` … `--step-4`).

### Texture & light
- **Film grain** overlay (SVG noise, ~5% opacity) — the single biggest "premium" tell.
- **Ambient glow** blobs drift slowly behind hero and connect.
- **Vignette** + **dot grid** add depth without clutter.

### Motion language
Calm and intentional, never bouncy. One easing curve (`cubic-bezier(.22,1,.36,1)`)
everywhere. **Everything is disabled under `prefers-reduced-motion`.**

The site leans on **native CSS scroll-driven animations**
(`animation-timeline: scroll() / view()` — see
[scroll-driven-animations.style](https://scroll-driven-animations.style)) for
scroll-position effects, with a JavaScript `requestAnimationFrame` fallback for
Safari/Firefox. A pre-paint script adds `.sd` to `<html>` when the browser
supports it so the right path runs with no flash. The catalogue:

- **Scroll progress bar** — tied to document scroll.
- **Scatter → assemble headlines** — section titles split into words that fly in
  from offset/blur and settle into clean, readable lines as they enter.
- **Kinetic background words** — giant ghost words (`WORK`, `WHY?`, `HOW`,
  `SKILLS`, `HELLO`) that drift horizontally as each section passes.
- **Velocity-reactive marquee** — the capability ticker speeds up and nudges
  direction with your scroll velocity (JS, since CSS can't read velocity).
- **Reveal-on-scroll**, **count-up stats**, **parallax/drift hooks**
  (`.parx` / `.drift` + `--par` / `--drift`), **magnetic buttons**, and a
  **custom cursor** (fine pointers only).

---

## 4. Component Inventory

Reusable pieces already built in `assets/`:

| Component | Where | Notes |
|---|---|---|
| Preloader | `#preloader` | AP mark + load bar + % counter; self-dismisses, never traps the page |
| Custom cursor | `#cur-dot` / `#cur-ring` | trailing ring + dot; fine-pointer only; grows on hover |
| Magnetic element | `.magnetic` | add the class to any button/link to make it pull toward the cursor |
| Section rail | `.rail` | scroll-spy index; add an `<a>` per section |
| Theme toggle | `.theme-btn` | persisted, no flash (pre-paint inline script) |
| Reveal | `.reveal` + `.d1…d5` | fade-up on scroll; delays for stagger |
| Count-up stat | `.count-up[data-to]` | animates a number into view |
| Marquee | `.marquee` | duplicate items once for a seamless loop |
| Feature card | `.feature` | the EpiSafe hero block (visual ∣ body) |
| Project card | `.proj` | secondary work; hover glow |
| Principle card | `.principle` | the Approach trio |
| Capability row | `.cap-row` | editorial index row |
| Status badge | `.status` | live "currently building" dot |

**Ideas to add later:** a deep case-study template, a writing/notes index,
an interactive EpiSafe device exploded-view, a downloadable resume button in
the nav, and an OG share image generator.

---

## 5. Copy Voice

Confident, plain, and warm — never buzzwordy. Lead with people and problems,
not adjectives. The "question behind the question" framing is the spine of the
whole site; it's what makes you memorable. Numbers (40+ interviews, 3
prototypes) do the bragging so the prose doesn't have to.

All section copy lives directly in `index.html` — edit it there.

---

## 6. What's a placeholder (replace before launch)

- The two secondary project cards in **Work** (clearly marked in the HTML).
- EpiSafe **product photo** — swap the animated placeholder for a real image.
- **GitHub** and **Resume** links in Connect + footer.
- **OG image** at `assets/img/og.png` (1200×630) for nice link previews.
- The favicon (currently an inline "A" — fine to keep, or design a real mark).
