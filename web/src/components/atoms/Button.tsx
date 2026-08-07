import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'confirm' | 'gradient';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  variant?: ButtonVariant;
  label: string;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'border-0 bg-primary text-text-color',
  secondary: 'border border-primary bg-transparent text-primary',
  ghost: 'border border-border bg-transparent text-border',
  destructive: 'border border-error bg-error/20 text-error',
  confirm: 'border border-success bg-success/20 text-success',
  gradient: 'border-0 bg-gradient-to-br from-secondary to-secondary-gradient text-text-color',
};

// disabled forza sempre l'aspetto ghost, a prescindere dalla variante richiesta (stesso comportamento del Button mobile)
export function Button({ variant = 'primary', label, loading = false, disabled, ...rest }: ButtonProps) {
  const isBlocked = disabled || loading;
  const effectiveVariant: ButtonVariant = disabled ? 'ghost' : variant;

  return (
    <button
      {...rest}
      disabled={isBlocked}
      className={`rounded-[14px] px-6 py-[15px] text-center text-sm font-semibold uppercase tracking-wide transition-transform active:scale-[0.97] disabled:opacity-50 ${VARIANT_CLASSES[effectiveVariant]}`}
    >
      {loading ? <Spinner /> : (label as ReactNode)}
    </button>
  );
}

function Spinner() {
  return <span className="inline-block h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent align-middle" />;
}
