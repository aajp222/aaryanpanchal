/**
 * CHAPTER 09 — APART
 *
 * A ribbon left in a book that has no last chapter. The sentence beside it
 * stops where it stopped. Nothing here resolves, and nothing here is
 * supposed to.
 */
export default function Bookmark({
  children,
}: {
  /** The sentence that does not finish. */
  children?: React.ReactNode;
}) {
  return (
    <div data-scene="bookmark" className="monument-break my-[clamp(4rem,10vw,8rem)]">
      <div className="mx-auto flex max-w-[54rem] items-start gap-[clamp(1.5rem,5vw,4rem)]">
        <svg
          viewBox="0 0 60 260"
          className="h-[clamp(12rem,28vw,20rem)] w-auto shrink-0"
          aria-hidden
        >
          <path d="M0 0 h60 v238 l-30 -22 l-30 22 z" fill="var(--accent)" opacity="0.9" />
          <path d="M0 0 h60 v238 l-30 -22 l-30 22 z" fill="none" stroke="var(--accent)" strokeWidth="1" />
        </svg>

        <div className="pt-2">
          <p className="label">page unknown</p>
          <p className="mt-4 font-display text-[clamp(1.5rem,4vw,2.8rem)] italic leading-[1.3]">
            {children ?? (
              <>
                some books dont get a final chapter,
                <span className="mt-2 block">just a bookmark of where you left it</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
