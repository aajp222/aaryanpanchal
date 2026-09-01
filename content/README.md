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
