/**
 * The colour arc.
 *
 * Every chapter is one setting of the same stylesheet. `chroma` scales the
 * saturation of the entire chapter — 0 leaves STONE in bright, chromaless
 * greys; 1 gives FLESH and BECOMING the full spectrum. `becoming` drives the
 * Fraunces SOFT and WONK axes, so the letterforms themselves travel from
 * geometric and flat-terminaled to soft and organic.
 *
 * Grounds stay in daylight. Two chapters are deliberate exceptions:
 * APART goes twilight, and PSALMS begins at night and arrives at dawn.
 */

export type Palette = {
  /** 0 → 1. Multiplies all chroma in the chapter. */
  chroma: number;
  /** 0 → 1. Stone to flesh, in the typeface's variable axes. */
  becoming: number;
  /** OKLCH lightness / chroma / hue for the page ground. */
  ground: [number, number, number];
  /** OKLCH for the primary accent. */
  accent: [number, number, number];
  /** OKLCH for the secondary accent. */
  accent2: [number, number, number];
  /** Hue of the body ink, so text warms with the chapter. */
  inkHue: number;
  /** OKLCH lightness/chroma of the body ink. Defaults to near-black; the two
   *  chapters with dark grounds set it light instead. */
  ink?: [number, number];
  /** Ground the chapter travels to, if it moves. Drives PSALMS' night → dawn. */
  groundEnd?: [number, number, number];
};

const NEUTRAL: Palette = {
  chroma: 0.4,
  becoming: 0.5,
  ground: [98.2, 0.008, 85],
  accent: [58, 0.1, 70],
  accent2: [55, 0.08, 240],
  inkHue: 70,
};

export const PALETTE: Record<string, Palette> = {
  // ── the surface ────────────────────────────────────────────────
  // Grounds stay close to paper so the site reads as one place; the
  // accent is what changes, and it changes hard.
  home:    { chroma: 0.95, becoming: 0.35, ground: [98.2, 0.008, 84], accent: [64, 0.17, 58],  accent2: [56, 0.13, 235], inkHue: 70 },
  work:    { chroma: 0.95, becoming: 0.2,  ground: [98, 0.007, 235],  accent: [52, 0.15, 248], accent2: [62, 0.15, 42],  inkHue: 240 },
  builds:  { chroma: 0.95, becoming: 0.45, ground: [98, 0.008, 150],  accent: [52, 0.14, 152], accent2: [64, 0.15, 70],  inkHue: 150 },
  writing: { chroma: 1,    becoming: 0.75, ground: [98, 0.008, 330],  accent: [55, 0.17, 330], accent2: [70, 0.15, 80],  inkHue: 320 },
  about:   { chroma: 0.95, becoming: 0.5,  ground: [98.2, 0.01, 55],  accent: [58, 0.16, 38],  accent2: [58, 0.12, 200], inkHue: 55 },
  book:    { chroma: 0.95, becoming: 0.3,  ground: [98, 0.008, 220],  accent: [56, 0.15, 228], accent2: [68, 0.16, 62],  inkHue: 225 },

  // ── the spine ──────────────────────────────────────────────────
  '01-stone':       { chroma: 0,    becoming: 0,    ground: [98.4, 0.004, 95], accent: [52, 0.02, 95],  accent2: [40, 0.02, 95],  inkHue: 95 },
  '02-india':       { chroma: 0.55, becoming: 0.05, ground: [97.2, 0.018, 82], accent: [68, 0.15, 72],  accent2: [58, 0.13, 40],  inkHue: 78 },
  '03-want':        { chroma: 0.5,  becoming: 0.1,  ground: [97.6, 0.014, 88], accent: [64, 0.13, 78],  accent2: [56, 0.1, 45],   inkHue: 82 },
  '04-search':      { chroma: 0.55, becoming: 0.16, ground: [97.6, 0.012, 235],accent: [62, 0.1, 242],  accent2: [70, 0.09, 90],  inkHue: 240 },
  '05-her':         { chroma: 0.66, becoming: 0.26, ground: [97.8, 0.014, 45], accent: [72, 0.12, 32],  accent2: [66, 0.1, 70],   inkHue: 40 },
  '06-love':        { chroma: 0.82, becoming: 0.36, ground: [97.4, 0.02, 78],  accent: [72, 0.16, 66],  accent2: [66, 0.14, 28],  inkHue: 60 },
  '07-faith':       { chroma: 0.7,  becoming: 0.42, ground: [97.6, 0.014, 140],accent: [56, 0.11, 148], accent2: [70, 0.1, 88],   inkHue: 130 },
  '08-boundaries':  { chroma: 0.34, becoming: 0.3,  ground: [96.8, 0.01, 70],  accent: [56, 0.08, 52],  accent2: [48, 0.06, 240], inkHue: 65 },
  '09-apart':       { chroma: 0.5,  becoming: 0.36, ground: [88, 0.024, 258],  accent: [44, 0.1, 258],  accent2: [52, 0.07, 60],  inkHue: 258, ink: [26, 0.02] },
  '10-baptism':     { chroma: 0.7,  becoming: 0.52, ground: [99.3, 0.005, 95], accent: [78, 0.13, 88],  accent2: [74, 0.09, 220], inkHue: 90 },
  '11-return':      { chroma: 0.14, becoming: 0.46, ground: [98.2, 0.006, 85], accent: [54, 0.06, 80],  accent2: [54, 0.05, 240], inkHue: 82 },
  '12-psalms':      { chroma: 0.62, becoming: 0.56, ground: [26, 0.06, 278],   accent: [86, 0.11, 84],  accent2: [78, 0.08, 262], inkHue: 275, ink: [94, 0.014], groundEnd: [95, 0.03, 72] },
  '13-still-love':  { chroma: 0.86, becoming: 0.62, ground: [97.2, 0.016, 30], accent: [56, 0.17, 26],  accent2: [62, 0.12, 62],  inkHue: 30 },
  '14-goodbye':     { chroma: 0.44, becoming: 0.6,  ground: [92, 0.012, 248],  accent: [54, 0.07, 248], accent2: [60, 0.05, 285], inkHue: 250 },
  '15-flesh':       { chroma: 1,    becoming: 1,    ground: [97.8, 0.022, 62], accent: [68, 0.16, 48],  accent2: [64, 0.13, 22],  inkHue: 50 },
  '16-ghosts':      { chroma: 0.24, becoming: 0.8,  ground: [97.8, 0.008, 225],accent: [68, 0.05, 228], accent2: [64, 0.04, 60],  inkHue: 220 },
  '17-jealousy':    { chroma: 0.9,  becoming: 0.76, ground: [97, 0.012, 60],   accent: [58, 0.18, 28],  accent2: [60, 0.12, 205], inkHue: 45 },
  '18-trust':       { chroma: 0.58, becoming: 0.82, ground: [97.4, 0.01, 238], accent: [55, 0.09, 238], accent2: [64, 0.08, 150], inkHue: 235 },
  '19-open-hands':  { chroma: 0.76, becoming: 0.92, ground: [98.4, 0.012, 225],accent: [70, 0.1, 232],  accent2: [78, 0.1, 92],   inkHue: 225 },
  '20-becoming':    { chroma: 1,    becoming: 1,    ground: [98.6, 0.014, 88], accent: [66, 0.15, 88],  accent2: [62, 0.14, 200], inkHue: 80 },

  // ── side chapters — the philosophy outside the relationship ────
  'time':        { chroma: 0.5,  becoming: 0.7,  ground: [97.2, 0.014, 52],  accent: [60, 0.12, 44],  accent2: [58, 0.08, 260], inkHue: 50 },
  'full':        { chroma: 0.72, becoming: 0.66, ground: [97.6, 0.018, 92],  accent: [68, 0.13, 92],  accent2: [62, 0.1, 40],   inkHue: 88 },
  'faith-is':    { chroma: 0.6,  becoming: 0.5,  ground: [97.8, 0.01, 210],  accent: [62, 0.1, 214],  accent2: [70, 0.1, 88],   inkHue: 210 },
  'perspective': { chroma: 0.66, becoming: 0.58, ground: [97.6, 0.012, 130], accent: [58, 0.11, 138], accent2: [58, 0.11, 300], inkHue: 130 },
  'plasticity':  { chroma: 0.55, becoming: 0.86, ground: [97.4, 0.01, 258],  accent: [56, 0.1, 262],  accent2: [64, 0.1, 40],   inkHue: 255 },
  'trees':       { chroma: 0.78, becoming: 0.9,  ground: [97.6, 0.018, 138], accent: [54, 0.13, 142], accent2: [70, 0.12, 96],  inkHue: 138 },
};

export function paletteFor(slug: string): Palette {
  return PALETTE[slug] ?? NEUTRAL;
}

/** The chapter palette as inline custom properties for a wrapper element. */
export function paletteVars(p: Palette): React.CSSProperties {
  return {
    '--chroma': p.chroma,
    '--becoming': p.becoming,
    '--ground-l': `${p.ground[0]}%`,
    '--ground-c': p.ground[1],
    '--ground-h': p.ground[2],
    '--accent-l': `${p.accent[0]}%`,
    '--accent-c': p.accent[1],
    '--accent-h': p.accent[2],
    '--accent2-l': `${p.accent2[0]}%`,
    '--accent2-c': p.accent2[1],
    '--accent2-h': p.accent2[2],
    '--ink-h': p.inkHue,
    ...(p.ink ? { '--ink-l': `${p.ink[0]}%`, '--ink-c': p.ink[1] } : {}),
  } as React.CSSProperties;
}
