import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
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
import { useAdmin } from '@/context/AdminContext';
import { logAction, AuditArea } from '@/lib/audit';

const schema = z.object({
  titulo: z.string().trim().min(1, 'Requerido').max(200),
  desarrollo: z.string().trim().min(1, 'Requerido').max(5000),
  imagen_url: z.string().url().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: 'noticias' | 'avisos_importantes';
  queryKey: string;
  label: string;
  area: AuditArea;
}

const PublicacionFormDialog = ({
  open,
  onOpenChange,
  table,
  queryKey,
  label,
  area,
}: Props) => {
  const qc = useQueryClient();
  const { username, role } = useAdmin();
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { titulo: '', desarrollo: '', imagen_url: '' },
  });

  useEffect(() => {
    if (open) form.reset({ titulo: '', desarrollo: '', imagen_url: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const redactorName =
    role === 'cupula' && username ? username : 'Departamento de Policias';

  const mutation = useMutation({
    mutationFn: async (v: FormValues) => {
      const payload = { ...v, redactor: redactorName, imagen_url: v.imagen_url || null };
      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;
      if (role) {
        await logAction(
          { username: redactorName, role },
          area,
          'crear',
          `Creó ${label.toLowerCase()}: "${v.titulo}"`,
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: `${label} creada` });
      onOpenChange(false);
    },
    onError: (e: Error) =>
      toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `publicaciones/${crypto.randomUUID()}.${ext}`;
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

  const imagen = form.watch('imagen_url');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-gold max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
            Crear {label}
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
          <div className="text-xs text-muted-foreground tracking-widest uppercase">
            Redactado por: <span className="text-gold">{redactorName}</span>
          </div>
          <Field label="Título" error={form.formState.errors.titulo?.message}>
            <Input {...form.register('titulo')} />
          </Field>
          <Field label="Desarrollo" error={form.formState.errors.desarrollo?.message}>
            <Textarea {...form.register('desarrollo')} rows={6} />
          </Field>

          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Imagen (opcional)
            </Label>
            <div className="flex gap-3 items-start">
              {imagen && (
                <img
                  src={imagen}
                  alt="preview"
                  className="w-24 h-24 object-cover border border-gold"
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
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Publicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

export default PublicacionFormDialog;
