import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

  const saveNoticias = (list: Noticia[]) => {
    setNoticias(list);
    localStorage.setItem('sapd-noticias', JSON.stringify(list));
  };

  const handleAddClick = () => {
    if (authenticated) {
      setShowForm(true);
    } else {
      setShowForm(true);
    }
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

  const removeNoticia = (id: string) => {
    saveNoticias(noticias.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bar-pattern w-full h-2 rounded-full mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gold text-2xl font-bold tracking-wider">📰 Noticias SAPD</h1>
          <Button onClick={handleAddClick} className="gold-gradient text-primary-foreground font-bold text-sm">
            + Añadir Noticia
          </Button>
        </div>

        {showForm && !authenticated && (
          <form onSubmit={handlePassSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-gold font-bold mb-4 text-center">🔒 Ingrese la Contraseña Administración RR-PP</h3>
            <Input
              type="password"
              placeholder="Contraseña"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="bg-muted border-border mb-3"
            />
            {passError && <p className="text-destructive text-sm text-center mb-3">❌ {passError}</p>}
            <Button type="submit" className="w-full gold-gradient text-primary-foreground font-bold">Ingresar</Button>
          </form>
        )}

        {showForm && authenticated && (
          <form onSubmit={addNoticia} className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-gold font-bold mb-4">Crear Noticia</h3>
            <div className="grid gap-3">
              <Input
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="bg-muted border-border"
              />
              <Textarea
                placeholder="Desarrollo"
                value={form.desarrollo}
                onChange={(e) => setForm({ ...form, desarrollo: e.target.value })}
                className="bg-muted border-border min-h-[120px]"
              />
              <Input
                placeholder="URL de imagen (opcional)"
                value={form.imagen}
                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                className="bg-muted border-border"
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 gold-gradient text-primary-foreground font-bold">Publicar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          </form>
        )}

        {noticias.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground italic">No hay noticias publicadas aún.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {noticias.map((n) => (
              <article key={n.id} className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in relative group">
                <button
                  onClick={() => removeNoticia(n.id)}
                  className="absolute top-3 right-3 z-10 bg-destructive/80 text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {n.imagen && (
                  <img src={n.imagen} alt={n.titulo} loading="lazy" className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{n.fecha}</p>
                  <h2 className="text-gold font-bold text-xl mb-2">{n.titulo}</h2>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{n.desarrollo}</p>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="bar-pattern w-full h-2 rounded-full mt-8" />
      </div>
    </div>
  );
};

export default NoticiasPage;
