'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Text arriving the way a thought is remembered rather than the way a page
 * loads. Under prefers-reduced-motion it simply starts arrived.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'p' | 'section' | 'li' | 'span';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(1.1rem)',
        transition: `opacity 900ms var(--ease-out-soft) ${delay}ms, transform 900ms var(--ease-out-soft) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
