'use client';

import { useEffect, useState } from 'react';

/** Chapters 01–04 are always open. */
export const FREE = ['01-stone', '02-india', '03-want', '04-search'];

export const UNLOCK_KEY = 'becoming.unlocked';

/** A gated chapter is a numbered spine chapter that is not one of the free four. */
export function isGatedSlug(slug: string): boolean {
  return /^\d\d-/.test(slug) && !FREE.includes(slug);
}

export function readUnlocked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Whether this reader can see a chapter — and therefore its name. */
export function isOpen(slug: string, unlocked: string[] | null): boolean {
  if (!isGatedSlug(slug)) return true;
  // null means "not read from storage yet" — treat as open so nothing flashes
  // shut on first paint of a page whose names were server-rendered.
  if (unlocked === null) return true;
  return unlocked.includes(slug);
}

/** null until mounted, so components can tell "unknown" from "nothing open". */
export function useUnlocked(): string[] | null {
  const [unlocked, setUnlocked] = useState<string[] | null>(null);
  useEffect(() => {
    setUnlocked(readUnlocked());
    const onStorage = (e: StorageEvent) => {
      if (e.key === UNLOCK_KEY) setUnlocked(readUnlocked());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return unlocked;
}
