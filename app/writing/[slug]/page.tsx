import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPieces, getPiece, getChapter } from '@/lib/content';
import PieceToggle from '@/components/ui/PieceToggle';
import Reveal from '@/components/ui/Reveal';
import { Wrap } from '@/components/ui/Section';

export function generateStaticParams() {
  return getPieces().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return {};
  return {
    title: `${piece.title} · Writing`,
    description: piece.body.trim().split('\n').slice(0, 2).join(' ').slice(0, 160),
    // Raw and angry drafts stay out of search results unless explicitly opted in.
    robots: piece.index ? undefined : { index: false, follow: false },
  };
}

export default async function PiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  const all = getPieces();
  const sibling = piece.rawOf ? getPiece(piece.rawOf) : all.find((p) => p.rawOf === piece.slug);
  const chapter = piece.chapter ? getChapter(piece.chapter) : undefined;
  const related = piece.related.map((r) => getPiece(r)).filter(Boolean);

  return (
    <Wrap>
      <article className="mx-auto max-w-[46rem] py-[clamp(3rem,8vw,6rem)]">
        <Reveal>
          <Link href="/writing/" className="label hover:text-[var(--page-ink)]">← Archive</Link>
          <h1 className="mt-6 font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.95]">{piece.title}</h1>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12">
            {sibling ? (
              <PieceToggle
                shapedText={piece.state === 'shaped' ? piece.body : sibling.body}
                rawText={piece.state === 'shaped' ? sibling.body : piece.body}
              />
            ) : (
              <p className="whitespace-pre-line font-display text-[clamp(1.2rem,2.4vw,1.7rem)] italic leading-[1.5]">
                {piece.body.trim()}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <dl className="mt-16 grid gap-x-8 gap-y-4 border-t border-[var(--color-rule-soft)] pt-6 sm:grid-cols-2">
            <div>
              <dt className="label">Kind</dt>
              <dd className="mt-1">{piece.kind}{piece.version > 1 && ` · take ${piece.version}`}</dd>
            </div>
            {piece.date && (
              <div>
                <dt className="label">Written</dt>
                <dd className="mt-1">{piece.date}</dd>
              </div>
            )}
            <div>
              <dt className="label">Themes</dt>
              <dd className="mt-1">{piece.themes.join(' · ') || '—'}</dd>
            </div>
            {chapter && (
              <div>
                <dt className="label">Where it belongs in the story</dt>
                <dd className="mt-1">
                  <Link
                    href={`/becoming/${chapter.slug}/`}
                    className="border-b border-[var(--accent-hair)] pb-0.5 hover:border-[var(--accent)]"
                  >
                    {chapter.number ? `Chapter ${String(chapter.number).padStart(2, '0')} — ` : ''}
                    {chapter.title} →
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        {related.length > 0 && (
          <Reveal delay={260}>
            <div className="mt-12 border-t border-[var(--color-rule-soft)] pt-6">
              <p className="label mb-3">Related</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {related.map((r) => (
                  <li key={r!.slug}>
                    <Link href={`/writing/${r!.slug}/`} className="font-display text-xl hover:opacity-60">
                      {r!.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </article>
    </Wrap>
  );
}
