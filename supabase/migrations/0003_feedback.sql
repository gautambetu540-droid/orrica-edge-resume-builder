-- Post-download product feedback
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete set null,
  resume_id uuid references public.resumes (id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  feedback text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_user_id_idx on public.feedback (user_id);

alter table public.feedback enable row level security;

create policy "Users can submit feedback"
  on public.feedback for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Users can view their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
