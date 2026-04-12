import { Link } from 'react-router-dom';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const tabs = [
  { path: '/sapd', label: 'SAPD', desc: 'Jerarquía del Departamento' },
  { path: '/vetados', label: 'VETOS', desc: 'Personal Vetado' },
  { path: '/noticias', label: 'Noticias', desc: 'Noticias del Departamento' },
  { path: '/importante', label: 'Importante', desc: 'Avisos Oficiales' },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-accent-bar w-full max-w-2xl h-[2px] mb-10" />
      <img src={LOGO_URL} alt="SAPD" width={120} height={120} className="mb-6" />
      <h1 className="text-gold text-2xl font-bold tracking-[0.4em] text-center mb-1">SAPD</h1>
      <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase mb-1">
        Law Enforcement Record & Police Blacklist
      </p>
      <p className="text-gold-dim text-[10px] italic tracking-wider mb-10">
        "To Protect and to Serve"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mb-10">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className="border border-border hover:border-gold py-6 px-4 text-center transition-colors group"
          >
            <div className="text-gold font-bold text-sm tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">
              [{tab.label}]
            </div>
            <div className="text-muted-foreground text-[9px] tracking-wider uppercase mt-2">{tab.desc}</div>
          </Link>
        ))}
      </div>
      <div className="bg-accent-bar w-full max-w-2xl h-[2px]" />
    </div>
  );
};

export default Index;
