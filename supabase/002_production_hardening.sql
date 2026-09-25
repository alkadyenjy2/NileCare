create table if not exists public.clinic_offers (
 id uuid primary key default gen_random_uuid(), clinic_name text not null, service text not null,
 price numeric(14,2) not null check(price>0), currency text not null check(currency in ('EGP','USD','EUR','GBP','SAR','AED')),
 included jsonb not null, excluded jsonb not null default '[]', delivery_time text not null, refund_policy text not null,
 approved boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.whatsapp_messages (
 id uuid primary key default gen_random_uuid(), provider_message_id text not null unique,
 direction text not null check(direction in ('inbound','outbound')), phone text, payload jsonb not null default '{}', created_at timestamptz not null default now()
);
create index if not exists leads_phone_idx on public.leads(phone);
create index if not exists leads_whatsapp_idx on public.leads(whatsapp);
create index if not exists leads_stage_idx on public.leads(stage);
create index if not exists payment_events_provider_idx on public.payment_events(provider_event_id);
create index if not exists whatsapp_messages_phone_idx on public.whatsapp_messages(phone);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
drop trigger if exists clinic_offers_updated_at on public.clinic_offers;
create trigger clinic_offers_updated_at before update on public.clinic_offers for each row execute function public.set_updated_at();
alter table public.clinic_offers enable row level security;
alter table public.whatsapp_messages enable row level security;
do $$
declare
  r text;
begin
  foreach r in array['anon','authenticated'] loop
    if exists(select 1 from pg_roles where rolname=r) then
      execute format('revoke all on public.clinic_offers from %I', r);
      execute format('revoke all on public.whatsapp_messages from %I', r);
    end if;
  end loop;
end $$;
