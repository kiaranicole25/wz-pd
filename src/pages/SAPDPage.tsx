import NavBar from '@/components/NavBar';
import OfficerCard from '@/components/OfficerCard';
import { RANGOS, officersByRango } from '@/data/officers';
import sapdLogo from '@/assets/sapd-logo.png';

const SAPDPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bar-pattern w-full h-2 rounded-full mb-6" />
        <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <img src={sapdLogo} alt="SAPD" width={80} height={80} className="drop-shadow-xl" />
            <div>
              <h1 className="text-gold font-bold text-2xl tracking-wider">SAPD</h1>
              <p className="text-police-blue text-sm">Law Enforcement Record & Police Blacklist</p>
              <p className="text-gold/60 text-xs italic">"To Protect and to Serve"</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Bienvenido a la Base de Datos Oficial de Jerarquía del Departamento de Policía de San Andreas (SAPD). 
            En esta sección se encuentra centralizada y vinculada toda la información correspondiente al personal policial 
            que ha prestado o presta servicio en cualquiera de las dependencias del Estado. Aquí se alojan los expedientes 
            completos de oficiales activos, inactivos, retirados y en comisión de servicios especiales, junto con sus 
            respectivas trayectorias, rangos alcanzados, méritos operativos, asignaciones notables y datos de contacto autorizados.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed mt-2">
            Cada ficha ha sido cuidadosamente elaborada y mantenida por el Departamento de Recursos Humanos en conjunto con la 
            División Administrativa, con el objetivo de garantizar transparencia, trazabilidad y acceso controlado a la información 
            institucional. El uso indebido de esta información será pasible de sanciones administrativas y/o penales según corresponda.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed mt-2 italic">
            Nota: Solo estarán en el apartado de ExPersonal oficiales quienes al presentar su renuncia solicitaran con anterioridad 
            quedar registrados en dicho apartado, asimismo, personal vetado del departamento. Esta base se actualiza de forma periódica.
          </p>
        </div>
        <div className="bar-pattern w-full h-2 rounded-full mb-8" />

        {/* Officers by Rank */}
        {RANGOS.map((rango) => {
          const officers = officersByRango[rango.key];
          return (
            <div key={rango.key} className="mb-8">
              <div className={`bg-gradient-to-r ${rango.color} rounded-t-lg px-4 py-2`}>
                <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'hsl(0 0% 100%)' }}>
                  ★ {rango.label}
                </h2>
              </div>
              <div className="border border-t-0 border-border rounded-b-lg p-4 bg-card/50">
                {officers.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center italic py-4">
                    Sin personal asignado actualmente
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {officers.map((officer) => (
                      <OfficerCard key={officer.id} officer={officer} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SAPDPage;
