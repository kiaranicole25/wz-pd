import { useState } from 'react';
import NavBar from '@/components/NavBar';

interface Noticia {
  id: string;
  titulo: string;
  desarrollo: string;
  imagen: string;
  fecha: string;
}

const NEWS_PASSWORD = 'rrppsapd2026';

const NoticiasPage = () => {
  const [noticias, setNoticias] = useState<Noticia[]>(() => {
    const saved = localStorage.getItem('sapd-noticias');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');
  const [form, setForm] = useState({ titulo: '', desarrollo: '', imagen: '' });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletePass, setDeletePass] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const saveNoticias = (list: Noticia[]) => {
    setNoticias(list);
    localStorage.setItem('sapd-noticias', JSON.stringify(list));
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === NEWS_PASSWORD) {
      setAuthenticated(true);
      setPassError('');
    } else {
      setPassError('Acceso denegado');
    }
  };

  const addNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.desarrollo) return;
    const noticia: Noticia = {
      id: Date.now().toString(),
      titulo: form.titulo,
      desarrollo: form.desarrollo,
      imagen: form.imagen,
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    saveNoticias([noticia, ...noticias]);
    setForm({ titulo: '', desarrollo: '', imagen: '' });
    setShowForm(false);
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePass === NEWS_PASSWORD && deleteTarget) {
      saveNoticias(noticias.filter((n) => n.id !== deleteTarget));
      setDeleteTarget(null);
      setDeletePass('');
      setDeleteError('');
    } else {
      setDeleteError('Acceso denegado');
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-accent-bar h-[2px] mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gold text-sm font-bold tracking-[0.3em] uppercase">Noticias SAPD</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:opacity-90 transition-opacity"
          >
            + Añadir Noticia
          </button>
        </div>

        {showForm && !authenticated && (
          <form onSubmit={handlePassSubmit} className="border-2 border-gold p-5 mb-6 max-w-sm mx-auto">
            <h3 className="text-gold font-bold text-[10px] tracking-[0.15em] uppercase mb-4 text-center">
              Ingrese la Contraseña Administración RR-PP
            </h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono mb-3"
            />
            {passError && <p className="text-destructive text-[10px] text-center mb-3 tracking-wider uppercase">✕ {passError}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase py-2 hover:opacity-90">Ingresar</button>
          </form>
        )}

        {showForm && authenticated && (
          <form onSubmit={addNoticia} className="border border-border p-5 mb-6">
            <h3 className="text-gold font-bold text-[10px] tracking-[0.2em] uppercase mb-4">Crear Noticia</h3>
            <div className="grid gap-3">
              <input placeholder="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono" />
              <textarea placeholder="Desarrollo" value={form.desarrollo} onChange={(e) => setForm({ ...form, desarrollo: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono min-h-[100px] resize-y" />
              <input placeholder="URL de imagen (opcional)" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase py-2 hover:opacity-90">Publicar</button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-border text-muted-foreground text-xs px-4 py-2 hover:text-foreground transition-colors">Cancelar</button>
              </div>
            </div>
          </form>
        )}

        {noticias.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">No hay noticias publicadas aún.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {noticias.map((n) => (
              <article key={n.id} className="border border-border relative group">
                <button
                  onClick={() => { setDeleteTarget(n.id); setDeletePass(''); setDeleteError(''); }}
                  className="absolute top-2 right-2 z-10 text-destructive text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity border border-destructive px-2 py-0.5"
                >
                  ✕ Borrar
                </button>
                {n.imagen && (
                  <img src={n.imagen} alt={n.titulo} loading="lazy" className="w-full h-44 object-cover border-b border-border" />
                )}
                <div className="p-5">
                  <p className="text-[9px] text-muted-foreground tracking-wider uppercase mb-1">{n.fecha}</p>
                  <h2 className="text-gold font-bold text-sm tracking-wider mb-2">{n.titulo}</h2>
                  <p className="text-value text-[11px] leading-relaxed whitespace-pre-wrap">{n.desarrollo}</p>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="bg-accent-bar h-[2px] mt-8" />
      </div>
    </div>
  );
};

export default NoticiasPage;
