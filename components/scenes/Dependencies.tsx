'use client';

import { useState } from 'react';

/**
 * CHAPTER 07 — FAITH  (and the FAITH IS aside)
 *
 * One ordinary cup, and the invisible people holding it up. The point is
 * wonder, not argument: by the time every line is lit, the reader has done
 * the counting themselves.
 */

const SUPPORTS = [
  { at: [12, 18], text: 'someone planted a tree they would not see fruit from' },
  { at: [82, 14], text: 'someone picked it by hand, in heat you and I have never stood in' },
  { at: [92, 44], text: 'someone drove it to a port' },
  { at: [86, 76], text: 'someone crossed an ocean with it' },
  { at: [50, 92], text: 'someone woke at four to open the shop' },
  { at: [10, 74], text: 'the water was clean, and nobody had to check' },
  { at: [6, 44], text: 'the grid stayed on all night while you slept' },
];

const CX = 50;
const CY = 50;

export default function Dependencies() {
  const [lit, setLit] = useState<number[]>([]);
  const all = lit.length === SUPPORTS.length;

  const toggle = (i: number) => setLit((l) => (l.includes(i) ? l : [...l, i]));

  return (
    <div data-scene="dependencies" className="monument-break my-[clamp(3rem,8vw,6rem)]">
      <div className="mx-auto max-w-[54rem]">
        <p className="label mb-6" aria-live="polite">
          {all ? 'every one of them a stranger' : `one cup — ${lit.length} of ${SUPPORTS.length} found`}
        </p>

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
          {/* The lines that were always there. */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {SUPPORTS.map((s, i) => (
              <line
                key={i}
                x1={CX} y1={CY} x2={s.at[0]} y2={s.at[1]}
                stroke="var(--accent)"
                strokeWidth="0.22"
                vectorEffect="non-scaling-stroke"
                style={{
                  opacity: lit.includes(i) ? 0.55 : 0,
                  transition: 'opacity 700ms var(--ease-out-soft)',
                }}
              />
            ))}
          </svg>

          {/* The ordinary thing in the middle. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16" aria-hidden>
              <path d="M12 20 h34 v18 a17 17 0 0 1 -34 0 z" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M46 24 h6 a7 7 0 0 1 0 14 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M14 50 h38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M22 12 c0 4 -4 4 -4 8 M32 10 c0 4 -4 4 -4 8 M42 12 c0 4 -4 4 -4 8"
                    fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"
                    style={{ opacity: all ? 1 : 0.35, transition: 'opacity 900ms' }} />
            </svg>
            <p className="label mt-2">a cup of coffee</p>
          </div>

          {/* The people. */}
          {SUPPORTS.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => toggle(i)}
              onFocus={() => toggle(i)}
              onClick={() => toggle(i)}
              aria-pressed={lit.includes(i)}
              className="absolute max-w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-sm px-2 py-1 text-left text-[0.82rem] leading-snug transition-colors"
              style={{
                left: `${s.at[0]}%`,
                top: `${s.at[1]}%`,
                color: lit.includes(i) ? 'var(--page-ink)' : 'var(--color-ink-4)',
              }}
            >
              <span
                aria-hidden
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: lit.includes(i) ? 'var(--accent)' : 'currentColor' }}
              />
              {lit.includes(i) ? s.text : '·····'}
            </button>
          ))}
        </div>

        <p
          className="mt-8 font-display text-[clamp(1.4rem,3.5vw,2.4rem)] italic"
          style={{ opacity: all ? 1 : 0, transition: 'opacity 1000ms var(--ease-out-soft)' }}
        >
          you trusted every one of them this morning, and you never once thought about it.
        </p>
      </div>
    </div>
  );
}
