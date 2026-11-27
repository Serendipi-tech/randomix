/** Durate condivise delle animazioni, in millisecondi: stanno qui per non essere riscritte a mano
 *  schermata per schermata. */
export const Motion = {
  /** Comparsa del contenuto al posto di uno skeleton: solo opacità, nessuno spostamento. */
  contentFade: 240,
  /** Apertura/chiusura di una sezione richiudibile. */
  collapse: 200,
} as const;
