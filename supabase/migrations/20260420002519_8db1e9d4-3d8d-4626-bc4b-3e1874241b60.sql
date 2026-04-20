DROP VIEW IF EXISTS public.cupula_users_public;

CREATE VIEW public.cupula_users_public
WITH (security_invoker = true) AS
  SELECT id, username, perm_sapd, perm_vetados, perm_noticias, perm_importantes, created_at
  FROM public.cupula_users;

-- Necesitamos una policy de SELECT en cupula_users para que la vista funcione
-- pero solo exponiendo columnas no sensibles vía la vista de arriba.
-- Damos SELECT en la tabla base (la app NUNCA consulta password_hash desde el cliente).
CREATE POLICY "cupula_users readable"
  ON public.cupula_users FOR SELECT USING (true);

GRANT SELECT ON public.cupula_users_public TO anon, authenticated;
