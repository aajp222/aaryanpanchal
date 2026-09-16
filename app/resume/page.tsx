import type { Metadata } from 'next';
import Monument from '@/components/ui/Monument';
import Reveal from '@/components/ui/Reveal';
import Tinted from '@/components/ui/Tinted';
import { Wrap } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Résumé',
  description:
    'Aaryan Panchal — Mechanical Engineering at WPI, Founder & CEO of EpiSafe. Mechanism design, SOLIDWORKS and Shapr3D, SwiftUI and BLE, TIG and MIG welding.',
};

const PDF = '/aaryan-panchal-resume.pdf';

const SKILLS: [string, string][] = [
  ['Design', 'SOLIDWORKS, Shapr3D, Fusion 360, Autodesk Inventor (basic)'],
  ['Manufacturing', 'TIG and MIG welding, engineering drawing interpretation'],
  ['Software & Electronics', 'Python, Swift/SwiftUI, JavaScript, Bluetooth LE, Arduino, Raspberry Pi'],
];

type Role = { title: string; org: string; when: string; bullets?: string[] };

const ENGINEERING: Role[] = [
  {
    title: 'Founder & CEO',
    org: 'EpiSafe LLC',
    when: 'May 2025 – Present',
    bullets: [
      'Designed and prototyped a compact, patent-pending multi-vial auto-injector with a new plunger mechanism, in Shapr3D and SOLIDWORKS.',
      'Developed a SwiftUI companion app and tested Bluetooth Low Energy battery monitoring against physical hardware.',
      "Implemented recorded phone alerts to saved emergency contacts, sharing the user's location and notifying them that epinephrine has been used.",
      'Won the WIRE Group Award at WPI i3 Lab Demo Day (Sept 2025), earning a chance to pitch to the investor group.',
    ],
  },
  {
    title: 'Welding Engineering Intern',
    org: 'Steel-Fab, Inc.',
    when: 'May – Jun 2023',
    bullets: [
      'Performed TIG and MIG welding and interpreted engineering drawings to support fabrication of large metal gears for U.S. government ship applications.',
    ],
  },
];

const PROJECTS: Role[] = [
  {
    title: 'Interactive Qualifying Project',
    org: 'WPI Kyoto Project Center',
    when: 'Aug 2026 – Present',
    bullets: [
      'Researching the role of seafood certification in Fukui, Japan for Fukui Prefectural University; facilitating team meetings and planning stakeholder interviews.',
    ],
  },
  {
    title: 'Project Lead',
    org: 'FIRST Tech Challenge Robotics',
    when: 'Aug 2020 – May 2024',
    bullets: [
      'Led a one-person team to design, program and test robots; created CAD models and integrated hardware.',
    ],
  },
];

const LEADERSHIP: Role[] = [
  {
    title: 'Marketing Chair',
    org: 'WPI Student Government Association',
    when: 'Jan 2026 – Present',
    bullets: [
      'Manage Instagram and produce promotional graphics and video — roughly 500 new followers and nearly 200,000 views since taking office.',
      'Created the templates for Senate Recap, Club Congress, Club of the Week and Financial Fridays; designed pep rally posters and contributed to merchandise design.',
    ],
  },
  {
    title: 'Community Advisor',
    org: 'WPI Residential Services',
    when: 'Aug 2025 – Present',
    bullets: ["Support residents' academic, social and wellness needs while upholding university policy."],
  },
  {
    title: 'Sports Media Assistant',
    org: 'WPI Athletics',
    when: 'Aug 2024 – Present',
    bullets: ['Produce and manage live sports broadcasts for FloSports. Produce Media Days for athletes.'],
  },
  {
    title: 'DJ Host & Wedding Assistant',
    org: 'Central Mass Productions',
    when: 'Aug 2024 – Aug 2025',
    bullets: ['Hosted live bingo events and supported wedding event production.'],
  },
];

function Section({ label, roles }: { label: string; roles: Role[] }) {
  return (
    <section className="mt-[clamp(2.5rem,5vw,4rem)]">
      <h2 className="label border-t border-[var(--color-rule)] pt-4">{label}</h2>
      {roles.map((r, i) => (
        <Reveal key={r.org} delay={Math.min(i * 60, 200)}>
          <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <h3 className="font-display text-[clamp(1.3rem,2.6vw,1.8rem)] leading-tight">
              {r.title} <span className="text-[var(--color-ink-3)]">·</span>{' '}
              <span className="italic">{r.org}</span>
            </h3>
            <p className="label tabular-nums sm:text-right">{r.when}</p>
          </div>
          {r.bullets && (
            <ul className="measure mt-3 space-y-2">
              {r.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[var(--color-ink-2)]">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--accent)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </section>
  );
}

export default function ResumePage() {
  return (
    <Tinted palette="work">
      <Wrap>
        <header className="py-[clamp(3rem,7vw,5rem)]">
          <Reveal><p className="label">Résumé</p></Reveal>
          <Monument size="huge" as="h1" className="mt-4">Aaryan Panchal</Monument>
          <Reveal delay={140}>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[var(--color-ink-2)]">
              <a href="mailto:aaryanpanchal@icloud.com" className="border-b border-[var(--accent-hair)] pb-0.5 hover:border-[var(--accent)]">
                aaryanpanchal@icloud.com
              </a>
              <a href="https://linkedin.com/in/aaryanpanchal" target="_blank" rel="noopener" className="hover:text-[var(--page-ink)]">LinkedIn ↗</a>
              <a href="https://episafe.co" target="_blank" rel="noopener" className="hover:text-[var(--page-ink)]">episafe.co ↗</a>
              <span className="text-[var(--color-ink-3)]">Worcester, MA</span>
            </p>
            <p className="mt-8">
              <a
                href={PDF}
                className="label inline-block rounded-full bg-[var(--page-ink)] px-6 py-3 !text-[var(--ground)] transition-opacity hover:opacity-80"
                download
              >
                Download the PDF ↓
              </a>
            </p>
          </Reveal>
        </header>

        <div className="pb-[clamp(4rem,9vw,7rem)]">
          <section>
            <h2 className="label border-t border-[var(--color-rule)] pt-4">Education</h2>
            <Reveal>
              <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <h3 className="font-display text-[clamp(1.3rem,2.6vw,1.8rem)] leading-tight">
                  Worcester Polytechnic Institute
                </h3>
                <p className="label tabular-nums sm:text-right">Worcester, MA</p>
              </div>
              <dl className="measure mt-3 space-y-1 text-[var(--color-ink-2)]">
                <div className="flex justify-between gap-6">
                  <dt>M.S. Mechanical Engineering</dt>
                  <dd className="label tabular-nums shrink-0">May 2029</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt>B.S. Mechanical Engineering</dt>
                  <dd className="label tabular-nums shrink-0">May 2028</dd>
                </div>
              </dl>
              <p className="measure mt-3 text-[0.95rem] text-[var(--color-ink-3)]">
                Relevant coursework: Continuum Mechanics (graduate), Heat Transfer, Stress Analysis.
              </p>
            </Reveal>
          </section>

          <section className="mt-[clamp(2.5rem,5vw,4rem)]">
            <h2 className="label border-t border-[var(--color-rule)] pt-4">Technical skills</h2>
            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-[13rem_1fr]">
              {SKILLS.map(([k, v]) => (
                <Reveal key={k} as="div" className="contents">
                  <dt className="label">{k}</dt>
                  <dd className="text-[var(--color-ink-2)]">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </section>

          <Section label="Engineering experience" roles={ENGINEERING} />
          <Section label="Projects" roles={PROJECTS} />
          <Section label="Leadership & additional experience" roles={LEADERSHIP} />
        </div>
      </Wrap>
    </Tinted>
  );
}
