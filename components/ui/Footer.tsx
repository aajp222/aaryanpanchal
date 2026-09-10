import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--color-rule-soft)]">
      <div className="mx-auto grid max-w-[92rem] gap-8 px-[clamp(1.25rem,4vw,3.5rem)] py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Aaryan Panchal</p>
          <p className="measure-tight mt-3 text-[var(--color-ink-2)]">
            Engineer, builder, and writer. Currently building EpiSafe in Worcester, Massachusetts.
          </p>
          <a href="mailto:aaryanpanchal@icloud.com" className="mt-4 inline-block border-b border-[var(--accent-hair)] pb-0.5 transition-colors hover:border-[var(--accent)]">
            aaryanpanchal@icloud.com
          </a>
        </div>

        <nav aria-label="Site">
          <p className="label mb-3">Site</p>
          <ul className="space-y-2 text-[var(--color-ink-2)]">
            <li><Link href="/work/" className="hover:text-[var(--page-ink)]">Work</Link></li>
            <li><Link href="/builds/" className="hover:text-[var(--page-ink)]">Builds</Link></li>
            <li><Link href="/writing/" className="hover:text-[var(--page-ink)]">Writing</Link></li>
            <li><Link href="/becoming/" className="hover:text-[var(--page-ink)]">Becoming</Link></li>
            <li><Link href="/about/" className="hover:text-[var(--page-ink)]">About</Link></li>
          </ul>
        </nav>

        <nav aria-label="Elsewhere">
          <p className="label mb-3">Elsewhere</p>
          <ul className="space-y-2 text-[var(--color-ink-2)]">
            <li><a href="https://linkedin.com/in/aaryanpanchal" target="_blank" rel="noopener" className="hover:text-[var(--page-ink)]">LinkedIn ↗</a></li>
            <li><Link href="/book/" className="hover:text-[var(--page-ink)]">Book a shoot</Link></li>
            <li><a href="/play.html" className="hover:text-[var(--page-ink)]">After hours</a></li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule-soft)] px-[clamp(1.25rem,4vw,3.5rem)] py-6">
        <span className="label">© {new Date().getFullYear()} Aaryan Panchal</span>
        <span className="label">
          Set in Fraunces, Paul Grotesk &amp; JetBrains Mono
          <a href="/void.html" aria-label="?" className="ml-0.5 opacity-40 transition-opacity hover:opacity-100">.</a>
        </span>
      </div>
    </footer>
  );
}
