import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordGateProps {
  title: string;
  showUsername?: boolean;
  onAuth: (username: string, password: string) => boolean;
  children: React.ReactNode;
}

const PasswordGate = ({ title, showUsername = false, onAuth, children }: PasswordGateProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuth(username, password)) {
      setSuccess(true);
      setError('');
      setTimeout(() => setAuthenticated(true), 800);
    } else {
      setError('Acceso denegado');
      setSuccess(false);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="text-gold font-bold text-lg">{title}</h2>
        </div>
        {showUsername && (
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1">Nombre:</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted border-border"
              placeholder="Ingrese su nombre"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1">Contraseña:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-muted border-border"
            placeholder="Ingrese la contraseña"
          />
        </div>
        {error && <p className="text-destructive text-sm text-center mb-3 font-semibold">❌ {error}</p>}
        {success && <p className="text-sm text-center mb-3 font-semibold" style={{ color: 'hsl(140 60% 40%)' }}>✅ Acceso aceptado</p>}
        <Button type="submit" className="w-full gold-gradient text-primary-foreground font-bold">
          Ingresar
        </Button>
      </form>
    </div>
  );
};

export default PasswordGate;
