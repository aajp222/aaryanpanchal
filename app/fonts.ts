import { Fraunces, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Fraunces is here for its variable axes, not just its shape. SOFT and WONK
 * are driven per-chapter from --becoming, so the letterforms travel from
 * geometric and flat-terminaled in STONE to soft and organic in FLESH.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
});

export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-mono-jb',
});

/** Aaryan's existing wordmark face, kept for nav and professional pages. */
export const grotesk = localFont({
  src: [
    { path: '../public/assets/fonts/PaulGrotesk-Thin.otf', weight: '250', style: 'normal' },
    { path: '../public/assets/fonts/PaulGrotesk-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/assets/fonts/PaulGrotesk-Bold.otf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-grotesk',
});
