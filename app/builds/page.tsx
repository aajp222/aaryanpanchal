import type { Metadata } from 'next';
import Link from 'next/link';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'Builds',
  description:
    'Smaller things Aaryan Panchal has built — a companion iOS app, a step sequencer, a text-mode terminal, a personal CRM, and this website.',
};

type Build = {
  name: string;
  year: string;
  what: string;
  stack: string[];
  href?: string;
  external?: boolean;
  note?: string;
};

const BUILDS: Build[] = [
  {
    name: 'EpiSafe companion app',
    year: '2025',
    what: 'Expiry reminders, device location, and an alert to an emergency contact the moment the injector fires. The hardware stays dead-simple so the phone can do the thinking.',
    stack: ['iOS', 'Bluetooth LE', 'TestFlight'],
    href: '/work/episafe/',
  },
  {
    name: 'This website',
    year: '2026',
    what: 'A static site with a twenty-chapter autobiography bolted underneath it. The chapters share one stylesheet at twenty-six different settings — a single saturation dial takes it from chromaless in Stone to full spectrum by Flesh, and the display typeface is driven off the same number so the letterforms soften as the story does.',
    stack: ['Next.js', 'TypeScript', 'MDX', 'Tailwind'],
    href: '/becoming/',
  },
  {
    name: 'The instrument',
    year: '2026',
    what: 'Press a letter, get a shape, a synthesised tone, and a poem. No samples, no audio files — just oscillators, and the whole archive mapped onto a keyboard.',
    stack: ['Web Audio', 'React'],
    href: '/writing/',
  },
  {
    name: 'Beat Lab & the arcade',
    year: '2025',
    what: 'A 4×16 step sequencer with a synthesised kit, two small games, and a drawer of throwable photographs. The after-hours room — still dark on purpose, because that is what it is.',
    stack: ['Canvas', 'Web Audio', 'Vanilla JS'],
    href: '/play.html',
    external: true,
  },
  {
    name: 'The terminal',
    year: '2025',
    what: 'A text-mode room with a working snake game, and now a query console for the writing archive. Type "archive trust" and it answers.',
    stack: ['Vanilla JS'],
    href: '/void.html',
    external: true,
  },
  {
    name: 'Personal CRM',
    year: '2025',
    what: 'A single-page lead tracker for the photography work. Data lives in the browser and never leaves it, which is both a privacy decision and an excuse not to run a server.',
    stack: ['localStorage', 'Vanilla JS'],
    note: 'Passcode-gated — it is my actual working copy.',
  },
];

export default function BuildsPage() {
  return (
    <Tinted palette="builds">
      <Wrap>
        <header className="py-[clamp(3rem,8vw,6rem)]">
          <Reveal><p className="label">The shelf</p></Reveal>
          <Monument size="colossal" as="h1" className="mt-6">Builds</Monument>
          <Reveal delay={160}>
            <p className="measure mt-8 text-[clamp(1.05rem,1.6vw,1.2rem)] text-[var(--color-ink-2)]">
              Smaller things. Some of these are useful, some were an excuse to learn something, and
              one is a step sequencer I wrote instead of sleeping. I learn by building — it is the
              same loop as everything else on this site, just with a shorter feedback cycle.
            </p>
          </Reveal>
        </header>
      </Wrap>

      <Section>
        <ul className="border-t border-[var(--color-rule-soft)]">
          {BUILDS.map((b, i) => {
            const inner = (
              <>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none transition-opacity group-hover:opacity-60">
                    {b.name}
                  </h2>
                  <span className="label tabular-nums">{b.year}</span>
                  {b.external && <span className="label !text-[var(--accent-ink)]">after hours ↗</span>}
                </div>
                <p className="measure mt-3 text-[var(--color-ink-2)]">{b.what}</p>
                {b.note && <p className="label mt-3 !normal-case !tracking-normal">{b.note}</p>}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {b.stack.map((s) => (
                    <li key={s} className="label rounded-full border border-[var(--color-rule)] px-3 py-1 !normal-case !tracking-normal">
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            );

            return (
              <li key={b.name} className="border-b border-[var(--color-rule-soft)] py-[clamp(1.8rem,3.5vw,2.8rem)]">
                <Reveal delay={Math.min(i * 60, 240)}>
                  {b.href ? (
                    b.external ? (
                      <a href={b.href} className="group block">{inner}</a>
                    ) : (
                      <Link href={b.href} className="group block">{inner}</Link>
                    )
                  ) : (
                    <div>{inner}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>
    </Tinted>
  );
}
