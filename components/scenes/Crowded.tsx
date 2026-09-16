'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CHAPTER 03 — WANT
 *
 * The page arrives with too much on it. Scrolling does not add — it removes.
 * By the end there is almost nothing left, and the question is finally
 * quiet enough to hear.
 */

const WANTS = [
  'more', 'a girlfriend', 'a 4.0', 'the internship', 'to be picked first',
  'followers', 'a car', 'to be right', 'money', 'a better phone', 'respect',
  'the offer', 'to win', 'attention', 'to be the youngest one who', 'a title',
  'to be wanted', 'a bigger room', 'to be impressive', 'more', 'to matter',
  'to be enough', 'more', 'more',
];

/**
 * Placement.
 *
 * The first version scattered these at random percentages, which piled half of
 * them on top of each other in the middle of the screen — "the offer",
 * "a girlfriend" and "a title" were sitting in the same square inch and none of
 * them could be read. Crowded is the point of this scene; illegible is not,
 * because the reader is supposed to feel the weight of reading all of it before
 * watching it go.
 *
 * So the words sit in a grid — one per cell, which makes overlap structurally
 * impossible — and the scatter comes from where each word sits *inside* its own
 * cell, plus size and a degree or two of tilt. Same restless feel, every word
 * readable, and it reflows on any screen for free.
 */

/** Deterministic per-word, so the page looks the same on every visit. */
function jitter(i: number, n: number): number {
  const s = Math.sin(i * 374.7 + n * 91.3) * 10000;
  return s - Math.floor(s);
}

/** Long phrases get smaller type, so nothing has to fight its own cell. */
function sizeFor(word: string, i: number): string {
  const j = jitter(i, 3);
  if (word.length <= 6) return `clamp(1.5rem, ${(2.8 + j * 1.8).toFixed(2)}vw, ${(2.6 + j * 1.3).toFixed(2)}rem)`;
  if (word.length <= 14) return `clamp(1.1rem, ${(1.8 + j * 1).toFixed(2)}vw, ${(1.6 + j * 0.6).toFixed(2)}rem)`;
  return `clamp(0.88rem, ${(1.15 + j * 0.45).toFixed(2)}vw, ${(1.14 + j * 0.24).toFixed(2)}rem)`;
}

const ALIGN = ['start', 'center', 'end'] as const;

/**
 * The order they leave in. Array order would clear the grid top-left to
 * bottom-right like a wiper; scattering it makes the pile thin out from
 * everywhere at once, which is closer to how this actually went.
 * Deterministic, so it is the same on every visit.
 */
const EXIT_ORDER = WANTS.map((_, i) => i).sort(
  (a, b) => jitter(a, 7) - jitter(b, 7)
);
const EXIT_RANK = new Map(EXIT_ORDER.map((wordIndex, rank) => [wordIndex, rank]));

export default function Crowded() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  // Words leave one at a time across the first 80% of the scroll.
  const gone = Math.floor((progress / 0.8) * WANTS.length);
  const cleared = progress > 0.82;

  if (reduced) {
    return (
      <div data-scene="crowded" className="monument-break my-[clamp(3rem,8vw,6rem)]">
        <div className="mx-auto max-w-[46rem]">
          <p className="label mb-4">everything I wanted, at once</p>
          <p className="font-display text-[1.3rem] leading-relaxed text-[var(--color-ink-2)]">
            {WANTS.join(' · ')}
          </p>
          <p className="mt-16 font-display text-[clamp(2rem,6vw,4rem)] italic">am i full?</p>
          <p className="mt-6 font-display text-[clamp(1.2rem,2.5vw,1.8rem)] text-[var(--color-ink-2)]">
            not completely.
            <span className="mt-2 block">but fuller than i have ever been.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-scene="crowded" ref={ref} className="monument-break relative my-[clamp(3rem,8vw,6rem)] h-[320svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* The pile. One word per grid cell — they can crowd, but they
            cannot collide. */}
        <div
          aria-hidden
          className="absolute inset-0 grid grid-cols-2 content-between gap-x-4 gap-y-2 px-[clamp(1rem,5vw,4rem)] py-[clamp(2rem,6vw,4.5rem)] sm:grid-cols-3 lg:grid-cols-4"
        >
          {WANTS.map((w, i) => {
            const away = (EXIT_RANK.get(i) ?? i) < gone;
            return (
              <span
                key={`${w}-${i}`}
                className="whitespace-nowrap font-display italic leading-none text-[var(--color-ink-2)]"
                style={{
                  fontSize: sizeFor(w, i),
                  justifySelf: ALIGN[Math.floor(jitter(i, 1) * 3)],
                  alignSelf: ALIGN[Math.floor(jitter(i, 2) * 3)],
                  opacity: away ? 0 : 1,
                  transform: `rotate(${((jitter(i, 4) - 0.5) * 4).toFixed(2)}deg) translateY(${away ? '-2.5rem' : '0'})`,
                  transition: 'opacity 700ms var(--ease-out-soft), transform 900ms var(--ease-out-soft)',
                  filter: away ? 'blur(3px)' : 'none',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* What is left when the pile is gone */}
        <div
          className="relative rounded-sm px-8 py-6 text-center"
          style={{
            opacity: cleared ? 1 : 0,
            transform: cleared ? 'none' : 'translateY(1rem)',
            transition: 'opacity 1200ms var(--ease-out-soft), transform 1200ms var(--ease-out-soft)',
          }}
        >
          <p className="font-display text-[clamp(2.4rem,9vw,6rem)] italic leading-none">am i full?</p>
          <p
            className="mt-10 font-display text-[clamp(1.1rem,2.6vw,1.8rem)] leading-relaxed text-[var(--color-ink-2)]"
            style={{ opacity: progress > 0.9 ? 1 : 0, transition: 'opacity 1200ms var(--ease-out-soft)' }}
          >
            not completely.
            <span className="mt-1 block">but fuller than i have ever been.</span>
          </p>
        </div>
      </div>

      <p className="sr-only">
        A page crowded with everything I wanted, which empties as you scroll until one question is
        left: am I full? Not completely. But fuller than I have ever been.
      </p>
    </div>
  );
}
