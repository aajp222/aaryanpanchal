# aaryanpanchal.com — Design

The thinking behind the site. It doubles as the brief.

Two audiences, one place. A recruiter should understand in thirty seconds that
this is an engineer and builder with an unusually strong creative identity. A
curious person should be able to spend an hour and come away feeling they know
how he thinks.

The site does not hide the second thing. **Becoming** is in the navigation.

---

## 1. The metaphor

Not darkness. **Light entering something that used to be stone.**

A seven-year-old, after his parents separated and he spent six months in India,
told his father *mera dil patthar ho gaya* — my heart became stone — and meant it
as armour. Fifteen years later he found Ezekiel 36:26: *I will take the heart of
stone out of your flesh and give you a heart of flesh.* The site is the space
between those two sentences.

So the whole thing lives in daylight. Black is a text colour here, never a page
colour. Two chapters are deliberate exceptions — **Apart** goes to a pale dusk,
**Psalms** begins at night and arrives at dawn — and the story returns to
daylight after each.

---

## 2. Architecture

```
/                  home
/work · /work/episafe · /builds · /about · /book       the surface
/writing           the instrument + the archive
/writing/[slug]    one piece
/becoming          contents of the book
/becoming/[slug]   20 chapters + 6 side chapters
/play.html · /void.html · /crm.html                    after hours (dark, on purpose)
```

Content is MDX read at build time, frontmatter validated by Zod
(`lib/schema.ts`), loaded through `lib/content.ts`, rendered with
`next-mdx-remote/rsc`. Adding a chapter or a poem means adding a file.

**Poems are not markdown.** Piece bodies render as preformatted text so lowercase,
odd capitalisation, misspellings, ragged breaks and unfinished last lines all
survive exactly as written. That is the point of the archive.

---

## 3. The colour arc

Every chapter is one setting of the same stylesheet. `lib/palette.ts` gives each
slug an OKLCH ground and accent, a `chroma` dial and a `becoming` position;
`components/ui/Tinted.tsx` applies them as custom properties, and
`app/globals.css` re-derives everything downstream inside `:root, .chapter`.

```css
--accent: oklch(var(--accent-l) calc(var(--accent-c) * var(--chroma)) var(--accent-h));
```

One multiplication is the whole mechanism. `--chroma: 0` leaves Stone in bright,
chromaless greys; `--chroma: 1` gives Flesh and Becoming the full spectrum. The
contents page shows the arc as a column of swatches, so it is legible at a glance.

| | | | |
|---|---|---|---|
| 01 Stone · graphite, chroma 0 | 02 India · marigold | 03 Want · ochre | 04 Search · sky |
| 05 Her · blush | 06 Love · sunset gold | 07 Faith · verdant | 08 Boundaries · limestone |
| 09 Apart · pale dusk | 10 Baptism · white + gold | 11 Return · bare paper | 12 Psalms · night → dawn |
| 13 Still Love · red | 14 Goodbye · rain | 15 Flesh · amber + skin | 16 Ghosts · pale wash |
| 17 Jealousy · hot vs cool | 18 Trust · steel | 19 Open Hands · sky | 20 Becoming · morning |

Surface pages sit on the same arc (`home`, `work`, `builds`, `writing`, `about`,
`book`), which is why the site changes colour on every route and still reads as
one place. Grounds stay near paper; the accent is what moves.

**Two accent tokens.** `--accent` is tuned for fills, rules and shapes.
`--accent-ink` is the same hue mixed toward the page ink, for anything that is
*text* — the bright accent fails contrast at small sizes on the palest chapters.
Secondary inks and rules are mixed from `--page-ink` toward `--ground` for the
same reason, so they stay legible on a dark chapter without special-casing.

---

## 4. Type

- **Fraunces** for display. Chosen for its variable `SOFT` and `WONK` axes, which
  are driven from the same per-chapter `--becoming` number as the colour. The
  letterforms are geometric and flat-terminaled in Stone and soft and wonky by
  Flesh. The typeface performs the transformation.
- **Paul Grotesk** (already Aaryan's) for navigation, professional pages and
  chapter body copy. The serif is reserved for monuments, poems and ledgers —
  that contrast is what makes a poem read as a poem.
- **JetBrains Mono** for chapter numbers, ledger labels and metadata.

Scale is storytelling. `<Monument>` gives one sentence a whole viewport where it
earns it: *I NEEDED GOD.* / *hi.* / *THE LOVE WAS NOT THE PROBLEM.* /
*FEELINGS ARE NOT FACTS.* / *TAKE THE STONE.*

> `<Monument>` renders a `<div>` with `role="heading"` rather than a real heading
> element. MDX wraps block children in a `<p>`, and neither `<p>` nor a heading
> may contain one — this keeps the HTML valid whatever a chapter puts inside.

---

## 5. `<Ledger>` — the recurring device

The site's most load-bearing component, and its philosophy in a data model.

`memory · fact · feeling · question · poem · prayer · anger · interpretation · later`

Something written in pain is not automatically history. Chapter 17 is built
almost entirely from it — *I saw two people sitting closely* → *I felt replaced*
→ *those are not the same statement* — and the same `kind` values are the
archive's filter facets, so the distinction is structural rather than decorative.

---

## 6. Scenes

Motion communicates or it doesn't ship. Each scene makes its chapter's argument
before the chapter states it.

| Chapter | Scene | What it does |
|---|---|---|
| 01 Stone | `Stone` | A bright slab. Striking it cracks it, and light comes through the crack — the only colour in the chapter, and the first in the whole book. |
| 03 Want | `Crowded` | Opens overfull. Scrolling *removes*. Ends with `am i full?` |
| 07 Faith | `Dependencies` | One cup, and the strangers holding it up. |
| 09 Apart | `Bookmark` | A ribbon. The sentence stops and stays stopped. |
| 12 Psalms | `PsalmScroll` | 95 → 151, and the chapter's own ground goes night → dawn as you read. |
| 17 Jealousy | `SplitPerception` | A divider between what I saw and what I felt. Dragging never changes the facts. |
| 19 Open Hands | `OpenHand` | Holding does nothing, forever. The page opens when you let go. |
| /writing | `Instrument` | Press a letter: a shape, a synthesised tone, a poem. The ground takes the key's colour. |

Every scene keeps its content under `prefers-reduced-motion` and is fully
keyboard-operable — Open Hands takes Space to hold and release, and offers a
plain control after a long hold for anyone who can't press-and-hold. Sound is
off until asked for, and is oscillators only: no audio files, nothing copyrighted.

---

## 7. Names

No third party is named anywhere — not in a chapter, not in a poem, not in the
page source. They are *her*, *a friend*, *my father*, *another man*,
*[redacted]*, rendered through `<Redacted>` so the absence is visible rather than
silent.

`npm run build` runs two guards (`scripts/check-names.mjs`): an exact check
against a gitignored `private/names.local.txt` that is never committed or bundled
and whose contents are never printed even on failure, and a listless heuristic
that flags capitalised words sitting where names sit. Details in
`content/README.md`.

Hidden is not private. Anything genuinely sensitive does not belong in a public
repo at all.

---

## 8. The emotional rule

She is not the villain. He is not the hero. Two people loved each other, both
made mistakes, circumstances were real, trust got complicated, and one of them
had to decide what kind of heart he wanted afterwards.

Anger stays anger and is labelled as anger. The story does not resolve, does not
promise reconciliation, does not turn grief into revenge or faith into certainty,
and does not make another person responsible for one man's transformation.

It ends *still becoming*, because he is.

---

## 9. The Map

`/becoming/map` — the knowledge map, and the one page that is entirely derived
rather than authored.

`lib/graph.ts` reads every theme tagged on a chapter or a piece. Each theme
becomes a node; two themes on the same document get an edge. Nothing is
positioned by hand, which means the map redraws itself as the archive grows and
can show Aaryan relationships he didn't arrange.

Every visual property carries information:

| Property | Means |
|---|---|
| Position on the ring | Mean chapter position — so the circle is the book, read clockwise. `india` and `childhood` sit at the top; `surrender` and `flesh` come back round to meet them. |
| Size | How much has been written about it. |
| Hue | The chapter the concept belongs to — `faith` verdant, `trust` steel, `love` gold, `surrender` sky. |
| Chroma | How far along the stone → flesh arc it sits, so the ring brightens clockwise. |
| Chords | Themes that genuinely co-occur, weighted by how often. |

Edges below weight 2 are dropped as noise; the rest sit at 13% opacity so the
resting state is a constellation, and selecting a concept lights only its own.

Selecting one opens what the brief asked for: what it connects to, the chapters
it runs through, everything written about it, the raw → shaped pairs where a
thought was caught mid-change, and — the point — **where the writing disagrees
with itself**. `contradicts` is declared in frontmatter and read from either
side. The first one it surfaces is the whole site: *mera dil patthar ho gaya*
vs *take the stone*.

Ring nodes are real focusable buttons with `aria-pressed`; below the
sm breakpoint the labels drop and the ring becomes a pure constellation, with a
chip list carrying the names. The panel is always text, so nothing depends on
being able to read the graph.


---

## 10. The gates

Chapters 01–04 are open, because nobody should hit a lock before they are
invested — by *I NEEDED GOD* at the end of Search, the reader is committed.
From 05 on, each chapter asks one question first, and the answer is always in
the chapter just finished. The only thing being tested is whether you read.

Baptism is deliberately harder: four questions drawn from the whole first half,
standing in front of the one chapter that is about refusing to treat baptism as
a transaction. The gate and the chapter argue the same thing.

A locked chapter withholds its **name** as well as its text — contents page,
chapter navigation, the map, the archive, the browser tab. It shows a redaction
bar instead, at a fixed width so it cannot leak how long the title is. Both
states are rendered and CSS chooses, keyed off `data-unlocked` on `<html>`, so
nothing is ever briefly visible before being masked.

Mechanically: clues in `lib/gates.ts` (server-only — answers are hashed at build
time and only hashes cross to the client), a pre-paint script in
`LockScript.tsx` that sets `data-locked` and `data-unlocked` on `<html>` before
anything renders, `LockSync.tsx` re-applying the same decision on every
client-side navigation, and progress in `localStorage`.

> The soft-navigation half matters more than it sounds. Next routes between
> pages without reloading, so a script that only runs on a cold load never runs
> again — which meant every chapter opened the moment you arrived by clicking a
> link, which is how everybody arrives.

Three decisions worth keeping:

- **It fails open.** No storage, no JavaScript, or a crawler — the writing shows.
  Being locked out of an autobiography by a browser setting is a worse outcome
  than an unearned read.
- **Matching is generous.** Case, punctuation, accents, articles and stray
  spaces are discarded. The question is "did you read this", not "can you spell it".
- **Gated chapters are `noindex` and out of the sitemap**, since a crawler can
  never answer. 01–04 stay indexable, so the opening of the story is still findable.

It is a ritual, not security: the text is in the page source either way. That is
the same honesty the redaction guard is built on — hidden is not private.
