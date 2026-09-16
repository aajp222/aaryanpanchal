import Reveal from './Reveal';

const SIZES = {
  /** One sentence, one viewport. TAKE THE STONE. */
  colossal: 'text-[clamp(3.2rem,12vw,11rem)] leading-[0.92]',
  huge: 'text-[clamp(2.6rem,8vw,7rem)] leading-[0.98]',
  large: 'text-[clamp(2rem,5.2vw,4.2rem)] leading-[1.04]',
} as const;

/**
 * Scale as storytelling. A Monument is not a heading — it is a moment the
 * reader is meant to stop inside, so it owns its whitespace by default.
 */
export default function Monument({
  children,
  size = 'huge',
  as = 'p',
  align = 'left',
  className = '',
  full = false,
}: {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  /** Semantics only. The rendered element is always a div — see below. */
  as?: 'h1' | 'h2' | 'p';
  align?: 'left' | 'center';
  className?: string;
  /** Give the line an entire viewport to sit in. */
  full?: boolean;
}) {
  // MDX wraps block-level children in a <p>, and neither <p> nor a heading may
  // contain one. So the box is always a <div>, and headings announce
  // themselves through ARIA instead — same semantics, valid HTML either way.
  const heading = as === 'h1' || as === 'h2';

  return (
    <Reveal
      className={`${full ? 'flex min-h-[86svh] flex-col justify-center' : ''} ${
        align === 'center' ? 'text-center' : ''
      }`}
    >
      <div
        role={heading ? 'heading' : undefined}
        aria-level={heading ? (as === 'h1' ? 1 : 2) : undefined}
        className={`font-display font-[350] ${SIZES[size]} ${className} [&>p]:m-0`}
      >
        {children}
      </div>
    </Reveal>
  );
}
