import { AnimeStatus } from '@/types/anime';
import { cn } from '@/lib/utils';

// A status is a STATE (instrument_v1). PLAIN TEXT (2026-08-21, supersedes
// the S2 tint, then the dot trial): just the colored word — the tint-chip
// grammar now belongs to the legend's interactive filters, and placement
// (top-right of the identity band) + the status hue carry the state on
// their own. airing = accent green, hiatus = amber, terminal = muted.
export const StatusChip = ({
  status,
  className,
}: {
  status: AnimeStatus;
  className?: string;
}) => (
  <span
    className={cn(
      'py-px text-[10px] tracking-wide',
      status === 'airing' && 'text-accent',
      status === 'hiatus' && 'text-syntax-amber',
      (status === 'finished' || status === 'upcoming') && 'text-muted-foreground',
      className,
    )}
  >
    {status}
  </span>
);
