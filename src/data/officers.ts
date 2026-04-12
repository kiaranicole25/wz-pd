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

export const RANGOS: { key: RangoKey; label: string }[] = [
  { key: 'comisarios', label: 'COMISARIOS' },
  { key: 'inspectores', label: 'INSPECTORES' },
  { key: 'capitanes', label: 'CAPITANES' },
  { key: 'tenientes', label: 'TENIENTES' },
  { key: 'sargentos', label: 'SARGENTOS' },
  { key: 'cabos', label: 'CABOS' },
  { key: 'oficiales', label: 'OFICIALES' },
  { key: 'cadetes', label: 'CADETES' },
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
    {
      id: '2',
      nombre: 'Kendo Lockser',
      rango: 'Comisario',
      cargo: 'Cúpula Administrativa',
      division: 'D.I',
      placa: '#0002',
      expediente: 'EXP-0002',
      notas: 'Vacío por ahora',
    },
  ],
  inspectores: [],
  capitanes: [],
  tenientes: [],
  sargentos: [],
  cabos: [],
  oficiales: [],
  cadetes: [],
};

export interface Vetado {
  id: string;
  nombre: string;
  discordId: string;
  motivo: string;
}

export const defaultVetados: Vetado[] = [
  { id: '1', nombre: 'Dave_Santorini', discordId: '660731672668667904', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '2', nombre: 'Demarco_Shepard', discordId: '673011366499713043', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '3', nombre: 'Rock_Lee', discordId: '862005230551433226', motivo: 'Abandono siendo Aspirante, falta de respeto a la facción y perdida de tiempo.' },
  { id: '4', nombre: 'Franco_Smiths', discordId: '1477514427178811563', motivo: 'Staff en otro servidor.' },
  { id: '5', nombre: 'Sergio_Dash', discordId: '710976587490656256', motivo: 'Desconocida.' },
  { id: '6', nombre: 'Fernando_Josue', discordId: '1334727345717772328', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '7', nombre: 'Judas_Perverse', discordId: '664495871047499799 / 1243981574756630622', motivo: 'Desconocida.' },
  { id: '8', nombre: '@satoru_es', discordId: 'No figura', motivo: 'Desconocida.' },
  { id: '9', nombre: 'Franco_Szchweitzer', discordId: '1247709460818825286', motivo: 'SAPD en otro servidor.' },
  { id: '10', nombre: 'Shaggy_Arizmendi', discordId: 'Ultimo Nick: Shaggy.o', motivo: 'Baneado por estafa.' },
  { id: '11', nombre: 'Massimo_Estrada', discordId: 'No figura', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '12', nombre: '@mariana185783', discordId: 'No figura', motivo: 'SAPD y STAFF en otro servidor.' },
  { id: '13', nombre: 'John_Kings', discordId: '1221527650665762956', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '14', nombre: 'Daren_Santos / Daren_Jaramillo', discordId: '1129962062538362920 / 1312532944656797738', motivo: 'Uso de cheats y MC.' },
  { id: '15', nombre: 'Fritz_Knight', discordId: '1291178044534296708', motivo: 'Desconocida.' },
  { id: '16', nombre: 'Andres_Kholyng [@jhonatanandres]', discordId: '1098696220546973807', motivo: 'Multicuentas.' },
  { id: '17', nombre: 'Ghunter_Raymonds', discordId: '921537562533822474', motivo: 'Uso de cheats.' },
  { id: '18', nombre: 'Monkey_Luffy', discordId: 'No figura', motivo: 'Cuenta baneada.' },
  { id: '19', nombre: 'Nelson_Puentes [@Onlymaxyt]', discordId: '1451306603260149780 / 1257014196294516839', motivo: 'Sin especificar.' },
  { id: '20', nombre: 'Lian_Cooronel', discordId: '1424468060168785942', motivo: 'Uso de cheats.' },
  { id: '21', nombre: 'Tra_Ficante (@hvs._. )', discordId: 'No existe', motivo: 'Abuso Administrativo.' },
  { id: '22', nombre: '@czt1499', discordId: 'No figura', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '23', nombre: 'Celestia_Ludenberg', discordId: '1433910175839813774', motivo: 'Cuenta baneada.' },
  { id: '24', nombre: 'Zeki_Rein', discordId: '1062879832993697925', motivo: 'SPAM.' },
  { id: '25', nombre: 'Ben_Sex', discordId: '1036647531230273546', motivo: 'Sin especificar.' },
  { id: '26', nombre: 'Lastik_Sex', discordId: '509357217065992192', motivo: 'Sin especificar.' },
  { id: '27', nombre: 'Maxi_Martinez', discordId: '702857278625153115', motivo: 'Anti-Rol Masivo.' },
  { id: '28', nombre: 'Sheyla_Garcia', discordId: '1307457562186219573', motivo: 'Anti-Rol.' },
  { id: '29', nombre: 'Mila_Lampard', discordId: '977345897031684126', motivo: 'Anti-Rol Masivo.' },
  { id: '30', nombre: 'Liz_Zarev', discordId: 'No figura', motivo: 'Anti-Rol.' },
  { id: '31', nombre: 'Alisson_Fiore (@rdavid_44)', discordId: 'No figura', motivo: 'Sin especificar.' },
  { id: '32', nombre: 'Abby_Suyende', discordId: '880607170654257214', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '33', nombre: 'Alexia_Martinez (@trrekker)', discordId: 'No figura', motivo: 'Abandonar sin presentar renuncia.' },
  { id: '34', nombre: 'Shanise_Winehouse', discordId: '1462558600521187455', motivo: 'Abandonar sin presentar renuncia.' },
];
