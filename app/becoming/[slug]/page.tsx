import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getChapters, getChapter } from '@/lib/content';
import { mdxComponents } from '@/components/mdx';
import ChapterShell from '@/components/ui/ChapterShell';

export function generateStaticParams() {
  return getChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return {};
  const n = chapter.number ? `${String(chapter.number).padStart(2, '0')} — ` : '';
  return {
    title: `${n}${chapter.title} · Becoming`,
    description: chapter.summary,
    robots: chapter.index ? undefined : { index: false, follow: false },
    openGraph: { title: `${chapter.title} · Becoming`, description: chapter.summary },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  return (
    <ChapterShell chapter={chapter}>
      <MDXRemote source={chapter.body} components={mdxComponents} />
    </ChapterShell>
  );
}
