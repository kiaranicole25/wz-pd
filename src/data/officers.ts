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

export type RangoKey =
  | 'comisarios'
  | 'inspectores'
  | 'capitanes'
  | 'tenientes'
  | 'sargentos'
  | 'cabos'
  | 'oficiales'
  | 'cadetes';

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

let _id = 0;
const o = (nombre: string, rango: string): Officer => ({
  id: String(++_id),
  nombre,
  rango,
  cargo: '',
  division: '',
  placa: '',
  expediente: `EXP-${String(_id).padStart(4, '0')}`,
  notas: 'Vacío por ahora',
});

export const officersByRango: Record<RangoKey, Officer[]> = {
  comisarios: [
    { ...o('Mike_Holloway', 'Comisario'), cargo: 'Encargado Facción', placa: '2526', division: 'División de Instructores', imagen: 'https://i.ibb.co/PGLWbn9x/283pd.png' },
    { ...o('Kendo_Lockser', 'Comisario'), cargo: 'Encargado Facción', placa: '2705', division: 'Special Weapons And Tactics', imagen: 'https://i.ibb.co/60jS7Yzz/SAPD-Kendo.png' },
  ],
  inspectores: [
    { ...o('Dashy_Woods', 'Inspector'), cargo: 'Cúpula Administrativa', placa: '3333', division: 'Lider de Special Waeapons and Tactics', imagen: 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png' },
    { ...o('Izhan_Grunewaldt', 'Inspector'), cargo: 'Cúpula Administrativa', placa: 'NA', division: 'Confidencial', imagen: 'https://i.ibb.co/zwqzFD8/312123123.png' },
    { ...o('Kenny_Parker', 'Inspector'), cargo: 'Cúpula Administrativa', placa: ' 3164', division: 'Lider de División de Instructores', imagen: 'https://i.ibb.co/PGLWbn9x/283pd.png' },
  ],
  capitanes: [
    { ...o('Andrew_Quintero', 'Capitán'), cargo: 'NA', placa: '6969', division: 'N/A', imagen: 'https://i.ibb.co/TxYbMV5c/sasdf2113.png' },
    { ...o('Carpe_Diem', 'Capitán'), cargo: 'Cúpula Administrativa', placa: '1611', division: 'División de Instructores', imagen: 'https://i.ibb.co/TxYbMV5c/sasdf2113.png' },
  ],
  tenientes: [
    { ...o('Thiago_Schneider', 'Teniente'), cargo: 'NA', placa: ':7777', division: 'Division de Instructores', imagen: 'https://i.ibb.co/PGLWbn9x/283pd.png' },
    { ...o('Aslan_Mog', 'Teniente'), cargo: 'NA', placa: '7373', division: 'NA', imagen: 'https://i.ibb.co/SwVXhRC4/IMG-20260415-221122.png' },
    { ...o('Alan_Cronck', 'Teniente'), cargo: 'NA', placa: '9907', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
  ],
  sargentos: [
    { ...o('Jhon_Conor', 'Sargento'), cargo: 'NA', placa: '2312', division: 'Special Weapons And Tactics', imagen: 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png' },
    { ...o('Harvey_Shikpa', 'Sargento'), cargo: 'NA', placa: '2707', division: 'Special Weapons And Tactics', imagen: 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png' },
    { ...o('Antwane_Legends', 'Sargento'), cargo: 'NA', placa: '9904', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Paul_Ivanov', 'Sargento'), cargo: 'NA', placa: '1007', division: 'NA', imagen: 'https://i.ibb.co/TBgn1Yth/image.png' },
    { ...o('Francisco_Duff', 'Sargento'), cargo: 'NA', placa: '4359', division: 'Special Weapons and Tactics', imagen: 'https://i.ibb.co/PGLWbn9x/283pd.png' },
    { ...o('Dana_Lopez', 'Sargento'), cargo: 'NA', placa: '7424', division: 'NA', imagen: 'https://i.ibb.co/0V2KzXgk/sadasdasda.png' },
  ],
  cabos: [
    { ...o('James_Wallthert', 'Cabo'), cargo: 'NA', placa: '9996', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('James_Bricceno', 'Cabo'), cargo: 'NA', placa: '7513', division: 'NA', imagen: 'https://i.ibb.co/TxYbMV5c/sasdf2113.png' },
    { ...o('Gino_Lesner', 'Cabo'), cargo: 'NA', placa: '9997', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Mike_Taylor', 'Cabo'), cargo: 'NA', placa: '9998', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Karina_Beckenbauer', 'Cabo'), cargo: 'NA', placa: 'NA', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Tiven_Gomez', 'Cabo'), cargo: 'NA', placa: '9990', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Night_Lesner', 'Cabo'), cargo: 'NA', placa: '9901', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('David_Lazo', 'Cabo'), cargo: 'NA', placa: '1406', division: 'Special Weapons and Tactics', imagen: 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png' },
    { ...o('Maxi_Gomez', 'Cabo'), cargo: 'NA', placa: '9902', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Eddie_Morgan', 'Cabo'), cargo: 'NA', placa: '9903', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Derek_Frost', 'Cabo'), cargo: 'NA', placa: '2247', division: 'NA', imagen: 'https://i.ibb.co/Q39GLH7N/asdasdasdsd2.png' },
  ],
  oficiales: [
    { ...o('Chinny_Lesner', 'Oficial'), cargo: 'NA', placa: '9991', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Kryzhh_Lesner', 'Oficial'), cargo: 'NA', placa: '9992', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Kseniya_Kvaratkhelia', 'Oficial'), cargo: 'NA', placa: '3644', division: 'División de Instructores', imagen: 'https://i.ibb.co/gZDvpxc7/SAPD-Mujer-1.png' },
    { ...o('Tryan_Cordozar', 'Oficial'), cargo: 'NA', placa: '9993', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Jaciel_Medina', 'Oficial'), cargo: 'NA', placa: '3035', division: 'NA', imagen: 'https://i.ibb.co/gZDvpxc7/SAPD-Mujer-1.png' },
    { ...o('James_Parker', 'Oficial'), cargo: 'NA', placa: '5025', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Misael_Chronos', 'Oficial'), cargo: 'NA', placa: '9995', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Franco_Tornillo', 'Oficial'), cargo: 'NA', placa: '2505', division: 'NA', imagen: 'https://i.ibb.co/Vp0LbkY5/SAPD-Hernandez.png' },
  ],
  cadetes: [
    { ...o('Kenz_Kuznetsov', 'Cadete'), cargo: 'NA', placa: '9123', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Zed_Ghostly', 'Cadete'), cargo: 'NA', placa: '1707', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Jhoe_Fernandez', 'Cadete'), cargo: 'NA', placa: '5125', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Shadow_Black', 'Cadete'), cargo: 'NA', placa: '9102', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Grodell_Whinstronck', 'Cadete'), cargo: 'NA', placa: '2201', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Dylan_Moreno', 'Cadete'), cargo: 'NA', placa: '4417', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
    { ...o('Lorenzo_Chevallier', 'Cadete'), cargo: 'NA', placa: '4612', division: 'NA', imagen: 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png' },
  ],
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
