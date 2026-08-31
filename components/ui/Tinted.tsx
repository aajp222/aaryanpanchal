import { paletteFor, paletteVars } from '@/lib/palette';

/**
 * Puts a page inside one of the palette's settings. Same machinery the
 * chapters use — a surface page is simply another position on the arc, which
 * is why the whole site reads as one place despite changing colour on every
 * route.
 */
export default function Tinted({
  as: Tag = 'div',
  palette,
  children,
  className = '',
}: {
  as?: 'div' | 'section' | 'article';
  /** Key into PALETTE — "work", "writing", "01-stone", … */
  palette: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`chapter ${className}`} style={paletteVars(paletteFor(palette))}>
      {children}
    </Tag>
  );
}
