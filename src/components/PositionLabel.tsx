import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface PositionLabelProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;     // label cyan + icon primary (e.g. details-page inputs with a value)
  iconActive?: boolean; // icon primary only (e.g. card position columns)
  className?: string;
}

// The icon+label contract:
// 1. icon size = 1em of the label type (12px icon beside text-xs) — an icon
//    larger than the type reads oversized against lowercase mono labels,
//    whose visual mass is only the x-height band.
// 2. the icon box and the text line box are the SAME height (12px), so
//    items-center aligns two equal boxes — alignment cannot drift and needs
//    no per-icon adjustments.
// If a glyph still reads unbalanced at this size, swap the glyph; never
// nudge positioning per usage.
export const PositionLabel = ({ icon: Icon, label, active, iconActive, className }: PositionLabelProps) => (
  <div
    className={cn(
      'flex items-center gap-1.5 text-xs leading-3 tracking-wider',
      active ? 'text-syntax-cyan' : 'text-muted-foreground',
      className,
    )}
  >
    <Icon className={cn('w-3 h-3 shrink-0', active || iconActive ? 'text-primary' : 'text-muted-foreground')} />
    <span>{label}</span>
  </div>
);
