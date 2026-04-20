import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/context/AdminContext';
import { Crown, ShieldCheck, ArrowLeft } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = 'choose' | 'cupula' | 'encargado';

const AdminLoginDialog = ({ open, onOpenChange }: Props) => {
  const { loginCupula, loginEncargado } = useAdmin();
  const [mode, setMode] = useState<Mode>('choose');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setMode('choose'); setUsername(''); setPassword(''); setError(''); setLoading(false);
  };

  const close = () => { reset(); onOpenChange(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = mode === 'cupula'
      ? await loginCupula(username.trim(), password)
      : await loginEncargado(password);
    setLoading(false);
    if (res.ok) close();
    else setError(res.error || 'Error');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="border-2 border-gold max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm text-center">
            {mode === 'choose' && 'Acceso Administrador'}
            {mode === 'cupula' && 'Login Cúpula'}
            {mode === 'encargado' && 'Login Encargado'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'choose' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setMode('cupula')}
              className="w-full flex items-center gap-3 border-2 border-gold/40 hover:border-gold p-4 text-left transition-colors group"
            >
              <Crown className="w-6 h-6 text-gold" />
              <div>
                <p className="text-gold font-bold tracking-widest uppercase text-sm">Loguearse como Cúpula</p>
                <p className="text-muted-foreground text-xs">Usuario personalizado + contraseña</p>
              </div>
            </button>
            <button
              onClick={() => setMode('encargado')}
              className="w-full flex items-center gap-3 border-2 border-gold/40 hover:border-gold p-4 text-left transition-colors group"
            >
              <ShieldCheck className="w-6 h-6 text-gold" />
              <div>
                <p className="text-gold font-bold tracking-widest uppercase text-sm">Loguearse como Encargado</p>
                <p className="text-muted-foreground text-xs">Acceso total + gestión de usuarios</p>
              </div>
            </button>
          </div>
        )}

        {(mode === 'cupula' || mode === 'encargado') && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {mode === 'cupula' && (
              <div className="space-y-2">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">Usuario</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="font-mono"
                  autoFocus
                  maxLength={50}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
                autoFocus={mode === 'encargado'}
                maxLength={100}
              />
            </div>
            {error && <p className="text-destructive text-xs tracking-wider uppercase">✕ {error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setMode('choose')} className="flex-1">
                <ArrowLeft className="w-4 h-4" /> Volver
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? '...' : 'Ingresar'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
