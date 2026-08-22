-- Refresh automation (data-pipeline.md §11: fixed-weekly ruling — primary
-- sources on schedules, validation sources event-driven).
-- Secrets live in Vault (edge_base_url / edge_anon_key / edge_cron_secret),
-- inserted out-of-band — never in this repo.

create extension if not exists pg_cron;
create extension if not exists pg_net;

create or replace function public.invoke_edge_refresh(fn text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  base text;
  anon text;
  secret text;
begin
  select decrypted_secret into base from vault.decrypted_secrets where name = 'edge_base_url';
  select decrypted_secret into anon from vault.decrypted_secrets where name = 'edge_anon_key';
  select decrypted_secret into secret from vault.decrypted_secrets where name = 'edge_cron_secret';
  perform net.http_post(
    url := base || '/functions/v1/' || fn,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || anon,
      'x-cron-secret', secret,
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 350000
  );
end;
$$;

revoke all on function public.invoke_edge_refresh(text) from public, anon, authenticated;

-- Daily AniList metadata sweep (airing progress, status flips, scores):
-- one invocation covers the whole catalog (~10 batched requests).
select cron.schedule('refresh-anilist-daily', '10 8 * * *',
  $$select public.invoke_edge_refresh('refresh-anilist')$$);

-- AFL: hourly small batches (edge wall-time limits forbid one big sweep);
-- each run refreshes ≤20 of the stalest pages, so the catalog cycles well
-- inside the weekly cadence and most runs no-op instantly.
select cron.schedule('refresh-afl-hourly', '40 * * * *',
  $$select public.invoke_edge_refresh('refresh-afl')$$);
