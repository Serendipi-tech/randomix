/** Partecipante a un sorteggio con la bottiglia: un nome scritto a mano o un amico scelto dalla
 *  lista, che porta con se' avatar e id. */
export type Participant = {
  /** Presente solo per gli amici: distingue la stessa persona da un omonimo scritto a mano. */
  friendId?: string;
  name: string;
  avatarUrl: string | null;
};

/** Iniziali del nome, al massimo due lettere: identificano il partecipante quando sulla ruota non
 *  c'e' spazio per il nome intero. */
export function participantInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
