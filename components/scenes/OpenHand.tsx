'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CHAPTER 19 — OPEN HANDS
 *
 * You are given something and told nothing. Holding it does not advance the
 * page — holding it never will. The page opens when you let go, and the
 * reader arrives at the chapter's argument a few seconds before it is written
 * down. That gap is the point, so nothing here explains itself early.
 *
 * Accessibility does not get to be the thing that spoils it: the object is a
 * real button, Space and Enter hold and release it exactly as a pointer does,
 * and anyone who cannot press-and-hold is offered a plain control — but only
 * after a long enough hold that they have already felt the nothing.
 */
export default function OpenHand({ children }: { children?: React.ReactNode }) {
  const [held, setHeld] = useState(false);
  const [released, setReleased] = useState(false);
  const [longHold, setLongHold] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (held && !released) {
      timer.current = window.setTimeout(() => setLongHold(true), 7000);
    } else if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [held, released]);

  const grab = () => { if (!released) setHeld(true); };
  const letGo = () => {
    if (!held || released) return;
    setHeld(false);
    setReleased(true);
  };

  return (
    <div data-scene="open-hand" className="monument-break my-[clamp(3rem,8vw,6rem)]">
      <div className="mx-auto flex min-h-[70svh] max-w-[46rem] flex-col items-center justify-center text-center">
        <button
          type="button"
          onPointerDown={grab}
          onPointerUp={letGo}
          onPointerLeave={() => { if (held) letGo(); }}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); grab(); } }}
          onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); letGo(); } }}
          disabled={released}
          aria-label={released ? 'Let go' : 'Something to hold'}
          className="relative flex h-52 w-52 touch-none select-none items-center justify-center rounded-full border-0 bg-transparent p-0 disabled:cursor-default"
        >
          {/* the light */}
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: released ? '3rem' : held ? '4.5rem' : '5.5rem',
              height: released ? '3rem' : held ? '4.5rem' : '5.5rem',
              background: 'radial-gradient(circle at 38% 34%, oklch(96% 0.09 88), oklch(78% 0.15 62))',
              boxShadow: `0 0 ${held ? 40 : 90}px ${held ? 6 : 22}px var(--accent-wash)`,
              opacity: released ? 0 : 1,
              transform: released ? 'translateY(-22rem) scale(0.7)' : held ? 'scale(0.94)' : 'scale(1)',
              transition: released
                ? 'transform 3.4s cubic-bezier(0.2,0.6,0.25,1), opacity 3.2s ease-out, width 3s, height 3s'
                : 'transform 700ms var(--ease-out-soft), width 700ms var(--ease-out-soft), height 700ms var(--ease-out-soft), box-shadow 700ms',
            }}
          />
          {/* the hand, closing and opening */}
          <svg viewBox="0 0 100 100" className="relative h-52 w-52" aria-hidden>
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity={released ? 0.55 : 0.42}
              style={{ transition: 'opacity 1.2s' }}
            >
              {[
                { open: 'M30 74 C24 58 26 40 30 30', closed: 'M30 74 C28 62 34 52 40 48' },
                { open: 'M42 76 C38 56 40 34 43 24', closed: 'M42 76 C40 60 46 50 52 46' },
                { open: 'M54 76 C52 56 56 34 59 26', closed: 'M54 76 C53 60 58 50 63 47' },
                { open: 'M66 74 C66 58 70 42 74 34', closed: 'M66 74 C66 60 70 52 74 50' },
              ].map((f, i) => (
                <path key={i} d={held ? f.closed : f.open} style={{ transition: 'd 900ms var(--ease-out-soft)' }} />
              ))}
              <path d="M26 76 C40 88 62 88 72 76" />
            </g>
          </svg>
        </button>

        <div className="mt-8 min-h-[8rem]">
          {/* Nothing is said until it is earned. */}
          {longHold && !released && (
            <p className="label" style={{ animation: 'fade-in 1.4s var(--ease-out-soft) forwards' }}>
              nothing happens while you hold it.
              <button
                type="button"
                onClick={() => { setHeld(false); setReleased(true); }}
                className="ml-3 underline underline-offset-4 hover:text-[var(--page-ink)]"
              >
                let go
              </button>
            </p>
          )}

          {released && (
            <div style={{ animation: 'fade-in 2.2s var(--ease-out-soft) 900ms both' }}>
              <p className="font-display text-[clamp(1.6rem,5vw,3.2rem)] italic leading-tight">
                that isn&#39;t holding.
                <span className="mt-1 block">it&#39;s offering.</span>
              </p>
              {children && <div className="mt-8">{children}</div>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(0.6rem); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
