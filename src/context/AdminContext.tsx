import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'sapd_admin_session_v2';
const ENCARGADO_PASSWORD = 'S-nrR3@7gK?hQYQ';

export type AdminRole = 'encargado' | 'cupula' | null;
export type PermArea = 'sapd' | 'vetados' | 'noticias' | 'importantes' | 'profugos' | 'logs';

export interface Permissions {
  sapd: boolean;
  vetados: boolean;
  noticias: boolean;
  importantes: boolean;
  profugos: boolean;
  logs: boolean;
}

interface Session {
  role: AdminRole;
  username: string;
  permissions: Permissions;
}

interface AdminContextValue extends Session {
  isAdmin: boolean;
  loginEncargado: (password: string) => Promise<{ ok: boolean; error?: string }>;
  loginCupula: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  can: (area: PermArea) => boolean;
  encargadoPassword: string | null; // se guarda solo en memoria de sesión para crear/borrar usuarios
}

const ALL_PERMS: Permissions = { sapd: true, vetados: true, noticias: true, importantes: true, profugos: true, logs: true };
const NO_PERMS: Permissions = { sapd: false, vetados: false, noticias: false, importantes: false, profugos: false, logs: false };

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>({ role: null, username: '', permissions: NO_PERMS });
  const [encargadoPassword, setEncargadoPassword] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed.session);
        if (parsed.encPwd) setEncargadoPassword(parsed.encPwd);
      } catch { /* noop */ }
    }
  }, []);

  const persist = (s: Session, encPwd: string | null) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ session: s, encPwd }));
  };

  const loginEncargado = async (password: string) => {
    const { data, error } = await supabase.functions.invoke('cupula-auth', {
      body: { op: 'login_encargado', password },
    });
    if (error || !data?.ok) return { ok: false, error: data?.error || 'Credenciales Incorrectas' };
    const s: Session = { role: 'encargado', username: data.username, permissions: ALL_PERMS };
    setSession(s);
    setEncargadoPassword(password);
    persist(s, password);
    return { ok: true };
  };

  const loginCupula = async (username: string, password: string) => {
    const { data, error } = await supabase.functions.invoke('cupula-auth', {
      body: { op: 'login_cupula', username, password },
    });
    if (error || !data?.ok) return { ok: false, error: data?.error || 'Credenciales incorrectas' };
    const s: Session = {
      role: 'cupula',
      username: data.username,
      permissions: data.permissions ?? NO_PERMS,
    };
    setSession(s);
    setEncargadoPassword(null);
    persist(s, null);
    return { ok: true };
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession({ role: null, username: '', permissions: NO_PERMS });
    setEncargadoPassword(null);
  };

  const can = (area: PermArea) => {
    if (session.role === 'encargado') return true;
    if (session.role === 'cupula') return !!session.permissions[area];
    return false;
  };

  return (
    <AdminContext.Provider
      value={{
        ...session,
        isAdmin: session.role !== null,
        loginEncargado,
        loginCupula,
        logout,
        can,
        encargadoPassword,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export { ENCARGADO_PASSWORD };
