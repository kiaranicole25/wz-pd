import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Publicacion {
  id: string;
  redactor: string;
  titulo: string;
  desarrollo: string;
  imagen_url: string | null;
  created_at: string;
}

export const useNoticias = () =>
  useQuery({
    queryKey: ['noticias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Publicacion[];
    },
  });

export const useAvisos = () =>
  useQuery({
    queryKey: ['avisos_importantes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avisos_importantes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Publicacion[];
    },
  });
