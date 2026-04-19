import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Rango, PersonalRow } from '@/hooks/useSAPDData';
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
import { Loader2, Upload } from 'lucide-react';

const schema = z.object({
  nombre: z.string().trim().min(1, 'Requerido').max(100),
  rango_id: z.string().uuid('Selecciona un rango válido de la lista'),
  cargo: z.string().trim().max(100),
  division: z.string().trim().max(150),
  placa: z.string().trim().max(20),
  expediente: z.string().trim().min(1, 'Requerido').max(50),
  notas: z.string().trim().max(500),
  imagen_url: z.string().url().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

const DIVISIONES = [
  'Lider de Division (SWAT)',
  'Lider de Division (DT)',
  'Lider de Division (DI)',
  'Lider de Division (RR-PP)',
  'Special Weapons And Tactics',
  'Division de Detectives',
  'Division de Instructores',
  'Division de Relaciones Publicas',
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rangos: Rango[];
  editing?: PersonalRow | null;
}

const emptyValues = (): FormValues => ({
  nombre: '',
  rango_id: '',
  cargo: 'NA',
  division: 'NA',
  placa: 'NA',
  expediente: `EXP-${Date.now().toString().slice(-6)}`,
  notas: 'Vacío por ahora',
  imagen_url: '',
});

const PersonalFormDialog = ({ open, onOpenChange, rangos, editing }: Props) => {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues(),
  });

  // Reset form ONLY when dialog opens or editing target changes
  useEffect(() => {
    if (!open) return;
    if (editing) {
      form.reset({
        nombre: editing.nombre,
        rango_id: editing.rango_id,
        cargo: editing.cargo,
        division: editing.division,
        placa: editing.placa,
        expediente: editing.expediente,
        notas: editing.notas,
        imagen_url: editing.imagen_url ?? '',
      });
    } else {
      form.reset(emptyValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing?.id]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        imagen_url: values.imagen_url || null,
      };
      if (editing) {
        const { error } = await supabase
          .from('personal')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('personal').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['personal'] });
      toast({
        title: editing ? 'Personal actualizado' : 'Personal agregado',
      });
      onOpenChange(false);
      form.reset(emptyValues());
    },
    onError: (e: Error) => {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    },
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from('personal-images')
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('personal-images').getPublicUrl(path);
      form.setValue('imagen_url', data.publicUrl, { shouldValidate: true });
      toast({ title: 'Imagen subida' });
    } catch (e) {
      toast({
        title: 'Error al subir',
        description: (e as Error).message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const imagenUrl = form.watch('imagen_url');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-gold max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
            {editing ? 'Editar personal' : 'Agregar personal'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(
            (v) => mutation.mutate(v),
            (errors) => {
              const first = Object.values(errors)[0]?.message as string | undefined;
              toast({
                title: 'Revisa el formulario',
                description: first ?? 'Hay campos inválidos',
                variant: 'destructive',
              });
            },
          )}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre" error={form.formState.errors.nombre?.message}>
              <Input {...form.register('nombre')} className="font-mono" />
            </Field>
            <Field label="Rango" error={form.formState.errors.rango_id?.message}>
              <RangoInput
                rangos={rangos}
                value={form.watch('rango_id')}
                onChange={(v) =>
                  form.setValue('rango_id', v, { shouldValidate: true })
                }
              />
            </Field>
            <Field label="Cargo">
              <Input {...form.register('cargo')} />
            </Field>
            <Field label="División">
              <Input
                {...form.register('division')}
                list="divisiones-list"
                placeholder="Escribe o selecciona..."
              />
              <datalist id="divisiones-list">
                {DIVISIONES.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>
            <Field label="Placa">
              <Input {...form.register('placa')} />
            </Field>
            <Field
              label="Expediente"
              error={form.formState.errors.expediente?.message}
            >
              <Input {...form.register('expediente')} className="font-mono" />
            </Field>
          </div>

          <Field label="Notas">
            <Textarea {...form.register('notas')} rows={2} />
          </Field>

          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Imagen
            </Label>
            <div className="flex gap-3 items-start">
              {imagenUrl && (
                <img
                  src={imagenUrl}
                  alt="preview"
                  className="w-20 h-24 object-cover border border-gold"
                />
              )}
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="URL de imagen (o subir abajo)"
                  {...form.register('imagen_url')}
                />
                <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border rounded cursor-pointer hover:border-gold text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Subiendo...' : 'Subir archivo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

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
              {editing ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RangoInput = ({
  rangos,
  value,
  onChange,
}: {
  rangos: Rango[];
  value: string;
  onChange: (id: string) => void;
}) => {
  const selected = rangos.find((r) => r.id === value);
  const [text, setText] = useState(selected?.label ?? '');

  useEffect(() => {
    if (selected && selected.label !== text) setText(selected.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Input
        list="rangos-list"
        value={text}
        placeholder="Escribe o selecciona un rango..."
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          const match = rangos.find(
            (r) => r.label.toLowerCase() === v.toLowerCase(),
          );
          onChange(match?.id ?? '');
        }}
      />
      <datalist id="rangos-list">
        {rangos.map((r) => (
          <option key={r.id} value={r.label} />
        ))}
      </datalist>
    </>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs tracking-widest uppercase text-muted-foreground">
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default PersonalFormDialog;
