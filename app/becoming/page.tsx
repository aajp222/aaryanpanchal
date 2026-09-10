import type { Metadata } from 'next';
import Link from 'next/link';
import { getSpine, getSideChapters } from '@/lib/content';
import { paletteFor } from '@/lib/palette';
import ContentsList, { type ContentsEntry } from '@/components/ui/ContentsList';
import { isGated } from '@/lib/gates';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'Becoming',
  description:
    'A long story in chapters — India, family, wanting, searching, love, faith, leaving, and learning that a heart can break without going back to stone.',
};

/** The swatch shows where a chapter sits on the arc: chromaless at Stone,
 *  full colour by Flesh. The contents page is the arc, seen at once. */
function Swatch({ slug }: { slug: string }) {
  const p = paletteFor(slug);
  return (
    <span
      aria-hidden
      className="inline-block h-9 w-9 shrink-0 rounded-full"
      style={{
        background: `oklch(${p.accent[0]}% ${(p.accent[1] * p.chroma).toFixed(3)} ${p.accent[2]})`,
      }}
    />
  );
}

export default function BecomingIndex() {
  const spine = getSpine();
  const asides = getSideChapters();

  const contents: ContentsEntry[] = spine.map((c) => {
    const p = paletteFor(c.slug);
    return {
      slug: c.slug,
      number: c.number!,
      title: c.title,
      subtitle: c.subtitle,
      gated: isGated(c.slug),
      color: `oklch(${p.accent[0]}% ${(p.accent[1] * p.chroma).toFixed(3)} ${p.accent[2]})`,
    };
  });

  return (
    <Tinted palette="home">
      <Wrap>
        <header className="flex min-h-[70svh] flex-col justify-center py-[clamp(3rem,8vw,6rem)]">
          <Reveal><p className="label">The long story</p></Reveal>
          <Monument size="colossal" as="h1" className="mt-6">Becoming</Monument>
          <Reveal delay={180}>
            <p className="measure mt-10 text-[clamp(1.05rem,1.6vw,1.22rem)] text-[var(--color-ink-2)]">
              This is the part of the website that isn&#39;t a résumé. It starts with a seven-year-old
              deciding that strength means becoming impossible to hurt, and it doesn&#39;t finish, because
              I haven&#39;t. Everyone in it except me is unnamed.
            </p>
            <p className="label mt-8">
              {spine.length} chapters · about an hour · the first four are open, the rest ask a question first
            </p>
            <p className="mt-5">
              <Link
                href="/becoming/map/"
                className="border-b border-[var(--accent-hair)] pb-1 font-display text-[1.15rem] italic transition-colors hover:border-[var(--accent)]"
              >
                or see how the ideas connect →
              </Link>
            </p>
          </Reveal>
        </header>
      </Wrap>

      <Wrap>
        <ContentsList entries={contents} />

        {asides.length > 0 && (
          <section className="py-[clamp(3.5rem,8vw,7rem)]">
            <p className="label mb-8">Beside the story</p>
            <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {asides.map((c, i) => (
                <li key={c.slug}>
                  <Reveal delay={i * 60}>
                    <Link href={`/becoming/${c.slug}/`} className="group block">
                      <span className="flex items-center gap-3">
                        <Swatch slug={c.slug} />
                        <span className="font-display text-2xl transition-opacity group-hover:opacity-60">
                          {c.title}
                        </span>
                      </span>
                      <span className="mt-2 block text-[0.95rem] text-[var(--color-ink-2)]">
                        {c.summary}
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Wrap>
    </Tinted>
  );
}
