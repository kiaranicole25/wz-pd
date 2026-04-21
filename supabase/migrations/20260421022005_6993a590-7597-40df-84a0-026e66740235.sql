-- 1) Permiso logs en cupula_users
ALTER TABLE public.cupula_users
  ADD COLUMN IF NOT EXISTS perm_logs boolean NOT NULL DEFAULT false;

-- 2) Tabla profugos
CREATE TABLE IF NOT EXISTS public.profugos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  localidad text NOT NULL DEFAULT 'Desconocida',
  numero_procesamiento text NOT NULL UNIQUE,
  imagen_url text,
  delitos text[] NOT NULL DEFAULT ARRAY[]::text[],
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profugos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profugos publicly readable"
  ON public.profugos FOR SELECT USING (true);

CREATE POLICY "profugos public insert"
  ON public.profugos FOR INSERT WITH CHECK (true);

CREATE POLICY "profugos public update"
  ON public.profugos FOR UPDATE USING (true);

CREATE POLICY "profugos public delete"
  ON public.profugos FOR DELETE USING (true);

CREATE TRIGGER profugos_set_updated_at
  BEFORE UPDATE ON public.profugos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();