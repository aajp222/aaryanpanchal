import type { Metadata } from 'next';
import Link from 'next/link';
import Plate from '@/components/ui/Plate';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import { Section, Wrap } from '@/components/ui/Section';
import Tinted from '@/components/ui/Tinted';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Aaryan Panchal — mechanical engineering at WPI, founder of EpiSafe, Co-Marketing Chair of Student Government. More interested in the question behind the question.',
};

const FACTS = [
  ['Currently', 'Founder, EpiSafe · ME @ WPI'],
  ['Based in', 'Worcester, Massachusetts'],
  ['Team', '5 engineers & operators'],
  ['Focused on', 'Medical devices, product, leadership'],
  ['Ask me about', 'Designing around regulation'],
  ['Email', 'aaryanpanchal@icloud.com'],
];

export default function AboutPage() {
  return (
    <Tinted palette="about">
      <Wrap>
        <div className="grid items-center gap-[clamp(2rem,6vw,5rem)] py-[clamp(3rem,8vw,6rem)] lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal><p className="label">About</p></Reveal>
            <Monument size="huge" as="h1" className="mt-6">
              I&#39;m more interested in the<br />
              <em className="italic text-[var(--accent-ink)]">question behind the question.</em>
            </Monument>
          </div>
          <Reveal delay={140}>
            <Plate
              src="aaryan-sga"
              alt="Aaryan Panchal"
              sizes="(max-width: 1024px) 70vw, 36vw"
              priority
              className="mx-auto max-w-[22rem] [&>img]:aspect-[4/5] [&>img]:rounded-sm"
            />
          </Reveal>
        </div>
      </Wrap>

      <Section>
        <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="measure">
            <Reveal>
              <p className="text-[clamp(1.08rem,1.6vw,1.24rem)] leading-[1.72] text-[var(--color-ink-2)]">
                When we started EpiSafe, the obvious question was <em>how do we make a smaller
                auto-injector?</em> The better one was: <strong className="font-medium text-[var(--page-ink)]">why
                do more than half of people prescribed epinephrine leave it at home?</strong>
              </p>
              <p className="mt-6 text-[clamp(1.08rem,1.6vw,1.24rem)] leading-[1.72] text-[var(--color-ink-2)]">
                That second question is what I engineer toward. I&#39;m studying Mechanical Engineering
                at WPI — stress, materials, thermodynamics — and spending the rest of my time running
                customer-discovery interviews, reading FDA guidance, and turning messy human needs
                into hardware people will actually carry.
              </p>
              <p className="mt-6 text-[clamp(1.08rem,1.6vw,1.24rem)] leading-[1.72] text-[var(--color-ink-2)]">
                I work best at the seam between the bench and the boardroom: close enough to the CAD
                to know what&#39;s possible, close enough to the patient to know what matters, and close
                enough to the regulation to know what it&#39;ll take to ship.
              </p>
              <p className="mt-6 text-[clamp(1.08rem,1.6vw,1.24rem)] leading-[1.72] text-[var(--color-ink-2)]">
                Outside of that I fly a drone, run marketing for a student government, argue about
                food, and write a great deal more than I publish.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <dl className="border-t border-[var(--color-rule-soft)]">
              {FACTS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--color-rule-soft)] py-4">
                  <dt className="label">{k}</dt>
                  <dd className="text-[0.98rem]">
                    {k === 'Email' ? (
                      <a href={`mailto:${v}`} className="border-b border-[var(--accent-hair)] pb-0.5 hover:border-[var(--accent)]">{v}</a>
                    ) : v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Plate src="lab" alt="Working on the EpiSafe prototype in the WPI lab" figure="Fig. 01" caption="In the lab · WPI" sizes="(max-width: 768px) 100vw, 46vw" className="[&>img]:aspect-[4/3] [&>img]:rounded-sm" />
          </Reveal>
          <Reveal delay={90}>
            <Plate src="team-2025" alt="The EpiSafe team at WPI" figure="Fig. 02" caption="The team" sizes="(max-width: 768px) 100vw, 46vw" className="[&>img]:aspect-[4/3] [&>img]:rounded-sm" />
          </Reveal>
        </div>
      </Section>

      {/* ── the bridge ── */}
      <section className="bg-[var(--color-cream)] py-[clamp(4rem,10vw,9rem)]">
        <Wrap>
          <Monument size="large" as="h2" className="max-w-[20ch]">
            That&#39;s the part that fits on a résumé.
          </Monument>
          <Reveal delay={140}>
            <p className="measure mt-8 text-[1.08rem] text-[var(--color-ink-2)]">
              There&#39;s a longer version — about India, a heart that decided to be stone, and most of
              what I&#39;ve had to learn since. It&#39;s twenty chapters and it doesn&#39;t have an ending yet.
            </p>
            <Link href="/becoming/" className="mt-10 inline-flex items-baseline gap-3 font-display text-[clamp(1.4rem,3vw,2.2rem)] italic transition-opacity hover:opacity-60">
              Becoming <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </Wrap>
      </section>
    </Tinted>
  );
}
