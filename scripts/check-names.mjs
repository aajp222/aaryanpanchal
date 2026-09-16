#!/usr/bin/env node
/**
 * Two guards against a private name reaching the public build.
 *
 *  1. EXACT — `private/names.local.txt` lists the real names. It is gitignored,
 *     never committed and never bundled; this script is the only thing that
 *     reads it. Any hit in content/ fails the build. If the file is absent the
 *     check skips with a warning, so the repo still builds for anyone else.
 *
 *  2. HEURISTIC — needs no list at all. Flags capitalised words sitting in the
 *     positions names occupy ("Dear X", "X said", "X's", "with X"), minus an
 *     allowlist of words this story legitimately capitalises. Catches the slip
 *     that guard 1 can only catch if you remembered to write the name down.
 *
 * Run by `npm run build` before next build.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');
const LIST = path.join(ROOT, 'private', 'names.local.txt');

const ALLOWED = new Set([
  // Aaryan's own identity — this is his story to tell.
  'Aaryan', 'Panchal',
  // Places, institutions, scripture, and the vocabulary of the story.
  'India', 'Indian', 'Worcester', 'Massachusetts', 'America', 'American',
  'WPI', 'EpiSafe', 'SGA', 'GISA', 'WIRE', 'FDA', 'CAD', 'CFD',
  'God', 'Lord', 'Jesus', 'Christ', 'Christian', 'Christianity', 'Catholic',
  'Catholicism', 'Hindu', 'Hinduism', 'Mass', 'Psalm', 'Psalms', 'Ezekiel',
  'Bible', 'Scripture', 'Gospel', 'Church', 'Baptism', 'Advent', 'Easter',
  'English', 'Hindi', 'Gujarati', 'Take', 'Version', 'Chapter',
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
  // Grammatical sentence-starters that trip the possessive/vocative patterns.
  'I', 'She', 'He', 'They', 'We', 'You', 'It', 'That', 'This', 'There', 'Then',
  'And', 'But', 'So', 'My', 'Her', 'His', 'Their', 'Our', 'Your', 'A', 'An',
  'The', 'If', 'When', 'What', 'Who', 'Why', 'How', 'Where', 'Not', 'No', 'Yes',
  'Someone', 'Somebody', 'Everyone', 'Nobody', 'Dear', 'Redacted',
  // Ordinary capitalised words that sit in name-shaped positions.
  'People', 'Being', 'Nothing', 'Something', 'Everything', 'Love', 'God',
  'Faith', 'Trust', 'Stone', 'Flesh', 'Grief', 'Time', 'Water', 'Because',
  'After', 'Before', 'Which', 'Both', 'Every', 'Some', 'Most', 'Nobody',
]);

/** Positions a personal name occupies in a sentence. */
const PATTERNS = [
  { re: /\bDear\s+([A-Z][a-z]{2,})/g, why: 'vocative — "Dear X"' },
  { re: /\b([A-Z][a-z]{2,})\s+(?:said|told|asked|replied|texted|called|wrote)\b/g, why: 'attribution — "X said"' },
  { re: /\b([A-Z][a-z]{2,})'s\b/g, why: 'possessive — "X\'s"' },
  { re: /\b(?:with|to|from|for|about|and)\s+([A-Z][a-z]{2,})\s+(?:was|were|is|had|said|and|,)/g, why: 'named participant' },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.mdx') || p.endsWith('.md') ? [p] : [];
  });
}

const files = walk(CONTENT);
const rel = (f) => path.relative(ROOT, f);
let failures = 0;
let warnings = 0;

// ── Guard 1: the exact list ────────────────────────────────────────────
if (fs.existsSync(LIST)) {
  const names = fs
    .readFileSync(LIST, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  if (names.length) {
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      for (const name of names) {
        const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const lines = text.split('\n');
        lines.forEach((line, i) => {
          if (re.test(line)) {
            // Never print the name itself — printing it would defeat the point.
            console.error(`\x1b[31m✗ ${rel(file)}:${i + 1}\x1b[0m a name from the private list appears here.`);
            failures++;
          }
          re.lastIndex = 0;
        });
      }
    }
  }
  console.log(`  exact-name guard: ${names.length} name(s) checked across ${files.length} file(s)`);
} else {
  console.log('\x1b[33m  exact-name guard: skipped\x1b[0m — no private/names.local.txt (see content/README.md)');
}

// ── Guard 2: the listless heuristic ────────────────────────────────────
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const { re, why } of PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        const word = m[1];
        if (ALLOWED.has(word)) continue;
        console.warn(`\x1b[33m⚠ ${rel(file)}:${i + 1}\x1b[0m "${word}" reads like a name (${why}). Redact it or add it to ALLOWED.`);
        warnings++;
      }
    }
  });
}

if (failures) {
  console.error(`\n\x1b[31mBuild stopped: ${failures} private name(s) in content.\x1b[0m`);
  process.exit(1);
}
console.log(`  name check passed${warnings ? ` with ${warnings} thing(s) to look at` : ''}.`);
