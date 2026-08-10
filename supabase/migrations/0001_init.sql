-- Orrica Edge resume builder database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "uuid-ossp";

-- ── profiles ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── resumes ─────────────────────────────────────────────────────────────
create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled Resume',
  resume_data jsonb not null default '{}'::jsonb,
  template text not null default 'modern-ats',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);
create index if not exists resumes_updated_at_idx on public.resumes (updated_at desc);

alter table public.resumes enable row level security;

create policy "Users can manage their own resumes"
  on public.resumes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute procedure public.set_updated_at();

-- ── resume_versions (lightweight version history) ──────────────────────
create table if not exists public.resume_versions (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes (id) on delete cascade,
  resume_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists resume_versions_resume_id_idx on public.resume_versions (resume_id);

alter table public.resume_versions enable row level security;

create policy "Users can manage versions of their own resumes"
  on public.resume_versions for all
  using (
    exists (
      select 1 from public.resumes r
      where r.id = resume_versions.resume_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.resumes r
      where r.id = resume_versions.resume_id and r.user_id = auth.uid()
    )
  );

-- Keep only the last 20 versions per resume to bound storage growth.
create or replace function public.trim_resume_versions()
returns trigger as $$
begin
  delete from public.resume_versions
  where id in (
    select id from public.resume_versions
    where resume_id = new.resume_id
    order by created_at desc
    offset 20
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists resume_versions_trim on public.resume_versions;
create trigger resume_versions_trim
  after insert on public.resume_versions
  for each row execute procedure public.trim_resume_versions();
