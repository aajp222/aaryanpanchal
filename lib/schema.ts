import { z } from 'zod';

/** The kinds a Ledger block can be. Doubles as the archive's filter facets —
 *  the philosophy and the data model are deliberately the same thing. */
export const LEDGER_KINDS = [
  'memory',
  'fact',
  'feeling',
  'question',
  'poem',
  'prayer',
  'anger',
  'interpretation',
  'later',
] as const;
export type LedgerKind = (typeof LEDGER_KINDS)[number];

export const THEMES = [
  'love', 'faith', 'stone', 'flesh', 'trust', 'anger', 'family', 'mortality',
  'india', 'childhood', 'god', 'doubt', 'control', 'food', 'humor', 'friendship',
  'grief', 'surrender', 'unfinished', 'music', 'poetry', 'question', 'memory',
  'engineering', 'work',
] as const;

export const chapterFrontmatter = z.object({
  title: z.string(),
  /** Position in the spine. Omitted for side chapters. */
  number: z.number().int().positive().optional(),
  subtitle: z.string().optional(),
  /** One sentence. Used on the contents page and as the meta description. */
  summary: z.string(),
  themes: z.array(z.string()).default([]),
  /** Chapters are public by default — this story is meant to be read. */
  index: z.boolean().default(true),
  /** Set when a chapter carries a bespoke scene component. */
  scene: z.string().optional(),
});
export type ChapterFrontmatter = z.infer<typeof chapterFrontmatter>;

export const pieceFrontmatter = z.object({
  title: z.string(),
  kind: z.enum(['poem', 'song', 'fragment', 'reflection', 'prayer', 'joke', 'draft', 'question']),
  /** Two states of one thought. Neither is presented as the better one. */
  state: z.enum(['raw', 'shaped']).default('shaped'),
  /** Slug of the raw sibling this was shaped from. */
  rawOf: z.string().optional(),
  /** Fuzzy dates are fine — "2024", "2025-03", "unknown". */
  date: z.string().optional(),
  themes: z.array(z.string()).default([]),
  /** Where it belongs in the story. */
  chapter: z.string().optional(),
  related: z.array(z.string()).default([]),
  /** Pieces this one disagrees with. The archive keeps its contradictions on
   *  purpose — a thought that changed is the whole point of keeping drafts. */
  contradicts: z.array(z.string()).default([]),
  version: z.number().int().positive().default(1),
  /** Raw and angry drafts stay out of search results unless opted in. */
  index: z.boolean().default(false),
  /** Which key on the instrument plays this piece. */
  key: z.string().length(1).optional(),
  /** Colours and timbre on the instrument. */
  tone: z.enum(['tender', 'bright', 'low', 'sharp', 'still', 'glad']).default('still'),
});
export type PieceFrontmatter = z.infer<typeof pieceFrontmatter>;
