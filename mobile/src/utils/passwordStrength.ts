/** Unico vincolo reale sulla password dell'account: minimo 8 caratteri (coerente col messaggio
 *  d'errore mostrato in registrazione/reset/cambio password). Funzione pura, chiamabile anche
 *  fuori dal render. */
export function isPasswordValid(password: string): boolean {
  return password.length >= 8;
}
