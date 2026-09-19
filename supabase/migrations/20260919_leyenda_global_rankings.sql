-- LEYENDA global leaderboard
-- Apply in the project's Supabase SQL editor.
-- Scores are intentionally independent of personal account data.

create table if not exists public.leyenda_scores (
  id bigint generated always as identity primary key,
  run_id text not null unique check (char_length(run_id) between 4 and 100),
  display_name text not null check (char_length(display_name) between 1 and 40),
  mode text not null check (mode in ('player','coach')),
  score bigint not null check (score between 0 and 1000000000),
  detail text not null default '' check (char_length(detail) <= 220),
  created_at timestamptz not null default now()
);

create index if not exists leyenda_scores_score_idx
  on public.leyenda_scores (score desc, created_at asc);

alter table public.leyenda_scores enable row level security;

drop policy if exists "leyenda_scores_public_read" on public.leyenda_scores;
create policy "leyenda_scores_public_read"
  on public.leyenda_scores for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.leyenda_scores from anon, authenticated;

create or replace function public.submit_leyenda_score(
  p_run_id text,
  p_display_name text,
  p_mode text,
  p_score bigint,
  p_detail text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(trim(p_run_id)) < 4 or char_length(p_run_id) > 100 then
    raise exception 'invalid run id';
  end if;
  if char_length(trim(p_display_name)) < 1 or char_length(p_display_name) > 40 then
    raise exception 'invalid display name';
  end if;
  if p_mode not in ('player','coach') then
    raise exception 'invalid mode';
  end if;
  if p_score < 0 or p_score > 1000000000 then
    raise exception 'invalid score';
  end if;
  if char_length(coalesce(p_detail,'')) > 220 then
    raise exception 'invalid detail';
  end if;

  insert into public.leyenda_scores(run_id,display_name,mode,score,detail)
  values(trim(p_run_id),trim(p_display_name),p_mode,p_score,coalesce(p_detail,''))
  on conflict (run_id) do nothing;
end;
$$;

grant execute on function public.submit_leyenda_score(text,text,text,bigint,text)
  to anon, authenticated;
