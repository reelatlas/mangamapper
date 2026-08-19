import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StepperInputProps {
  value: string;
  onValueChange: (raw: string) => void;
  onStep: (dir: number) => void; // dir may be ±1 or ±10 (shift)
  onEscape?: () => void;
  placeholder?: string;
  'aria-label': string;
  derived?: boolean; // dimmed text — value computed from the driver
  className?: string;
}

// Numeric input in the details-page format (dashed, h-7) whose steppers are
// COMPONENT-OWNED: keys (↑/↓, shift=±10), the ▲▼ buttons (visible on hover/focus),
// and the mousewheel (only while focused) all route through onStep — which is
// what makes seeded stepping work on every input path. Native spinners are
// disabled via .no-spinner. Esc calls onEscape.
// The border reflects FOCUS only (matching the details-page inputs) — never a
// persistent "active" state, so clicking away always returns it to rest.
export const StepperInput = ({
  value,
  onValueChange,
  onStep,
  onEscape,
  placeholder = '#',
  'aria-label': ariaLabel,
  derived,
  className,
}: StepperInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // wheel must be a non-passive native listener to preventDefault
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (document.activeElement !== el) return;
      e.preventDefault();
      onStep(e.deltaY < 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onStep]);

  return (
    <div className={cn('relative inline-flex group/step', className)}>
      <Input
        ref={inputRef}
        type="number"
        min={1}
        inputMode="numeric"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValueChange(e.target.value.replace(/[^0-9]/g, ''))}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onEscape?.();
            return;
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            onStep((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1));
          }
        }}
        className={cn(
          'no-spinner font-mono text-sm bg-muted/30 h-7 w-[4.8rem] border-dashed',
          derived && 'text-muted-foreground',
        )}
      />
      <div className="absolute right-[3px] inset-y-[3px] w-[0.95rem] flex flex-col gap-px rounded-sm overflow-hidden opacity-0 group-hover/step:opacity-100 group-focus-within/step:opacity-100 transition-opacity">
        {([1, -1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            tabIndex={-1}
            aria-label={dir > 0 ? 'increment' : 'decrement'}
            onMouseDown={(e) => e.preventDefault()} // don't steal/blur focus
            onClick={() => {
              inputRef.current?.focus(); // direct stepper click also focuses (reveals the affordance)
              onStep(dir);
            }}
            className="flex-1 flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-border text-[6px] leading-none"
          >
            {dir > 0 ? '▲' : '▼'}
          </button>
        ))}
      </div>
    </div>
  );
};
