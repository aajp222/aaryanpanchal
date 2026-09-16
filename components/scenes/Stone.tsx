'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * CHAPTER 01 — STONE
 *
 * A slab, in daylight. Hardness is drawn with geometry and weight, never with
 * darkness. Striking it puts a crack in it, and light comes through the crack —
 * which is the chapter's whole argument, made before the chapter says it:
 * the thing that keeps everything out keeps everything in.
 */

type Crack = { x: number; y: number; d: string; id: number };

const W = 800;
const H = 460;

/** A jagged run outward from the strike point to the slab's edge. */
function crackPath(x: number, y: number, seed: number): string {
  const rand = (i: number) => {
    const s = Math.sin(seed * 977 + i * 131) * 10000;
    return s - Math.floor(s);
  };
  const angle = rand(0) * Math.PI * 2;
  const segments = 7 + Math.floor(rand(1) * 4);
  let cx = x;
  let cy = y;
  let a = angle;
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
  for (let i = 0; i < segments; i++) {
    a += (rand(i + 2) - 0.5) * 0.9;
    const len = 30 + rand(i + 20) * 70;
    cx += Math.cos(a) * len;
    cy += Math.sin(a) * len;
    d += ` L ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    if (cx < -40 || cx > W + 40 || cy < -40 || cy > H + 40) break;
  }
  return d;
}

/** A running bond of blocks, each a hair different so the slab reads as
 *  material rather than as a rectangle. */
const BLOCKS = (() => {
  const rows = 6;
  const h = H / rows;
  const out: { x: number; y: number; w: number; h: number; l: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : -W / 8;
    const cols = 4;
    const w = W / cols;
    for (let c = -1; c <= cols; c++) {
      const x = c * w + offset;
      if (x > W || x + w < 0) continue;
      const seed = Math.sin(r * 71.3 + c * 33.7) * 10000;
      const jitter = seed - Math.floor(seed);
      out.push({ x, y: r * h, w, h, l: 80 + jitter * 6 });
    }
  }
  return out;
})();

const LINES = [
  'it held.',
  'nothing got in.',
  'nothing got out either.',
];

export default function Stone() {
  const [cracks, setCracks] = useState<Crack[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const idRef = useRef(0);

  const strike = useCallback((clientX?: number, clientY?: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    let x = W / 2;
    let y = H / 2;
    if (clientX !== undefined && clientY !== undefined) {
      const r = svg.getBoundingClientRect();
      x = ((clientX - r.left) / r.width) * W;
      y = ((clientY - r.top) / r.height) * H;
    } else {
      // Keyboard strikes land somewhere plausible rather than dead centre.
      const n = idRef.current;
      x = W * (0.28 + 0.16 * (n % 3));
      y = H * (0.32 + 0.18 * ((n + 1) % 3));
    }
    const id = idRef.current++;
    setCracks((c) => (c.length >= 3 ? c : [...c, { x, y, d: crackPath(x, y, id + 1), id }]));
  }, []);

  const struck = cracks.length;
  const done = struck >= 3;

  return (
    <div data-scene="stone" className="monument-break my-[clamp(3rem,8vw,6rem)]">
      <div className="mx-auto max-w-[62rem]">
        <button
          type="button"
          onClick={(e) => strike(e.clientX, e.clientY)}
          disabled={done}
          aria-label={done ? 'The stone is cracked' : `Strike the stone. ${struck} of 3 cracks.`}
          className="block w-full cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full select-none rounded-sm"
            role="img"
            aria-hidden
          >
            <defs>
              {/* The light that only exists once there is a crack to come through. */}
              <linearGradient id="stone-light" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="oklch(88% 0.11 78)" />
                <stop offset="100%" stopColor="oklch(80% 0.14 52)" />
              </linearGradient>
              <filter id="stone-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
              <clipPath id="stone-clip"><rect width={W} height={H} rx="2" /></clipPath>
            </defs>

            <g clipPath="url(#stone-clip)">
              {/* Mortar. The gaps between blocks are stone too — nothing
                  gets through them, which is the point. */}
              <rect width={W} height={H} fill="oklch(72% 0.004 95)" />

              {/* A running bond: rigid, level, deliberately joyless. */}
              <g>
                {BLOCKS.map((b, i) => (
                  <rect
                    key={i}
                    x={b.x + 1.5}
                    y={b.y + 1.5}
                    width={b.w - 3}
                    height={b.h - 3}
                    rx="1"
                    fill={`oklch(${b.l}% 0.004 95)`}
                  />
                ))}
                <rect width={W} height={H} fill="oklch(80% 0.004 95)" filter="url(#stone-grain)" />
              </g>

              {/* Each crack lets the light that was always there come through. */}
              {cracks.map((c) => (
                <g key={c.id}>
                  <path
                    d={c.d}
                    stroke="url(#stone-light)"
                    strokeWidth={done ? 8 : 4.5}
                    fill="none"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-width 900ms var(--ease-out-soft)' }}
                  />
                  <path d={c.d} stroke="oklch(58% 0.01 95)" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.5" />
                </g>
              ))}
            </g>
          </svg>
        </button>

        <div className="mt-6 min-h-[8rem]">
          <p className="label" aria-live="polite">
            {done ? 'three cracks' : `strike the stone — ${struck} of 3`}
          </p>
          <p className="mt-4 font-display text-[clamp(1.2rem,2.8vw,2rem)] italic leading-snug">
            {LINES.slice(0, struck).map((l, i) => (
              <span
                key={l}
                className="block"
                style={{
                  opacity: 0,
                  animation: `stone-line 900ms var(--ease-out-soft) ${i * 120}ms forwards`,
                }}
              >
                {l}
              </span>
            ))}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes stone-line { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes stone-line { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
