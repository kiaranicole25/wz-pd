-- Tabla noticias (publicaciones de /noticias)
CREATE TABLE public.noticias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  redactor text NOT NULL DEFAULT 'Anónimo',
  titulo text NOT NULL,
  desarrollo text NOT NULL DEFAULT '',
  imagen_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noticias publicly readable" ON public.noticias FOR SELECT USING (true);
CREATE POLICY "noticias public insert" ON public.noticias FOR INSERT WITH CHECK (true);
CREATE POLICY "noticias public update" ON public.noticias FOR UPDATE USING (true);
CREATE POLICY "noticias public delete" ON public.noticias FOR DELETE USING (true);

-- Tabla avisos_importantes (publicaciones de /importante)
CREATE TABLE public.avisos_importantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  redactor text NOT NULL DEFAULT 'Anónimo',
  titulo text NOT NULL,
  desarrollo text NOT NULL DEFAULT '',
  imagen_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.avisos_importantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avisos publicly readable" ON public.avisos_importantes FOR SELECT USING (true);
CREATE POLICY "avisos public insert" ON public.avisos_importantes FOR INSERT WITH CHECK (true);
CREATE POLICY "avisos public update" ON public.avisos_importantes FOR UPDATE USING (true);
CREATE POLICY "avisos public delete" ON public.avisos_importantes FOR DELETE USING (true);

-- Sequence para expediente autoincremental empezando en 100
CREATE SEQUENCE IF NOT EXISTS public.expediente_seq START WITH 100 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.next_expediente()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'EX-' || LPAD(nextval('public.expediente_seq')::text, 5, '0');
$$;

-- Seed noticias e importantes con los datos por defecto que ya estaban hardcodeados
INSERT INTO public.noticias (redactor, titulo, desarrollo, imagen_url) VALUES
  ('Departamento SAPD', 'Zonas Rojas - Departamento de Policías', E'T: Territorios.\nF: Fábricas.\n\nNota al usuario: Los territorios (T) solo serán considerados Zonas Rojas si hay una conquista activa.', 'https://i.ibb.co/chMtCfqS/Zonas-Rojas-SAPDWZ.png');

INSERT INTO public.avisos_importantes (redactor, titulo, desarrollo) VALUES
  ('División Administrativa', 'Registro de Zonas Rojas Disponible', E'Se informa a todo el personal que se ha añadido el registro oficial de Zonas Rojas del Departamento en el apartado de Información Pública.\n\nConsulte el mapa y las indicaciones en: https://wz-pd.lovable.app/noticias'),
  ('División Administrativa', 'Nueva Plataforma Web del Departamento SAPD', 'Se informa a todo el personal del Departamento de Policía de San Andreas que a partir de la fecha se ha implementado una nueva plataforma web oficial para la gestión y consulta de información institucional. Esta herramienta centraliza la jerarquía del departamento, el registro de personal vetado, noticias internas y avisos importantes. Se solicita a todos los miembros familiarizarse con el sistema y reportar cualquier inconveniente a la División Administrativa.');

-- Triggers updated_at (reutiliza función estándar)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER noticias_updated_at BEFORE UPDATE ON public.noticias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER avisos_updated_at BEFORE UPDATE ON public.avisos_importantes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();