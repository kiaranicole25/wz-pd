import { useState } from 'react';
import NavBar from '@/components/NavBar';
import PasswordGate from '@/components/PasswordGate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Vetado {
  id: string;
  nombre: string;
  discordId: string;
  motivo: string;
}

const CREDENTIALS = [
  { user: 'Mike_Holloway', pass: 'mike0000' },
  { user: 'Kendo_Lockser', pass: 'kendo1111' },
];

const VetadosPage = () => {
  const [vetados, setVetados] = useState<Vetado[]>(() => {
    const saved = localStorage.getItem('sapd-vetados');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', discordId: '', motivo: '' });

  const saveVetados = (list: Vetado[]) => {
    setVetados(list);
    localStorage.setItem('sapd-vetados', JSON.stringify(list));
  };

  const addVetado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.discordId || !form.motivo) return;
    const newVetado: Vetado = {
      id: Date.now().toString(),
      nombre: form.nombre,
      discordId: form.discordId,
      motivo: form.motivo,
    };
    saveVetados([...vetados, newVetado]);
    setForm({ nombre: '', discordId: '', motivo: '' });
    setShowForm(false);
  };

  const removeVetado = (id: string) => {
    saveVetados(vetados.filter((v) => v.id !== id));
  };

  const handleAuth = (username: string, password: string) => {
    return CREDENTIALS.some((c) => c.user === username && c.pass === password);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PasswordGate
          title="Administración SAPD - Ingrese sus credenciales"
          showUsername
          onAuth={handleAuth}
        >
          {/* Vetados Content */}
          <div className="veto-gradient h-2 rounded-full mb-6" />
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-wider" style={{ color: 'hsl(0 65% 50%)' }}>
              🚫 Personal Vetado — SAPD
            </h1>
            <Button onClick={() => setShowForm(!showForm)} className="gold-gradient text-primary-foreground font-bold text-sm">
              {showForm ? 'Cancelar' : '+ Agregar Vetado'}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={addVetado} className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
              <h3 className="text-gold font-bold mb-4">Agregar Vetado</h3>
              <div className="grid gap-3">
                <Input
                  placeholder="Nombre_Apellido"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="bg-muted border-border"
                />
                <Input
                  placeholder="Discord ID"
                  value={form.discordId}
                  onChange={(e) => setForm({ ...form, discordId: e.target.value })}
                  className="bg-muted border-border"
                />
                <Input
                  placeholder="Motivo"
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  className="bg-muted border-border"
                />
                <Button type="submit" className="gold-gradient text-primary-foreground font-bold">
                  Confirmar
                </Button>
              </div>
            </form>
          )}

          {vetados.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground italic">No hay personal vetado registrado actualmente.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {vetados.map((v) => (
                <div key={v.id} className="bg-card border border-border rounded-lg p-4 animate-fade-in relative group">
                  <button
                    onClick={() => removeVetado(v.id)}
                    className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity text-sm hover:underline"
                  >
                    ✕ Eliminar
                  </button>
                  <p><span className="font-semibold" style={{ color: 'hsl(0 65% 50%)' }}>Número EXP (Discord ID):</span> <span className="text-foreground">{v.discordId}</span></p>
                  <p><span className="font-semibold" style={{ color: 'hsl(0 65% 50%)' }}>Nombre DP:</span> <span className="text-foreground">{v.nombre}</span></p>
                  <p><span className="font-semibold" style={{ color: 'hsl(0 65% 50%)' }}>Motivo:</span> <span className="text-foreground">{v.motivo}</span></p>
                </div>
              ))}
            </div>
          )}
          <div className="veto-gradient h-2 rounded-full mt-6" />
        </PasswordGate>
      </div>
    </div>
  );
};

export default VetadosPage;
