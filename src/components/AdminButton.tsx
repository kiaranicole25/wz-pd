import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
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
import { ShieldCheck, ShieldOff } from 'lucide-react';

const AdminButton = () => {
  const { isAdmin, login, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setOpen(false);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (isAdmin) {
    return (
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-background transition-colors"
        title="Salir del modo admin"
      >
        <ShieldCheck className="w-4 h-4" />
        Admin ON
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest uppercase border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"
      >
        <ShieldOff className="w-4 h-4" />
        Modo Admin
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-2 border-gold">
          <DialogHeader>
            <DialogTitle className="text-gold tracking-[0.2em] uppercase text-sm">
              Acceso administrador
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                Contraseña
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-destructive text-xs tracking-wider uppercase">
                ✕ {error}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminButton;
