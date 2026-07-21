export type PasswordRules = {
  length: boolean;
  letter: boolean;
  number: boolean;
  special: boolean;
};

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

/** Calcola quali regole soddisfa una password e il livello complessivo (rosso/giallo/verde).
 *  Funzione pura (non un hook React: nessun useState/useEffect), può essere chiamata anche fuori dal render. */
export function getPasswordStrength(password: string) {
  const rules: PasswordRules = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  const score = Object.values(rules).filter(Boolean).length;
  const level: PasswordStrengthLevel = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';

  return { rules, score, level };
}
