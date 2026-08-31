'use client';

import { useEffect, useState } from 'react';

/** A hairline in the chapter's accent. The only always-visible chrome inside
 *  Becoming, so it stays 2px and says nothing. */
export default function ReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div
        className="h-full origin-left bg-[var(--accent)]"
        style={{ transform: `scaleX(${p})`, transition: 'transform 90ms linear' }}
      />
    </div>
  );
}
