'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type Entry = {
  slug: string;
  title: string;
  kind: string;
  state: 'raw' | 'shaped';
  date?: string;
  themes: string[];
  chapter?: string;
  chapterTitle?: string;
  version: number;
  hasSibling: boolean;
  excerpt: string;
};

/**
 * Keyword search finds a word. These find a *shape* — the pairs where a thought
 * changed, the places the archive disagrees with itself, the love that has
 * nothing to do with romance. Each one is a predicate, not a string match.
 */
const LENSES: { label: string; hint: string; test: (e: Entry) => boolean }[] = [
  { label: 'everything about trust', hint: 'trust, faith, doubt', test: (e) => ['trust', 'faith', 'doubt'].some((t) => e.themes.includes(t)) },
  { label: 'what changed', hint: 'pieces that exist in two states', test: (e) => e.hasSibling },
  { label: 'love that isn’t romantic', hint: 'family, friendship, God', test: (e) => e.themes.includes('love') && ['family', 'friendship', 'god', 'humor'].some((t) => e.themes.includes(t)) },
  { label: 'still unfinished', hint: 'raw, unresolved, stopped early', test: (e) => e.state === 'raw' || e.themes.includes('unfinished') },
  { label: 'written in anger', hint: 'not evidence, kept anyway', test: (e) => e.themes.includes('anger') || e.kind === 'draft' },
  { label: 'the stupid ones', hint: 'jokes, and one entire song', test: (e) => e.kind === 'joke' || e.themes.includes('humor') },
];

export default function ArchiveBrowser({ entries, themes }: { entries: Entry[]; themes: { theme: string; count: number }[] }) {
  const [lens, setLens] = useState<number | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    let out = entries;
    if (lens !== null) out = out.filter(LENSES[lens].test);
    if (theme) out = out.filter((e) => e.themes.includes(theme));
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      out = out.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.excerpt.toLowerCase().includes(needle) ||
          e.themes.some((t) => t.includes(needle))
      );
    }
    return out;
  }, [entries, lens, theme, q]);

  const clear = () => { setLens(null); setTheme(null); setQ(''); };
  const filtered = lens !== null || theme !== null || q.trim() !== '';

  return (
    <div>
      <div className="border-t border-[var(--color-rule-soft)] pt-8">
        <p className="label mb-4">Show me…</p>
        <div className="flex flex-wrap gap-2">
          {LENSES.map((l, i) => (
            <button
              key={l.label}
              type="button"
              onClick={() => setLens(lens === i ? null : i)}
              aria-pressed={lens === i}
              title={l.hint}
              className={`rounded-full border px-4 py-1.5 text-[0.86rem] transition-colors ${
                lens === i
                  ? 'border-transparent bg-[var(--page-ink)] text-[var(--ground)]'
                  : 'border-[var(--color-rule)] hover:border-[var(--page-ink)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[var(--color-rule-soft)] pt-6">
        <label className="flex-1">
          <span className="sr-only">Search the archive</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="or search a word"
            className="w-full min-w-[12rem] border-b border-[var(--color-rule)] bg-transparent pb-2 outline-none placeholder:text-[var(--color-ink-4)] focus:border-[var(--accent)]"
          />
        </label>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {themes.slice(0, 12).map((t) => (
            <button
              key={t.theme}
              type="button"
              onClick={() => setTheme(theme === t.theme ? null : t.theme)}
              aria-pressed={theme === t.theme}
              className={`label !normal-case !tracking-normal transition-colors ${
                theme === t.theme ? '!text-[var(--accent-ink)]' : 'hover:text-[var(--page-ink)]'
              }`}
            >
              {t.theme}
              <span className="ml-1 !text-[var(--color-ink-4)]">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="label mt-6" aria-live="polite">
        {shown.length} of {entries.length}
        {filtered && (
          <button type="button" onClick={clear} className="ml-3 underline underline-offset-4 hover:text-[var(--page-ink)]">
            clear
          </button>
        )}
      </p>

      <ul className="mt-4">
        {shown.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/writing/${e.slug}/`}
              className="group grid gap-x-6 gap-y-2 border-b border-[var(--color-rule-soft)] py-6 md:grid-cols-[1fr_1.2fr]"
            >
              <div>
                <span className="font-display text-[clamp(1.2rem,2.4vw,1.7rem)] transition-opacity group-hover:opacity-60">
                  {e.title}
                </span>
                <span className="label mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{e.kind}</span>
                  {e.date && <span className="!text-[var(--color-ink-4)]">{e.date}</span>}
                  {e.hasSibling && <span className="!text-[var(--accent-ink)]">raw + shaped</span>}
                  {e.chapterTitle && <span className="!text-[var(--color-ink-4)]">ch. {e.chapterTitle}</span>}
                </span>
              </div>
              <p className="whitespace-pre-line font-display text-[0.98rem] italic leading-snug text-[var(--color-ink-2)]">
                {e.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="py-12 font-display text-xl italic text-[var(--color-ink-3)]">
          nothing in the archive matches that yet.
        </p>
      )}
    </div>
  );
}
