-- Run once in Supabase → SQL Editor (safe to run again).
-- Adds a flexible "details" field for variant, colour, insurance, features, thumbnails, etc.
alter table public.cars add column if not exists details jsonb not null default '{}'::jsonb;
