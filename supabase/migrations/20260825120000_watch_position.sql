-- UI-ready watch-order data (Sean 2026-08-23): order-only components carry
-- their community FRACTIONAL position (Ryuusui = 35.5) and air date, so the
-- UI phase (specials/OVAs/fractional display, arcs, watch order, IP
-- umbrella) pulls decisions from data instead of re-research. Populated by
-- wiki fractional rows + research; label stays the display title.
alter table public.series_components add column watch_position numeric;
alter table public.series_components add column air_date date;
