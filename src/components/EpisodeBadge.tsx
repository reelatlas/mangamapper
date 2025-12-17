import { EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';

interface EpisodeBadgeProps {
  type: EpisodeType;
  className?: string;
}

export const EpisodeBadge = ({ type, className }: EpisodeBadgeProps) => {
  const config = {
    canon: {
      label: 'CANON',
      className: 'text-accent border-accent',
    },
    filler: {
      label: 'FILLER',
      className: 'text-destructive border-destructive',
    },
    'anime-only-canon': {
      label: 'ANIME',
      className: 'text-syntax-purple border-syntax-purple',
    },
  };

  const { label, className: badgeClassName } = config[type];

  return (
    <span className={cn(
      'font-mono text-[10px] px-1.5 py-0.5 border uppercase tracking-wider',
      badgeClassName,
      className
    )}>
      [{label}]
    </span>
  );
};
