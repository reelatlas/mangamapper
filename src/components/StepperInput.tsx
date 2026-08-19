import { useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Hold-to-repeat pacing: one step on press, repeat after an initial delay,
// then accelerate in two stages the longer the hold lasts. Keyboard holds
// (↑/↓) accelerate for free via native key repeat.
const HOLD_DELAY = 400;
const holdInterval = (ticks: number) => (ticks > 22 ? 40 : ticks > 8 ? 80 : 130);

interface StepperInputProps {
  value: string;
  onValueChange: (raw: string) => void;
  onStep: (dir: number) => void; // dir may be ±1 or ±10 (shift)
  onEscape?: () => void;
  placeholder?: string;
  'aria-label': string;
  derived?: boolean;   // dimmed text — value computed from the driver
  nullValue?: boolean; // '—' — the universal null, disabled tone
  className?: string;
  // ── variants (ONE component, two skins — never fork the behavior) ─────────
  // 'box'    — the details-page dashed box (original skin)
  // 'inline' — the position-row skin ("Q1"): value reads as data at rest,
  //            dashed underline on hover AND focus (never solid/primary),
  //            steppers take ZERO space until focused, width in ch units
  //            (parent locks it to maxCh while focused), neutral caret,
  //            no select-all.
  variant?: 'box' | 'inline';
  widthCh?: number; // inline only: current width in ch (hug or focus-locked max)
  onFocusChange?: (focused: boolean) => void;
}

// Numeric input whose steppers are COMPONENT-OWNED: keys (↑/↓, shift=±10),
// the ▲▼ buttons (HOLD to auto-repeat with acceleration), and the mousewheel
// (only while focused) all route through onStep — which is what makes seeded
// stepping work on every input path. Native spinners are disabled. Esc calls
// onEscape. The border/underline reflects FOCUS only — never a persistent
// "active" state — and focus never select-alls (the caret lands where
// clicked).
export const StepperInput = ({
  value,
  onValueChange,
  onStep,
  onEscape,
  placeholder = '#',
  'aria-label': ariaLabel,
  derived,
  nullValue,
  className,
  variant = 'box',
  widthCh,
  onFocusChange,
}: StepperInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inline = variant === 'inline';

  // hold-to-repeat: the timeout chain reads onStep through a ref so a hold
  // survives the re-renders each step causes (fresh closure every tick)
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const holdTimer = useRef<number | null>(null);
  const endHold = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);
  useEffect(() => endHold, [endHold]);
  const startHold = (dir: number) => {
    endHold();
    inputRef.current?.focus(); // stepper press also focuses (reveals the affordance)
    stepRef.current(dir);
    let ticks = 0;
    const tick = () => {
      ticks++;
      stepRef.current(dir);
      holdTimer.current = window.setTimeout(tick, holdInterval(ticks));
    };
    holdTimer.current = window.setTimeout(tick, HOLD_DELAY);
  };

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

  const stepButtons = (btnClass: string) =>
    ([1, -1] as const).map((dir) => (
      <button
        key={dir}
        type="button"
        tabIndex={-1}
        aria-label={dir > 0 ? 'increment' : 'decrement'}
        onMouseDown={(e) => e.preventDefault()} // don't steal/blur focus
        onPointerDown={(e) => {
          e.preventDefault();
          startHold(dir);
        }}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        className={btnClass}
      >
        {dir > 0 ? '▲' : '▼'}
      </button>
    ));

  const input = (
    <Input
      ref={inputRef}
      // inline holds '—' (a non-numeric glyph), so it must be a text input
      type={inline ? 'text' : 'number'}
      min={inline ? undefined : 1}
      inputMode="numeric"
      autoComplete="off"
      placeholder={inline ? undefined : placeholder}
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onValueChange(e.target.value.replace(/[^0-9]/g, ''))}
      onFocus={() => onFocusChange?.(true)}
      onBlur={() => onFocusChange?.(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onEscape?.();
          if (inline) inputRef.current?.blur();
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          onStep((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1));
        }
      }}
      style={inline && widthCh ? { width: `${widthCh}ch` } : undefined}
      className={cn(
        'no-spinner font-mono [caret-color:currentColor]',
        inline
          ? // reads as data at rest; dashed underline on hover/focus only
            'h-auto rounded-none border-0 border-b border-dashed border-transparent bg-transparent p-0 text-sm leading-normal group-hover/step:border-muted-foreground focus:border-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0'
          : 'text-sm bg-muted/30 h-7 w-[4.8rem] border-dashed',
        derived && 'text-muted-foreground',
        nullValue && 'text-muted-foreground/60',
      )}
    />
  );

  if (inline) {
    return (
      <span className={cn('inline-flex items-baseline group/step', className)}>
        {input}
        {/* Q1: steppers occupy ZERO space until the field is focused */}
        <span className="hidden group-focus-within/step:flex flex-col gap-px self-center ml-0.5">
          {stepButtons(
            'flex items-center justify-center rounded-[1px] bg-secondary px-[3px] py-px text-[5px] leading-none text-secondary-foreground hover:bg-border',
          )}
        </span>
      </span>
    );
  }

  return (
    <div className={cn('relative inline-flex group/step', className)}>
      {input}
      <div className="absolute right-[3px] inset-y-[3px] w-[0.95rem] flex flex-col gap-px rounded-sm overflow-hidden opacity-0 group-hover/step:opacity-100 group-focus-within/step:opacity-100 transition-opacity">
        {stepButtons(
          'flex-1 flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-border text-[6px] leading-none',
        )}
      </div>
    </div>
  );
};
