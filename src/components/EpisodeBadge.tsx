import { EpisodeType } from '@/types/anime';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EpisodeBadgeProps {
  type: EpisodeType;
  className?: string;
}

export const EpisodeBadge = ({ type, className }: EpisodeBadgeProps) => {
  const config = {
    canon: {
      label: 'Canon',
      variant: 'default' as const,
      className: 'bg-primary/90 hover:bg-primary text-primary-foreground',
    },
    filler: {
      label: 'Filler',
      variant: 'destructive' as const,
      className: 'bg-destructive/90 hover:bg-destructive text-destructive-foreground',
    },
    'anime-only-canon': {
      label: 'Anime Original',
      variant: 'secondary' as const,
      className: 'bg-accent-foreground/90 hover:bg-accent-foreground text-accent',
    },
  };

  const { label, className: badgeClassName } = config[type];

  return (
    <Badge className={cn(badgeClassName, className)}>
      {label}
    </Badge>
  );
};
