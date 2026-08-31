'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/work/', label: 'Work' },
  { href: '/builds/', label: 'Builds' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        lifted ? 'border-b border-[var(--color-rule-soft)] bg-[color-mix(in_oklab,var(--ground)_88%,transparent)] backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[92rem] items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)] py-4">
        <Link href="/" className="font-sans text-[0.95rem] font-medium tracking-tight" aria-label="Aaryan Panchal — home">
          Aaryan&nbsp;Panchal
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`label !normal-case !tracking-[0.04em] !text-[0.82rem] transition-colors hover:text-[var(--page-ink)] ${
                active(l.href) ? '!text-[var(--page-ink)]' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
          {/* Becoming is not hidden — but it is a different kind of thing,
              so it is set in the story's typeface rather than the site's. */}
          <Link
            href="/becoming/"
            className="group relative font-display text-[1.06rem] italic transition-opacity hover:opacity-70"
          >
            Becoming
            <span
              aria-hidden
              className={`absolute -right-2.5 top-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)] transition-opacity ${
                active('/becoming') ? 'opacity-100' : 'opacity-60'
              }`}
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="label -mr-2 px-2 py-1 md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-[57px] z-40 bg-[var(--ground)] px-[clamp(1.25rem,6vw,3rem)] pt-10 md:hidden"
      >
        <ul className="flex flex-col gap-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-display text-4xl">{l.label}</Link>
            </li>
          ))}
          <li className="mt-2 border-t border-[var(--color-rule-soft)] pt-6">
            <Link href="/becoming/" className="font-display text-4xl italic">
              Becoming
              <span aria-hidden className="ml-2 inline-block h-2 w-2 rounded-full bg-[var(--accent)] align-middle" />
            </Link>
            <p className="label mt-2">The long story</p>
          </li>
        </ul>
      </div>
    </header>
  );
}
