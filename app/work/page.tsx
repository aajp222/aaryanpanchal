import type { Metadata } from 'next';
import Link from 'next/link';
import Plate from '@/components/ui/Plate';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'EpiSafe — an epinephrine auto-injector thin enough to live in a phone case. Plus WPI Student Government marketing and drone cinematography.',
};

export default function WorkPage() {
  return (
    <Tinted palette="work">
      <Wrap>
        <header className="py-[clamp(3rem,8vw,6rem)]">
          <Reveal><p className="label">What I&#39;m building</p></Reveal>
          <Monument size="colossal" as="h1" className="mt-6">Work</Monument>
          <Reveal delay={160}>
            <p className="measure mt-8 text-[clamp(1.05rem,1.6vw,1.2rem)] text-[var(--color-ink-2)]">
              A medical device that has to earn FDA clearance, the public voice of a student
              government, and a drone. Different rooms, same question underneath: why doesn&#39;t the
              obvious thing work, and what would have to be true for it to.
            </p>
          </Reveal>
        </header>
      </Wrap>

      {/* ── EPISAFE ── */}
      <Section label="Medical device · Founder & Product Lead" index="01">
        <Link href="/work/episafe/" className="group block">
          <Reveal>
            <Plate
              src="product-hero"
              alt="EpiSafe — an epinephrine auto-injector mounted to the back of a phone"
              sizes="100vw"
              className="mx-auto max-w-[34rem] [&>img]:!object-contain"
              imgClassName="drop-shadow-[0_40px_70px_rgba(20,17,14,0.16)]"
            />
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <Monument size="large" as="h2">
              EpiSafe
            </Monument>
            <Reveal delay={100}>
              <p className="text-[1.08rem] text-[var(--color-ink-2)]">
                An epinephrine auto-injector thin enough to live in your phone case — built for the
                <strong className="font-medium text-[var(--page-ink)]"> 56% of people prescribed an
                EpiPen who don&#39;t carry one.</strong> The problem was never the drug. It&#39;s that the
                standard injector is bulky and easy to leave behind, so it fails in the pocket that
                stayed home rather than in the emergency room.
              </p>
              <p className="mt-4 text-[1.08rem] text-[var(--color-ink-2)]">
                I lead mechanism design, customer discovery and the regulatory groundwork. The whole
                design is shaped by one constraint above all others: it has to clear the 510(k)
                substantial-equivalence pathway.
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--color-rule-soft)] pt-6 sm:grid-cols-4">
                {[
                  ['56%', "Don't carry their injector"],
                  ['11.4 mm', 'Thin enough for a case'],
                  ['0.3 mg', 'Epinephrine dose'],
                  ['$6.6B', 'Auto-injector market'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-none">{n}</dt>
                    <dd className="label mt-2 !normal-case !tracking-normal !text-[0.72rem]">{l}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 border-b border-[var(--accent-hair)] pb-1 inline-block transition-colors group-hover:border-[var(--accent)]">
                Read the full case study →
              </p>
            </Reveal>
          </div>
        </Link>
      </Section>

      {/* ── SGA ── */}
      <Section label="Leadership · WPI Student Government" index="02">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <Plate
              src="sga-title"
              alt="A WPI Student Government campaign graphic"
              figure="Fig. 02"
              caption="Financial Fridays — one of the recurring campaigns"
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="[&>img]:aspect-[16/10] [&>img]:rounded-sm"
            />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
              Co-Marketing Chair
            </h2>
            <p className="mt-5 text-[var(--color-ink-2)]">
              As External Marketing Chair I run the public voice of WPI&#39;s Student Government —
              Instagram, TikTok and the website. Elections, Senate recaps, Financial Fridays, Club of
              the Week, and every external club&#39;s promo request comes through marketing.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--color-rule-soft)] pt-6">
              {[
                ['3', 'Channels — IG, TikTok, web'],
                ['6.8K', 'Top post reach'],
                ['Weekly', 'Club of the Week cadence'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-[clamp(1.3rem,2.4vw,2rem)] leading-none">{n}</dt>
                  <dd className="label mt-2 !normal-case !tracking-normal !text-[0.72rem]">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ── DRONE ── */}
      <Section label="Camera work" index="03">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
              Drone &amp; photography
            </h2>
            <p className="mt-5 text-[var(--color-ink-2)]">
              Aerial cinematography and on-the-ground photography — events, sports, real estate and
              product. Based at WPI, available across Worcester and New England. It pays for parts,
              and it taught me more about composition than any class did.
            </p>
            <p className="mt-8">
              <Link href="/book/" className="border-b border-[var(--accent-hair)] pb-1 transition-colors hover:border-[var(--accent)]">
                Book a shoot →
              </Link>
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Plate
              src="aerial-tower"
              alt="Aerial photograph of New England woodland in autumn"
              figure="Fig. 03"
              caption="New England, autumn"
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="[&>img]:aspect-[16/10] [&>img]:rounded-sm"
            />
          </Reveal>
        </div>
      </Section>
    </Tinted>
  );
}
