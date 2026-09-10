import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { chapterFrontmatter, pieceFrontmatter, type ChapterFrontmatter, type PieceFrontmatter } from './schema';

const ROOT = path.join(process.cwd(), 'content');
const BECOMING = path.join(ROOT, 'becoming');
const SIDE = path.join(BECOMING, 'side');
const WRITING = path.join(ROOT, 'writing');

export type Chapter = ChapterFrontmatter & { slug: string; body: string; side: boolean };
export type Piece = PieceFrontmatter & { slug: string; body: string };

function readDir(dir: string): { slug: string; raw: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, ''), raw: fs.readFileSync(path.join(dir, f), 'utf8') }));
}

function parseChapters(dir: string, side: boolean): Chapter[] {
  return readDir(dir).map(({ slug, raw }) => {
    const { data, content } = matter(raw);
    const parsed = chapterFrontmatter.safeParse(data);
    if (!parsed.success) {
      throw new Error(`content/becoming${side ? '/side' : ''}/${slug}.mdx — ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
    }
    return { ...parsed.data, slug, body: content, side };
  });
}

let _chapters: Chapter[] | null = null;

/** The twenty-chapter spine, in order, followed by the side chapters. */
export function getChapters(): Chapter[] {
  if (_chapters) return _chapters;
  const spine = parseChapters(BECOMING, false).sort((a, b) => (a.number ?? 999) - (b.number ?? 999));
  const side = parseChapters(SIDE, true).sort((a, b) => a.title.localeCompare(b.title));
  _chapters = [...spine, ...side];
  return _chapters;
}

export function getSpine(): Chapter[] {
  return getChapters().filter((c) => !c.side);
}

export function getSideChapters(): Chapter[] {
  return getChapters().filter((c) => c.side);
}

export function getChapter(slug: string): Chapter | undefined {
  return getChapters().find((c) => c.slug === slug);
}

/** Previous and next along the spine. Side chapters sit outside the sequence. */
export function neighbours(slug: string): { prev?: Chapter; next?: Chapter } {
  const spine = getSpine();
  const i = spine.findIndex((c) => c.slug === slug);
  if (i === -1) return {};
  return { prev: spine[i - 1], next: spine[i + 1] };
}

let _pieces: Piece[] | null = null;

export function getPieces(): Piece[] {
  if (_pieces) return _pieces;
  _pieces = readDir(WRITING).map(({ slug, raw }) => {
    const { data, content } = matter(raw);
    const parsed = pieceFrontmatter.safeParse(data);
    if (!parsed.success) {
      throw new Error(`content/writing/${slug}.mdx — ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
    }
    return { ...parsed.data, slug, body: content };
  });
  return _pieces;
}

export function getPiece(slug: string): Piece | undefined {
  return getPieces().find((p) => p.slug === slug);
}

export function piecesForChapter(chapterSlug: string): Piece[] {
  return getPieces().filter((p) => p.chapter === chapterSlug);
}

/** Every theme actually in use, with counts, most-used first. */
export function themeIndex(): { theme: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getPieces()) for (const t of p.themes) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count || a.theme.localeCompare(b.theme));
}
