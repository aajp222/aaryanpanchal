import { getChapters, getPieces, type Chapter, type Piece } from './content';
import { paletteFor } from './palette';

/**
 * The concept graph is computed from the content, not drawn by hand.
 *
 * Every theme tagged on a chapter or a piece becomes a node; two themes that
 * appear on the same chapter or the same piece get an edge. So the map is an
 * actual picture of how these ideas are entangled in the writing, and it
 * redraws itself the moment new writing is added — which is the only version
 * of "a map of someone's mind" worth building.
 */

export type ConceptNode = {
  theme: string;
  /** Pieces and chapters carrying this theme. */
  pieces: string[];
  chapters: string[];
  /** How much has been written about it. Drives node size. */
  weight: number;
  /** Mean position in the twenty-chapter spine, 1–20. Drives the ring order. */
  position: number;
  /** The accent of the chapter this theme sits closest to, so the map
   *  inherits the stone → flesh arc rather than inventing a palette. */
  color: string;
  /** Where the theme is at its densest. */
  homeChapter?: string;
};

export type ConceptEdge = { a: string; b: string; weight: number };

export type ConceptGraph = {
  nodes: ConceptNode[];
  edges: ConceptEdge[];
};

const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export function buildGraph(): ConceptGraph {
  const chapters = getChapters();
  const pieces = getPieces();
  const spine = new Map(chapters.filter((c) => c.number).map((c) => [c.slug, c.number!]));

  const nodes = new Map<string, {
    pieces: string[]; chapters: string[]; positions: number[]; chapterCount: Map<string, number>;
  }>();
  const edges = new Map<string, number>();

  const touch = (theme: string) => {
    if (!nodes.has(theme)) {
      nodes.set(theme, { pieces: [], chapters: [], positions: [], chapterCount: new Map() });
    }
    return nodes.get(theme)!;
  };

  /** One "document" — a chapter or a piece — links every theme on it to every other. */
  const record = (themes: string[], chapterSlug: string | undefined, add: (n: ReturnType<typeof touch>) => void) => {
    const uniq = [...new Set(themes)];
    for (const t of uniq) {
      const n = touch(t);
      add(n);
      if (chapterSlug) {
        const pos = spine.get(chapterSlug);
        if (pos) n.positions.push(pos);
        n.chapterCount.set(chapterSlug, (n.chapterCount.get(chapterSlug) ?? 0) + 1);
      }
    }
    for (let i = 0; i < uniq.length; i++) {
      for (let j = i + 1; j < uniq.length; j++) {
        const k = key(uniq[i], uniq[j]);
        edges.set(k, (edges.get(k) ?? 0) + 1);
      }
    }
  };

  for (const c of chapters as Chapter[]) {
    record(c.themes, c.slug, (n) => { if (!n.chapters.includes(c.slug)) n.chapters.push(c.slug); });
  }
  for (const p of pieces as Piece[]) {
    record(p.themes, p.chapter, (n) => { if (!n.pieces.includes(p.slug)) n.pieces.push(p.slug); });
  }

  const built: ConceptNode[] = [...nodes.entries()].map(([theme, n]) => {
    const position = n.positions.length
      ? n.positions.reduce((a, b) => a + b, 0) / n.positions.length
      : 10.5; // themes that only appear beside the spine sit at its midpoint
    // A theme's home is the chapter that shares its name when one exists —
    // faith belongs to Faith, trust to Trust — and otherwise the chapter
    // nearest its centre of gravity.
    const named = n.chapters.find((slug) => slug.replace(/^\d+-/, '') === theme);
    const nearest = chapters
      .filter((c) => c.number)
      .sort((a, b) => Math.abs(a.number! - position) - Math.abs(b.number! - position))[0];
    const homeChapter = named
      ?? [...n.chapterCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
      ?? nearest?.slug;
    // Hue says which chapter it belongs to; chroma says how far along the arc
    // it sits, so the ring still reads stone → flesh.
    const pal = paletteFor(named ?? nearest?.slug ?? '20-becoming');
    // t: 0 at chapter one, 1 at chapter twenty.
    const t = Math.min(1, Math.max(0, (position - 1) / 19));
    const chroma = 0.035 + t * 0.155;
    const lightness = 66 - t * 9;
    return {
      theme,
      pieces: n.pieces,
      chapters: n.chapters,
      weight: n.pieces.length + n.chapters.length,
      position,
      homeChapter,
      color: `oklch(${lightness.toFixed(1)}% ${chroma.toFixed(3)} ${pal.accent[2]})`,
    };
  });

  // Around the ring in story order, so the circle is the book.
  built.sort((a, b) => a.position - b.position || a.theme.localeCompare(b.theme));

  const present = new Set(built.map((n) => n.theme));
  const builtEdges: ConceptEdge[] = [...edges.entries()]
    .map(([k, weight]) => {
      const [a, b] = k.split('|');
      return { a, b, weight };
    })
    .filter((e) => present.has(e.a) && present.has(e.b))
    .sort((a, b) => b.weight - a.weight);

  return { nodes: built, edges: builtEdges };
}
