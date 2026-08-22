-- Parameterized Vault writer for operational secrets (edge_base_url /
-- edge_anon_key / edge_cron_secret). Values are passed at call time by a
-- service-role client — never stored in the repo. Revoked from every
-- non-service role; the service key bypasses RLS/grants by design.

create or replace function public.set_vault_secret(secret_name text, secret_value text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from vault.secrets where name = secret_name;
  perform vault.create_secret(secret_value, secret_name);
end;
$$;

revoke all on function public.set_vault_secret(text, text) from public, anon, authenticated;
