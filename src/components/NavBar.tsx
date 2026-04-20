import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AdminLoginDialog from './AdminLoginDialog';
import { useAdmin } from '@/context/AdminContext';
import { LogOut } from 'lucide-react';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const baseTabs = [
  { path: '/sapd', label: 'Departamento' },
  { path: '/vetados', label: 'Vetados' },
  { path: '/noticias', label: 'Información' },
  { path: '/importante', label: 'Importante' },
];

const NavBar = () => {
  const location = useLocation();
  const { isAdmin, role, username, logout } = useAdmin();
  const [loginOpen, setLoginOpen] = useState(false);

  // Solo el Encargado ve la pestaña Logs
  const tabs = role === 'encargado' ? [...baseTabs, { path: '/logs', label: 'Logs' }] : baseTabs;

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault();
      setLoginOpen(true);
    }
  };

  return (
    <>
      <nav className="border-b-2 border-gold">
        <div className="max-w-5xl mx-auto px-4 flex items-center h-16 gap-6">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 shrink-0 group">
            <img
              src={LOGO_URL}
              alt="SAPD"
              width={38}
              height={38}
              className="transition-transform group-hover:scale-110"
              title={isAdmin ? 'SAPD' : 'Click para acceso administrador'}
            />
            <span className="text-gold font-bold text-base tracking-[0.3em]">SAPD</span>
          </Link>
          <div className="flex items-center gap-0 flex-1">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-5 py-4 text-sm font-bold tracking-widest uppercase border-b-2 transition-colors ${
                    isActive
                      ? 'border-gold text-gold'
                      : 'border-transparent text-muted-foreground hover:text-gold'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground leading-tight">
                  Estás logueado como
                </p>
                <p className="text-gold font-bold text-xs tracking-widest uppercase leading-tight">
                  {username}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 border border-gold/40 text-gold hover:bg-gold hover:text-background transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default NavBar;
