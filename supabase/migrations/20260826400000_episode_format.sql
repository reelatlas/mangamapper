-- T4.4 (rule T29, Sean's T4.0 D-11 ruling, 2026-08-26): the format axis.
-- Nullable, DERIVED by heal-format.ts from the containing component's kind
-- (season → tv, ova, special, movie) and FORMAT_OVERRIDES (ruled rows: the
-- kenshin 95-98 OVAs, recaps). Orthogonal to standing (T23): a format never
-- changes a type. NULL = no component covers the row and no ruling names it
-- — the honest gap (format_missing is the queue). Stored now, surfaced at
-- the UI pass.
alter table public.episodes add column if not exists format text
  check (format is null or format in ('tv', 'ova', 'special', 'movie', 'recap'));
