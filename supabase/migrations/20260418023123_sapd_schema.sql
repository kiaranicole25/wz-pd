-- Rangos table
create table public.rangos (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  orden integer not null,
  created_at timestamptz not null default now()
);
alter table public.rangos enable row level security;
create policy "rangos publicly readable" on public.rangos for select using (true);

-- Personal table
create table public.personal (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rango_id uuid not null references public.rangos(id) on delete restrict,
  cargo text not null default 'NA',
  division text not null default 'NA',
  placa text not null default 'NA',
  expediente text not null,
  notas text not null default 'Vacío por ahora',
  imagen_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.personal enable row level security;
create policy "personal publicly readable" on public.personal for select using (true);
create policy "personal public insert" on public.personal for insert with check (true);
create policy "personal public update" on public.personal for update using (true);
create policy "personal public delete" on public.personal for delete using (true);
create index personal_rango_id_idx on public.personal(rango_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger personal_set_updated_at before update on public.personal
for each row execute function public.set_updated_at();

-- Vetados table
create table public.vetados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  discord_id text not null default 'No figura',
  motivo text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.vetados enable row level security;
create policy "vetados publicly readable" on public.vetados for select using (true);
create policy "vetados public insert" on public.vetados for insert with check (true);
create policy "vetados public update" on public.vetados for update using (true);
-- intencionalmente sin policy de delete: nadie puede borrar vetados
create trigger vetados_set_updated_at before update on public.vetados
for each row execute function public.set_updated_at();

-- Storage bucket for personal images
insert into storage.buckets (id, name, public) values ('personal-images','personal-images', true)
on conflict (id) do nothing;
create policy "personal-images public read" on storage.objects for select using (bucket_id = 'personal-images');
create policy "personal-images public upload" on storage.objects for insert with check (bucket_id = 'personal-images');
create policy "personal-images public update" on storage.objects for update using (bucket_id = 'personal-images');
create policy "personal-images public delete" on storage.objects for delete using (bucket_id = 'personal-images');

-- Seed rangos
insert into public.rangos (key,label,orden) values ('comisarios','COMISARIOS',1);
insert into public.rangos (key,label,orden) values ('inspectores','INSPECTORES',2);
insert into public.rangos (key,label,orden) values ('capitanes','CAPITANES',3);
insert into public.rangos (key,label,orden) values ('tenientes','TENIENTES',4);
insert into public.rangos (key,label,orden) values ('sargentos','SARGENTOS',5);
insert into public.rangos (key,label,orden) values ('cabos','CABOS',6);
insert into public.rangos (key,label,orden) values ('oficiales','OFICIALES',7);
insert into public.rangos (key,label,orden) values ('cadetes','CADETES',8);

-- Seed personal
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Mike_Holloway', (select id from public.rangos where key='comisarios'), 'Encargado Facción', 'División de Instructores', '2526', 'EXP-0001', 'Vacío por ahora', 'https://i.ibb.co/PGLWbn9x/283pd.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Kendo_Lockser', (select id from public.rangos where key='comisarios'), 'Encargado Facción', 'Special Weapons And Tactics', '2705', 'EXP-0002', 'Vacío por ahora', 'https://i.ibb.co/60jS7Yzz/SAPD-Kendo.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Dashy_Woods', (select id from public.rangos where key='inspectores'), 'Cúpula Administrativa', 'Lider de Special Waeapons and Tactics', '3333', 'EXP-0003', 'Vacío por ahora', 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Izhan_Grunewaldt', (select id from public.rangos where key='inspectores'), 'Cúpula Administrativa', 'NA', 'NA', 'EXP-0004', 'Vacío por ahora', 'https://i.ibb.co/zwqzFD8/312123123.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Kenny_Parker', (select id from public.rangos where key='inspectores'), 'Cúpula Administrativa', 'Lider de División de Instructores', ' 3164', 'EXP-0005', 'Vacío por ahora', 'https://i.ibb.co/PGLWbn9x/283pd.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Andrew_Quintero', (select id from public.rangos where key='capitanes'), 'NA', 'N/A', '6969', 'EXP-0006', 'Vacío por ahora', 'https://i.ibb.co/TxYbMV5c/sasdf2113.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Carpe_Diem', (select id from public.rangos where key='capitanes'), 'Cúpula Administrativa', 'Confidencial', '1611', 'EXP-0007', 'Vacío por ahora', 'https://i.ibb.co/TxYbMV5c/sasdf2113.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Thiago_Schneider', (select id from public.rangos where key='tenientes'), 'NA', 'Division de Instructores', ':7777', 'EXP-0008', 'Vacío por ahora', 'https://i.ibb.co/PGLWbn9x/283pd.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Aslan_Mog', (select id from public.rangos where key='tenientes'), 'NA', 'NA', '7373', 'EXP-0009', 'Vacío por ahora', 'https://i.ibb.co/SwVXhRC4/IMG-20260415-221122.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Alan_Cronck', (select id from public.rangos where key='tenientes'), 'NA', 'NA', '9907', 'EXP-0010', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Jhon_Conor', (select id from public.rangos where key='sargentos'), 'NA', 'Special Weapons And Tactics', '2312', 'EXP-0011', 'Vacío por ahora', 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Harvey_Shikpa', (select id from public.rangos where key='sargentos'), 'NA', 'Special Weapons And Tactics', '2707', 'EXP-0012', 'Vacío por ahora', 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Antwane_Legends', (select id from public.rangos where key='sargentos'), 'NA', 'NA', '9904', 'EXP-0013', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Paul_Ivanov', (select id from public.rangos where key='sargentos'), 'NA', 'NA', '1007', 'EXP-0014', 'Vacío por ahora', 'https://i.ibb.co/TBgn1Yth/image.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Francisco_Duff', (select id from public.rangos where key='sargentos'), 'NA', 'Special Weapons and Tactics', '4359', 'EXP-0015', 'Vacío por ahora', 'https://i.ibb.co/PGLWbn9x/283pd.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Dana_Lopez', (select id from public.rangos where key='sargentos'), 'NA', 'NA', '7424', 'EXP-0016', 'Vacío por ahora', 'https://i.ibb.co/0V2KzXgk/sadasdasda.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('James_Wallthert', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9996', 'EXP-0017', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('James_Bricceno', (select id from public.rangos where key='cabos'), 'NA', 'NA', '7513', 'EXP-0018', 'Vacío por ahora', 'https://i.ibb.co/TxYbMV5c/sasdf2113.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Lucciano_Ferroni', (select id from public.rangos where key='cabos'), 'NA', 'NA', '5512', 'EXP-0019', 'Vacío por ahora', 'https://i.ibb.co/TxYbMV5c/sasdf2113.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Biggiegz_Ferroni', (select id from public.rangos where key='cabos'), 'NA', 'NA', '5513', 'EXP-0020', 'Vacío por ahora', 'https://i.ibb.co/TxYbMV5c/sasdf2113.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Gino_Lesner', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9997', 'EXP-0021', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Mike_Taylor', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9998', 'EXP-0022', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Karina_Beckenbauer', (select id from public.rangos where key='cabos'), 'NA', 'NA', 'NA', 'EXP-0023', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Tiven_Gomez', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9990', 'EXP-0024', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Night_Lesner', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9901', 'EXP-0025', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('David_Lazo', (select id from public.rangos where key='cabos'), 'NA', 'Special Weapons and Tactics', '1406', 'EXP-0026', 'Vacío por ahora', 'https://i.ibb.co/MkW7cXv1/SAPD-SWAT.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Maxi_Gomez', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9902', 'EXP-0027', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Eddie_Morgan', (select id from public.rangos where key='cabos'), 'NA', 'NA', '9903', 'EXP-0028', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Derek_Frost', (select id from public.rangos where key='cabos'), 'NA', 'NA', '2247', 'EXP-0029', 'Vacío por ahora', 'https://i.ibb.co/Q39GLH7N/asdasdasdsd2.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Chinny_Lesner', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '9991', 'EXP-0030', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Kryzhh_Lesner', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '9992', 'EXP-0031', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Kseniya_Kvaratkhelia', (select id from public.rangos where key='oficiales'), 'NA', 'División de Instructores', '3644', 'EXP-0032', 'Vacío por ahora', 'https://i.ibb.co/gZDvpxc7/SAPD-Mujer-1.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Tryan_Cordozar', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '9993', 'EXP-0033', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Jaciel_Medina', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '3035', 'EXP-0034', 'Vacío por ahora', 'https://i.ibb.co/gZDvpxc7/SAPD-Mujer-1.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('James_Parker', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '5025', 'EXP-0035', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Misael_Chronos', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '9995', 'EXP-0036', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Franco_Tornillo', (select id from public.rangos where key='oficiales'), 'NA', 'NA', '2505', 'EXP-0037', 'Vacío por ahora', 'https://i.ibb.co/Vp0LbkY5/SAPD-Hernandez.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Kenz_Kuznetsov', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '9123', 'EXP-0038', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Zed_Ghostly', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '1707', 'EXP-0039', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Jhoe_Fernandez', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '5125', 'EXP-0040', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Shadow_Black', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '9102', 'EXP-0041', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Grodell_Whinstronck', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '2201', 'EXP-0042', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Dylan_Moreno', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '4417', 'EXP-0043', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');
insert into public.personal (nombre, rango_id, cargo, division, placa, expediente, notas, imagen_url) values ('Lorenzo_Chevallier', (select id from public.rangos where key='cadetes'), 'NA', 'NA', '4612', 'EXP-0044', 'Vacío por ahora', 'https://i.ibb.co/8LbSc8zB/SAPD-LS.png');

-- Seed vetados
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Dave_Santorini','660731672668667904','Abandonar sin presentar renuncia.',1);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Demarco_Shepard','673011366499713043','Abandonar sin presentar renuncia.',2);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Rock_Lee','862005230551433226','Abandono siendo Aspirante, falta de respeto a la facción y perdida de tiempo.',3);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Franco_Smiths','1477514427178811563','Staff en otro servidor.',4);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Sergio_Dash','710976587490656256','Desconocida.',5);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Fernando_Josue','1334727345717772328','Abandonar sin presentar renuncia.',6);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Judas_Perverse','664495871047499799 / 1243981574756630622','Desconocida.',7);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('@satoru_es','No figura','Desconocida.',8);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Franco_Szchweitzer','1247709460818825286','SAPD en otro servidor.',9);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Shaggy_Arizmendi','Ultimo Nick: Shaggy.o','Baneado por estafa.',10);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Massimo_Estrada','No figura','Abandonar sin presentar renuncia.',11);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('@mariana185783','No figura','SAPD y STAFF en otro servidor.',12);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('John_Kings','1221527650665762956','Abandonar sin presentar renuncia.',13);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Daren_Santos / Daren_Jaramillo','1129962062538362920 / 1312532944656797738','Uso de cheats y MC.',14);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Fritz_Knight','1291178044534296708','Desconocida.',15);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Andres_Kholyng [@jhonatanandres]','1098696220546973807','Multicuentas.',16);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Ghunter_Raymonds','921537562533822474','Uso de cheats.',17);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Monkey_Luffy','No figura','Cuenta baneada.',18);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Nelson_Puentes [@Onlymaxyt]','1451306603260149780 / 1257014196294516839','Sin especificar.',19);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Lian_Cooronel','1424468060168785942','Uso de cheats.',20);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Tra_Ficante (@hvs._. )','No existe','Abuso Administrativo.',21);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('@czt1499','No figura','Abandonar sin presentar renuncia.',22);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Celestia_Ludenberg','1433910175839813774','Cuenta baneada.',23);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Zeki_Rein','1062879832993697925','SPAM.',24);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Ben_Sex','1036647531230273546','Sin especificar.',25);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Lastik_Sex','509357217065992192','Sin especificar.',26);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Maxi_Martinez','702857278625153115','Anti-Rol Masivo.',27);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Sheyla_Garcia','1307457562186219573','Anti-Rol.',28);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Mila_Lampard','977345897031684126','Anti-Rol Masivo.',29);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Liz_Zarev','No figura','Anti-Rol.',30);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Alisson_Fiore (@rdavid_44)','No figura','Sin especificar.',31);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Abby_Suyende','880607170654257214','Abandonar sin presentar renuncia.',32);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Alexia_Martinez (@trrekker)','No figura','Abandonar sin presentar renuncia.',33);
insert into public.vetados (nombre, discord_id, motivo, orden) values ('Shanise_Winehouse','1462558600521187455','Abandonar sin presentar renuncia.',34);