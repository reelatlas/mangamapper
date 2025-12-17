import { EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';

interface EpisodeBadgeProps {
  type: EpisodeType;
  className?: string;
}

export const EpisodeBadge = ({ type, className }: EpisodeBadgeProps) => {
  const config = {
    canon: {
      label: 'canon',
      className: 'text-accent border-accent',
    },
    filler: {
      label: 'filler',
      className: 'text-destructive border-destructive',
    },
    'anime-only-canon': {
      label: 'anime',
      className: 'text-syntax-purple border-syntax-purple',
    },
  };

  const { label, className: badgeClassName } = config[type];

  return (
    <span className={cn(
      'font-mono text-[10px] px-2 py-0.5 rounded-full border tracking-wider',
      badgeClassName,
      className
    )}>
      {label}
    </span>
  );
};
