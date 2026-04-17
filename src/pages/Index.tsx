import { Link } from 'react-router-dom';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const tabs = [
  { path: '/sapd', label: 'Departamento de Policías', desc: 'Jerarquía del Departamento' },
  { path: '/vetados', label: 'Registro de Vetados', desc: 'Personal Vetado' },
  { path: '/informacion', label: 'Información Pública de SAPD', desc: 'Publicaciones Oficiales' },
  { path: '/importante', label: 'Avisos Importantes', desc: 'Avisos Oficiales' },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-accent-bar w-full max-w-3xl h-[2px] mb-10" />
      <img src={LOGO_URL} alt="SAPD" width={150} height={150} className="mb-8" />
      <h1 className="text-gold text-4xl font-bold tracking-[0.4em] text-center mb-2">SAPD</h1>
      <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-1">
        Law Enforcement Record & Police Blacklist
      </p>
      <p className="text-gold-dim text-sm italic tracking-wider mb-12">
        "To Protect and to Serve"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-10">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className="border border-border hover:border-gold py-6 px-4 text-center transition-colors group"
          >
            <div className="text-gold font-bold text-sm tracking-[0.1em] group-hover:tracking-[0.15em] transition-all">
              {tab.label}
            </div>
            <div className="text-muted-foreground text-xs tracking-wider uppercase mt-3">{tab.desc}</div>
          </Link>
        ))}
      </div>
      <div className="bg-accent-bar w-full max-w-3xl h-[2px]" />
    </div>
  );
};

export default Index;
