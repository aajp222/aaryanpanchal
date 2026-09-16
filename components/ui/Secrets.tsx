'use client';

import { useEffect } from 'react';

/**
 * The two doors that were already in this site before the rebuild, kept
 * working. Nothing important lives behind either one — the story is in the
 * navigation now, not hidden.
 */
export default function Secrets() {
  useEffect(() => {
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let pos = 0;
    let word = '';

    // Becoming is not advertised anywhere on the site any more, so these are
    // how someone who went looking gets in. Each one is a thing you would only
    // type if you had already noticed something.
    const PHRASES: [string, string][] = [
      ['patthar', '/becoming/'],
      ['36:26', '/becoming/15-flesh/'],
      ['becoming', '/becoming/'],
      ['takethestone', '/becoming/15-flesh/'],
      ['panchal', '/crm.html'],
    ];
    const longest = Math.max(...PHRASES.map(([p]) => p.length));

    const onKey = (e: KeyboardEvent) => {
      pos = e.code === KONAMI[pos] ? pos + 1 : e.code === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        location.href = '/void.html';
        return;
      }

      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || t?.isContentEditable) return;
      if (!e.key || e.key.length !== 1) return;
      word = (word + e.key.toLowerCase()).replace(/\s/g, '').slice(-longest);
      const hit = PHRASES.find(([phrase]) => word.endsWith(phrase));
      if (hit) {
        word = '';
        location.href = hit[1];
      }
    };

    window.addEventListener('keydown', onKey);
    try {
      console.log('%c▲ hello, curious one.', 'color:#c4611e;font-size:18px;font-weight:bold;');
      console.log(
        '%cThere is more here than the navigation suggests.\nThe old doors still open: ↑ ↑ ↓ ↓ ← → ← → B A\nand /writing rewards a keyboard.',
        'color:#8a8177;font-size:12px;line-height:1.7;'
      );
    } catch {}

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
