'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * The lock screen. It receives prompts and hashes — never the answers — and
 * the question is always answerable from the chapter you just finished.
 *
 * Matching is deliberately generous: case, punctuation, accents, articles and
 * stray spaces are all discarded. The point is whether you read it, not
 * whether you can spell it.
 */

export type GateQuestion = { prompt: string; hashes: string[] };

const KEY = 'becoming.unlocked';

function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(the|a|an|my)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hash(s: string): string {
  let h = 5381;
  const n = normalise(s);
  for (let i = 0; i < n.length; i++) h = ((h << 5) + h + n.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function unlock(slug: string) {
  try {
    const seen: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!seen.includes(slug)) localStorage.setItem(KEY, JSON.stringify([...seen, slug]));
  } catch {
    /* storage unavailable — the pre-paint script fails open, so reading still works */
  }
}

export default function ChapterGate({
  slug,
  from,
  questions,
  title,
  number,
}: {
  slug: string;
  from: string;
  questions: GateQuestion[];
  title: string;
  number?: number;
}) {
  const many = questions.length > 1;
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ''));
  const [wrong, setWrong] = useState<boolean[] | null>(null);
  const [tries, setTries] = useState(0);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => { first.current?.focus(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const misses = questions.map((q, i) => !q.hashes.includes(hash(answers[i] ?? '')));
    if (misses.some(Boolean)) {
      setWrong(misses);
      setTries((t) => t + 1);
      return;
    }
    unlock(slug);
    // The pre-paint script set this; removing it reveals the chapter in place.
    document.documentElement.removeAttribute('data-locked');
    window.scrollTo({ top: 0 });
  };

  const missed = wrong?.filter(Boolean).length ?? 0;

  return (
    <div className="flex min-h-[78svh] flex-col justify-center py-[clamp(3rem,8vw,6rem)]">
      <p className="label !text-[var(--accent-ink)]">
        {number ? `Chapter ${String(number).padStart(2, '0')}` : 'Chapter'} · locked
      </p>
      <h1 className="mt-5 font-display font-[350] text-[clamp(2.6rem,9vw,7rem)] leading-[0.92] tracking-[-0.03em]">
        {title}
      </h1>

      <p className="measure mt-8 text-[clamp(1.02rem,1.5vw,1.16rem)] text-[var(--color-ink-2)]">
        {many ? (
          <>This one asks for more than the others. Four questions, all of them answered
          somewhere in {from}.</>
        ) : (
          <>One question. The answer is in <Link href={`/becoming/${from}/`} className="border-b border-[var(--accent-hair)] pb-0.5 hover:border-[var(--accent)]">the chapter before this one</Link>.</>
        )}
      </p>

      <form onSubmit={submit} className="mt-10 max-w-[38rem]">
        {questions.map((q, i) => (
          <div key={i} className={i > 0 ? 'mt-8' : ''}>
            <label className="block">
              <span className="font-display text-[clamp(1.15rem,2.2vw,1.55rem)] italic leading-snug">
                {q.prompt}
              </span>
              <input
                ref={i === 0 ? first : undefined}
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                  if (wrong) setWrong(null);
                }}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={wrong?.[i] ? true : undefined}
                className="mt-3 w-full border-b border-[var(--color-rule)] bg-transparent pb-2 font-display text-[1.15rem] outline-none focus:border-[var(--accent)]"
              />
            </label>
            {wrong?.[i] && <p className="label mt-2 !normal-case !tracking-normal">not that one.</p>}
          </div>
        ))}

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            className="label rounded-full bg-[var(--page-ink)] px-6 py-3 !text-[var(--ground)] transition-opacity hover:opacity-80"
          >
            {many ? 'Open the chapter' : 'Open it'}
          </button>
          <Link href="/becoming/" className="label hover:text-[var(--page-ink)]">All chapters</Link>
        </div>

        <p aria-live="polite" className="label mt-6 !normal-case !tracking-normal min-h-[1.4rem]">
          {wrong && (many
            ? `${missed} of ${questions.length} not right yet.`
            : '')}
          {tries >= 3 && (
            <span className="block text-[var(--color-ink-3)]">
              It&#39;s a word from the chapter, near the end. Go back and it will be obvious.
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
