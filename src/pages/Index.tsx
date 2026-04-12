import { Link } from 'react-router-dom';
import sapdLogo from '@/assets/sapd-logo.png';

const tabs = [
  { path: '/sapd', label: 'SAPD', desc: 'Jerarquía del Departamento', icon: '🛡️' },
  { path: '/vetados', label: 'VETOS', desc: 'Personal Vetado', icon: '🚫' },
  { path: '/noticias', label: 'Noticias', desc: 'Noticias del Departamento', icon: '📰' },
  { path: '/importante', label: 'Importante', desc: 'Avisos Oficiales', icon: '⚠️' },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bar-pattern w-full h-2 mb-8 rounded-full" />
      <img src={sapdLogo} alt="SAPD Logo" width={140} height={140} className="mb-6 drop-shadow-2xl" />
      <h1 className="text-gold text-3xl md:text-4xl font-bold tracking-widest text-center mb-2">
        SAPD
      </h1>
      <p className="text-muted-foreground text-center mb-1 text-sm">
        Law Enforcement Record & Police Blacklist
      </p>
      <p className="text-gold/70 text-center mb-8 italic text-xs tracking-wider">
        "To Protect and to Serve"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
          >
            <div className="text-3xl mb-2">{tab.icon}</div>
            <div className="text-gold font-bold text-lg group-hover:scale-105 transition-transform">
              [{tab.label}]
            </div>
            <div className="text-muted-foreground text-xs mt-1">{tab.desc}</div>
          </Link>
        ))}
      </div>
      <div className="bar-pattern w-full h-2 rounded-full" />
    </div>
  );
};

export default Index;
