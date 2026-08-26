-- T4.2 (rule T26, Sean's T4.0 D-10 ruling 2026-08-26): an author / studio /
-- community override is an ANNOTATION, never a fourth episode type. Three
-- kinds join the closed vocabulary (R10 / A43):
--   adopted     — material outside the identified source that Sean ruled
--                 canon; `basis` REQUIRED: author | studio | community
--   retconned   — material later dropped from canon (world-trigger 49-63)
--   side_source — adapts a work other than the series' source (Shippuden
--                 452-457 → Itachi Shinden novel); the work is named in note
-- The vocabulary in scripts/ingest/lib/annotations.ts is canonical; this
-- constraint mirrors it and the census class annotation_invalid keeps them
-- in lockstep.

alter table public.episode_annotations add column if not exists basis text
  check (basis is null or basis in ('author', 'studio', 'community'));

alter table public.episode_annotations drop constraint if exists episode_annotations_kind_check;
alter table public.episode_annotations add constraint episode_annotations_kind_check check (
  kind in ('divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged',
           'adopted', 'retconned', 'side_source')
);

-- adopted without a basis is not a ruling; side_source without the work named is not a fact
alter table public.episode_annotations drop constraint if exists episode_annotations_adopted_basis_check;
alter table public.episode_annotations add constraint episode_annotations_adopted_basis_check check (
  (kind <> 'adopted' and basis is null) or (kind = 'adopted' and basis is not null)
);
alter table public.episode_annotations drop constraint if exists episode_annotations_side_source_note_check;
alter table public.episode_annotations add constraint episode_annotations_side_source_note_check check (
  kind <> 'side_source' or (note is not null and length(note) > 0)
);
