import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getChapters, getChapter } from '@/lib/content';
import { gateProps, isGated } from '@/lib/gates';
import { mdxComponents } from '@/components/mdx';
import ChapterShell from '@/components/ui/ChapterShell';

export function generateStaticParams() {
  return getChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return {};
  const n = chapter.number ? String(chapter.number).padStart(2, '0') : '';
  // A gated chapter withholds its name everywhere, including the browser tab
  // and any link preview.
  if (isGated(slug)) {
    return {
      title: `Chapter ${n} · Becoming`,
      description: 'A locked chapter. One question opens it, and the answer is in the chapter before.',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${n} — ${chapter.title} · Becoming`,
    description: chapter.summary,
    // A gated chapter is locked from a crawler's point of view too — it can
    // never answer the question — so it stays out of the index. Chapters 01–04
    // are open, which keeps the opening of the story discoverable.
    robots: chapter.index && !isGated(slug) ? undefined : { index: false, follow: false },
    openGraph: { title: `${chapter.title} · Becoming`, description: chapter.summary },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  return (
    <ChapterShell chapter={chapter} gate={gateProps(slug)}>
      <MDXRemote source={chapter.body} components={mdxComponents} />
    </ChapterShell>
  );
}
