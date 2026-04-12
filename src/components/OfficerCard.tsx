import type { Officer } from '@/data/officers';

const SIN_FOTO = () => (
  <div className="w-28 h-32 border border-gold flex items-center justify-center bg-muted">
    <span className="text-muted-foreground text-xs font-bold tracking-wider">SIN FOTO</span>
  </div>
);

const OfficerCard = ({ officer }: { officer: Officer }) => {
  return (
    <div className="flex gap-5 border-b border-border py-4">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        {officer.imagen ? (
          <img
            src={officer.imagen}
            alt={officer.nombre}
            loading="lazy"
            width={112}
            height={128}
            className="w-28 h-32 object-cover border border-gold"
          />
        ) : (
          <SIN_FOTO />
        )}
        <span className="text-xs text-muted-foreground font-mono">
          {officer.expediente}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-1 text-sm min-w-0">
        <Row label="NOMBRE" value={officer.nombre} />
        <Row label="RANGO" value={officer.rango} />
        <Row label="CARGO" value={officer.cargo} />
        <Row label="DIVISIÓN" value={officer.division} />
        <Row label="PLACA" value={officer.placa} />
        <Row label="EXPEDIENTE" value={officer.expediente} />

        <div className="mt-2">
          <span className="text-muted-foreground text-xs">
            NOTAS: {officer.notas}
          </span>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <p>
    <span className="text-label font-bold tracking-wider">{label}</span>
    <span className="text-muted-foreground mx-2">—</span>

    <span
      className={
        label === "NOMBRE"
          ? "bg-yellow-400 text-black px-2 py-0.5 rounded"
          : "text-value"
      }
    >
      {value}
    </span>
  </p>
);

export default OfficerCard;
