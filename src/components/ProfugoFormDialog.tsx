import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, Wand2, Plus, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { logAction } from '@/lib/audit';
import { ProfugoRow, generateProcesamiento } from '@/hooks/useProfugos';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: ProfugoRow | null;
}

const PROC_REGEX = /^[A-Z]{2}\d{8}$/;

const ProfugoFormDialog = ({ open, onOpenChange, editing }: Props) => {
  const qc = useQueryClient();
  const { username, role } = useAdmin();
  const [uploading, setUploading] = useState(false);

  const [nombre, setNombre] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [proc, setProc] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [delitos, setDelitos] = useState<string[]>([]);
  const [nuevoDelito, setNuevoDelito] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setNombre(editing.nombre);
      setLocalidad(editing.localidad);
      setProc(editing.numero_procesamiento);
      setImagenUrl(editing.imagen_url ?? '');
      setDelitos([...editing.delitos]);
    } else {
      setNombre(''); setLocalidad(''); setProc('');
      setImagenUrl(''); setDelitos([]); setNuevoDelito('');
    }
  }, [open, editing?.id]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `profugos/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from('personal-images')
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('personal-images').getPublicUrl(path);
      setImagenUrl(data.publicUrl);
      toast({ title: 'Imagen subida' });
    } catch (e) {
      toast({ title: 'Error al subir', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const addDelito = () => {
    const t = nuevoDelito.trim();
    if (!t) return;
    setDelitos((d) => [...d, t]);
    setNuevoDelito('');
  };

  const removeDelito = (i: number) => setDelitos((d) => d.filter((_, idx) => idx !== i));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!nombre.trim()) throw new Error('El nombre es obligatorio');
      const procClean = proc.trim().toUpperCase();
      if (!PROC_REGEX.test(procClean)) {
        throw new Error('Número de procesamiento inválido (formato: 2 letras + 8 dígitos, ej: AZ12345678)');
      }
      const payload = {
        nombre: nombre.trim(),
        localidad: localidad.trim() || 'Desconocida',
        numero_procesamiento: procClean,
        imagen_url: imagenUrl || null,
        delitos,
      };
      if (editing) {
        const { error } = await supabase.from('profugos').update(payload).eq('id', editing.id);
        if (error) throw error;
        if (role) await logAction({ username, role }, 'profugos' as never, 'editar',
          `Editó prófugo: ${payload.nombre} (${payload.numero_procesamiento})`);
      } else {
        const { error } = await supabase.from('profugos').insert(payload);
        if (error) throw error;
        if (role) await logAction({ username, role }, 'profugos' as never, 'crear',
          `Creó prófugo: ${payload.nombre} (${payload.numero_procesamiento})`);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profugos'] });
      toast({ title: editing ? 'Prófugo actualizado' : 'Prófugo agregado' });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-gold max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
            {editing ? 'Editar prófugo' : 'Agregar prófugo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Nombre y Apellido</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Localidad</Label>
              <Input value={localidad} onChange={(e) => setLocalidad(e.target.value)} maxLength={100} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              Número de Procesamiento (2 letras + 8 dígitos)
            </Label>
            <div className="flex gap-2">
              <Input
                value={proc}
                onChange={(e) => setProc(e.target.value.toUpperCase())}
                placeholder="AZ12345678"
                className="font-mono"
                maxLength={10}
              />
              <Button type="button" variant="outline" onClick={() => setProc(generateProcesamiento())} className="gap-2 shrink-0">
                <Wand2 className="w-4 h-4" /> Autogenerar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">Delitos</Label>
            <div className="flex gap-2">
              <Input
                value={nuevoDelito}
                onChange={(e) => setNuevoDelito(e.target.value)}
                placeholder="Escribe un delito y presiona Agregar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addDelito(); }
                }}
              />
              <Button type="button" onClick={addDelito} variant="outline" className="gap-2 shrink-0">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
            {delitos.length > 0 && (
              <ol className="list-decimal list-inside space-y-1 text-sm bg-row-even/40 border border-border p-3">
                {delitos.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 group">
                    <span><span className="text-gold font-bold mr-1">{i + 1}.</span>{d}</span>
                    <button type="button" onClick={() => removeDelito(i)}
                      className="opacity-0 group-hover:opacity-100 text-destructive p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">Mugshot</Label>
            <div className="flex gap-3 items-start">
              {imagenUrl && (
                <img src={imagenUrl} alt="preview" className="w-20 h-24 object-cover border-2 border-gold" />
              )}
              <div className="flex-1 space-y-2">
                <Input placeholder="URL de imagen (o subir abajo)" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
                <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border rounded cursor-pointer hover:border-gold text-xs uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Subiendo...' : 'Subir archivo'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfugoFormDialog;
