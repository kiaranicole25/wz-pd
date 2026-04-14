import { useState } from 'react';
import NavBar from '@/components/NavBar';

interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

const AVISO_PASSWORD = 'avisossapd2026mikekendo';

const defaultAviso: Aviso = {
  id: 'default-1',
  titulo: 'Nueva Plataforma Web del Departamento SAPD',
  contenido: 'Se informa a todo el personal del Departamento de Policía de San Andreas que a partir de la fecha se ha implementado una nueva plataforma web oficial para la gestión y consulta de información institucional. Esta herramienta centraliza la jerarquía del departamento, el registro de personal vetado, noticias internas y avisos importantes. Se solicita a todos los miembros familiarizarse con el sistema y reportar cualquier inconveniente a la División Administrativa.',
  fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
};

const ImportantePage = () => {
  const [avisos, setAvisos] = useState<Aviso[]>(() => {
    const saved = localStorage.getItem('sapd-avisos');
    return saved ? JSON.parse(saved) : [defaultAviso];
  });
  const [showForm, setShowForm] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');
  const [form, setForm] = useState({ titulo: '', contenido: '' });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletePass, setDeletePass] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const saveAvisos = (list: Aviso[]) => {
    setAvisos(list);
    localStorage.setItem('sapd-avisos', JSON.stringify(list));
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === AVISO_PASSWORD) {
      setAuthenticated(true);
      setPassError('');
    } else {
      setPassError('Acceso denegado');
    }
  };

  const addAviso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.contenido) return;
    const aviso: Aviso = {
      id: Date.now().toString(),
      titulo: form.titulo,
      contenido: form.contenido,
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    saveAvisos([aviso, ...avisos]);
    setForm({ titulo: '', contenido: '' });
    setShowForm(false);
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePass === AVISO_PASSWORD && deleteTarget) {
      saveAvisos(avisos.filter((a) => a.id !== deleteTarget));
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
        <div className="mb-8">
          <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">Avisos Importantes — SAPD</h1>
        </div>

        {showForm && !authenticated && (
          <form onSubmit={handlePassSubmit} className="border-2 border-gold p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-gold font-bold text-xs tracking-[0.15em] uppercase mb-5 text-center">
              Ingrese la Contraseña para Crear Avisos
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
          <form onSubmit={addAviso} className="border border-border p-6 mb-8">
            <h3 className="text-gold font-bold text-xs tracking-[0.2em] uppercase mb-5">Crear Aviso</h3>
            <div className="grid gap-4">
              <input placeholder="Título del aviso" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
              <textarea placeholder="Contenido del aviso" value={form.contenido} onChange={(e) => setForm({ ...form, contenido: e.target.value })} className="bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono min-h-[120px] resize-y" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90">Publicar</button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-border text-muted-foreground text-sm px-5 py-2.5 hover:text-foreground transition-colors">Cancelar</button>
              </div>
            </div>
          </form>
        )}

        <div className="grid gap-5">
          {avisos.map((a) => (
            <div key={a.id} className="border border-border p-6 relative group">
              <button
                onClick={() => { setDeleteTarget(a.id); setDeletePass(''); setDeleteError(''); }}
                className="absolute top-3 right-3 text-destructive text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity border border-destructive px-3 py-1"
              >
                ✕ Borrar
              </button>
              <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">{a.fecha}</p>
              <h2 className="text-gold font-bold text-base tracking-wider mb-3">{a.titulo}</h2>
              <p className="text-value text-sm leading-relaxed whitespace-pre-wrap">{a.contenido}</p>
            </div>
          ))}
        </div>

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

export default ImportantePage;
