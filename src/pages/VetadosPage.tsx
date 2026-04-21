import { useState } from 'react';
import NavBar from '@/components/NavBar';
import PasswordGate from '@/components/PasswordGate';
import VetadoFormDialog from '@/components/VetadoFormDialog';
import { useAdmin } from '@/context/AdminContext';
import { useVetados, VetadoRow } from '@/hooks/useSAPDData';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { logAction } from '@/lib/audit';
import { Loader2, Pencil, Plus } from 'lucide-react';

const VETADOS_PASSWORD = 'Deptosapd2026';

const VetadosPageInner = () => {
  const { can } = useAdmin();
  const canVet = can('vetados');
  const { data: vetados = [], isLoading } = useVetados();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VetadoRow | null>(null);

  const nextOrden = vetados.length
    ? Math.max(...vetados.map((v) => v.orden)) + 1
    : 1;

  const guard = (fn: () => void) => {
    if (!canVet) {
      toast({ title: 'No tienes permisos suficientes', variant: 'destructive' });
      return;
    }
    fn();
  };

  return (
    <>
      <div className="bg-accent-bar h-[2px] mb-8" />
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">
          Personal Vetado — SAPD
        </h1>
        {canVet && (
          <Button onClick={() => guard(() => { setEditing(null); setFormOpen(true); })} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar vetado
          </Button>
        )}
      </div>

      <div
        className={`veto-header grid ${
          canVet ? 'grid-cols-[1fr_1fr_2fr_auto]' : 'grid-cols-[1fr_1fr_2fr]'
        } px-5 py-3 border-l-4 border-gold gap-2`}
      >
        <span className="text-gold text-xs font-bold tracking-widest uppercase">Nombre DP</span>
        <span className="text-gold text-xs font-bold tracking-widest uppercase">Discord ID</span>
        <span className="text-gold text-xs font-bold tracking-widest uppercase">Motivo</span>
        {canVet && <span className="w-10" />}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      )}

      {vetados.map((v, i) => (
        <div
          key={v.id}
          className={`grid ${
            canVet ? 'grid-cols-[1fr_1fr_2fr_auto]' : 'grid-cols-[1fr_1fr_2fr]'
          } px-5 py-3 border-b border-border gap-2 items-center ${
            i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'
          }`}
        >
          <span className="text-value text-sm">{v.nombre}</span>
          <span className="text-value text-sm font-mono break-all">{v.discord_id}</span>
          <span className="text-value text-sm">{v.motivo}</span>
          {canVet && (
            <button
              onClick={() => guard(() => { setEditing(v); setFormOpen(true); })}
              className="p-2 border border-gold text-gold hover:bg-gold hover:text-background transition-colors"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {!isLoading && vetados.length === 0 && (
        <div className="border border-border p-10 text-center">
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            No hay personal vetado registrado.
          </p>
        </div>
      )}
      <div className="bg-accent-bar h-[2px] mt-8" />

      <VetadoFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        nextOrden={nextOrden}
      />
    </>
  );
};

const VetadosPage = () => {
  const { isAdmin, role, username } = useAdmin();
  const [cupulaConfirmed, setCupulaConfirmed] = useState(false);
  const handleAuth = (_username: string, password: string) =>
    password === VETADOS_PASSWORD;

  const handleConfirmCupula = async () => {
    setCupulaConfirmed(true);
    if (role) {
      await logAction(
        { username, role },
        'vetados',
        'crear',
        `${username} visitó la lista de vetados`,
      );
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {role === 'encargado' || (role === 'cupula' && cupulaConfirmed) ? (
          <VetadosPageInner />
        ) : role === 'cupula' ? (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="border-2 border-gold w-full max-w-md p-8 text-center">
              <h2 className="text-gold font-bold text-sm tracking-[0.2em] mb-6 uppercase">
                ¿Quieres ver los vetados?
              </h2>
              <p className="text-muted-foreground text-xs mb-8 tracking-wider">
                Tu visita quedará registrada en los logs.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleConfirmCupula} className="flex-1">
                  Sí
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        ) : isAdmin ? (
          <VetadosPageInner />
        ) : (
          <PasswordGate
            title="Administración SAPD — Ingrese la contraseña del Departamento"
            onAuth={handleAuth}
          >
            <VetadosPageInner />
          </PasswordGate>
        )}
      </div>
    </div>
  );
};

export default VetadosPage;
