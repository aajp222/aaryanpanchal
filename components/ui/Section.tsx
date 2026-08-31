export function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[92rem] px-[clamp(1.25rem,4vw,3.5rem)] ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = '',
  id,
  label,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** The mono eyebrow, e.g. "Selected work". */
  label?: string;
  /** The mono numeral beside it, e.g. "01". */
  index?: string;
}) {
  return (
    <section id={id} className={`py-[clamp(4.5rem,11vw,10rem)] ${className}`}>
      <Wrap>
        {(label || index) && (
          <div className="mb-[clamp(2rem,4vw,3.5rem)] flex items-baseline gap-4 border-t border-[var(--color-rule-soft)] pt-4">
            {index && <span className="label !text-[var(--accent-ink)]">{index}</span>}
            {label && <span className="label">{label}</span>}
          </div>
        )}
        {children}
      </Wrap>
    </section>
  );
}
