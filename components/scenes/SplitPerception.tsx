'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * CHAPTER 17 — JEALOUSY
 *
 * Two columns and a handle between them. Dragging changes how much of each
 * side you can see; it never changes what is in either one. That is the
 * whole lesson, built into the control rather than stated above it.
 */

const SAW = ['two people sitting close', 'laughing', 'talking easily', 'a hand near a hand', 'comfort'];
const FELT = ['replaced', 'cheated', 'forgotten', 'stupid for still caring', 'afraid I had made it all up'];

export default function SplitPerception() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(88, Math.max(12, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) setFromClientX(e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [setFromClientX]);

  return (
    <div data-scene="split-perception" className="monument-break my-[clamp(3rem,8vw,6rem)]">
      <div
        ref={ref}
        className="relative mx-auto grid max-w-[58rem] grid-cols-2 gap-0 overflow-hidden rounded-sm border border-[var(--color-rule-soft)] select-none"
      >
        {/* What I saw — cool, small, and short. */}
        <div
          className="px-[clamp(1rem,3vw,2.5rem)] py-[clamp(2rem,5vw,3.5rem)]"
          style={{
            background: 'oklch(96% calc(0.02 * var(--chroma)) 205)',
            width: `${pos}%`,
            minWidth: '100%',
          }}
        >
          <p className="label" style={{ color: 'oklch(48% calc(0.11 * var(--chroma)) 205)' }}>What I saw</p>
          <ul className="mt-5 space-y-2 font-display text-[clamp(1.05rem,2vw,1.4rem)] leading-snug">
            {SAW.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className="label mt-8 !normal-case !tracking-normal">Five things. That is the whole list.</p>
        </div>

        {/* What I felt — hot, and much longer than the evidence. */}
        <div
          className="px-[clamp(1rem,3vw,2.5rem)] py-[clamp(2rem,5vw,3.5rem)]"
          style={{ background: 'oklch(96% calc(0.028 * var(--chroma)) 32)' }}
        >
          <p className="label" style={{ color: 'oklch(52% calc(0.16 * var(--chroma)) 28)' }}>What I felt</p>
          <ul className="mt-5 space-y-2 font-display text-[clamp(1.05rem,2vw,1.4rem)] italic leading-snug">
            {FELT.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className="label mt-8 !normal-case !tracking-normal">All of it real. None of it evidence.</p>
        </div>

        {/* The handle. */}
        <div
          className="absolute inset-y-0 z-10 w-px bg-[var(--color-rule)]"
          style={{ left: `${pos}%` }}
          aria-hidden
        />
        <button
          type="button"
          role="slider"
          aria-label="Move the line between what I saw and what I felt"
          aria-valuemin={12}
          aria-valuemax={88}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% of the view given to what I saw`}
          onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPos((p) => Math.max(12, p - 4)); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setPos((p) => Math.min(88, p + 4)); }
          }}
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border border-[var(--color-rule)] bg-[var(--ground)] px-2.5 py-4 shadow-sm"
          style={{ left: `${pos}%` }}
        >
          <span aria-hidden className="block h-4 w-px bg-[var(--color-ink-3)]" />
        </button>
      </div>

      <p className="label mx-auto mt-5 max-w-[58rem] !normal-case !tracking-normal">
        Drag the line. Notice that nothing in either column changes.
      </p>
    </div>
  );
}
