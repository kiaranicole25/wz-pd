export interface Officer {
  id: string;
  nombre: string;
  rango: string;
  cargo: string;
  division: string;
  placa: string;
  expediente: string;
  notas: string;
  imagen?: string;
}

export type RangoKey = 'comisarios' | 'inspectores' | 'capitanes' | 'tenientes' | 'sargentos' | 'cabos' | 'oficiales' | 'cadetes';

export const RANGOS: { key: RangoKey; label: string; color: string }[] = [
  { key: 'comisarios', label: 'Comisarios', color: 'from-yellow-600 to-yellow-800' },
  { key: 'inspectores', label: 'Inspectores', color: 'from-yellow-500 to-amber-700' },
  { key: 'capitanes', label: 'Capitanes', color: 'from-blue-400 to-blue-700' },
  { key: 'tenientes', label: 'Tenientes', color: 'from-blue-500 to-indigo-700' },
  { key: 'sargentos', label: 'Sargentos', color: 'from-emerald-500 to-emerald-800' },
  { key: 'cabos', label: 'Cabos', color: 'from-teal-500 to-teal-700' },
  { key: 'oficiales', label: 'Oficiales', color: 'from-slate-400 to-slate-600' },
  { key: 'cadetes', label: 'Cadetes', color: 'from-gray-400 to-gray-600' },
];

export const officersByRango: Record<RangoKey, Officer[]> = {
  comisarios: [
    {
      id: '1',
      nombre: 'Mike Holloway',
      rango: 'Comisario',
      cargo: 'Cúpula Administrativa',
      division: 'Encargado General',
      placa: '#0001',
      expediente: 'EXP-0001',
      notas: 'Vacío por ahora',
    },
  ],
  inspectores: [
    {
      id: '2',
      nombre: 'Kendo Lockser',
      rango: 'Inspector',
      cargo: 'Cúpula Administrativa',
      division: 'D.I',
      placa: '#0002',
      expediente: 'EXP-0002',
      notas: 'Vacío por ahora',
    },
  ],
  capitanes: [],
  tenientes: [],
  sargentos: [],
  cabos: [],
  oficiales: [],
  cadetes: [],
};
