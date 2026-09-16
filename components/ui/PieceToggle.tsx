'use client';

import { useState } from 'react';

/**
 * Raw and shaped are two states of one thought, not a draft and an
 * improvement — so the control is a toggle between equals, and neither
 * side is labelled "better".
 */
export default function PieceToggle({
  rawText,
  shapedText,
  rawLabel = 'Raw',
  shapedLabel = 'Shaped',
}: {
  rawText: string;
  shapedText: string;
  rawLabel?: string;
  shapedLabel?: string;
}) {
  const [showRaw, setShowRaw] = useState(false);
  const text = showRaw ? rawText : shapedText;

  return (
    <div>
      <div role="group" aria-label="Two states of this piece" className="mb-4 flex gap-1">
        {[
          [false, shapedLabel],
          [true, rawLabel],
        ].map(([raw, label]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => setShowRaw(raw as boolean)}
            aria-pressed={showRaw === raw}
            className={`label px-3 py-1.5 transition-colors ${
              showRaw === raw
                ? 'bg-[var(--accent-wash)] !text-[var(--accent-ink)]'
                : 'hover:text-[var(--page-ink)]'
            }`}
          >
            {label as string}
          </button>
        ))}
      </div>
      <p
        key={String(showRaw)}
        className="whitespace-pre-line font-display text-[clamp(1.12rem,1.9vw,1.42rem)] italic leading-[1.55]"
        style={{ animation: 'none' }}
      >
        {text.replace(/^\n+|\n+$/g, '')}
      </p>
    </div>
  );
}
