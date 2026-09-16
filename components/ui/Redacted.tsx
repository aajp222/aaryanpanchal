/**
 * Someone else's name, kept out of it.
 *
 * The substitute is rendered as a visible mark rather than a silent swap —
 * a person is missing here on purpose, and the page should say so. Real names
 * never enter the content files, so nothing is hidden client-side either.
 */
export default function Redacted({
  as = 'her',
  who = 'a person in this story',
}: {
  /** What to show instead — "her", "a friend", "my father", "[redacted]". */
  as?: string;
  /** Screen-reader and tooltip context. */
  who?: string;
}) {
  return (
    <span
      title={`Name withheld — ${who}`}
      className="underline decoration-dotted decoration-[var(--accent-hair)] underline-offset-[0.25em]"
    >
      {as}
    </span>
  );
}

/** The one-line explanation, placed once at the foot of a chapter. */
export function RedactionNote() {
  return (
    <p className="label mt-16 border-t border-[var(--color-rule-soft)] pt-5 !normal-case !tracking-normal !text-[0.78rem] leading-relaxed">
      Everyone in this story except me is unnamed — <em>her</em>, <em>a friend</em>, <em>my father</em>,
      <em> someone</em>. It is my story to tell and theirs to keep. Names are not hidden in the page
      source either; they were never written down.
    </p>
  );
}
