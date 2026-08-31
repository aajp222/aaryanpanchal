'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { play, setEnabled, isEnabled, type Tone } from '@/lib/audio';

/**
 * THE INSTRUMENT — /writing
 *
 * Press a key: a shape blooms, a tone sounds, and if that letter has a piece
 * behind it, the piece opens. Playing the keyboard is browsing the archive.
 *
 * The whole alphabet responds, not just the mapped letters, because an
 * instrument that only answers on certain keys is a menu with extra steps.
 *
 * Everything it does is also available without it: the full archive is listed
 * underneath, sound is off until asked for, and reduced motion trades the
 * bloom for a quiet fade.
 */

export type Playable = {
  slug: string;
  title: string;
  key?: string;
  tone: Tone;
  kind: string;
  excerpt: string;
};

/** Vivid, flat, and warm enough to belong to this site. */
const COLORS = [
  'oklch(70% 0.17 62)',   // marigold
  'oklch(62% 0.16 32)',   // terracotta
  'oklch(58% 0.13 148)',  // verdant
  'oklch(66% 0.13 240)',  // sky
  'oklch(48% 0.14 262)',  // deep
  'oklch(74% 0.12 20)',   // blush
  'oklch(76% 0.15 88)',   // gold
  'oklch(56% 0.18 25)',   // brick
  'oklch(62% 0.15 320)',  // plum
];

type Burst = { id: number; shape: number; color: string; x: number; y: number; size: number };

let burstId = 0;

export default function Instrument({ pieces }: { pieces: Playable[] }) {
  const byKey = useRef(new Map<string, Playable>());
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [wash, setWash] = useState<string | null>(null);
  const [current, setCurrent] = useState<Playable | null>(null);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    byKey.current = new Map(pieces.filter((p) => p.key).map((p) => [p.key!.toLowerCase(), p]));
  }, [pieces]);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const strike = useCallback(
    (letter: string, origin?: { x: number; y: number }) => {
      const code = letter.charCodeAt(0) - 97;
      const piece = byKey.current.get(letter);
      setTouched(true);

      play(piece?.tone ?? 'still', code);

      const id = burstId++;
      const color = COLORS[Math.abs(code) % COLORS.length];
      // The ground takes the key's colour and keeps it until the next key —
      // patatap's move, and the reason the page feels played rather than browsed.
      setWash(color);
      setBursts((b) => [
        ...b.slice(-11),
        {
          id,
          shape: Math.abs(code) % 6,
          color,
          // Deterministic per letter, but always in a ring — the middle of
          // the stage belongs to the writing, not to the decoration.
          x: origin?.x ?? 50 + Math.cos((code * 2.399) % (Math.PI * 2)) * (34 + (code % 5) * 3.2),
          y: origin?.y ?? 50 + Math.sin((code * 2.399) % (Math.PI * 2)) * (30 + (code % 4) * 4),
          size: 22 + ((code * 17) % 34),
        },
      ]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2400);

      if (piece) setCurrent(piece);
    },
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || t?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      strike(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [strike]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setEnabled(next);
    if (next) play('bright', 4);
  };

  const mapped = pieces.filter((p) => p.key);

  return (
    <div className="relative">
      {/* ── the stage ── */}
      <div
        className="monument-break relative min-h-[70svh] overflow-hidden"
        style={{
          background: wash ? `color-mix(in oklab, ${wash} 16%, var(--ground))` : 'var(--color-cream)',
          transition: 'background-color 700ms var(--ease-out-soft)',
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {bursts.map((b) => (
            <Shape key={b.id} burst={b} reduced={reduced} />
          ))}
        </div>

        <div className="relative flex min-h-[70svh] flex-col items-center justify-center px-6 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[46rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: `radial-gradient(closest-side, ${wash ? `color-mix(in oklab, ${wash} 14%, var(--ground))` : 'var(--color-cream)'} 42%, transparent 100%)`,
              transition: 'background 700ms var(--ease-out-soft)',
            }}
          />
          {current ? (
            <div key={current.slug} className="relative max-w-[38rem]">
              <p className="label">{current.kind}</p>
              <p className="mt-4 whitespace-pre-line font-display text-[clamp(1.3rem,3vw,2.1rem)] italic leading-[1.45]">
                {current.excerpt}
              </p>
              <Link
                href={`/writing/${current.slug}/`}
                className="label mt-6 inline-block border-b border-[var(--accent-hair)] pb-1 hover:border-[var(--accent)]"
              >
                {current.title} — read it →
              </Link>
            </div>
          ) : (
            <div className="relative max-w-[30rem]">
              <p className="font-display text-[clamp(1.6rem,4vw,2.6rem)] italic leading-tight">
                press a letter.
              </p>
              <p className="label mt-4">
                {mapped.length} of the 26 have something behind them
              </p>
            </div>
          )}
        </div>

        <p aria-live="polite" className="sr-only">
          {current ? `${current.title}. ${current.excerpt}` : ''}
        </p>
      </div>

      {/* ── controls ── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="label border-b border-[var(--color-rule)] pb-0.5 hover:text-[var(--page-ink)]"
        >
          Sound {sound ? 'on' : 'off'}
        </button>
        {touched && (
          <button type="button" onClick={() => setCurrent(null)} className="label hover:text-[var(--page-ink)]">
            Clear
          </button>
        )}
      </div>

      {/* ── the same thing, tappable — this is the whole instrument on a phone ── */}
      <div className="mt-6">
        <p className="label mb-3">or tap</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2.6rem,1fr))] gap-1.5">
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => {
            const has = pieces.some((p) => p.key?.toLowerCase() === letter);
            return (
              <button
                key={letter}
                type="button"
                onClick={(e) => {
                  const r = (e.currentTarget.closest('.relative') as HTMLElement)?.getBoundingClientRect();
                  const b = e.currentTarget.getBoundingClientRect();
                  strike(letter, r ? { x: ((b.x - r.x) / r.width) * 100, y: 40 } : undefined);
                }}
                aria-label={
                  has
                    ? `Play ${letter} — opens ${pieces.find((p) => p.key?.toLowerCase() === letter)!.title}`
                    : `Play ${letter}`
                }
                className={`aspect-square rounded-sm border text-[0.8rem] uppercase transition-colors ${
                  has
                    ? 'border-[var(--accent-hair)] bg-[var(--accent-wash)] hover:bg-[var(--accent)] hover:text-[var(--ground)]'
                    : 'border-[var(--color-rule-soft)] text-[var(--color-ink-4)] hover:border-[var(--color-rule)]'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Six flat forms. Which one you get is a property of the letter, so a key
 *  always draws the same thing — the alphabet becomes learnable. */
function Shape({ burst, reduced }: { burst: Burst; reduced: boolean }) {
  const { shape, color, x, y, size } = burst;
  const base: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    color,
    animation: reduced ? 'ins-fade 2.4s ease-out forwards' : 'ins-bloom 2.4s cubic-bezier(0.16,1,0.3,1) forwards',
  };

  const px = `${size}vmin`;

  return (
    <>
      <span style={base} className="block -translate-x-1/2 -translate-y-1/2">
        {shape === 0 && <span style={{ display: 'block', width: px, height: px, borderRadius: '50%', background: color }} />}
        {shape === 1 && (
          <span style={{ display: 'block', width: px, height: px, borderRadius: '50%', border: `${Math.max(3, size / 6)}px solid ${color}` }} />
        )}
        {shape === 2 && (
          <span style={{ display: 'flex', gap: '0.5vmin', alignItems: 'flex-end', height: px }}>
            {[0.4, 0.75, 1, 0.6, 0.85].map((h, i) => (
              <span key={i} style={{ display: 'block', width: `${size / 9}vmin`, height: `${size * h}%`, background: color }} />
            ))}
          </span>
        )}
        {shape === 3 && (
          <svg width={px} height={px} viewBox="0 0 100 100" aria-hidden>
            <path d="M2 70 L22 30 L42 70 L62 30 L82 70 L98 40" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
          </svg>
        )}
        {shape === 4 && (
          <svg width={px} height={px} viewBox="0 0 100 100" aria-hidden>
            <path d="M50 4 L96 96 L4 96 Z" fill={color} />
          </svg>
        )}
        {shape === 5 && (
          <span style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${size / 12}vmin` }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ display: 'block', width: `${size / 6}vmin`, height: `${size / 6}vmin`, borderRadius: '50%', background: color }} />
            ))}
          </span>
        )}
      </span>

      <style>{`
        @keyframes ins-bloom {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.15) rotate(-8deg); }
          14%  { opacity: 1; transform: translate(-50%, -50%) scale(1.04) rotate(0deg); }
          62%  { opacity: 1; transform: translate(-50%, -50%) scale(1.12) rotate(1deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.34) rotate(4deg); }
        }
        @keyframes ins-fade {
          0%   { opacity: 0; transform: translate(-50%, -50%); }
          20%  { opacity: 0.8; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
