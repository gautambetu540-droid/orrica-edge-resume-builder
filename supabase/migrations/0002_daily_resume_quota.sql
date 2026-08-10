-- Daily resume creation quota: 2 new resumes per user per India calendar day.
create table if not exists public.resume_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  resume_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date),
  constraint resume_daily_usage_count_nonnegative check (resume_count >= 0)
);

alter table public.resume_daily_usage enable row level security;

drop policy if exists "Users can view their own daily resume usage" on public.resume_daily_usage;
create policy "Users can view their own daily resume usage"
  on public.resume_daily_usage for select
  using (auth.uid() = user_id);

create or replace function public.consume_resume_quota(p_user_id uuid)
returns table (allowed boolean, used integer, remaining integer, usage_date date)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date date := timezone('Asia/Kolkata', now())::date;
  v_count integer;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.resume_daily_usage (user_id, usage_date, resume_count)
  values (p_user_id, v_date, 1)
  on conflict (user_id, usage_date)
  do update set
    resume_count = public.resume_daily_usage.resume_count + 1,
    updated_at = now()
  where public.resume_daily_usage.resume_count < 2
  returning resume_count into v_count;

  if v_count is null then
    select resume_count into v_count
    from public.resume_daily_usage
    where user_id = p_user_id and usage_date = v_date;
    return query select false, v_count, greatest(0, 2 - v_count), v_date;
  end if;

  return query select true, v_count, greatest(0, 2 - v_count), v_date;
end;
$$;

revoke all on function public.consume_resume_quota(uuid) from public;
grant execute on function public.consume_resume_quota(uuid) to authenticated;
