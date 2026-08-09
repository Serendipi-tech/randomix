import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
}

// Contenitore generico e riusabile per griglie di entità (categorie, tag...). Compatto di proposito:
// solo bordo/sfondo/padding, il contenuto lo decide chi lo usa.
export function Card({ children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex flex-col gap-2 rounded-xl border border-border bg-foreground p-3 ${
        onClick ? 'cursor-pointer text-left hover:bg-background/40' : ''
      }`}
    >
      {children}
    </div>
  );
}
