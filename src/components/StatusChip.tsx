import { AnimeStatus } from '@/types/anime';
import { cn } from '@/lib/utils';

// A status is a STATE, and states earn tag treatment (instrument_v1 ruling,
// 2026-08-20): S2 tint — colored text on a 10% wash of the same hue, no
// border. airing = accent green, hiatus = amber, terminal states = muted.
export const StatusChip = ({
  status,
  className,
}: {
  status: AnimeStatus;
  className?: string;
}) => (
  <span
    className={cn(
      'px-[0.45rem] py-px text-[10px] tracking-wide',
      status === 'airing' && 'bg-accent/10 text-accent',
      status === 'hiatus' && 'bg-syntax-amber/10 text-syntax-amber',
      (status === 'finished' || status === 'upcoming') && 'bg-muted text-muted-foreground',
      className,
    )}
  >
    {status}
  </span>
);
