-- Ruling state on staged non-main entries (Sean 2026-08-23): every
-- fractional/special/recap gets a DISPOSITION + reasoning note when ruled —
-- 'excluded_recap' (out of count and watch order), 'order_only' (holds a
-- watch-order slot), 'modeled' (an order-only component exists). Unruled
-- rows stay in the fractional_unmodeled ask-Sean queue. UI decides
-- surfacing later FROM this data.
alter table public.ingest_fractionals add column disposition text
  check (disposition in ('excluded_recap', 'order_only', 'modeled'));
