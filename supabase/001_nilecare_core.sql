create extension if not exists pgcrypto;

create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(), clinic_name text not null, contact_name text,
 phone text, whatsapp text, email text, source text not null, stage text not null default 'new',
 notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
 id uuid primary key default gen_random_uuid(), lead_id uuid references public.leads(id) on delete cascade,
 event_type text not null, external_id text, payload jsonb not null default '{}', created_at timestamptz not null default now(),
 unique(event_type, external_id)
);

create table if not exists public.payment_events (
 id uuid primary key default gen_random_uuid(), lead_id uuid references public.leads(id), provider text not null,
 provider_event_id text not null unique, status text not null, payload jsonb not null default '{}', created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.payment_events enable row level security;

do $$
declare
  r text;
begin
  foreach r in array['anon','authenticated'] loop
    if exists(select 1 from pg_roles where rolname=r) then
      execute format('revoke all on public.leads from %I', r);
      execute format('revoke all on public.lead_events from %I', r);
      execute format('revoke all on public.payment_events from %I', r);
    end if;
  end loop;
end $$;

comment on table public.leads is 'NileCare lead registry. Access is deny-by-default until production auth/RLS policies are explicitly bound.';
comment on table public.lead_events is 'NileCare idempotent operational event log.';
comment on table public.payment_events is 'NileCare payment provider event log; provider_event_id is idempotent.';
