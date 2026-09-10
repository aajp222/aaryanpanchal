import Monument from '@/components/ui/Monument';
import Ledger, { LedgerSplit } from '@/components/ui/Ledger';
import Poem from '@/components/ui/Poem';
import Piece from '@/components/ui/Piece';
import Redacted from '@/components/ui/Redacted';
import Plate from '@/components/ui/Plate';
import Reveal from '@/components/ui/Reveal';
import Pause, { Break } from '@/components/ui/Pause';
import Stone from '@/components/scenes/Stone';
import Crowded from '@/components/scenes/Crowded';
import Dependencies from '@/components/scenes/Dependencies';
import Bookmark from '@/components/scenes/Bookmark';
import PsalmScroll from '@/components/scenes/PsalmScroll';
import SplitPerception from '@/components/scenes/SplitPerception';
import OpenHand from '@/components/scenes/OpenHand';

/** Everything a chapter can reach for. */
export const mdxComponents = {
  Monument,
  Ledger,
  LedgerSplit,
  Poem,
  Piece,
  Redacted,
  Plate,
  Reveal,
  Pause,
  Break,
  // Scenes — one chapter each.
  Stone,
  Crowded,
  Dependencies,
  Bookmark,
  PsalmScroll,
  SplitPerception,
  OpenHand,
};
