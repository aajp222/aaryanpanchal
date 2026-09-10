'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export type ContentsEntry = {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  color: string;
  gated: boolean;
};

const KEY = 'becoming.unlocked';

/**
 * The table of contents, which knows what this reader has opened.
 *
 * It renders unlocked on the server and corrects itself on mount — the
 * opposite of the chapter pages, because here a brief flash of chapter titles
 * gives nothing away. The titles were never the secret.
 */
export default function ContentsList({ entries }: { entries: ContentsEntry[] }) {
  const [unlocked, setUnlocked] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      setUnlocked(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      setUnlocked([]);
    }
  }, []);

  const isOpen = (e: ContentsEntry) =>
    !e.gated || unlocked === null || unlocked.includes(e.slug);

  // Where to send someone who has lost their place.
  const resume = entries.find((e) => !isOpen(e));
  const openCount = entries.filter(isOpen).length;

  const reset = () => {
    try { localStorage.removeItem(KEY); } catch { /* nothing to clear */ }
    setUnlocked([]);
  };

  return (
    <>
      {unlocked !== null && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="label" aria-live="polite">
            {openCount} of {entries.length} open
            {resume && (
              <>
                <span className="mx-2 text-[var(--color-ink-4)]">·</span>
                <Link href={`/becoming/${resume.slug}/`} className="!text-[var(--accent-ink)] hover:underline">
                  continue at {resume.title}
                </Link>
              </>
            )}
          </p>
          {openCount > 4 && (
            <button type="button" onClick={reset} className="label hover:text-[var(--page-ink)]">
              start over
            </button>
          )}
        </div>
      )}

      <ol className="border-t border-[var(--color-rule-soft)]">
        {entries.map((c) => {
          const open = isOpen(c);
          return (
            <li key={c.slug}>
              <Link
                href={`/becoming/${c.slug}/`}
                className="group flex items-baseline gap-[clamp(1rem,3vw,2.5rem)] border-b border-[var(--color-rule-soft)] py-[clamp(1.1rem,2.2vw,1.7rem)]"
                aria-label={open ? undefined : `${c.title} — locked, one question to open`}
              >
                <span className="label w-8 shrink-0 tabular-nums">
                  {String(c.number).padStart(2, '0')}
                </span>
                <span className="flex flex-1 flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span
                    className="font-display text-[clamp(1.6rem,4.4vw,3rem)] leading-none transition-opacity group-hover:opacity-60"
                    style={{ opacity: open ? 1 : 0.45 }}
                  >
                    {c.title}
                  </span>
                  {open
                    ? c.subtitle && <span className="text-[0.95rem] text-[var(--color-ink-3)]">{c.subtitle}</span>
                    : <span className="label !normal-case !tracking-normal">one question to open</span>}
                </span>
                <span className="flex items-center self-center">
                  {open ? (
                    <span
                      aria-hidden
                      className="inline-block h-9 w-9 shrink-0 rounded-full"
                      style={{ background: c.color }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="inline-block h-9 w-9 shrink-0 rounded-full border border-dashed"
                      style={{ borderColor: c.color }}
                    />
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
