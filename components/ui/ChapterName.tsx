import { isGated } from '@/lib/gates';

/**
 * A chapter's name, shown only once the chapter is open.
 *
 * Both states are rendered and CSS picks one, driven by `data-unlocked` on
 * <html> which the pre-paint script sets — so a name is masked by default and
 * never flashes before being hidden. Locked chapters get a redaction bar, the
 * same gesture the site already uses for the people it will not name, at a
 * fixed width so it cannot leak how long the title is.
 */
export default function ChapterName({
  slug,
  title,
  color,
  className = '',
}: {
  slug: string;
  title: string;
  color?: string;
  className?: string;
}) {
  if (!isGated(slug)) return <span className={className}>{title}</span>;

  return (
    <span className={className}>
      <span className="ch-name" data-slug={slug}>{title}</span>
      <span
        className="ch-bar"
        data-slug={slug}
        role="img"
        aria-label="Locked chapter"
        style={color ? { background: color } : undefined}
      />
    </span>
  );
}
