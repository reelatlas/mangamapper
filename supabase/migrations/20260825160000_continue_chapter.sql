-- Per-episode continue-reading override (Sean's ruling 2026-08-23):
-- the DEFAULT continue point after an episode derives from its anchor
-- (end chapter + 1; the end chapter itself when a partial/mid-chapter
-- annotation marks a split). This column stores the EXCEPTIONS research
-- names explicitly — skips (Blue Exorcist resumes at 38 after ep 37),
-- grafts (JJK readers continue at 138 after ep 47, not 137), mid-chapter
-- endings (Oshi no Ko ep 35 ends mid-ch 127). UI surfacing is deferred;
-- the data point is first-class now.
alter table chapter_anchors add column if not exists continue_chapter numeric;
