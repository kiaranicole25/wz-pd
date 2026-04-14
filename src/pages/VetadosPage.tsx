import NavBar from '@/components/NavBar';
import PasswordGate from '@/components/PasswordGate';
import { defaultVetados } from '@/data/officers';

const VETADOS_PASSWORD = 'Deptosapd2026';

const VetadosPage = () => {
  const handleAuth = (_username: string, password: string) => {
    return password === VETADOS_PASSWORD;
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <PasswordGate
          title="Administración SAPD — Ingrese la contraseña del Departamento"
          onAuth={handleAuth}
        >
          <div className="bg-accent-bar h-[2px] mb-8" />
          <div className="mb-8">
            <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">
              Personal Vetado — SAPD
            </h1>
          </div>

          <div className="veto-header grid grid-cols-[1fr_1fr_2fr] px-5 py-3 border-l-4 border-gold">
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Nombre DP</span>
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Discord ID</span>
            <span className="text-gold text-xs font-bold tracking-widest uppercase">Motivo</span>
          </div>

          {defaultVetados.map((v, i) => (
            <div
              key={v.id}
              className={`grid grid-cols-[1fr_1fr_2fr] px-5 py-3 border-b border-border ${i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'}`}
            >
              <span className="text-value text-sm">{v.nombre}</span>
              <span className="text-value text-sm font-mono">{v.discordId}</span>
              <span className="text-value text-sm">{v.motivo}</span>
            </div>
          ))}

          {defaultVetados.length === 0 && (
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
