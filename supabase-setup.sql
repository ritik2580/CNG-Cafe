create table if not exists public.cafe_site (
  id smallint primary key check (id = 1),
  menu jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.cafe_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.cng_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cafe_admins where user_id = auth.uid()
  );
$$;

insert into public.cafe_site (id)
values (1)
on conflict (id) do nothing;

alter table public.cafe_site enable row level security;
alter table public.cafe_admins enable row level security;

grant select on public.cafe_site to anon, authenticated;
grant update on public.cafe_site to authenticated;
grant execute on function public.cng_is_admin() to authenticated;

drop policy if exists "public can read cafe site" on public.cafe_site;
create policy "public can read cafe site"
on public.cafe_site for select
to anon, authenticated
using (true);

drop policy if exists "cng admins can update cafe site" on public.cafe_site;
create policy "cng admins can update cafe site"
on public.cafe_site for update
to authenticated
using (public.cng_is_admin())
with check (public.cng_is_admin());

-- After creating your owner account in Supabase Authentication, run this once.
-- Replace the email with the email address you use to sign in to /admin/.
-- insert into public.cafe_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
