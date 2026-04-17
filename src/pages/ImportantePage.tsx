import NavBar from '@/components/NavBar';

interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

const avisos: Aviso[] = [
  {
    id: 'default-2',
    titulo: 'Registro de Zonas Rojas Disponible',
    contenido: 'Se informa a todo el personal que se ha añadido el registro oficial de Zonas Rojas del Departamento en el apartado de Información Pública.\n\nConsulte el mapa y las indicaciones en: https://wz-pd.lovable.app/noticias',
    fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
  },
  {
    id: 'default-1',
    titulo: 'Nueva Plataforma Web del Departamento SAPD',
    contenido: 'Se informa a todo el personal del Departamento de Policía de San Andreas que a partir de la fecha se ha implementado una nueva plataforma web oficial para la gestión y consulta de información institucional. Esta herramienta centraliza la jerarquía del departamento, el registro de personal vetado, noticias internas y avisos importantes. Se solicita a todos los miembros familiarizarse con el sistema y reportar cualquier inconveniente a la División Administrativa.',
    fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
  },
];

const ImportantePage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="mb-8">
          <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">Avisos Importantes — SAPD</h1>
        </div>

        <div className="grid gap-5">
          {avisos.map((a) => (
            <div key={a.id} className="border border-border p-6">
              <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">{a.fecha}</p>
              <h2 className="text-gold font-bold text-base tracking-wider mb-3">{a.titulo}</h2>
              <p className="text-value text-sm leading-relaxed whitespace-pre-wrap">{a.contenido}</p>
            </div>
          ))}
        </div>

        <div className="bg-accent-bar h-[2px] mt-10" />
      </div>
    </div>
  );
};

export default ImportantePage;
