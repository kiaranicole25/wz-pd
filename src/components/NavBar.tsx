import { Link, useLocation } from 'react-router-dom';
import sapdLogo from '@/assets/sapd-logo.png';

const tabs = [
  { path: '/sapd', label: 'SAPD', icon: '🛡️' },
  { path: '/vetados', label: 'VETOS', icon: '🚫' },
  { path: '/noticias', label: 'Noticias', icon: '📰' },
  { path: '/importante', label: 'Importante', icon: '⚠️' },
];

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={sapdLogo} alt="SAPD" width={40} height={40} />
            <span className="text-gold font-bold text-lg tracking-wider hidden sm:block">SAPD</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'gold-gradient text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
