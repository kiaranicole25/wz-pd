import { useState } from 'react';

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
      setTimeout(() => setAuthenticated(true), 600);
    } else {
      setError('Acceso denegado');
      setSuccess(false);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="border-2 border-gold w-full max-w-md p-8">
        <h2 className="text-gold font-bold text-sm tracking-[0.2em] text-center mb-8 uppercase">{title}</h2>
        {showUsername && (
          <div className="mb-5">
            <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2">Nombre</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono"
            />
          </div>
        )}
        <div className="mb-5">
          <label className="block text-xs text-muted-foreground tracking-widest uppercase mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary font-mono"
          />
        </div>
        {error && <p className="text-destructive text-xs text-center mb-4 tracking-wider uppercase">✕ {error}</p>}
        {success && <p className="text-xs text-center mb-4 tracking-wider uppercase" style={{ color: 'hsl(140 60% 50%)' }}>✓ Acceso aceptado</p>}
        <button type="submit" className="w-full bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase py-2.5 hover:opacity-90 transition-opacity">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
