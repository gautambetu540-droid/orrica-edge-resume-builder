-- Public candidate feedback moderation flag
alter table public.feedback
  add column if not exists is_featured boolean not null default false;

create index if not exists feedback_featured_idx
  on public.feedback (is_featured, created_at desc);

create policy "Anyone can view featured feedback"
  on public.feedback for select
  using (is_featured = true);
