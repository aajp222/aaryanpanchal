/**
 * Verse, exactly as written.
 *
 * The text arrives as a prop rather than as children so that MDX never gets a
 * chance to reflow it — lowercase, odd capitalisation, ragged line breaks and
 * unfinished last lines all survive the trip to the page intact.
 */
export default function Poem({
  text,
  attribution,
  className = '',
  size = 'normal',
}: {
  text: string;
  attribution?: string;
  className?: string;
  size?: 'normal' | 'large';
}) {
  return (
    <figure className={`my-10 ${className}`}>
      <blockquote
        className={`whitespace-pre-line font-display italic leading-[1.55] ${
          size === 'large'
            ? 'text-[clamp(1.4rem,3.2vw,2.4rem)]'
            : 'text-[clamp(1.15rem,2vw,1.5rem)]'
        }`}
      >
        {text.replace(/^\n+|\n+$/g, '')}
      </blockquote>
      {attribution && <figcaption className="label mt-4">{attribution}</figcaption>}
    </figure>
  );
}
