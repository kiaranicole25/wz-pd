import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Aviso {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

const AVISO_PASSWORD = 'avisossapd2026mikekendo';

const defaultAviso: Aviso = {
  id: 'default-1',
  titulo: '🆕 Nueva Plataforma Web del Departamento SAPD',
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

  const saveAvisos = (list: Aviso[]) => {
    setAvisos(list);
    localStorage.setItem('sapd-avisos', JSON.stringify(list));
  };

  const handleAddClick = () => {
    setShowForm(true);
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

  const removeAviso = (id: string) => {
    saveAvisos(avisos.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bar-pattern w-full h-2 rounded-full mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gold text-2xl font-bold tracking-wider">⚠️ Avisos Importantes — SAPD</h1>
          <Button onClick={handleAddClick} className="gold-gradient text-primary-foreground font-bold text-sm">
            + Crear Aviso
          </Button>
        </div>

        {showForm && !authenticated && (
          <form onSubmit={handlePassSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-gold font-bold mb-4 text-center">🔒 Ingrese la Contraseña para Crear Avisos</h3>
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
          <form onSubmit={addAviso} className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-gold font-bold mb-4">Crear Aviso</h3>
            <div className="grid gap-3">
              <Input
                placeholder="Título del aviso"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="bg-muted border-border"
              />
              <Textarea
                placeholder="Contenido del aviso"
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                className="bg-muted border-border min-h-[120px]"
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 gold-gradient text-primary-foreground font-bold">Publicar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </div>
          </form>
        )}

        <div className="grid gap-5">
          {avisos.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-6 animate-fade-in relative group">
              <button
                onClick={() => removeAviso(a.id)}
                className="absolute top-3 right-3 bg-destructive/80 text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <p className="text-xs text-muted-foreground mb-2">{a.fecha}</p>
              <h2 className="text-gold font-bold text-lg mb-3">{a.titulo}</h2>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{a.contenido}</p>
            </div>
          ))}
        </div>
        <div className="bar-pattern w-full h-2 rounded-full mt-8" />
      </div>
    </div>
  );
};

export default ImportantePage;
