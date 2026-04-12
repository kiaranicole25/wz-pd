import { useState } from 'react';
import NavBar from '@/components/NavBar';
import PasswordGate from '@/components/PasswordGate';
import { defaultVetados, type Vetado } from '@/data/officers';

const CREDENTIALS = [
  { user: 'Mike_Holloway', pass: 'mike0000' },
  { user: 'Kendo_Lockser', pass: 'kendo1111' },
];

const VetadosPage = () => {
  const [vetados, setVetados] = useState<Vetado[]>(() => {
    const saved = localStorage.getItem('sapd-vetados');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    localStorage.setItem('sapd-vetados', JSON.stringify(defaultVetados));
    return defaultVetados;
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PasswordGate
          title="Administración SAPD — Ingrese sus credenciales"
          showUsername
          onAuth={handleAuth}
        >
          <div className="bg-accent-bar h-[2px] mb-6" />
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-gold text-sm font-bold tracking-[0.3em] uppercase">
              Personal Vetado — SAPD
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:opacity-90 transition-opacity"
            >
              {showForm ? 'Cancelar' : '+ Agregar Vetado'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={addVetado} className="border border-border p-5 mb-6">
              <h3 className="text-gold font-bold text-[10px] tracking-[0.2em] uppercase mb-4">Agregar Vetado</h3>
              <div className="grid gap-3">
                <input placeholder="Nombre_Apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono" />
                <input placeholder="Discord ID" value={form.discordId} onChange={(e) => setForm({ ...form, discordId: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono" />
                <input placeholder="Motivo" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className="bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary font-mono" />
                <button type="submit" className="bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase py-2 hover:opacity-90">Confirmar</button>
              </div>
            </form>
          )}

          {/* Table header */}
          <div className="veto-header grid grid-cols-[1fr_1fr_2fr] px-4 py-2 border-l-4 border-gold">
            <span className="text-gold text-[10px] font-bold tracking-widest uppercase">Nombre DP</span>
            <span className="text-gold text-[10px] font-bold tracking-widest uppercase">Discord ID</span>
            <span className="text-gold text-[10px] font-bold tracking-widest uppercase">Motivo</span>
          </div>

          {vetados.map((v, i) => (
            <div
              key={v.id}
              className={`grid grid-cols-[1fr_1fr_2fr] px-4 py-2.5 border-b border-border group relative ${i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'}`}
            >
              <span className="text-value text-[11px]">{v.nombre}</span>
              <span className="text-value text-[11px] font-mono">{v.discordId}</span>
              <span className="text-value text-[11px] pr-6">{v.motivo}</span>
              <button
                onClick={() => removeVetado(v.id)}
                className="absolute top-1 right-2 text-destructive text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}

          {vetados.length === 0 && (
            <div className="border border-border p-8 text-center">
              <p className="text-muted-foreground text-[10px] tracking-wider uppercase">No hay personal vetado registrado.</p>
            </div>
          )}
          <div className="bg-accent-bar h-[2px] mt-6" />
        </PasswordGate>
      </div>
    </div>
  );
};

export default VetadosPage;
