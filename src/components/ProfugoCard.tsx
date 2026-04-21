import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProfugoRow } from '@/hooks/useProfugos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, X, Check, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAdmin } from '@/context/AdminContext';
import { logAction } from '@/lib/audit';

interface Props {
  profugo: ProfugoRow;
  canEdit: boolean;
  onEdit: (p: ProfugoRow) => void;
  onDelete: (p: ProfugoRow) => void;
}

const ProfugoCard = ({ profugo, canEdit, onEdit, onDelete }: Props) => {
  const qc = useQueryClient();
  const { username, role } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [nuevo, setNuevo] = useState('');

  const addDelito = useMutation({
    mutationFn: async () => {
      const t = nuevo.trim();
      if (!t) return;
      const { error } = await supabase
        .from('profugos')
        .update({ delitos: [...profugo.delitos, t] })
        .eq('id', profugo.id);
      if (error) throw error;
      if (role) await logAction({ username, role }, 'profugos' as never, 'editar',
        `Agregó delito a ${profugo.nombre}: ${t}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profugos'] });
      setNuevo(''); setAdding(false);
      toast({ title: 'Delito agregado' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <article className="relative bg-[#0a1f4d] border-y-4 border-[hsl(48_100%_50%)] my-6 overflow-hidden shadow-2xl">
      {/* franja superior */}
      <header className="border-b-2 border-[hsl(48_100%_50%)]/60 px-8 py-3 flex items-center gap-4 bg-gradient-to-r from-[#0a1f4d] via-[#0d2659] to-[#0a1f4d]">
        <div className="w-12 h-12 bg-[hsl(48_100%_50%)] flex items-center justify-center shrink-0">
          <ShieldAlert className="w-7 h-7 text-[#0a1f4d]" />
        </div>
        <h2 className="text-white font-black text-2xl tracking-[0.15em] uppercase ml-auto"
            style={{ fontFamily: 'Georgia, serif' }}>
          San Andreas Police Dept.
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 px-8 py-8">
        {/* Datos */}
        <div className="space-y-5 text-left">
          <div>
            <p className="text-[hsl(48_100%_50%)] font-black text-lg tracking-[0.2em] uppercase"
               style={{ fontFamily: 'Georgia, serif' }}>NAME</p>
            <p className="text-[hsl(210_100%_70%)] font-bold text-2xl uppercase tracking-wide"
               style={{ fontFamily: 'Georgia, serif' }}>
              {profugo.nombre}
            </p>
          </div>
          <div>
            <p className="text-[hsl(48_100%_50%)] font-black text-lg tracking-[0.2em] uppercase"
               style={{ fontFamily: 'Georgia, serif' }}>HANGOUT</p>
            <p className="text-[hsl(210_100%_70%)] text-xl"
               style={{ fontFamily: 'Georgia, serif' }}>
              {profugo.localidad}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[hsl(48_100%_50%)] font-black text-lg tracking-[0.2em] uppercase"
                 style={{ fontFamily: 'Georgia, serif' }}>WANTED FOR</p>
              {canEdit && !adding && (
                <button
                  onClick={() => setAdding(true)}
                  className="text-[hsl(48_100%_50%)] hover:bg-[hsl(48_100%_50%)] hover:text-[#0a1f4d] border border-[hsl(48_100%_50%)] px-2 py-1 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Delito
                </button>
              )}
            </div>
            {profugo.delitos.length === 0 ? (
              <p className="text-[hsl(210_100%_70%)]/60 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Sin cargos registrados
              </p>
            ) : (
              <ol className="space-y-1">
                {profugo.delitos.map((d, i) => (
                  <li key={i} className="text-[hsl(210_100%_70%)] text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="text-[hsl(48_100%_50%)] font-bold mr-2">{i + 1}.</span>{d}
                  </li>
                ))}
              </ol>
            )}
            {adding && (
              <div className="flex gap-2 mt-2">
                <Input
                  autoFocus
                  value={nuevo}
                  onChange={(e) => setNuevo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addDelito.mutate(); }
                    if (e.key === 'Escape') { setAdding(false); setNuevo(''); }
                  }}
                  placeholder="Nuevo delito..."
                  className="bg-white text-[#0a1f4d] border-[hsl(48_100%_50%)]"
                />
                <button onClick={() => addDelito.mutate()} disabled={addDelito.isPending}
                  className="bg-[hsl(48_100%_50%)] text-[#0a1f4d] px-3 hover:bg-[hsl(48_100%_60%)]">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setAdding(false); setNuevo(''); }}
                  className="border border-[hsl(48_100%_50%)] text-[hsl(48_100%_50%)] px-3 hover:bg-[hsl(48_100%_50%)]/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mugshot */}
        <div className="flex flex-col items-center gap-2">
          <div className="border-4 border-[hsl(48_100%_50%)] bg-[#e8eef5] w-[280px] h-[300px] overflow-hidden flex items-center justify-center">
            {profugo.imagen_url ? (
              <img src={profugo.imagen_url} alt={profugo.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#0a1f4d]/40 text-xs tracking-widest uppercase">Sin imagen</span>
            )}
          </div>
          <p className="font-mono text-[hsl(48_100%_50%)] text-sm tracking-widest font-bold">
            #{profugo.numero_procesamiento}
          </p>
        </div>
      </div>

      {/* franja inferior */}
      <div className="border-t-2 border-[hsl(48_100%_50%)]/60 h-3 bg-gradient-to-r from-[#0a1f4d] via-[#0d2659] to-[#0a1f4d]" />

      {canEdit && (
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(profugo)}
            className="bg-[#0a1f4d] border-[hsl(48_100%_50%)] text-[hsl(48_100%_50%)] hover:bg-[hsl(48_100%_50%)] hover:text-[#0a1f4d]">
            <Pencil className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(profugo)}
            className="bg-[#0a1f4d] border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </article>
  );
};

export default ProfugoCard;
