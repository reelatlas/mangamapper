-- T28's sliver clause (Sean 2026-09-04): two annotation kinds so recurring
-- patterns are DATA, not prose — `recap` (re-shown / retold material of
-- chapters already covered; weightless in the standing; the batch-14 reborn
-- rows had mis-filed these as `abridged`) and `unverified` (a chapter
-- certainly in the episode whose share could not be sized; the anchor stands
-- and the census lists the row as a queue: unverified_share).
alter table public.episode_annotations drop constraint if exists episode_annotations_kind_check;
alter table public.episode_annotations add constraint episode_annotations_kind_check check (
  kind in ('divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged', 'adopted', 'retconned', 'side_source', 'recap', 'unverified')
);
