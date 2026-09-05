-- I46 (amended, same sitting): the identity of a related work is THE WORK (its AniList id), never the owner pair — a work sits under
-- several owners (Battle of Gods under Dragon Ball Z and Super; Boruto the Movie under Shippuden and Boruto) and an external id maps
-- to the work once. Ownership is what the ledger rows say; the 'wiki' source's key is owner-scoped by construction (series@position).
alter table public.related_work_external_ids drop constraint if exists related_work_external_ids_series_id_anilist_id_source_key;
alter table public.related_work_external_ids drop column series_id;
alter table public.related_work_external_ids add constraint related_work_external_ids_anilist_source_key unique (anilist_id, source);
