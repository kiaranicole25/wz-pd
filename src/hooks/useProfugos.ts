import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProfugoRow {
  id: string;
  nombre: string;
  localidad: string;
  numero_procesamiento: string;
  imagen_url: string | null;
  delitos: string[];
  orden: number;
  created_at: string;
  updated_at: string;
}

export const useProfugos = () =>
  useQuery({
    queryKey: ['profugos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profugos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProfugoRow[];
    },
  });

// Genera un número tipo AB12345678 (2 letras + 8 dígitos)
export const generateProcesamiento = (): string => {
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  ).join('');
  const digits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return `${letters}${digits}`;
};
