import NavBar from '@/components/NavBar';

interface Publicacion {
  id: string;
  titulo: string;
  desarrollo: string;
  imagen: string;
}

const publicaciones: Publicacion[] = [
  {
    id: '1',
    titulo: 'Zonas Rojas - Departamento de Policías',
    desarrollo: 'T: Territorios.\nF: Fábricas.\n\nNota al usuario: Los territorios (T) solo serán considerados Zonas Rojas si hay una conquista activa.',
    imagen: 'https://i.ibb.co/chMtCfqS/Zonas-Rojas-SAPDWZ.png',
  },
];

const NoticiasPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="mb-8">
          <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">Información Pública de SAPD</h1>
        </div>

        <div className="grid gap-5">
          {publicaciones.map((n) => (
            <article key={n.id} className="border border-border">
              <div className="p-6">
                <h2 className="text-gold font-bold text-base tracking-wider mb-3">{n.titulo}</h2>
                <p className="text-value text-sm leading-relaxed whitespace-pre-wrap mb-4">{n.desarrollo}</p>
              </div>
              {n.imagen && (
                <img src={n.imagen} alt={n.titulo} loading="lazy" className="w-full object-contain border-t border-border" />
              )}
            </article>
          ))}
        </div>

        <div className="bg-accent-bar h-[2px] mt-10" />
      </div>
    </div>
  );
};

export default NoticiasPage;
