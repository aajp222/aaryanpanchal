import type { Metadata } from 'next';
import Link from 'next/link';
import { buildGraph } from '@/lib/graph';
import { getChapter, getPiece, getPieces } from '@/lib/content';
import ConceptMap, { type MapNode, type MapEdge } from '@/components/ui/ConceptMap';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import Tinted from '@/components/ui/Tinted';
import { Wrap } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'The Map',
  description:
    'The ideas in Becoming as a network — what connects to what, where each one lives in the story, and the places the writing disagrees with itself.',
};

/** Edges below this are noise; above it, the ring reads as a weave. */
const MIN_EDGE = 2;

export default function MapPage() {
  const { nodes, edges } = buildGraph();
  const pieces = getPieces();

  const mapNodes: MapNode[] = nodes.map((n) => {
    const themePieces = n.pieces.map((s) => getPiece(s)!).filter(Boolean);

    // Raw/shaped pairs where both sides carry this theme — a thought caught
    // mid-change.
    const revisions = themePieces
      .filter((p) => p.state === 'shaped' && p.rawOf && getPiece(p.rawOf))
      .map((p) => {
        const raw = getPiece(p.rawOf!)!;
        return { raw: raw.slug, rawTitle: raw.title, shaped: p.slug, shapedTitle: p.title };
      });

    // Contradictions are declared on either side; show them from both.
    const seen = new Set<string>();
    const contradictions = themePieces.flatMap((p) => {
      const outgoing = p.contradicts.map((o) => [p.slug, o] as const);
      const incoming = pieces.filter((q) => q.contradicts.includes(p.slug)).map((q) => [q.slug, p.slug] as const);
      return [...outgoing, ...incoming]
        .map(([a, b]) => (a < b ? ([a, b] as const) : ([b, a] as const)))
        .filter(([a, b]) => {
          const k = `${a}|${b}`;
          if (seen.has(k) || !getPiece(a) || !getPiece(b)) return false;
          seen.add(k);
          return true;
        })
        .map(([a, b]) => ({ a, aTitle: getPiece(a)!.title, b, bTitle: getPiece(b)!.title }));
    });

    return {
      theme: n.theme,
      weight: n.weight,
      position: n.position,
      color: n.color,
      pieces: themePieces.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind })),
      chapters: n.chapters
        .map((s) => getChapter(s)!)
        .filter(Boolean)
        .sort((a, b) => (a.number ?? 99) - (b.number ?? 99))
        .map((c) => ({ slug: c.slug, title: c.title, number: c.number })),
      contradictions,
      revisions,
    };
  });

  const mapEdges: MapEdge[] = edges.filter((e) => e.weight >= MIN_EDGE);

  return (
    <Tinted palette="20-becoming">
      <Wrap>
        <header className="py-[clamp(3rem,7vw,5rem)]">
          <Reveal><p className="label">Becoming</p></Reveal>
          <Monument size="huge" as="h1" className="mt-4">The Map</Monument>
          <Reveal delay={160}>
            <p className="measure mt-6 text-[clamp(1.02rem,1.4vw,1.16rem)] text-[var(--color-ink-2)]">
              Not a sitemap — a picture of how these ideas are tangled together. It is built from the
              writing itself rather than drawn by hand, so it redraws every time I add something.
              Which also means it will show me things about myself I didn&#39;t arrange.
            </p>
            <p className="label mt-6">
              <Link href="/becoming/" className="hover:text-[var(--page-ink)]">← All chapters</Link>
              <span className="mx-3 text-[var(--color-ink-4)]">·</span>
              <Link href="/writing/" className="hover:text-[var(--page-ink)]">The archive →</Link>
            </p>
          </Reveal>
        </header>

        <section className="pb-[clamp(4rem,9vw,7rem)]">
          <ConceptMap nodes={mapNodes} edges={mapEdges} />
        </section>
      </Wrap>
    </Tinted>
  );
}
