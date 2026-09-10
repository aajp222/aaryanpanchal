import type { Metadata } from 'next';
import Plate from '@/components/ui/Plate';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import BookingForm from '@/components/ui/BookingForm';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'Book a Shoot — Drone & Photography',
  description:
    'Aerial drone cinematography and on-the-ground photography with Aaryan Panchal — events, sports, real estate and product. Worcester, MA and across New England.',
  alternates: { canonical: 'https://aaryanpanchal.com/book/' },
};

const SERVICES = [
  ['A · 01', 'Aerial & Drone', '4K drone cinematography — sweeping reveals, top-downs and dynamic follow shots of venues, fields and landscapes.'],
  ['A · 02', 'Events & Sports', 'Fast, candid coverage of games, ceremonies and campus events — the energy, the crowd, and the moments that matter.'],
  ['A · 03', 'Real Estate', 'Aerial and interior sets that make a property look its best — listings, venues, and spaces that need to sell.'],
  ['A · 04', 'Portrait & Product', 'Clean, controlled detail work — headshots, team photos and crisp product macros built for the web.'],
];

export default function BookPage() {
  return (
    <Tinted palette="book">
      <Wrap>
        <header className="py-[clamp(3rem,8vw,6rem)]">
          <Reveal><p className="label">Drone · Photo · Video</p></Reveal>
          <Monument size="colossal" as="h1" className="mt-6">Book the shot.</Monument>
          <Reveal delay={160}>
            <p className="measure mt-8 text-[clamp(1.05rem,1.6vw,1.22rem)] text-[var(--color-ink-2)]">
              Aerial drone cinematography and on-the-ground photography — events, sports, real estate
              and product. Based at WPI, flying and shooting across Worcester and New England.
            </p>
          </Reveal>
        </header>
      </Wrap>

      <Reveal>
        <Plate
          src="aerial-tower"
          alt="Aerial drone photograph over New England fall foliage"
          sizes="100vw"
          priority
          className="[&>img]:h-[clamp(20rem,52vw,38rem)]"
        />
      </Reveal>

      <Section label="What I shoot" index="01">
        <Monument size="large" as="h2" className="max-w-[16ch]">
          From the sky, and the <em className="italic text-[var(--accent-ink)]">sidelines.</em>
        </Monument>
        <Reveal delay={100}>
          <p className="measure mt-6 text-[var(--color-ink-2)]">
            Pick a lane or mix them. Every booking comes back as a colour-graded, ready-to-post set —
            stills, vertical cutdowns, and a hero edit.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {SERVICES.map(([n, title, body], i) => (
            <Reveal key={title} delay={i * 70}>
              <p className="label !text-[var(--accent-ink)]">{n}</p>
              <h3 className="mt-2 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-[0.98rem] text-[var(--color-ink-2)]">{body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Selected frames" index="02">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['reel-poster', 'Golden hour, from above', 'Aerial · Drone'],
            ['event-cover', 'On location', 'Events · WPI'],
            ['wpi-gameday', 'Game day', 'Sports · Sideline'],
          ].map(([src, cap, fig], i) => (
            <Reveal key={src} delay={i * 80}>
              <Plate
                src={src}
                alt={cap}
                figure={fig}
                caption={cap}
                sizes="(max-width: 768px) 100vw, 30vw"
                className="[&>img]:aspect-[4/3] [&>img]:rounded-sm"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Book a shoot" index="03">
        <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.8rem)] leading-tight">
              Let&#39;s get it on the calendar.
            </h2>
            <p className="mt-5 text-[var(--color-ink-2)]">
              Fill this out and it&#39;ll open a pre-filled email straight to me. I read everything and
              reply with a quote within 24 hours.
            </p>
            <ul className="mt-8 space-y-3 text-[0.95rem] text-[var(--color-ink-2)]">
              {[
                'Licensed and insured drone work, flown within regulations.',
                'Fast turnaround — most sets delivered the same week.',
                'Worcester and New England. Travel further for the right project.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-[var(--accent)]" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <BookingForm />
          </Reveal>
        </div>
      </Section>
    </Tinted>
  );
}
