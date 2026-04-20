import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { VetadoRow } from '@/hooks/useSAPDData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { logAction } from '@/lib/audit';

const schema = z.object({
  nombre: z.string().trim().min(1, 'Requerido').max(150),
  discord_id: z.string().trim().max(150),
  motivo: z.string().trim().min(1, 'Requerido').max(500),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: VetadoRow | null;
  nextOrden: number;
}

const VetadoFormDialog = ({ open, onOpenChange, editing, nextOrden }: Props) => {
  const qc = useQueryClient();
  const { username, role } = useAdmin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: editing
      ? {
          nombre: editing.nombre,
          discord_id: editing.discord_id,
          motivo: editing.motivo,
        }
      : { nombre: '', discord_id: 'No figura', motivo: '' },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (editing) {
        const { error } = await supabase
          .from('vetados')
          .update(values)
          .eq('id', editing.id);
        if (error) throw error;
        if (role) await logAction(
          { username, role }, 'vetados', 'editar',
          `Editó vetado: ${values.nombre} - DiscordID: ${values.discord_id}`,
        );
      } else {
        const { error } = await supabase
          .from('vetados')
          .insert({ ...values, orden: nextOrden });
        if (error) throw error;
        if (role) await logAction(
          { username, role }, 'vetados', 'crear',
          `Creó vetado: ${values.nombre}, Razón: ${values.motivo}, DiscordID: ${values.discord_id}`,
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vetados'] });
      toast({ title: editing ? 'Vetado actualizado' : 'Vetado agregado' });
      onOpenChange(false);
      form.reset();
    },
    onError: (e: Error) => {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-gold">
        <DialogHeader>
          <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
            {editing ? 'Editar vetado' : 'Agregar vetado'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Nombre DP
            </Label>
            <Input {...form.register('nombre')} className="font-mono" />
            {form.formState.errors.nombre && (
              <p className="text-xs text-destructive">
                {form.formState.errors.nombre.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Discord ID
            </Label>
            <Input {...form.register('discord_id')} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Motivo
            </Label>
            <Textarea {...form.register('motivo')} rows={3} />
            {form.formState.errors.motivo && (
              <p className="text-xs text-destructive">
                {form.formState.errors.motivo.message}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground italic">
            Nota: los vetados no pueden ser eliminados, solo editados.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {editing ? 'Guardar cambios' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VetadoFormDialog;
