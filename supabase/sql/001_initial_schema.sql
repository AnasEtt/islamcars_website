-- Islamcars initial Supabase schema
-- Run this file in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  year integer not null check (year between 1990 and 2100),
  daily_price integer not null check (daily_price > 0),
  fuel_type text not null,
  transmission text not null,
  seats integer not null default 5 check (seats > 0),
  description text,
  status text not null default 'available' check (
    status in ('available', 'reserved', 'unavailable', 'maintenance')
  ),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  start_date date not null,
  end_date date not null,
  message text,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'refused', 'cancelled', 'completed')
  ),
  cash_payment_received boolean not null default false,
  manager_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists cars_status_idx on public.cars(status);
create index if not exists cars_featured_idx on public.cars(featured);
create index if not exists car_images_car_id_idx on public.car_images(car_id);
create index if not exists reservations_car_id_idx on public.reservations(car_id);
create index if not exists reservations_user_id_idx on public.reservations(user_id);
create index if not exists reservations_status_idx on public.reservations(status);
create index if not exists reservations_dates_idx on public.reservations(start_date, end_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.car_images enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_basic_fields" on public.profiles;
create policy "profiles_update_own_basic_fields"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = 'customer');

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "cars_public_read_active" on public.cars;
create policy "cars_public_read_active"
on public.cars
for select
to anon, authenticated
using (status in ('available', 'reserved'));

drop policy if exists "cars_admin_all" on public.cars;
create policy "cars_admin_all"
on public.cars
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "car_images_public_read_for_active_cars" on public.car_images;
create policy "car_images_public_read_for_active_cars"
on public.car_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.cars
    where cars.id = car_images.car_id
      and cars.status in ('available', 'reserved')
  )
);

drop policy if exists "car_images_admin_all" on public.car_images;
create policy "car_images_admin_all"
on public.car_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reservations_insert_public" on public.reservations;
create policy "reservations_insert_public"
on public.reservations
for insert
to anon, authenticated
with check (
  customer_name <> ''
  and customer_email <> ''
  and customer_phone <> ''
  and status = 'pending'
  and cash_payment_received = false
  and manager_note is null
);

drop policy if exists "reservations_select_own_or_admin" on public.reservations;
create policy "reservations_select_own_or_admin"
on public.reservations
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reservations_admin_update" on public.reservations;
create policy "reservations_admin_update"
on public.reservations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "reservations_admin_delete" on public.reservations;
create policy "reservations_admin_delete"
on public.reservations
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "car_images_storage_public_read" on storage.objects;
create policy "car_images_storage_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'car-images');

drop policy if exists "car_images_storage_admin_insert" on storage.objects;
create policy "car_images_storage_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'car-images' and public.is_admin());

drop policy if exists "car_images_storage_admin_update" on storage.objects;
create policy "car_images_storage_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'car-images' and public.is_admin())
with check (bucket_id = 'car-images' and public.is_admin());

drop policy if exists "car_images_storage_admin_delete" on storage.objects;
create policy "car_images_storage_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'car-images' and public.is_admin());
