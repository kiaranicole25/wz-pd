import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import OfficerCard from '@/components/OfficerCard';
import PersonalFormDialog from '@/components/PersonalFormDialog';
import { useAdmin } from '@/context/AdminContext';
import { useRangos, usePersonal, PersonalRow } from '@/hooks/useSAPDData';
import { supabase } from '@/integrations/supabase/client';
import { logAction } from '@/lib/audit';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const SAPDPage = () => {
  const { can, role, username } = useAdmin();
  const canSAPD = can('sapd');
  const { data: rangos = [] } = useRangos();
  const { data: personal = [], isLoading } = usePersonal();
  const qc = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PersonalRow | null>(null);
  const [deleting, setDeleting] = useState<PersonalRow | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (p: PersonalRow) => {
      const { error } = await supabase.from('personal').delete().eq('id', p.id);
      if (error) throw error;
      await logAction(
        { username, role: role! },
        'sapd',
        'borrar',
        `Eliminó SAPD: ${p.nombre} (${p.expediente})`,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['personal'] });
      toast({ title: 'Personal eliminado' });
      setDeleting(null);
    },
    onError: (e: Error) =>
      toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const guard = (fn: () => void) => {
    if (!canSAPD) {
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
            <img src={LOGO_URL} alt="SAPD" width={90} height={90} className="shrink-0" />
            <div className="flex-1">
              <h1 className="text-gold font-bold text-2xl tracking-[0.3em] mb-2">SAPD</h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase mb-4">
                Law Enforcement Record & Police Blacklist — "To Protect and to Serve"
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bienvenido a la Base de Datos Oficial de Jerarquía del Departamento de Policía de San Andreas (SAPD).
                En esta sección se encuentra centralizada y vinculada toda la información correspondiente al personal policial
                que ha prestado o presta servicio en cualquiera de las dependencias del Estado.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-accent-bar h-[2px] mb-10" />

        {canSAPD && (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => guard(() => { setEditing(null); setFormOpen(true); })} className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar personal
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {!isLoading &&
          rangos.map((rango) => {
            const officers = personal.filter((p) => p.rango_id === rango.id);
            return (
              <div key={rango.id} className="mb-8">
                <div className="bg-header px-5 py-3 border-l-4 border-gold">
                  <h2 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">
                    ★ {rango.label}
                  </h2>
                </div>
                <div className="border border-t-0 border-border px-5">
                  {officers.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8 tracking-wider uppercase">
                      Sin personal asignado actualmente
                    </p>
                  ) : (
                    officers.map((officer) => (
                      <OfficerCard
                        key={officer.id}
                        officer={officer}
                        canEdit={canSAPD}
                        onEdit={(o) => guard(() => { setEditing(o); setFormOpen(true); })}
                        onDelete={(o) => guard(() => setDeleting(o))}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <PersonalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        rangos={rangos}
        editing={editing}
      />

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

export default SAPDPage;
