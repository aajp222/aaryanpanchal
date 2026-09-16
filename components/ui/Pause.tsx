/**
 * Silence, as an element. Some pages need a held breath between two
 * sentences more than they need another sentence.
 */
export default function Pause({ size = 'normal' }: { size?: 'small' | 'normal' | 'long' }) {
  const h = { small: 'h-[12vh]', normal: 'h-[28vh]', long: 'h-[60vh]' }[size];
  return <div aria-hidden className={h} />;
}

/** A monument that breaks out of the chapter's reading measure. */
export function Break({ children }: { children: React.ReactNode }) {
  return <div className="monument-break my-[clamp(4rem,10vw,9rem)]">{children}</div>;
}
