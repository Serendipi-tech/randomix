interface ChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

// Chip selezionabile: sfondo/bordo pieni sul primary quando attivo, outline quando inattivo.
export function Chip({ label, selected, disabled = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide text-text-color transition-transform active:scale-[0.96] disabled:opacity-40 ${
        selected ? 'border-primary bg-primary' : 'border-border bg-transparent'
      }`}
    >
      {label}
    </button>
  );
}
