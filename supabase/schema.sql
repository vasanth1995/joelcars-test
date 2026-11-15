-- Run this once in Supabase → SQL Editor.

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  year int,
  price bigint not null,
  km int,
  fuel text,
  transmission text,
  owner_count text,
  location text,
  description text,
  images text[] not null default '{}',
  image_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.sold_cars (
  id uuid primary key default gen_random_uuid(),
  caption text,
  image_url text not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

alter table public.cars enable row level security;
alter table public.sold_cars enable row level security;

-- Everyone (visitors, not logged in) can read.
create policy "public read cars" on public.cars for select using (true);
create policy "public read sold" on public.sold_cars for select using (true);

-- Only a logged-in admin can change data.
create policy "admin write cars" on public.cars for all to authenticated using (true) with check (true);
create policy "admin write sold" on public.sold_cars for all to authenticated using (true) with check (true);

-- Image bucket (public so photos load fast through the CDN).
insert into storage.buckets (id, name, public) values ('car-images', 'car-images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects for select using (bucket_id = 'car-images');
create policy "admin upload images" on storage.objects for insert to authenticated with check (bucket_id = 'car-images');
create policy "admin delete images" on storage.objects for delete to authenticated using (bucket_id = 'car-images');
