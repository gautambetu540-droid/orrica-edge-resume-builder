-- Store the candidate name captured from the resume used for feedback.
alter table public.feedback add column if not exists candidate_name text not null default '';

-- Backfill existing feedback where the linked resume still exists.
update public.feedback f
set candidate_name = coalesce(nullif(trim(r.resume_data->'personalInfo'->>'fullName'), ''), '')
from public.resumes r
where f.resume_id = r.id
  and coalesce(trim(f.candidate_name), '') = '';
