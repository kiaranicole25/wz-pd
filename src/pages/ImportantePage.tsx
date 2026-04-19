import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import PublicacionFormDialog from '@/components/PublicacionFormDialog';
import { useAdmin } from '@/context/AdminContext';
import { useAvisos, Publicacion } from '@/hooks/usePublicaciones';
import { supabase } from '@/integrations/supabase/client';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const ImportantePage = () => {
  const { isAdmin } = useAdmin();
  const { data: avisos = [], isLoading } = useAvisos();
  const qc = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Publicacion | null>(null);

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('avisos_importantes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['avisos_importantes'] });
      toast({ title: 'Aviso eliminado' });
      setDeleting(null);
    },
    onError: (e: Error) =>
      toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-gold text-lg font-bold tracking-[0.3em] uppercase">
            Avisos Importantes — SAPD
          </h1>
          {isAdmin && (
            <Button onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Crear aviso
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        <div className="grid gap-5">
          {avisos.map((a) => (
            <div key={a.id} className="border border-border p-6">
              <div className="flex justify-between items-start gap-4 mb-2">
                <p className="text-xs text-muted-foreground tracking-wider uppercase">
                  {formatFecha(a.created_at)} · Redactado por: {a.redactor}
                </p>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleting(a)}
                    className="gap-2 h-7"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </Button>
                )}
              </div>
              <h2 className="text-gold font-bold text-base tracking-wider mb-3">
                {a.titulo}
              </h2>
              <p className="text-value text-sm leading-relaxed whitespace-pre-wrap">
                {a.desarrollo}
              </p>
              {a.imagen_url && (
                <img
                  src={a.imagen_url}
                  alt={a.titulo}
                  loading="lazy"
                  className="w-full object-contain border border-border mt-4"
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-accent-bar h-[2px] mt-10" />
      </div>

      <PublicacionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        table="avisos_importantes"
        queryKey="avisos_importantes"
        label="Aviso"
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar "{deleting?.titulo}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && del.mutate(deleting.id)}
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

export default ImportantePage;
