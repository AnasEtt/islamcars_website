-- Site settings for editable public contact information.
-- Run this in Supabase SQL Editor if the project already has the initial schema.

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  agency_name text not null default 'Islamcars',
  city text not null default 'Agadir',
  contact_email text,
  contact_phone text,
  whatsapp_phone text,
  address text,
  service_area text,
  opening_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (
  id,
  agency_name,
  city,
  contact_email,
  contact_phone,
  whatsapp_phone,
  address,
  service_area,
  opening_hours
)
values (
  true,
  'Islamcars',
  'Agadir',
  'contact@islamcars.example',
  '+212 600 000 000',
  '+212 600 000 000',
  'Agadir, Maroc',
  'Agadir et alentours',
  'Tous les jours, 09:00 - 20:00'
)
on conflict (id) do nothing;
