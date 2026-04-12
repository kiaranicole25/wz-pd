import type { Officer } from '@/data/officers';
import officerPlaceholder from '@/assets/officer-placeholder.jpg';

interface OfficerCardProps {
  officer: Officer;
}

const OfficerCard = ({ officer }: OfficerCardProps) => {
  return (
    <div className="flex gap-4 bg-card border border-border rounded-lg p-4 animate-fade-in hover:border-primary/30 transition-colors">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <img
          src={officer.imagen || officerPlaceholder}
          alt={officer.nombre}
          loading="lazy"
          width={100}
          height={100}
          className="w-24 h-24 rounded-md object-cover border-2 border-primary/50"
        />
        <span className="text-xs text-muted-foreground font-mono">{officer.expediente}</span>
      </div>
      <div className="flex flex-col gap-1 min-w-0 text-sm">
        <p><span className="text-gold font-semibold">Nombre:</span> <span className="text-foreground">{officer.nombre}</span></p>
        <p><span className="text-gold font-semibold">Rango:</span> <span className="text-foreground">{officer.rango}</span></p>
        <p><span className="text-gold font-semibold">Cargo:</span> <span className="text-foreground">{officer.cargo}</span></p>
        <p><span className="text-gold font-semibold">División:</span> <span className="text-foreground">{officer.division}</span></p>
        <p><span className="text-gold font-semibold">Placa:</span> <span className="text-foreground">{officer.placa}</span></p>
        <p className="mt-1 text-xs text-muted-foreground italic">📝 Notas: {officer.notas}</p>
      </div>
    </div>
  );
};

export default OfficerCard;
