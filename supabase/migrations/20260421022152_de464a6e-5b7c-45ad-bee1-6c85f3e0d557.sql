ALTER TABLE public.cupula_users
  ADD COLUMN IF NOT EXISTS perm_profugos boolean NOT NULL DEFAULT false;

DROP VIEW IF EXISTS public.cupula_users_public;
CREATE VIEW public.cupula_users_public
WITH (security_invoker = true) AS
SELECT id, username, perm_sapd, perm_vetados, perm_noticias, perm_importantes,
       perm_profugos, perm_logs, created_at
FROM public.cupula_users;