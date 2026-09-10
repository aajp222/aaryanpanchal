import Link from 'next/link';
import type { Metadata } from 'next';
import { getPieces, getPiece, themeIndex, getChapter } from '@/lib/content';
import Instrument, { type Playable } from '@/components/scenes/Instrument';
import ArchiveBrowser, { type Entry } from '@/components/ui/ArchiveBrowser';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Poems, songs, half-thoughts, prayers, jokes and drafts that contradict each other. Press a key to open one.',
};

const excerpt = (body: string, lines = 4) =>
  body.trim().split('\n').slice(0, lines).join('\n');

export default function WritingPage() {
  const pieces = getPieces();

  const playable: Playable[] = pieces
    .filter((p) => p.key)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      key: p.key,
      tone: p.tone,
      kind: p.kind,
      excerpt: excerpt(p.body, 5),
    }));

  const entries: Entry[] = pieces
    .map((p) => {
      const sibling = p.rawOf ? getPiece(p.rawOf) : pieces.find((o) => o.rawOf === p.slug);
      const chapter = p.chapter ? getChapter(p.chapter) : undefined;
      return {
        slug: p.slug,
        title: p.title,
        kind: p.kind,
        state: p.state,
        date: p.date,
        themes: p.themes,
        chapter: p.chapter,
        chapterTitle: chapter?.title,
        version: p.version,
        hasSibling: Boolean(sibling),
        excerpt: excerpt(p.body, 3),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Tinted palette="writing"><Wrap>
      <header className="pb-[clamp(2rem,4vw,3rem)] pt-[clamp(2rem,5vw,4rem)]">
        <Reveal><p className="label">The archive</p></Reveal>
        <Monument size="huge" as="h1" className="mt-4">Writing</Monument>
        <Reveal delay={160}>
          <p className="measure mt-6 text-[clamp(1.02rem,1.4vw,1.14rem)] text-[var(--color-ink-2)]">
            Poems, songs, prayers, jokes, one-line thoughts and drafts that disagree with each other.
            Some of it is good. Some of it is immature, unfinished, or something I no longer believe.
            All of it is left as it was written — lowercase, misspellings and all — because the point
            isn&#39;t the finished thing. It&#39;s watching a thought change when a person does.
          </p>
        </Reveal>
      </header>

      <Instrument pieces={playable} />

      <section className="py-[clamp(3rem,7vw,6rem)]">
        <ArchiveBrowser entries={entries} themes={themeIndex()} />
        <p className="mt-12 border-t border-[var(--color-rule-soft)] pt-6">
          <Link
            href="/becoming/map/"
            className="border-b border-[var(--accent-hair)] pb-1 font-display text-[clamp(1.15rem,2vw,1.5rem)] italic transition-colors hover:border-[var(--accent)]"
          >
            See all of it as a map →
          </Link>
        </p>
      </section>
    </Wrap></Tinted>
  );
}
