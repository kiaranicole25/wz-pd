import NavBar from '@/components/NavBar';
import OfficerCard from '@/components/OfficerCard';
import { RANGOS, officersByRango } from '@/data/officers';

const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_the_Los_Angeles_Police_Department.png/250px-Seal_of_the_Los_Angeles_Police_Department.png';

const SAPDPage = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="bg-accent-bar h-[2px] mb-8" />
        <div className="border border-border p-8 mb-8">
          <div className="flex items-start gap-6">
            <img src={LOGO_URL} alt="SAPD" width={90} height={90} className="shrink-0" />
            <div>
              <h1 className="text-gold font-bold text-2xl tracking-[0.3em] mb-2">SAPD</h1>
              <p className="text-muted-foreground text-xs tracking-wider uppercase mb-4">
                Law Enforcement Record & Police Blacklist — "To Protect and to Serve"
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bienvenido a la Base de Datos Oficial de Jerarquía del Departamento de Policía de San Andreas (SAPD). 
                En esta sección se encuentra centralizada y vinculada toda la información correspondiente al personal policial 
                que ha prestado o presta servicio en cualquiera de las dependencias del Estado. Aquí se alojan los expedientes 
                completos de oficiales activos, inactivos, retirados y en comisión de servicios especiales, junto con sus 
                respectivas trayectorias, rangos alcanzados, méritos operativos, asignaciones notables y datos de contacto autorizados.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Cada ficha ha sido cuidadosamente elaborada y mantenida por el Departamento de Recursos Humanos en conjunto con la 
                División Administrativa. El uso indebido de esta información será pasible de sanciones administrativas y/o penales.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3 italic">
                Nota: Solo estarán en el apartado de ExPersonal oficiales quienes al presentar su renuncia solicitaran con anterioridad 
                quedar registrados en dicho apartado. Esta base se actualiza de forma periódica.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-accent-bar h-[2px] mb-10" />

        {/* Officers by Rank */}
        {RANGOS.map((rango) => {
          const officers = officersByRango[rango.key];
          return (
            <div key={rango.key} className="mb-8">
              <div className="bg-header px-5 py-3 border-l-4 border-gold">
                <h2 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">
                  ★ {rango.label}
                </h2>
              </div>
              <div className="border border-t-0 border-border px-5">
                {officers.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8 tracking-wider uppercase">
                    Sin personal asignado actualmente
                  </p>
                ) : (
                  officers.map((officer) => (
                    <OfficerCard key={officer.id} officer={officer} />
                  ))
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
