import manifest from '@/public/assets/opt/manifest.json';

type Manifest = Record<string, { widths: number[]; w: number | null; h: number | null }>;
const M = manifest as Manifest;

export type PlateProps = {
  /** Base name of the source image, e.g. "product-hero". */
  src: string;
  alt: string;
  caption?: string;
  /** Mono figure label, e.g. "Fig. 01". */
  figure?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * A plate in the illustrated book. Reads the widths that actually exist from
 * the build manifest, so no request ever 404s on an upscale that was skipped.
 */
export default function Plate({
  src, alt, caption, figure, sizes = '100vw', priority, className = '', imgClassName = '',
}: PlateProps) {
  const entry = M[src];
  if (!entry) {
    throw new Error(`Plate: no optimised image for "${src}". Run \`npm run images\`.`);
  }
  const srcSet = entry.widths.map((w) => `/assets/opt/${src}-${w}.webp ${w}w`).join(', ');
  const fallback = `/assets/opt/${src}-${entry.widths[entry.widths.length - 1]}.webp`;

  const img = (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={entry.w ?? undefined}
      height={entry.h ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      // eslint-disable-next-line @next/next/no-img-element
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`h-full w-full object-cover ${imgClassName}`}
    />
  );

  if (!caption && !figure) return <div className={className}>{img}</div>;

  return (
    <figure className={className}>
      {img}
      <figcaption className="label mt-3 flex gap-3">
        {figure && <span className="text-[var(--accent-ink)]">{figure}</span>}
        {caption && <span className="!normal-case !tracking-normal">{caption}</span>}
      </figcaption>
    </figure>
  );
}
