import { Link, useLocation } from 'react-router-dom';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const tabs = [
  { path: '/sapd', label: 'Departamento' },
  { path: '/vetados', label: 'Vetados' },
  { path: '/noticias', label: 'Noticias' },
  { path: '/importante', label: 'Importante' },
];

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="border-b-2 border-gold">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-16 gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={LOGO_URL} alt="SAPD" width={38} height={38} />
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
      </div>
    </nav>
  );
};

export default NavBar;
