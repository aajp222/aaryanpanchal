# content/

Everything readable on this site lives here. Nothing needs a developer.

```
content/
  becoming/01-stone.mdx … 20-becoming.mdx   the spine, in order
  becoming/side/*.mdx                       chapters beside the story
  writing/*.mdx                             the archive — one file per piece
```

---

## Adding a piece of writing

Create `content/writing/<slug>.mdx`. Frontmatter, then the text.

```mdx
---
title: trying
kind: poem          # poem | song | fragment | reflection | prayer | joke | draft | question
state: shaped       # raw | shaped
rawOf: trying-raw   # slug of the raw sibling, if there is one
date: "2025"        # fuzzy is fine — "2024", "2025-03", omit entirely
themes: [surrender, love, control]
chapter: 19-open-hands
related: [trying-raw]
contradicts: [take-the-stone]   # a piece this one disagrees with
version: 2          # take 1 / take 2 / take 3
index: false        # false keeps it out of search results (the default)
key: o              # which key on the instrument plays it
tone: tender        # tender | bright | low | sharp | still | glad
---
trying,
its not a chain, not a lock,
not even a weight.
```

**The body is not markdown.** It renders exactly as typed — lowercase, odd
capitalisation, misspellings, ragged line breaks, an unfinished last line. That
is deliberate. Nothing reflows it and nothing tidies it.

To show a thought changing, write two files and point the shaped one at the raw
one with `rawOf`. The site offers them as a toggle, with neither labelled as the
better one.

`contradicts` is for the other kind of change — where you simply disagree with
something you wrote before, and both are staying. The Map collects these under
*disagrees with itself*; it reads the link from either side, so you only need to
declare it once.

## Adding a chapter

`content/becoming/<nn>-<slug>.mdx`, or `content/becoming/side/<slug>.mdx` for one
beside the story.

```mdx
---
title: Stone
number: 1           # position in the spine; omit for a side chapter
subtitle: A sentence I said when I was seven.
summary: One sentence — used on the contents page and as the meta description.
themes: [stone, childhood]
index: true         # chapters are public by default
---
```

The body **is** MDX, so a chapter can reach for `<Monument>`, `<Ledger>`,
`<Poem>`, `<Piece id="…" />`, `<Redacted />`, `<Plate>`, `<Pause>`, `<Break>`
and any of the scenes. See `components/mdx.tsx` for the full list.

Its colour and its position on the stone→flesh arc come from `lib/palette.ts`,
keyed by slug. A chapter with no entry there falls back to a neutral setting.

---

## Names

**No third party is ever named on this site.** Not in a chapter, not in a poem,
not in the page source. They are `her`, `a friend`, `my father`, `another man`,
`[redacted]` — use the `<Redacted>` component so the absence is visible rather
than silent.

Two guards run before every build (`npm run build`):

**1. The exact list.** Create `private/names.local.txt` — one name per line,
`#` for comments. It is gitignored, never committed, and never bundled; the
check script is the only thing that reads it. If any name in it appears
anywhere in `content/`, the build fails and prints the file and line **without
printing the name**.

```
# private/names.local.txt — never commit this file
Firstname
Firstname Lastname
```

**2. The heuristic**, which needs no list at all. It flags capitalised words
sitting where names sit — `Dear X`, `X said`, `X's` — minus an allowlist of
words this story legitimately capitalises. It catches the slip you'd only catch
with guard 1 if you'd remembered to write the name down. Add false positives to
`ALLOWED` in `scripts/check-names.mjs`.

Neither guard is a substitute for reading what you wrote. Hidden is not the same
as private: anything genuinely sensitive does not belong in a public repo at all.


---

## The gates

Chapters 01–04 are open. From **05** on, each chapter asks one question before
it opens, and the answer is always in the chapter you just finished — never a
riddle, never a hunt. **10 — Baptism** is the exception: it asks four questions
drawn from the whole first half, and it sits directly in front of the chapter
about refusing to let baptism become a transaction.

Clues live in `lib/gates.ts`, one entry per chapter:

```ts
{ slug: '06-love', from: '05-her', questions: [{
  prompt: 'Finish it — "it felt like i\u2019d been ____, not introduced."',
  answers: ['found'],
}]},
```

List every phrasing you would accept in `answers`. Matching is already generous
— case, punctuation, accents, articles and stray spaces are all discarded — so
you only need genuinely different answers, not spelling variants.

**Answers never reach the browser.** `lib/gates.ts` is server-only; pages hash
the answers at build time and hand the gate component only the hashes. That
keeps them out of view-source.

### What a lock actually does

- A locked chapter renders the gate instead of the writing. A script in
  `LockScript.tsx` runs before the page paints, so the text never flashes and
  a returning reader never sees the gate flash either.
- Progress lives in `localStorage` under `becoming.unlocked`. The contents page
  shows how many are open, offers a *continue at…* link, and has a *start over*
  control once you're past the free four.
- If `localStorage` is unavailable — a private window, blocked site data — the
  gate **fails open** and the reader gets the writing. Being locked out of
  someone's autobiography by a browser setting is worse than an unearned read.
- Gated chapters carry `noindex` and are kept out of the sitemap: a crawler can
  never answer the question, so from its point of view they are always locked.
  Chapters 01–04 stay indexable, which keeps the opening of the story findable.

**This is a ritual, not security.** The site is a static export, so every
chapter's text is in the page source whether it is locked or not, and turning
off JavaScript shows everything. The gate is there to pace a reader who wants
to be paced — it is not protection, and nothing genuinely private should rely
on it.
