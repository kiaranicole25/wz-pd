-- Tabla de usuarios Cúpula (creados por el Encargado)
CREATE TABLE public.cupula_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  perm_sapd boolean NOT NULL DEFAULT false,
  perm_vetados boolean NOT NULL DEFAULT false,
  perm_noticias boolean NOT NULL DEFAULT false,
  perm_importantes boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cupula_users ENABLE ROW LEVEL SECURITY;

-- Lectura pública SOLO de username + permisos (sin hash) vía vista
CREATE OR REPLACE VIEW public.cupula_users_public AS
  SELECT id, username, perm_sapd, perm_vetados, perm_noticias, perm_importantes, created_at
  FROM public.cupula_users;

GRANT SELECT ON public.cupula_users_public TO anon, authenticated;

-- Nadie puede leer/escribir directo a cupula_users desde el cliente.
-- Toda mutación pasa por edge functions con SERVICE_ROLE.

-- Tabla de logs de auditoría (inmutable: solo INSERT y SELECT)
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_username text NOT NULL,
  actor_role text NOT NULL, -- 'encargado' | 'cupula' | 'anon'
  area text NOT NULL,       -- 'sapd' | 'vetados' | 'noticias' | 'importantes' | 'auth' | 'usuarios'
  action text NOT NULL,     -- 'crear' | 'editar' | 'borrar' | 'login_ok' | 'login_fail'
  detalle text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Lectura pública (la app filtra: solo encargado ve la pestaña).
-- Si querés restringir a server-only, lo hacemos luego con edge function.
CREATE POLICY "audit_logs readable" ON public.audit_logs
  FOR SELECT USING (true);

-- INSERT abierto para que la app pueda registrar acciones e intentos fallidos.
CREATE POLICY "audit_logs insertable" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Sin policies de UPDATE/DELETE => inmutable.

CREATE INDEX audit_logs_created_idx ON public.audit_logs (created_at DESC);
