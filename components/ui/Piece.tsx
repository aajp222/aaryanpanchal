import Link from 'next/link';
import { getPiece, getPieces } from '@/lib/content';
import PieceToggle from './PieceToggle';

/**
 * Pulls a piece out of the archive and into the chapter it belongs to.
 * When the piece has a raw sibling, the two states are offered as a toggle.
 */
export default function Piece({ id, link = true }: { id: string; link?: boolean }) {
  const piece = getPiece(id);
  if (!piece) throw new Error(`Piece: no writing entry "${id}" in content/writing.`);

  const raw = piece.rawOf ? getPiece(piece.rawOf) : getPieces().find((p) => p.rawOf === piece.slug);

  return (
    <figure className="my-12 border-l border-[var(--accent-hair)] pl-6">
      {raw && raw.slug !== piece.slug ? (
        <PieceToggle
          shapedText={piece.state === 'shaped' ? piece.body : raw.body}
          rawText={piece.state === 'shaped' ? raw.body : piece.body}
        />
      ) : (
        <p className="whitespace-pre-line font-display text-[clamp(1.12rem,1.9vw,1.42rem)] italic leading-[1.55]">
          {piece.body.replace(/^\n+|\n+$/g, '')}
        </p>
      )}

      <figcaption className="label mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>{piece.kind}</span>
        {piece.date && <span className="!text-[var(--color-ink-4)]">{piece.date}</span>}
        {piece.version > 1 && <span className="!text-[var(--color-ink-4)]">take {piece.version}</span>}
        {link && (
          <Link href={`/writing/${piece.slug}/`} className="!text-[var(--accent-ink)] hover:underline">
            in the archive →
          </Link>
        )}
      </figcaption>
    </figure>
  );
}
