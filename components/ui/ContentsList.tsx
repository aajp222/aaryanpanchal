'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UNLOCK_KEY, readUnlocked } from './unlocked';

export type ContentsEntry = {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  color: string;
  gated: boolean;
};

/**
 * The table of contents.
 *
 * Each row renders both states and lets CSS choose, driven by `data-unlocked`
 * on <html> — so a locked chapter's name is never briefly visible before being
 * masked. Only the counter and the resume link wait for mount, and neither of
 * them names anything.
 */
export default function ContentsList({ entries }: { entries: ContentsEntry[] }) {
  const [unlocked, setUnlocked] = useState<string[] | null>(null);

  useEffect(() => setUnlocked(readUnlocked()), []);

  const isOpen = (e: ContentsEntry) => !e.gated || (unlocked?.includes(e.slug) ?? false);
  const resume = entries.find((e) => !isOpen(e));
  const openCount = entries.filter(isOpen).length;

  const reset = () => {
    try { localStorage.removeItem(UNLOCK_KEY); } catch { /* nothing to clear */ }
    setUnlocked([]);
    document.documentElement.setAttribute('data-unlocked', '');
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
                  continue at chapter {String(resume.number).padStart(2, '0')}
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
        {entries.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/becoming/${c.slug}/`}
              className="group flex items-baseline gap-[clamp(1rem,3vw,2.5rem)] border-b border-[var(--color-rule-soft)] py-[clamp(1.1rem,2.2vw,1.7rem)]"
            >
              <span className="label w-8 shrink-0 tabular-nums">
                {String(c.number).padStart(2, '0')}
              </span>

              <span className="flex flex-1 flex-wrap items-baseline gap-x-5 gap-y-1">
                {/* open: the real name and subtitle */}
                <span
                  className="ch-name font-display text-[clamp(1.6rem,4.4vw,3rem)] leading-none transition-opacity group-hover:opacity-60"
                  data-slug={c.slug}
                >
                  {c.title}
                </span>
                {c.subtitle && (
                  <span className="ch-name text-[0.95rem] text-[var(--color-ink-3)]" data-slug={c.slug}>
                    {c.subtitle}
                  </span>
                )}

                {/* locked: a bar of fixed width, and what it takes to open it */}
                {c.gated && (
                  <>
                    <span
                      className="ch-bar font-display text-[clamp(1.6rem,4.4vw,3rem)]"
                      data-slug={c.slug}
                      role="img"
                      aria-label="Locked chapter"
                      style={{ background: c.color }}
                    />
                    <span className="ch-hint label !normal-case !tracking-normal" data-slug={c.slug}>
                      one question to open
                    </span>
                  </>
                )}
              </span>

              <span className="flex items-center self-center">
                <span
                  aria-hidden
                  className={`${c.gated ? 'ch-dot' : ''} inline-block h-9 w-9 shrink-0 rounded-full`}
                  data-slug={c.gated ? c.slug : undefined}
                  style={{ background: c.color }}
                />
                {c.gated && (
                  <span
                    aria-hidden
                    className="ch-dot-locked inline-block h-9 w-9 shrink-0 rounded-full border border-dashed"
                    data-slug={c.slug}
                    style={{ borderColor: c.color }}
                  />
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
