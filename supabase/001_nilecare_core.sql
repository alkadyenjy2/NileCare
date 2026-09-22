create extension if not exists pgcrypto;

create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(), clinic_name text not null, contact_name text,
 phone text, whatsapp text, email text, source text not null, stage text not null default 'new',
 notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
 id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade,
 event_type text not null, external_id text, payload jsonb not null default '{}', created_at timestamptz not null default now(),
 unique(event_type, external_id)
);

create table if not exists public.payment_events (
 id uuid primary key default gen_random_uuid(), lead_id uuid references public.leads(id), provider text not null,
 provider_event_id text not null unique, status text not null, payload jsonb not null default '{}', created_at timestamptz not null default now()
);
