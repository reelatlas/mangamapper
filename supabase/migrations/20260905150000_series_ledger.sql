-- P40 — NO SCRIPT DELETES A SERIES (Sean 2026-09-05, after INCIDENT-2026-09-05:
-- audit-titles.ts deleted six series through a cascade, and the cascade also
-- erased every trace). A tombstone LEDGER, kept by triggers the application
-- cannot skip: every series row's creation and deletion is recorded here, a
-- cascade cannot erase it, and the census class series_deleted_unruled lists
-- any deletion no ruling names (lib/rulings/deleted-series.ts).
create table public.series_ledger (
  id text primary key,                          -- the series id (our slug, I1)
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  note text
);
alter table public.series_ledger enable row level security;   -- service-role only: no public policy

create or replace function public.series_ledger_on_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.series_ledger (id, created_at, deleted_at, note)
  values (new.id, now(), null, null)
  on conflict (id) do update set deleted_at = null, note = coalesce(public.series_ledger.note, '') || ' | re-created ' || to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  return new;
end $$;

create or replace function public.series_ledger_on_delete() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.series_ledger (id, created_at, deleted_at, note)
  values (old.id, now(), now(), 'deleted without a ledger row')
  on conflict (id) do update set deleted_at = now();
  return old;
end $$;

drop trigger if exists series_ledger_insert on public.series;
create trigger series_ledger_insert after insert on public.series
  for each row execute function public.series_ledger_on_insert();
drop trigger if exists series_ledger_delete on public.series;
create trigger series_ledger_delete after delete on public.series
  for each row execute function public.series_ledger_on_delete();

-- backfill: every series that exists today (the incident's six were re-created before this ledger existed)
insert into public.series_ledger (id, created_at, deleted_at, note)
select id, coalesce(updated_at, now()), null, 'backfilled 2026-09-05 at the ledger''s creation (P40)' from public.series
on conflict (id) do nothing;
