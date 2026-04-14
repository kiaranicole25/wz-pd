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
      <div className="max-w-5xl mx-auto px-6 py-10">
        <PasswordGate
          title="Administración SAPD — Ingrese las credenciales que le asignaron en el Departamento"
          showUsername
          onAuth={handleAuth}
        >
          <div className="bg-accent-bar h-[2px] mb-8" />
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">
              Personal Vetado — SAPD
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              {showForm ? 'Cancelar' : '+ Agregar Vetado'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={addVetado} className="border border-border p-6 mb-8">
              <h3 className="text-gold font-bold text-xs tracking-[0.2em] uppercase mb-5">Agregar Vetado</h3>
              <div className="grid gap-4">
                <input placeholder="Nombre_Apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
                <input placeholder="Discord ID" value={form.discordId} onChange={(e) => setForm({ ...form, discordId: e.target.value })} className="bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
                <input placeholder="Motivo" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className="bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono" />
                <button type="submit" className="bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90">Confirmar</button>
              </div>
            </form>
          )}

          {/* Table header */}
          <div className="veto-header grid grid-cols-[1fr_1fr_2fr] px-5 py-3 border-l-4 border-gold">
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Nombre DP</span>
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Discord ID</span>
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Motivo</span>
          </div>

          {vetados.map((v, i) => (
            <div
              key={v.id}
              className={`grid grid-cols-[1fr_1fr_2fr] px-5 py-3 border-b border-border group relative ${i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'}`}
            >
              <span className="text-value text-sm">{v.nombre}</span>
              <span className="text-value text-sm font-mono">{v.discordId}</span>
              <span className="text-value text-sm pr-8">{v.motivo}</span>
              <button
                onClick={() => removeVetado(v.id)}
                className="absolute top-2 right-3 text-destructive text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}

          {vetados.length === 0 && (
            <div className="border border-border p-10 text-center">
              <p className="text-muted-foreground text-sm tracking-wider uppercase">No hay personal vetado registrado.</p>
            </div>
          )}
          <div className="bg-accent-bar h-[2px] mt-8" />
        </PasswordGate>
      </div>
    </div>
  );
};

export default VetadosPage;
