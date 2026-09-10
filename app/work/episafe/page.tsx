import type { Metadata } from 'next';
import Link from 'next/link';
import Plate from '@/components/ui/Plate';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'EpiSafe — Case Study',
  description:
    'EpiSafe: an epinephrine auto-injector thin enough to live in a phone case, built for the 56% of people prescribed an EpiPen who do not carry one. Mechanism design, customer discovery and the 510(k) pathway.',
};

const FACTS = [
  ['Role', 'Founder & Product Lead'],
  ['Timeline', '2024 — Present'],
  ['Focus', 'Mechanism · Discovery · FDA'],
  ['Status', 'Patent pending · CAD complete'],
];

const STATS = [
  ['56%', "Of patients don't carry their injector"],
  ['11.4 mm', 'Thin enough for a phone case'],
  ['0.3 mg', 'Epinephrine dose'],
  ['$6.6B', 'Auto-injector market'],
];

export default function EpiSafePage() {
  return (
    <Tinted palette="work">
      <Wrap>
        <header className="py-[clamp(3rem,8vw,6rem)]">
          <Reveal>
            <Link href="/work/" className="label hover:text-[var(--page-ink)]">← Work</Link>
            <p className="label mt-6">Case study · Medical device</p>
          </Reveal>
          <Monument size="colossal" as="h1" className="mt-5">EpiSafe</Monument>
          <Reveal delay={160}>
            <p className="measure mt-8 text-[clamp(1.05rem,1.7vw,1.28rem)] text-[var(--color-ink-2)]">
              An epinephrine auto-injector thin enough to live in your phone case — built for the 56%
              of people prescribed an EpiPen who don&#39;t carry one.
            </p>
            <dl className="mt-12 grid gap-x-8 gap-y-5 border-t border-[var(--color-rule-soft)] pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {FACTS.map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </header>
      </Wrap>

      <Reveal>
        <Plate
          src="product-hero"
          alt="EpiSafe mounted to the back of a phone"
          sizes="100vw"
          priority
          className="mx-auto max-w-[36rem] px-6 [&>img]:!object-contain"
          imgClassName="drop-shadow-[0_50px_80px_rgba(20,17,14,0.18)]"
        />
      </Reveal>

      <Section>
        <dl className="grid gap-8 border-y border-[var(--color-rule-soft)] py-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <Reveal key={l}>
              <dt className="font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-none">{n}</dt>
              <dd className="label mt-3 !normal-case !tracking-normal">{l}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section label="The problem" index="01">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[0.85fr_1.15fr]">
          <Monument size="large" as="h2">
            The problem isn&#39;t the drug.<br />
            It&#39;s <em className="italic text-[var(--accent-ink)]">carrying it.</em>
          </Monument>
          <Reveal delay={100}>
            <p className="text-[1.08rem] text-[var(--color-ink-2)]">
              Epinephrine is the only thing that stops anaphylaxis, and it only works if it&#39;s on you
              when seconds matter. Yet more than half of people prescribed an auto-injector don&#39;t
              have it when they need it.
            </p>
            <p className="mt-5 text-[1.08rem] text-[var(--color-ink-2)]">
              The reason is mundane and human: the standard injector is bulky, awkward and easy to
              leave behind. The device isn&#39;t failing in the ER — it&#39;s failing in the pocket that
              stayed home.
            </p>
            <p className="mt-5 text-[1.08rem] text-[var(--color-ink-2)]">
              EpiSafe&#39;s bet is simple. Put the dose where the phone already is. If it lives in the
              one thing nobody forgets, carry rates change.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section label="The build" index="02">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <Reveal>
            <Plate
              src="product-macro"
              alt="The EpiSafe internal injector mechanism"
              figure="Fig. 01"
              caption="Internal mechanism — spring force, fluid path, needle deployment"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="[&>img]:aspect-[4/3] [&>img]:rounded-sm"
            />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-tight">
              Discovery first. CAD second.
            </h2>
            <p className="mt-5 text-[var(--color-ink-2)]">
              The internal injector was redesigned from scratch to fit a phone-case envelope — spring
              force, fluid path and needle deployment all reworked to hit dose equivalence in a
              fraction of the thickness.
            </p>
            <p className="mt-5 text-[var(--color-ink-2)]">
              CAD is complete and CFD simulations are validating dose delivery against a predicate
              auto-injector. Provisional patents are filed on both the mechanism and the form factor,
              and a companion iOS app is on TestFlight for closed beta.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {['Mechanism design', 'CAD / CFD', 'Utility provisional', 'Design provisional', 'iOS · BLE'].map((c) => (
                <li key={c} className="label rounded-full border border-[var(--color-rule)] px-3 py-1 !normal-case !tracking-normal">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section label="How it works" index="03">
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
          <Reveal>
            <p className="text-[1.08rem] text-[var(--color-ink-2)]">
              EpiSafe mounts to the back of a phone like a thin case insert. In an emergency the user
              — or a bystander — deploys it with a single action, delivering a 0.3 mg intramuscular
              dose the same way a conventional auto-injector does.
            </p>
            <p className="mt-5 text-[1.08rem] text-[var(--color-ink-2)]">
              The companion app handles the parts software is good at: expiry reminders, location,
              and alerting an emergency contact the moment the device is used. The hardware stays
              dead-simple; the phone does the thinking.
            </p>
            <p className="mt-5 text-[1.08rem] text-[var(--color-ink-2)]">
              Every decision is made against one constraint above all others — it has to earn FDA
              clearance through the 510(k) substantial-equivalence pathway.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Plate
              src="internal"
              alt="Exploded view of the EpiSafe injector subassembly"
              figure="Fig. 02"
              caption="Injector subassembly"
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="[&>img]:aspect-square [&>img]:rounded-sm [&>img]:!object-contain"
            />
          </Reveal>
        </div>
      </Section>

      <Reveal>
        <Plate
          src="demoday"
          alt="The EpiSafe team at WPI Demo Day 2025"
          sizes="100vw"
          className="[&>img]:h-[clamp(18rem,45vw,32rem)]"
        />
      </Reveal>

      <Section label="Validated in the room" index="04">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            ['2025', 'WIRE Group Award · Incubation Stage', "$500 funding, selected out of WPI's i3 Lab"],
            ['2026', 'Accepted into GISA', "Goat Impact Summer Accelerator · WPI's student startup accelerator"],
            ['2025', 'Provisional Patent Filed', 'Mechanism & form factor'],
          ].map(([yr, title, note], i) => (
            <Reveal key={title} delay={i * 90}>
              <p className="label !text-[var(--accent-ink)]">{yr}</p>
              <p className="mt-2 font-medium">{title}</p>
              <p className="mt-1 text-[0.95rem] text-[var(--color-ink-2)]">{note}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Where it's going" index="05">
        <Monument size="large" as="h2" className="max-w-[20ch]">
          Make epinephrine something people <em className="italic text-[var(--accent-ink)]">actually have on them.</em>
        </Monument>
        <Reveal delay={120}>
          <p className="measure mt-8 text-[1.08rem] text-[var(--color-ink-2)]">
            Next: bench testing for dose equivalence, a manufacturable industrial design, and an FDA
            pre-submission targeted for Q4 2026. The north star hasn&#39;t moved.
          </p>
          <p className="mt-10">
            <a href="mailto:aaryanpanchal@icloud.com" className="border-b border-[var(--accent-hair)] pb-1 transition-colors hover:border-[var(--accent)]">
              Want the deeper version? Happy to walk through the mechanism, the discovery, or the regulatory plan →
            </a>
          </p>
        </Reveal>
      </Section>
    </Tinted>
  );
}
