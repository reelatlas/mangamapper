import { EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';
import { Tv } from 'lucide-react';

interface EpisodeBadgeProps {
  type: EpisodeType;
  className?: string;
}

export const EpisodeBadge = ({ type, className }: EpisodeBadgeProps) => {
  const config = {
    canon: {
      label: 'canon',
      className: 'text-accent border-accent',
      icon: null,
    },
    filler: {
      label: 'ffff',
      className: 'text-destructive border-destructive',
      icon: null,
    },
    'anime-only-canon': {
      label: null,
      className: 'text-syntax-purple border-syntax-purple',
      icon: Tv,
    },
  };

  const { label, className: badgeClassName, icon: Icon } = config[type];

  return (
    <span className={cn(
      'font-mono text-[10px] px-2 py-0.5 rounded-full border tracking-wider inline-flex items-center justify-center',
      badgeClassName,
      className
    )}>
      {Icon ? <Icon size={10} /> : label}
    </span>
  );
};
