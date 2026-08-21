// THE app-wide hold-to-repeat pacing (2026-08-21, extracted from
// StepperInput): one step on press, repeat after an initial delay, then
// accelerate in two stages the longer the hold lasts. Used by the position
// steppers (pointer holds) and the catalog's keyboard walking — one
// acceleration vocabulary across the app; never fork the numbers per
// surface.
export const HOLD_DELAY = 400;
export const holdInterval = (ticks: number) => (ticks > 22 ? 40 : ticks > 8 ? 80 : 130);
