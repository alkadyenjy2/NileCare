-- NileCare patient inquiry schema alignment.
-- Keep legacy clinic intake columns for compatibility, but patient intake is canonical for the landing form.
alter table public.leads alter column clinic_name drop not null;
alter table public.leads add column if not exists full_name text;
alter table public.leads add column if not exists country text;
alter table public.leads add column if not exists service_category text;
alter table public.leads add column if not exists preferred_contact_method text;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists consent boolean not null default false;

create index if not exists leads_email_idx on public.leads (lower(email));
create index if not exists leads_created_at_idx on public.leads (created_at desc);

comment on column public.leads.message is 'Patient coordination request. Sensitive medical details must not be submitted.';
comment on column public.leads.consent is 'Patient consent to be contacted about the coordination inquiry.';
