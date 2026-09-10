/**
 * THE GATES
 *
 * Chapters 01–04 are open: by "I NEEDED GOD" the reader is committed, and
 * nobody should hit a lock before they are. From 05 on, each chapter asks one
 * question before it opens, and the answer is always in the chapter you just
 * finished. Never a riddle, never a hunt — the only thing being tested is
 * whether you read.
 *
 * Baptism is the exception, and deliberately: it asks four questions drawn from
 * the whole first half, and it sits directly in front of the chapter about
 * refusing to let baptism become a transaction.
 *
 * This module is server-only. Plaintext answers live here and never reach the
 * browser — pages hash them at build time and hand the client only the hashes.
 */

/** Always open — the story has to be readable before it asks for anything. */
export const FREE = ['01-stone', '02-india', '03-want', '04-search'];

export type Gate = {
  /** The chapter this gate guards. */
  slug: string;
  /** Which chapter holds the answer, for the "you'll find it in…" hint. */
  from: string;
  questions: { prompt: string; answers: string[] }[];
};

export const GATES: Gate[] = [
  { slug: '05-her', from: '04-search', questions: [{
    prompt: 'I stopped wanting a person and admitted I wanted something else. What?',
    answers: ['god', 'i needed god'],
  }]},
  { slug: '06-love', from: '05-her', questions: [{
    prompt: 'Finish it — “it felt like i’d been ____, not introduced.”',
    answers: ['found'],
  }]},
  { slug: '07-faith', from: '06-love', questions: [{
    prompt: 'Not for her face, but for the ____ she brought to a loud, broken place.',
    answers: ['peace'],
  }]},
  { slug: '08-boundaries', from: '07-faith', questions: [{
    prompt: 'Finish it — “faith is the car ____.”',
    answers: ['starting', 'starts'],
  }]},
  { slug: '09-apart', from: '08-boundaries', questions: [{
    prompt: 'A limit is not the enemy of the thing. Sometimes it is what makes the thing ____.',
    answers: ['possible', 'work'],
  }]},

  // The one that is not like the others.
  { slug: '10-baptism', from: 'the first nine chapters', questions: [
    { prompt: 'What did I say to my father when I was seven?',
      answers: ['mera dil patthar ho gaya', 'my heart became stone', 'my heart has become stone', 'stone'] },
    { prompt: 'When I come home, where does the dog put her head?',
      answers: ['my foot', 'foot', 'on my foot', 'her head on my foot'] },
    { prompt: 'Chapter three ends on a question I still cannot answer. What is it?',
      answers: ['am i full', 'am i full?', 'how much is enough'] },
    { prompt: 'Love ≠ compatibility. Love ≠ permission. Love ≠ ____',
      answers: ['timing', 'time'] },
  ]},

  { slug: '11-return', from: '10-baptism', questions: [{
    prompt: 'I did not come out of it certain. I came out of it ____.',
    answers: ['committed', 'commitment'],
  }]},
  { slug: '12-psalms', from: '11-return', questions: [{
    prompt: 'After two years, a separation and a baptism — what was the first word?',
    answers: ['hi', 'hi.'],
  }]},
  { slug: '13-still-love', from: '12-psalms', questions: [{
    prompt: 'Which psalm did I start at?',
    answers: ['95', 'ninety five', 'psalm 95'],
  }]},
  { slug: '14-goodbye', from: '13-still-love', questions: [{
    prompt: 'Finish it — “the love was not the ____.”',
    answers: ['problem'],
  }]},
  { slug: '15-flesh', from: '14-goodbye', questions: [{
    prompt: 'After about fifteen years of not doing it, what did I finally do?',
    answers: ['cried', 'cry', 'crying', 'i cried'],
  }]},
  { slug: '16-ghosts', from: '15-flesh', questions: [{
    prompt: 'A heart of flesh can break without becoming ____ again.',
    answers: ['stone'],
  }]},
  { slug: '17-jealousy', from: '16-ghosts', questions: [{
    prompt: 'It was not the romance I missed. It was the ____.',
    answers: ['conversation', 'conversations', 'talking'],
  }]},
  { slug: '18-trust', from: '17-jealousy', questions: [{
    prompt: 'Finish it — “feelings are real. feelings are not ____.”',
    answers: ['facts', 'fact'],
  }]},
  { slug: '19-open-hands', from: '18-trust', questions: [{
    prompt: 'I had been treating two words as one. Real, and ____.',
    answers: ['permanent', 'permanence'],
  }]},
  { slug: '20-becoming', from: '19-open-hands', questions: [{
    prompt: 'Finish it — “that isn’t holding. it’s ____.”',
    answers: ['offering', 'its offering', 'it is offering'],
  }]},
];

export function gateFor(slug: string): Gate | undefined {
  return GATES.find((g) => g.slug === slug);
}

/** True for the spine chapters that ask a question first. */
export function isGated(slug: string): boolean {
  return GATES.some((g) => g.slug === slug);
}

/**
 * Generous on purpose. The question is "did you read this", not "can you
 * spell it" — case, punctuation, accents, articles and stray spaces are all
 * discarded before comparison.
 */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // drop accents
    .replace(/[\u2019']/g, '')          // straight and curly apostrophes
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(the|a|an|my)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A small non-cryptographic hash. This is a ritual, not a lock — the chapter
 * text is in the page source either way — but it keeps the answers out of
 * view-source, which is all it needs to do.
 */
export function hash(s: string): string {
  let h = 5381;
  const n = normalise(s);
  for (let i = 0; i < n.length; i++) h = ((h << 5) + h + n.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** What a page hands the client: prompts and hashes, never the answers. */
export function gateProps(slug: string) {
  const gate = gateFor(slug);
  if (!gate) return null;
  return {
    slug: gate.slug,
    from: gate.from,
    questions: gate.questions.map((q) => ({ prompt: q.prompt, hashes: q.answers.map(hash) })),
  };
}
