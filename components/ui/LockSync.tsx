'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { FREE, UNLOCK_KEY } from './unlocked';

// useLayoutEffect fires before the browser paints, which is what keeps a soft
// navigation from flashing the chapter text. It does nothing during prerender,
// so fall back to useEffect there to avoid React's warning.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * The lock, kept in sync across client-side navigation.
 *
 * LockScript handles a cold page load before first paint. But Next routes
 * between pages without reloading, so that script never runs again — which
 * meant every chapter opened as soon as you arrived by clicking a link, which
 * is how everybody actually arrives. This re-applies the decision on every
 * route change, before paint.
 */
export default function LockSync() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const slug = pathname.match(/^\/becoming\/([^/]+)/)?.[1];

    let unlocked: string[] | null = [];
    try {
      unlocked = JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]') as string[];
    } catch {
      unlocked = null; // storage unavailable → fail open, as on a cold load
    }
    // '*' matches nothing in a ~= selector on its own, so names stay masked
    // only when we actually know they are locked.
    root.setAttribute('data-unlocked', unlocked === null ? '*' : unlocked.join(' '));

    let locked = false;
    if (slug && /^\d\d-/.test(slug) && !FREE.includes(slug)) {
      locked = unlocked !== null && !unlocked.includes(slug);
    }

    if (locked) root.setAttribute('data-locked', '');
    else root.removeAttribute('data-locked');
  }, [pathname]);

  return null;
}
