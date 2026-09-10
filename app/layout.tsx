import type { Metadata } from 'next';
import { fraunces, jetbrains, grotesk } from './fonts';
import Nav from '@/components/ui/Nav';
import Footer from '@/components/ui/Footer';
import Secrets from '@/components/ui/Secrets';
import LockScript from '@/components/ui/LockScript';
import LockSync from '@/components/ui/LockSync';
import LockStyles from '@/components/ui/LockStyles';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://aaryanpanchal.com'),
  title: {
    default: 'Aaryan Panchal — Engineer, Builder, Writer',
    template: '%s · Aaryan Panchal',
  },
  description:
    'Aaryan Panchal — mechanical engineer and founder of EpiSafe, an epinephrine auto-injector thin enough to live in a phone case. Work, builds, writing, and a long story called Becoming.',
  authors: [{ name: 'Aaryan Panchal' }],
  openGraph: {
    type: 'website',
    url: 'https://aaryanpanchal.com',
    siteName: 'Aaryan Panchal',
    title: 'Aaryan Panchal — Engineer, Builder, Writer',
    description: 'Engineer, builder, writer. I build things. Some of them build me back.',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/assets/img/favicon.svg', apple: '/assets/img/mark-black.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrains.variable} ${grotesk.variable}`}>
      <body className="min-h-screen">
        <LockStyles />
        <LockScript />
        <LockSync />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--page-ink)] focus:px-4 focus:py-2 focus:text-[var(--ground)]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Secrets />
      </body>
    </html>
  );
}
