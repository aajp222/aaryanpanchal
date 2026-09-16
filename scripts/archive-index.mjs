#!/usr/bin/env node
/**
 * A tiny index of the writing archive for the terminal's `archive` command.
 * The terminal is a static HTML page with no build step of its own, so it
 * reads this file at runtime rather than importing the content layer.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SRC = path.join(process.cwd(), 'content/writing');
const OUT = path.join(process.cwd(), 'public/assets/archive-index.json');

const entries = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(SRC, f), 'utf8'));
    return {
      slug: f.replace(/\.mdx$/, ''),
      title: data.title,
      kind: data.kind,
      themes: data.themes ?? [],
      chapter: data.chapter ?? null,
      first: content.trim().split('\n')[0],
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

fs.writeFileSync(OUT, JSON.stringify(entries));
console.log(`  archive index: ${entries.length} entries → public/assets/archive-index.json`);
