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

/** Stable scatter — the same every visit, so the page has a memory of itself. */
function place(i: number) {
  const r = (n: number) => { const s = Math.sin(i * 374.7 + n * 91.3) * 10000; return s - Math.floor(s); };
  return {
    left: `${6 + r(1) * 84}%`,
    top: `${5 + r(2) * 86}%`,
    fontSize: `${0.85 + r(3) * 1.9}rem`,
    rotate: `${(r(4) - 0.5) * 14}deg`,
  };
}

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
    <div ref={ref} className="monument-break relative my-[clamp(3rem,8vw,6rem)] h-[320svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* The pile */}
        <div aria-hidden className="absolute inset-0">
          {WANTS.map((w, i) => {
            const p = place(i);
            const away = i < gone;
            return (
              <span
                key={`${w}-${i}`}
                className="absolute whitespace-nowrap font-display italic text-[var(--color-ink-2)]"
                style={{
                  left: p.left,
                  top: p.top,
                  fontSize: p.fontSize,
                  opacity: away ? 0 : 1,
                  transform: `rotate(${p.rotate}) translateY(${away ? '-2.5rem' : '0'})`,
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
          className="relative text-center"
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
