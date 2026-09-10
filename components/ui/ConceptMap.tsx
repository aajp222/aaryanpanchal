'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

/**
 * THE MAP
 *
 * Not a force-directed hairball. Every property carries information:
 *
 *   position around the ring — where the idea sits in the twenty chapters, so
 *                              the circle is the book, read clockwise
 *   size                     — how much has been written about it
 *   colour                   — the palette of the chapter it lives closest to,
 *                              so the map inherits the stone → flesh arc
 *   chords                   — themes that actually co-occur in the writing
 *
 * All of it is computed from the content, so it redraws itself as Aaryan adds
 * to the archive rather than being a picture that goes stale.
 */

export type MapNode = {
  theme: string;
  weight: number;
  position: number;
  color: string;
  pieces: { slug: string; title: string; kind: string }[];
  chapters: { slug: string; title: string; number?: number }[];
  contradictions: { a: string; aTitle: string; b: string; bTitle: string }[];
  revisions: { raw: string; rawTitle: string; shaped: string; shapedTitle: string }[];
};

export type MapEdge = { a: string; b: string; weight: number };

const SIZE = 1000;
const C = SIZE / 2;
const R = 330;

export default function ConceptMap({ nodes, edges }: { nodes: MapNode[]; edges: MapEdge[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const geometry = useMemo(() => {
    const maxW = Math.max(...nodes.map((n) => n.weight));
    return nodes.map((n, i) => {
      // -90° so the story starts at the top and runs clockwise.
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...n,
        angle,
        x: C + Math.cos(angle) * R,
        y: C + Math.sin(angle) * R,
        r: 5 + (n.weight / maxW) * 13,
      };
    });
  }, [nodes]);

  const byTheme = useMemo(() => new Map(geometry.map((g) => [g.theme, g])), [geometry]);
  const active = selected ? byTheme.get(selected) : null;

  const neighbours = useMemo(() => {
    if (!selected) return [];
    return edges
      .filter((e) => e.a === selected || e.b === selected)
      .map((e) => ({ theme: e.a === selected ? e.b : e.a, weight: e.weight }))
      .sort((x, y) => y.weight - x.weight);
  }, [edges, selected]);

  const isLit = (e: MapEdge) => !selected || e.a === selected || e.b === selected;

  return (
    <div className="grid gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      {/* ── the ring ── */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full touch-manipulation select-none"
          role="group"
          aria-label="A ring of concepts, ordered by where they appear in the story"
        >
          {/* the book, as a circle */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-rule-soft)" strokeWidth="1" />

          <g>
            {edges.map((e, i) => {
              const a = byTheme.get(e.a);
              const b = byTheme.get(e.b);
              if (!a || !b) return null;
              const lit = isLit(e);
              // Pull the chord toward the centre so the bundle reads as a
              // weave rather than a cage of straight lines.
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const cx = C + (mx - C) * 0.5;
              const cy = C + (my - C) * 0.5;
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
                  fill="none"
                  stroke={selected && lit ? a.color : 'currentColor'}
                  strokeWidth={lit ? Math.min(3.2, 0.7 + e.weight * 0.3) : 0.6}
                  opacity={selected ? (lit ? 0.62 : 0.05) : 0.13}
                  style={{ transition: 'opacity 400ms, stroke-width 400ms' }}
                />
              );
            })}
          </g>

          <g>
            {geometry.map((n) => {
              const dim = selected && n.theme !== selected && !neighbours.some((x) => x.theme === n.theme);
              const left = Math.cos(n.angle) < -0.01;
              const deg = (n.angle * 180) / Math.PI;
              return (
                <g
                  key={n.theme}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === n.theme}
                  aria-label={`${n.theme} — ${n.weight} entries`}
                  onClick={() => setSelected(selected === n.theme ? null : n.theme)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(selected === n.theme ? null : n.theme);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible_circle]:stroke-[var(--page-ink)] [&:focus-visible_circle]:stroke-2"
                  style={{ opacity: dim ? 0.22 : 1, transition: 'opacity 400ms' }}
                >
                  <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} />
                  {selected === n.theme && (
                    <circle cx={n.x} cy={n.y} r={n.r + 7} fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.55" />
                  )}
                  <text
                    x={left ? n.x - n.r - 10 : n.x + n.r + 10}
                    y={n.y}
                    transform={`rotate(${left ? deg + 180 : deg} ${left ? n.x - n.r - 10 : n.x + n.r + 10} ${n.y})`}
                    textAnchor={left ? 'end' : 'start'}
                    dominantBaseline="middle"
                    className="hidden font-mono sm:inline"
                    fontSize="20"
                    fill="currentColor"
                    opacity={selected === n.theme ? 1 : 0.72}
                  >
                    {n.theme}
                  </text>
                </g>
              );
            })}
          </g>

          {/* the centre says what the ring is, on its own ground */}
          <circle cx={C} cy={C} r="112" fill="var(--ground)" opacity="0.92" className="hidden sm:inline" />
          <text x={C} y={C - 8} textAnchor="middle" className="hidden font-mono sm:inline" fontSize="18" fill="currentColor" opacity="0.42">
            {selected ? selected : 'clockwise, in story order'}
          </text>
          <text x={C} y={C + 18} textAnchor="middle" className="hidden font-mono sm:inline" fontSize="16" fill="currentColor" opacity="0.3">
            {selected ? `${active?.weight} entries` : `${nodes.length} concepts · ${edges.length} connections`}
          </text>
        </svg>
      </div>

      {/* ── the panel: the same information as text, always ── */}
      <div className="lg:sticky lg:top-24">
        {!active ? (
          <div>
            <p className="label">Pick a concept</p>
            <p className="measure mt-4 text-[var(--color-ink-2)]">
              Each dot is something I kept writing about. Where it sits on the ring is where it lives
              in the story — <em>india</em> and <em>childhood</em> near the top, <em>surrender</em> and
              <em> flesh</em> coming back round to meet them. How big it is, is how much there is. The
              lines are the ideas that actually turn up together.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {nodes.map((n) => (
                <li key={n.theme}>
                  <button
                    type="button"
                    onClick={() => setSelected(n.theme)}
                    className="flex items-center gap-2 rounded-full border border-[var(--color-rule)] px-3 py-1.5 text-[0.86rem] transition-colors hover:border-[var(--page-ink)]"
                  >
                    <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.color }} />
                    {n.theme}
                    <span className="text-[var(--color-ink-4)]">{n.weight}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] leading-none">{active.theme}</h2>
              <button type="button" onClick={() => setSelected(null)} className="label hover:text-[var(--page-ink)]">
                clear
              </button>
            </div>

            {neighbours.length > 0 && (
              <section className="mt-8">
                <p className="label">Connects to</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {neighbours.slice(0, 10).map((n) => (
                    <li key={n.theme}>
                      <button
                        type="button"
                        onClick={() => setSelected(n.theme)}
                        className="rounded-full border border-[var(--color-rule)] px-3 py-1 text-[0.86rem] transition-colors hover:border-[var(--page-ink)]"
                        style={{ borderColor: n.weight >= 5 ? byTheme.get(n.theme)?.color : undefined }}
                      >
                        {n.theme} <span className="text-[var(--color-ink-4)]">{n.weight}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active.chapters.length > 0 && (
              <section className="mt-8">
                <p className="label">Runs through</p>
                <ul className="mt-3 space-y-1.5">
                  {active.chapters.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/becoming/${c.slug}/`} className="font-display text-xl hover:opacity-60">
                        {c.number ? `${String(c.number).padStart(2, '0')} — ` : ''}
                        {/* Locked chapters keep their names here too. The CSS
                            in LockStyles resolves this before paint. */}
                        <span className="ch-name" data-slug={c.slug}>{c.title}</span>
                        <span className="ch-bar" data-slug={c.slug} role="img" aria-label="Locked chapter" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active.pieces.length > 0 && (
              <section className="mt-8">
                <p className="label">Written about it</p>
                <ul className="mt-3 space-y-1.5">
                  {active.pieces.map((p) => (
                    <li key={p.slug} className="flex flex-wrap items-baseline gap-x-3">
                      <Link href={`/writing/${p.slug}/`} className="font-display text-xl hover:opacity-60">
                        {p.title}
                      </Link>
                      <span className="label">{p.kind}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active.revisions.length > 0 && (
              <section className="mt-8">
                <p className="label">Changed its mind</p>
                <ul className="mt-3 space-y-2">
                  {active.revisions.map((r) => (
                    <li key={r.shaped} className="text-[0.95rem] text-[var(--color-ink-2)]">
                      <Link href={`/writing/${r.shaped}/`} className="hover:text-[var(--page-ink)]">
                        <span className="font-display text-lg text-[var(--page-ink)]">{r.rawTitle}</span>
                        {' → '}
                        <span className="font-display text-lg text-[var(--page-ink)]">{r.shapedTitle}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active.contradictions.length > 0 && (
              <section className="mt-8 border-t border-[var(--color-rule-soft)] pt-6">
                <p className="label">Disagrees with itself</p>
                <ul className="mt-3 space-y-2">
                  {active.contradictions.map((c) => (
                    <li key={`${c.a}-${c.b}`} className="text-[0.95rem]">
                      <Link href={`/writing/${c.a}/`} className="font-display text-lg hover:opacity-60">{c.aTitle}</Link>
                      <span className="mx-2 text-[var(--color-ink-3)]">vs</span>
                      <Link href={`/writing/${c.b}/`} className="font-display text-lg hover:opacity-60">{c.bTitle}</Link>
                    </li>
                  ))}
                </ul>
                <p className="label mt-4 !normal-case !tracking-normal">
                  Both are still here. A thought that changed is worth more than a thought that was
                  always right.
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
