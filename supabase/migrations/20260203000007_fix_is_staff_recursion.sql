-- Fix: avoid RLS recursion ("stack depth limit exceeded")
-- When user_profiles policies call public.is_staff(), and is_staff() queries user_profiles,
-- it can recurse infinitely. Make is_staff() SECURITY DEFINER with row_security disabled.

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists(
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('1','2','3','9')
  );
$$;

