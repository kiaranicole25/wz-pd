import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, ScrollText, Users } from 'lucide-react';

interface AuditLog {
  id: string;
  actor_username: string;
  actor_role: string;
  area: string;
  action: string;
  detalle: string;
  created_at: string;
}

interface CupulaUser {
  id: string;
  username: string;
  perm_sapd: boolean;
  perm_vetados: boolean;
  perm_noticias: boolean;
  perm_importantes: boolean;
  created_at: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const areaLabel = (a: string) => {
  const map: Record<string, string> = {
    sapd: '/sapd', vetados: '/vetados', noticias: '/noticias',
    importantes: '/importante', auth: 'auth', usuarios: 'usuarios',
  };
  return map[a] ?? a;
};

const actionColor = (a: string) => {
  if (a === 'crear') return 'text-green-400';
  if (a === 'borrar') return 'text-destructive';
  if (a === 'editar') return 'text-blue-400';
  if (a === 'login_fail') return 'text-destructive';
  if (a === 'login_ok') return 'text-gold-dim';
  return 'text-muted-foreground';
};

const LogsPage = () => {
  const { role, encargadoPassword, username } = useAdmin();
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [delUser, setDelUser] = useState<CupulaUser | null>(null);

  // Form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [perms, setPerms] = useState({ sapd: false, vetados: false, noticias: false, importantes: false });
  const [creating, setCreating] = useState(false);

  const { data: logs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['audit_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: role === 'encargado',
  });

  const { data: users = [] } = useQuery({
    queryKey: ['cupula_users_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cupula_users_public' as never)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CupulaUser[];
    },
    enabled: role === 'encargado',
  });

  const deleteUser = useMutation({
    mutationFn: async (u: CupulaUser) => {
      const { data, error } = await supabase.functions.invoke('cupula-auth', {
        body: {
          op: 'delete_user',
          encargado_password: encargadoPassword,
          user_id: u.id,
          actor: username,
        },
      });
      if (error || !data?.ok) throw new Error(data?.error || 'Error');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cupula_users_public'] });
      qc.invalidateQueries({ queryKey: ['audit_logs'] });
      toast({ title: 'Usuario eliminado' });
      setDelUser(null);
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  if (role !== 'encargado') return <Navigate to="/" replace />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword) {
      toast({ title: 'Completa nombre y contraseña', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke('cupula-auth', {
      body: {
        op: 'create_user',
        encargado_password: encargadoPassword,
        username: newUsername.trim(),
        password: newPassword,
        permissions: perms,
        actor: username,
      },
    });
    setCreating(false);
    if (error || !data?.ok) {
      toast({ title: 'Error', description: data?.error || 'No se pudo crear', variant: 'destructive' });
      return;
    }
    toast({ title: 'Usuario creado' });
    setNewUsername(''); setNewPassword('');
    setPerms({ sapd: false, vetados: false, noticias: false, importantes: false });
    setCreateOpen(false);
    qc.invalidateQueries({ queryKey: ['cupula_users_public'] });
    qc.invalidateQueries({ queryKey: ['audit_logs'] });
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-accent-bar w-full h-[2px] mb-8" />
        <h1 className="text-gold text-3xl font-bold tracking-[0.3em] uppercase text-center mb-2">
          Logs
        </h1>
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase text-center mb-10">
          Registro de actividad — Solo Encargado
        </p>

        {/* USUARIOS CÚPULA */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gold text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              <Users className="w-4 h-4" /> Usuarios Cúpula
            </h2>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Crear Usuario Personalizado
            </Button>
          </div>

          <div className="border border-border">
            {users.length === 0 ? (
              <p className="text-muted-foreground text-xs tracking-wider uppercase text-center py-6">
                Sin usuarios creados
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-header">
                  <tr>
                    <th className="text-left text-xs text-gold font-bold tracking-widest uppercase px-4 py-2">Usuario</th>
                    <th className="text-center text-xs text-gold font-bold tracking-widest uppercase px-2 py-2">SAPD</th>
                    <th className="text-center text-xs text-gold font-bold tracking-widest uppercase px-2 py-2">Vetados</th>
                    <th className="text-center text-xs text-gold font-bold tracking-widest uppercase px-2 py-2">Información</th>
                    <th className="text-center text-xs text-gold font-bold tracking-widest uppercase px-2 py-2">Importantes</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-row-even' : 'bg-row-odd'}>
                      <td className="px-4 py-2 font-mono">{u.username}</td>
                      <td className="text-center">{u.perm_sapd ? '✓' : '—'}</td>
                      <td className="text-center">{u.perm_vetados ? '✓' : '—'}</td>
                      <td className="text-center">{u.perm_noticias ? '✓' : '—'}</td>
                      <td className="text-center">{u.perm_importantes ? '✓' : '—'}</td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => setDelUser(u)}
                          className="p-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* LOGS */}
        <section>
          <h2 className="text-gold text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
            <ScrollText className="w-4 h-4" /> Registro de Actividad
          </h2>

          {loadingLogs && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          )}

          {!loadingLogs && logs.length === 0 && (
            <div className="border border-border p-10 text-center">
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Sin registros disponibles
              </p>
            </div>
          )}

          <div className="border border-border divide-y divide-border">
            {logs.map((l) => (
              <div key={l.id} className="px-4 py-3 grid grid-cols-[140px_1fr] gap-4 text-sm hover:bg-row-even/50">
                <span className="text-muted-foreground text-xs font-mono">
                  {formatDate(l.created_at)}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-gold font-bold">{l.actor_username}</span>
                  <span className={`text-xs uppercase tracking-wider ${actionColor(l.action)}`}>
                    {l.action.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {areaLabel(l.area)}
                  </span>
                  <span className="text-value text-sm w-full">— {l.detalle}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-[10px] tracking-widest uppercase text-center mt-4">
            Los registros son inmutables. Mostrando los últimos 500.
          </p>
        </section>
      </main>

      {/* CREAR USUARIO */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-2 border-gold">
          <DialogHeader>
            <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
              Crear Usuario Personalizado
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Nombre</Label>
              <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="font-mono" maxLength={50} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Contraseña</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="font-mono" maxLength={100} />
            </div>
            <div className="space-y-3">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Permisos</Label>
              {([
                ['sapd', 'Editar / Crear / Borrar SAPD'],
                ['vetados', 'Editar Vetados'],
                ['noticias', 'Crear / Editar / Borrar Información'],
                ['importantes', 'Editar / Crear / Borrar Importantes'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={perms[key]}
                    onCheckedChange={(v) => setPerms((p) => ({ ...p, [key]: !!v }))}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Crear
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRMAR BORRAR USUARIO */}
      <AlertDialog open={!!delUser} onOpenChange={(o) => !o && setDelUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario {delUser?.username}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario perderá su acceso inmediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => delUser && deleteUser.mutate(delUser)}
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

export default LogsPage;
