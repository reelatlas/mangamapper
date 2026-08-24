-- Continue-reading metadata (Sean's C2 ruling, 2026-08-24): continue_chapter
-- switches to ANIME-PARITY semantics where the anime's next step is known —
-- the reader's next chapter to stay in step with the anime (= the next
-- canon/mixed episode's start), even when earlier chapters were skipped; the
-- skipped/unseen facts are DATA, not lost:
--   continue_kind: 'parity' (next read follows the anime's own order)
--                | 'unseen'  (next chronological unseen chapter — used past
--                             the known frontier or where the future
--                             adaptation is unknown)
--                | 'post_series' (after the finale: coverage max + 1)
--                | null      (legacy rows: default end+1 exception semantics)
--   continue_note: human-readable record of what parity skips or defers
--                  (e.g. "chs 220-240 not yet seen here; backfilled later"),
--                  including the episode linkage where known. No UI surfaces
--                  any of this yet — data-first per the ruling.
alter table chapter_anchors add column if not exists continue_kind text;
alter table chapter_anchors add column if not exists continue_note text;
