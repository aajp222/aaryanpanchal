'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CHAPTER 12 — PSALMS
 *
 * 95 to 151, and the night going with them. The chapter's own ground is
 * driven from here, so the room the reader is sitting in gets lighter as the
 * hours pass. No scripture is reproduced at length — the psalm numbers and
 * the clock are the whole event, because the act was the point.
 */

const FIRST = 95;
const LAST = 151;
const START_MIN = 1 * 60 + 20; // 1:20 am
const END_MIN = 4 * 60 + 30; // 4:30 am

const clock = (mins: number) => {
  const h24 = Math.floor(mins / 60) % 24;
  const m = Math.floor(mins % 60);
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'am' : 'pm'}`;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function PsalmScroll({
  /** OKLCH ground at 1:20am and at first light. */
  night = [26, 0.06, 278] as [number, number, number],
  dawn = [95, 0.03, 72] as [number, number, number],
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chapter = el.closest('.chapter') as HTMLElement | null;
    if (!chapter) return;

    // Reduced motion gets first light immediately — the room is still legible,
    // it just doesn't perform the passage of time.
    if (reduced) {
      chapter.style.setProperty('--ground-l', `${dawn[0]}%`);
      chapter.style.setProperty('--ground-c', String(dawn[1]));
      chapter.style.setProperty('--ground-h', String(dawn[2]));
      chapter.style.setProperty('--ink-l', '22%');
      setT(1);
      return;
    }

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setT(p);
      chapter.style.setProperty('--ground-l', `${lerp(night[0], dawn[0], p).toFixed(2)}%`);
      chapter.style.setProperty('--ground-c', lerp(night[1], dawn[1], p).toFixed(4));
      chapter.style.setProperty('--ground-h', lerp(night[2], dawn[2], p).toFixed(1));
      chapter.style.setProperty('--ink-l', `${lerp(94, 22, p).toFixed(2)}%`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      chapter.style.removeProperty('--ground-l');
      chapter.style.removeProperty('--ground-c');
      chapter.style.removeProperty('--ground-h');
      chapter.style.removeProperty('--ink-l');
    };
  }, [reduced, night, dawn]);

  const current = Math.min(LAST, FIRST + Math.floor(t * (LAST - FIRST + 1)));
  const minutes = lerp(START_MIN, END_MIN, t);
  const numbers = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);

  return (
    <div data-scene="psalms" ref={ref} className={`monument-break my-[clamp(3rem,8vw,6rem)] ${reduced ? '' : 'h-[420svh]'}`}>
      <div className={reduced ? '' : 'sticky top-0 flex h-svh flex-col justify-center'}>
        <div className="mx-auto flex w-full max-w-[54rem] items-center gap-[clamp(1.5rem,5vw,4rem)]">
          {/* The whole night, as a ruler. */}
          <ol aria-hidden className="hidden max-h-[70svh] flex-col flex-wrap gap-x-3 text-[0.62rem] leading-[1.35] sm:flex">
            {numbers.map((n) => (
              <li
                key={n}
                className="font-mono tabular-nums"
                style={{ opacity: n <= current ? 0.75 : 0.16, transition: 'opacity 400ms' }}
              >
                {n}
              </li>
            ))}
          </ol>

          <div className="flex-1">
            <p className="label">Psalm</p>
            <p className="font-display text-[clamp(5rem,20vw,14rem)] leading-[0.85] tabular-nums">
              {current}
            </p>
            <p className="label mt-6 tabular-nums">{clock(minutes)}</p>
            <p
              className="measure mt-8 font-display text-[clamp(1.1rem,2.4vw,1.6rem)] italic leading-snug"
              style={{ opacity: t > 0.9 ? 1 : 0, transition: 'opacity 1200ms var(--ease-out-soft)' }}
            >
              she woke up somewhere around a hundred and forty.
              <span className="mt-2 block">we admitted it was still there.</span>
            </p>
          </div>
        </div>
      </div>

      <p className="sr-only">
        From Psalm 95 to Psalm 151, read aloud over the phone between 1:20 in the morning and 4:30.
        She fell asleep partway through and woke near the end.
      </p>
    </div>
  );
}
