-- T26 amendment + I41 (Sean ruled 2026-09-04): `chain_source` — material from another
-- work on the series' READING CHAIN (the named manga sequence: Rosario + Vampire
-- Season I → Season II; Trigun → Trigun Maximum): canon to the series, told out of
-- order, position-less. `side_source` narrows to works OUTSIDE the chain (novels,
-- games, parallel tellings), whose canon is by adoption, never the chain.
alter table public.episode_annotations drop constraint if exists episode_annotations_kind_check;
alter table public.episode_annotations add constraint episode_annotations_kind_check check (
  kind in ('divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged', 'adopted', 'retconned', 'side_source', 'recap', 'unverified', 'chain_source')
);
