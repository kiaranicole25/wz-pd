import { Navigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAdmin } from '@/context/AdminContext';
import { ScrollText } from 'lucide-react';

const LogsPage = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-accent-bar w-full h-[2px] mb-8" />
        <h1 className="text-gold text-3xl font-bold tracking-[0.3em] uppercase text-center mb-2">
          Logs
        </h1>
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase text-center mb-10">
          Registro de actividad
        </p>

        <div className="border border-border p-16 flex flex-col items-center justify-center text-center">
          <ScrollText className="w-12 h-12 text-gold-dim mb-4" />
          <p className="text-gold-dim tracking-widest uppercase text-sm">
            Sin registros disponibles
          </p>
          <p className="text-muted-foreground text-xs tracking-wider mt-2">
            Este apartado se encuentra vacío por el momento.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LogsPage;
