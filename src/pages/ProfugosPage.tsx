import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import ProfugoCard from '@/components/ProfugoCard';
import ProfugoFormDialog from '@/components/ProfugoFormDialog';
import { useAdmin } from '@/context/AdminContext';
import { useProfugos, ProfugoRow } from '@/hooks/useProfugos';
import { supabase } from '@/integrations/supabase/client';
import { logAction } from '@/lib/audit';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, ShieldAlert } from 'lucide-react';

const ProfugosPage = () => {
  const { can, role, username } = useAdmin();
  const canEdit = can('profugos' as never);
  const { data: profugos = [], isLoading } = useProfugos();
  const qc = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProfugoRow | null>(null);
  const [deleting, setDeleting] = useState<ProfugoRow | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (p: ProfugoRow) => {
      const { error } = await supabase.from('profugos').delete().eq('id', p.id);
      if (error) throw error;
      if (role) await logAction({ username, role }, 'profugos' as never, 'borrar',
        `Eliminó prófugo: ${p.nombre} (${p.numero_procesamiento})`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profugos'] });
      toast({ title: 'Prófugo eliminado' });
      setDeleting(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const guard = (fn: () => void) => {
    if (!canEdit) {
      toast({ title: 'No tienes permisos suficientes', variant: 'destructive' });
      return;
    }
    fn();
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="border border-border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-[90px] h-[90px] bg-[#0a1f4d] border-2 border-[hsl(48_100%_50%)] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-14 h-14 text-[hsl(48_100%_50%)]" />
            </div>
            <div className="flex-1">
              <h1 className="text-gold font-bold text-2xl tracking-[0.3em] mb-2">PRÓFUGOS DE LA JUSTICIA</h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase mb-4">
                San Andreas Most Wanted — "Bring them in"
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Lista oficial de prófugos buscados por el Departamento de Policía de San Andreas. Cualquier ciudadano
                con información sobre el paradero de las personas listadas debe contactar de inmediato a la autoridad
                policial más cercana.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-accent-bar h-[2px] mb-10" />

        {canEdit && (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => guard(() => { setEditing(null); setFormOpen(true); })} className="gap-2">
              <Plus className="w-4 h-4" /> Agregar prófugo
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {!isLoading && profugos.length === 0 && (
          <div className="border border-border p-10 text-center">
            <p className="text-muted-foreground text-sm tracking-wider uppercase">
              No hay prófugos registrados actualmente
            </p>
          </div>
        )}

        {!isLoading && profugos.map((p) => (
          <ProfugoCard
            key={p.id}
            profugo={p}
            canEdit={canEdit}
            onEdit={(o) => guard(() => { setEditing(o); setFormOpen(true); })}
            onDelete={(o) => guard(() => setDeleting(o))}
          />
        ))}
      </div>

      <ProfugoFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {deleting?.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && deleteMutation.mutate(deleting)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfugosPage;
