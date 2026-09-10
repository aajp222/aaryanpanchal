import Link from 'next/link';
import { paletteFor, paletteVars } from '@/lib/palette';
import { neighbours, type Chapter } from '@/lib/content';
import { RedactionNote } from './Redacted';
import ChapterGate, { type GateQuestion } from './ChapterGate';
import ReadingProgress from './ReadingProgress';
import Reveal from './Reveal';
import { Wrap } from './Section';

export default function ChapterShell({
  chapter,
  children,
  gate,
}: {
  chapter: Chapter;
  children: React.ReactNode;
  /** Present when this chapter asks a question before it opens. */
  gate?: { slug: string; from: string; questions: GateQuestion[] } | null;
}) {
  const palette = paletteFor(chapter.slug);
  const { prev, next } = neighbours(chapter.slug);
  const n = chapter.number ? String(chapter.number).padStart(2, '0') : '—';

  return (
    <div className="chapter" style={paletteVars(palette)}>
      {gate && (
        <div className="chapter-gate">
          <Wrap>
            <ChapterGate
              slug={gate.slug}
              from={gate.from}
              questions={gate.questions}
              title={chapter.title}
              number={chapter.number}
            />
          </Wrap>
        </div>
      )}

      <div className={gate ? 'chapter-body' : undefined}>
      <ReadingProgress />

      {/* ── The chapter's title card. One sentence, all the room it needs. ── */}
      <header className="flex min-h-[64svh] flex-col justify-center py-[clamp(3rem,8vw,6rem)]">
        <Wrap>
          <Reveal>
            <p className="label !text-[var(--accent-ink)]">
              {chapter.side ? 'Aside' : `Chapter ${n}`}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display font-[350] text-[clamp(3.2rem,12vw,10rem)] leading-[0.9] tracking-[-0.035em]">
              {chapter.title}
            </h1>
          </Reveal>
          {chapter.subtitle && (
            <Reveal delay={200}>
              <p className="measure mt-8 font-display text-[clamp(1.2rem,2.6vw,1.9rem)] italic leading-snug text-[var(--color-ink-2)]">
                {chapter.subtitle}
              </p>
            </Reveal>
          )}
        </Wrap>
      </header>

      <Wrap>
        <article className="prose-chapter mx-auto max-w-[46rem] pb-[clamp(4rem,9vw,7rem)]">
          {children}
          <RedactionNote />
        </article>
      </Wrap>

      {/* ── Where you are in the book ── */}
      <nav className="border-t border-[var(--color-rule-soft)]" aria-label="Chapters">
        <Wrap>
          <div className="grid gap-6 py-10 md:grid-cols-3 md:items-center">
            <div>
              {prev && (
                <Link href={`/becoming/${prev.slug}/`} className="group block">
                  <span className="label">← Previous</span>
                  <span className="mt-1 block font-display text-2xl transition-opacity group-hover:opacity-60">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <Link href="/becoming/" className="label text-center hover:text-[var(--page-ink)]">
              All chapters
            </Link>
            <div className="md:text-right">
              {next && (
                <Link href={`/becoming/${next.slug}/`} className="group block">
                  <span className="label">Next →</span>
                  <span className="mt-1 block font-display text-2xl transition-opacity group-hover:opacity-60">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </Wrap>
      </nav>
      </div>
    </div>
  );
}
