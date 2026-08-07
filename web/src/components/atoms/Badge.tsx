interface BadgeProps {
  label: string;
  color: string;
}

// Badge non interattivo: testo/bordo nel colore passato, sfondo nella stessa tinta al 20%.
// color-mix() invece della concatenazione hex+alpha: qui `color` è spesso un riferimento var(--token), non un hex puro.
export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs uppercase"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`, borderColor: color, color }}
    >
      {label}
    </span>
  );
}
