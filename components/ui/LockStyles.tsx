import { GATES } from '@/lib/gates';

/**
 * One pair of rules per gated chapter. Names default to hidden; the matching
 * `data-unlocked~="slug"` on <html>, set before paint, reveals them.
 *
 * Only slugs are emitted here — never the clues or the answers.
 */
const CSS = `
.ch-bar{display:inline-block;width:6.5ch;height:0.62em;border-radius:2px;opacity:.2;background:currentColor;vertical-align:baseline}
${GATES.map(
  (g) => `.ch-name[data-slug="${g.slug}"],.ch-dot[data-slug="${g.slug}"]{display:none}
html[data-unlocked~="${g.slug}"] .ch-name[data-slug="${g.slug}"]{display:inline}
html[data-unlocked~="${g.slug}"] .ch-dot[data-slug="${g.slug}"]{display:inline-block}
html[data-unlocked~="${g.slug}"] .ch-bar[data-slug="${g.slug}"],
html[data-unlocked~="${g.slug}"] .ch-hint[data-slug="${g.slug}"],
html[data-unlocked~="${g.slug}"] .ch-dot-locked[data-slug="${g.slug}"]{display:none}`
).join('\n')}
`;

export default function LockStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
