import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Rango {
  id: string;
  key: string;
  label: string;
  orden: number;
}

export interface PersonalRow {
  id: string;
  nombre: string;
  rango_id: string;
  cargo: string;
  division: string;
  placa: string;
  expediente: string;
  notas: string;
  imagen_url: string | null;
  rango?: Rango;
}

export interface VetadoRow {
  id: string;
  nombre: string;
  discord_id: string;
  motivo: string;
  orden: number;
}

export const useRangos = () =>
  useQuery({
    queryKey: ['rangos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rangos')
        .select('*')
        .order('orden');
      if (error) throw error;
      return data as Rango[];
    },
  });

export const usePersonal = () =>
  useQuery({
    queryKey: ['personal'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal')
        .select('*, rango:rangos(*)')
        .order('created_at');
      if (error) throw error;
      return data as PersonalRow[];
    },
  });

export const useVetados = () =>
  useQuery({
    queryKey: ['vetados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vetados')
        .select('*')
        .order('orden');
      if (error) throw error;
      return data as VetadoRow[];
    },
  });
