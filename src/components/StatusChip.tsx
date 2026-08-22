import { AnimeStatus } from '@/types/anime';
import { cn } from '@/lib/utils';

// A status is a STATE (instrument_v1). PLAIN TEXT (2026-08-21, supersedes
// the S2 tint, then the dot trial): just the colored word — the tint-chip
// grammar now belongs to the legend's interactive filters, and placement
// (top-right of the identity band) + the status hue carry the state on
// their own. airing = accent green, hiatus = amber, terminal = muted.
//
// ONE REGISTER everywhere (Sean's max-consistency ruling, 2026-08-21):
// 12px (text-xs), no tracking — the homepage row meta is the reference,
// and the card/detail seats match it exactly. Seats may position the chip
// (margins/shrink) but never restyle its size, tracking, or hues.
export const StatusChip = ({
  status,
  className,
}: {
  status: AnimeStatus;
  className?: string;
}) => (
  <span
    className={cn(
      'text-xs',
      status === 'airing' && 'text-accent',
      status === 'hiatus' && 'text-syntax-amber',
      (status === 'finished' || status === 'upcoming') && 'text-muted-foreground',
      className,
    )}
  >
    {status}
  </span>
);
