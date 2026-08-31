import type { LedgerKind } from '@/lib/schema';

/**
 * The site's recurring philosophical device.
 *
 * Something written in pain is not automatically history. A Ledger block
 * forces the distinction onto the page: what happened, what I felt, what I
 * thought it meant, what I later learned — each labelled, none of them
 * pretending to be another. The same `kind` values are the archive's filter
 * facets, so the philosophy and the data model are one thing.
 */

const KIND: Record<LedgerKind, { label: string; hue: number; chroma: number }> = {
  memory:         { label: 'Memory',         hue: 70,  chroma: 0.09 },
  fact:           { label: 'Fact',           hue: 240, chroma: 0.08 },
  feeling:        { label: 'Feeling',        hue: 25,  chroma: 0.14 },
  question:       { label: 'Question',       hue: 300, chroma: 0.11 },
  poem:           { label: 'Poem',           hue: 88,  chroma: 0.12 },
  prayer:         { label: 'Prayer',         hue: 220, chroma: 0.10 },
  anger:          { label: 'Anger',          hue: 18,  chroma: 0.18 },
  interpretation: { label: 'What I thought it meant', hue: 150, chroma: 0.10 },
  later:          { label: 'What I learned later',    hue: 262, chroma: 0.10 },
};

export default function Ledger({
  kind,
  children,
  label,
}: {
  kind: LedgerKind;
  children: React.ReactNode;
  /** Override the default label, e.g. "What I saw". */
  label?: string;
}) {
  const k = KIND[kind];
  // Chroma is multiplied by the chapter dial, so these labels are grey in
  // STONE and fully coloured by FLESH along with everything else.
  const tint = `oklch(52% calc(${k.chroma} * var(--chroma)) ${k.hue})`;

  return (
    <div className="my-8 border-l-2 pl-5" style={{ borderColor: tint }}>
      <p className="label !tracking-[0.16em]" style={{ color: tint }}>
        {label ?? k.label}
      </p>
      <div className="mt-2 font-display text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.45] [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}

/**
 * Two or more Ledgers side by side, for the moments where the whole point is
 * that the columns are not the same statement.
 */
export function LedgerSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-12 grid gap-x-10 gap-y-0 md:grid-cols-2 [&>div]:my-6">
      {children}
    </div>
  );
}
