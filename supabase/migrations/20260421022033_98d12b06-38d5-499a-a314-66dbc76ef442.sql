DROP VIEW IF EXISTS public.cupula_users_public;
CREATE VIEW public.cupula_users_public AS
SELECT id, username, perm_sapd, perm_vetados, perm_noticias, perm_importantes, perm_logs, created_at
FROM public.cupula_users;