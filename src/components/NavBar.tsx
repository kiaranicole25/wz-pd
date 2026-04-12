import { Link, useLocation } from 'react-router-dom';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const tabs = [
  { path: '/sapd', label: 'SAPD' },
  { path: '/vetados', label: 'VETOS' },
  { path: '/noticias', label: 'Noticias' },
  { path: '/importante', label: 'Importante' },
];

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="border-b-2 border-gold">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-14 gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={LOGO_URL} alt="SAPD" width={32} height={32} />
          <span className="text-gold font-bold text-sm tracking-[0.3em]">SAPD</span>
        </Link>
        <div className="flex items-center gap-0 flex-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-3 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${
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
      </div>
    </nav>
  );
};

export default NavBar;
