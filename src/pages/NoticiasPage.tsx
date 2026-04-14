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
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">Información Pública de SAPD</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            + Añadir Publicación
          </button>
        </div>

        {showForm && !authenticated && (
          <form onSubmit={handlePassSubmit} className="border-2 border-gold p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-gold font-bold text-xs tracking-[0.15em] uppercase mb-5 text-center">
              Ingrese la Contraseña Administración RR-PP
            </h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono mb-4"
            />
            {passError && <p className="text-destructive text-xs text-center mb-4 tracking-wider uppercase">✕ {passError}</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90">Ingresar</button>
          </form>
        )}

        {showForm && authenticated && (
          <form onSubmit={addNoticia} className="border border-border p-6 mb-8">
            <h3 className="text-gold font-bold text-xs tracking-[0.2em] uppercase mb-5">Crear Publicación</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-gold text-xs font-bold tracking-wider uppercase mb-1 block">Título</label>
                <input placeholder="Título de la publicación" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
              </div>
              <div>
                <label className="text-gold text-xs font-bold tracking-wider uppercase mb-1 block">Desarrollo</label>
                <textarea placeholder="Contenido de la publicación" value={form.desarrollo} onChange={(e) => setForm({ ...form, desarrollo: e.target.value })} className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono min-h-[120px] resize-y" />
              </div>
              <div>
                <label className="text-gold text-xs font-bold tracking-wider uppercase mb-1 block">URL de Imagen</label>
                <input placeholder="https://ejemplo.com/imagen.png (opcional)" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90">Publicar</button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-border text-muted-foreground text-sm px-5 py-2.5 hover:text-foreground transition-colors">Cancelar</button>
              </div>
            </div>
          </form>
        )}

        {noticias.length === 0 ? (
          <div className="border border-border p-10 text-center">
            <p className="text-muted-foreground text-sm tracking-wider uppercase">No hay publicaciones aún.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {noticias.map((n) => (
              <article key={n.id} className="border border-border relative group">
                <button
                  onClick={() => { setDeleteTarget(n.id); setDeletePass(''); setDeleteError(''); }}
                  className="absolute top-3 right-3 z-10 text-destructive text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity border border-destructive px-3 py-1"
                >
                  ✕ Borrar
                </button>
                {n.imagen && (
                  <img src={n.imagen} alt={n.titulo} loading="lazy" className="w-full h-52 object-cover border-b border-border" />
                )}
                <div className="p-6">
                  <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">{n.fecha}</p>
                  <h2 className="text-gold font-bold text-base tracking-wider mb-3">{n.titulo}</h2>
                  <p className="text-value text-sm leading-relaxed whitespace-pre-wrap">{n.desarrollo}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <form onSubmit={handleDelete} className="border-2 border-gold p-6 w-full max-w-md bg-background">
              <h3 className="text-gold font-bold text-xs tracking-[0.15em] uppercase mb-5 text-center">
                Ingrese la contraseña para borrar
              </h3>
              <input
                type="password"
                placeholder="Contraseña"
                value={deletePass}
                onChange={(e) => setDeletePass(e.target.value)}
                className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono mb-4"
                autoFocus
              />
              {deleteError && <p className="text-destructive text-xs text-center mb-4 tracking-wider uppercase">✕ {deleteError}</p>}
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-destructive text-destructive-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90">Confirmar</button>
                <button type="button" onClick={() => setDeleteTarget(null)} className="border border-border text-muted-foreground text-sm px-5 py-2.5 hover:text-foreground">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-accent-bar h-[2px] mt-10" />
      </div>
    </div>
  );
};

export default NoticiasPage;
