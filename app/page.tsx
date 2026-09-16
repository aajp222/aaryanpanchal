import Link from 'next/link';
import Plate from '@/components/ui/Plate';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

const ROLES = ['Engineer', 'Builder', 'Entrepreneur', 'Creative', 'Writer'];

const AWARDS = [
  ['2025', 'WIRE Group Award · Incubation Stage', "Selected out of WPI's i3 Lab"],
  ['2026', 'Accepted into GISA', "WPI's student startup accelerator"],
  ['2025', 'Provisional Patent Filed', 'Mechanism & form factor'],
];

export default function Home() {
  return (
    <Tinted palette="home">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <Wrap>
        <div className="grid min-h-[calc(88svh-57px)] items-center gap-6 pb-10 pt-[clamp(2rem,6vw,5rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-2">
          <div>
            <Reveal>
              <p className="label mb-[clamp(1.75rem,4vw,3rem)]">
                Aaryan Panchal — Worcester, Massachusetts
              </p>
            </Reveal>

            <h1 className="font-display font-[350] text-[clamp(3.4rem,10.5vw,9.5rem)] leading-[0.92] tracking-[-0.035em]">
              <Reveal as="span" className="block">I build things.</Reveal>
              <Reveal as="span" delay={140} className="block italic text-[var(--accent-ink)]">
                Some of them build me back.
              </Reveal>
            </h1>

            <Reveal delay={260}>
              <p className="measure mt-[clamp(2rem,4vw,3rem)] text-[clamp(1.05rem,1.5vw,1.22rem)] leading-[1.62] text-[var(--color-ink-2)]">
                Mechanical engineer and founder of <strong className="font-medium text-[var(--page-ink)]">EpiSafe</strong> —
                an epinephrine auto-injector thin enough to live in a phone case. I spend the rest of my
                time running customer-discovery interviews, flying a drone, and writing things down.
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <Link href="/work/" className="border-b border-[var(--page-ink)] pb-1 transition-opacity hover:opacity-60">
                  See the work →
                </Link>
                <a href="mailto:aaryanpanchal@icloud.com" className="border-b border-[var(--color-rule)] pb-1 text-[var(--color-ink-2)] transition-colors hover:border-[var(--page-ink)] hover:text-[var(--page-ink)]">
                  Get in touch
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
              style={{ background: 'var(--accent-wash)' }}
            />
            <Plate
              src="product-hero"
              alt="EpiSafe — an epinephrine auto-injector mounted to the back of a phone"
              sizes="(max-width: 1024px) 68vw, 40vw"
              priority
              imgClassName="!object-contain drop-shadow-[0_40px_70px_rgba(20,17,14,0.16)]"
              className="mx-auto max-w-[22rem] lg:max-w-[30rem]"
            />
          </Reveal>
        </div>

        <ul className="flex flex-wrap items-center gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-2 border-y border-[var(--color-rule-soft)] py-5">
          {ROLES.map((r) => (
            <li key={r} className="label">{r}</li>
          ))}
        </ul>
      </Wrap>

      {/* ── SELECTED WORK ────────────────────────────────────── */}
      <Section label="Selected work" index="01">
        <div className="grid gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Monument size="large" as="h2">
              The thing I&#39;ve built<br />
              that had to be <em className="italic text-[var(--accent-ink)]">real</em>.
            </Monument>
            <Reveal delay={120}>
              <p className="measure mt-8 text-[var(--color-ink-2)]">
                EpiSafe is built for the <strong className="font-medium text-[var(--page-ink)]">56% of people
                prescribed an EpiPen who don&#39;t carry one.</strong> I lead the mechanism design, the customer
                discovery, and the regulatory groundwork. CAD is complete, CFD is validating dose equivalence,
                and provisional patents are filed on both the mechanism and the form factor.
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--color-rule-soft)] pt-6">
                {[
                  ['9 mo', 'Idea to working concept'],
                  ['11.4 mm', 'Thin · 0.3 mg dose'],
                  ['$6.6B', 'Auto-injector market'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-none">{n}</dt>
                    <dd className="label mt-2 !normal-case !tracking-normal !text-[0.72rem]">{l}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10">
                <Link href="/work/episafe/" className="border-b border-[var(--accent-hair)] pb-1 transition-colors hover:border-[var(--accent)]">
                  Read the case study →
                </Link>
              </p>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <Plate
              src="product-macro"
              alt="The EpiSafe internal injector mechanism, close up on the bench"
              figure="Fig. 01"
              caption="The internal mechanism — real parts, real springs"
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="[&>img]:aspect-[4/3] [&>img]:rounded-sm"
            />
          </Reveal>
        </div>
      </Section>

      {/* ── FULL-BLEED PROOF ─────────────────────────────────── */}
      <Reveal>
        <Plate
          src="demoday"
          alt="The EpiSafe team accepting recognition at WPI Demo Day 2025"
          sizes="100vw"
          className="[&>img]:h-[clamp(20rem,52vw,38rem)] [&>img]:object-[50%_22%]"
        />
      </Reveal>
      <Section className="!pt-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid gap-8 md:grid-cols-3">
          {AWARDS.map(([yr, title, note], i) => (
            <Reveal key={title} delay={i * 90}>
              <p className="label !text-[var(--accent-ink)]">{yr}</p>
              <p className="mt-2 font-medium">{title}</p>
              <p className="mt-1 text-[0.95rem] text-[var(--color-ink-2)]">{note}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── A DOOR, NOT A BILLBOARD ──────────────────────────
           This used to be a full band explaining what Becoming is and
           inviting you in. It isn't advertised any more: one unexplained
           sentence, no label, no call to action. Anyone who wonders what it
           means can click it. Anyone who doesn't has lost nothing. ── */}
      <section className="border-y border-[var(--color-rule-soft)]">
        <Wrap>
          <Link
            href="/becoming/"
            className="group block py-[clamp(4rem,11vw,9rem)]"
            aria-label="mera dil patthar ho gaya"
          >
            <p className="font-display text-[clamp(1.4rem,3.4vw,2.4rem)] italic leading-snug text-[var(--color-ink-3)] transition-colors duration-500 group-hover:text-[var(--page-ink)]">
              mera dil patthar ho gaya.
            </p>
          </Link>
        </Wrap>
      </section>

      {/* ── ELSEWHERE ────────────────────────────────────────── */}
      <Section label="Also" index="02">
        <div className="grid gap-[clamp(2rem,4vw,3.5rem)] md:grid-cols-3">
          <Reveal>
            <Link href="/work/" className="group block">
              <Plate
                src="sga-title"
                alt="A WPI Student Government campaign graphic designed by Aaryan"
                sizes="(max-width: 768px) 100vw, 30vw"
                className="overflow-hidden rounded-sm [&>img]:aspect-[5/4] [&>img]:transition-transform [&>img]:duration-700 group-hover:[&>img]:scale-[1.03]"
              />
              <h3 className="mt-5 font-display text-2xl">Student Government</h3>
              <p className="mt-2 text-[0.98rem] text-[var(--color-ink-2)]">
                Marketing Chair at WPI — the public voice of Student Government across three channels.
              </p>
            </Link>
          </Reveal>

          <Reveal delay={90}>
            <Link href="/book/" className="group block">
              <Plate
                src="aerial-tower"
                alt="An aerial photograph of New England woodland in autumn"
                sizes="(max-width: 768px) 100vw, 30vw"
                className="overflow-hidden rounded-sm [&>img]:aspect-[5/4] [&>img]:transition-transform [&>img]:duration-700 group-hover:[&>img]:scale-[1.03]"
              />
              <h3 className="mt-5 font-display text-2xl">Drone &amp; Photography</h3>
              <p className="mt-2 text-[0.98rem] text-[var(--color-ink-2)]">
                Aerial cinematography and on-the-ground photography. Events, sports, real estate, product.
              </p>
            </Link>
          </Reveal>

          {/* Writing gets type rather than a photograph — the honest picture of it. */}
          <Reveal delay={180}>
            <Link href="/writing/" className="group block">
              <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-sm bg-[var(--color-cream)] px-8 transition-colors group-hover:bg-[var(--accent-wash)]">
                <p className="font-display text-[clamp(1.1rem,2.2vw,1.6rem)] italic leading-snug">
                  some books dont get<br />a final chapter,<br />
                  <span className="text-[var(--color-ink-3)]">just a bookmark<br />of where you left it</span>
                </p>
              </div>
              <h3 className="mt-5 font-display text-2xl">Writing</h3>
              <p className="mt-2 text-[0.98rem] text-[var(--color-ink-2)]">
                Poems, songs, half-thoughts and drafts that contradict each other. Press a key to open one.
              </p>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <Wrap>
        <div className="border-t border-[var(--color-rule)] py-[clamp(3.5rem,7vw,6rem)]">
          <Monument size="large" as="h2">
            Building something <em className="italic text-[var(--accent-ink)]">hard?</em>
          </Monument>
          <Reveal delay={120}>
            <a
              href="mailto:aaryanpanchal@icloud.com"
              className="mt-7 inline-block font-display text-[clamp(1.5rem,4.6vw,3.2rem)] leading-none transition-opacity hover:opacity-60"
            >
              aaryanpanchal@icloud.com <span aria-hidden className="text-[var(--accent-ink)]">→</span>
            </a>
          </Reveal>
        </div>
      </Wrap>
    </Tinted>
  );
}
