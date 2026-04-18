import type { PersonalRow } from '@/hooks/useSAPDData';
import { useAdmin } from '@/context/AdminContext';
import { Pencil, Trash2 } from 'lucide-react';

const SIN_FOTO = () => (
  <div className="w-28 h-32 border border-gold flex items-center justify-center bg-muted">
    <span className="text-muted-foreground text-xs font-bold tracking-wider">SIN FOTO</span>
  </div>
);

interface Props {
  officer: PersonalRow;
  onEdit?: (o: PersonalRow) => void;
  onDelete?: (o: PersonalRow) => void;
}

const OfficerCard = ({ officer, onEdit, onDelete }: Props) => {
  const { isAdmin } = useAdmin();

  return (
    <div className="flex gap-5 border-b border-border py-4 relative">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        {officer.imagen_url ? (
          <img
            src={officer.imagen_url}
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

      <div className="flex flex-col justify-center gap-1 text-sm min-w-0 w-full">
        <Row label="NOMBRE" value={officer.nombre} />
        <Row label="RANGO" value={officer.rango?.label ?? ''} />
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

      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit?.(officer)}
            className="p-2 border border-gold text-gold hover:bg-gold hover:text-background transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(officer)}
            className="p-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <p className="flex w-full">
    <span className="text-label font-bold tracking-wider whitespace-nowrap">
      {label}
    </span>

    <span className="text-muted-foreground mx-2">—</span>

    <span
      className={
        label === "NOMBRE"
          ? "bg-yellow-500/80 text-black px-2 py-0.5 w-full"
          : "text-value"
      }
    >
      {value}
    </span>
  </p>
);

export default OfficerCard;
