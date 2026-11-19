import { useMemo } from 'react';

/** Confronta due valori per uguaglianza strutturale, indipendentemente dal riferimento.
 *  Funzione pura (non un hook React), può essere chiamata anche fuori dal render. */
function isValueEqual<T>(initial: T, current: T): boolean {
  // Se i valori sono primitivi uguali, sono uguali
  if (initial === current) {
    return true;
  }

  // Se uno è null/undefined e l'altro no, sono diversi
  if (initial == null || current == null) {
    return initial === current;
  }

  // Per oggetti e array, confronta la rappresentazione JSON
  try {
    return JSON.stringify(initial) === JSON.stringify(current);
  } catch {
    // Se la serializzazione fallisce (es. funzioni, circular references),
    // riserva al confronto per riferimento (fallback conservativo)
    return false;
  }
}

/** Hook che determina se lo stato di un form è "sporco" (diverso dal valore iniziale).
 *  @param initialValue - Il valore iniziale del form (snapshot al primo render)
 *  @param currentValue - Il valore corrente del form
 *  @returns Oggetto con isDirty: true se currentValue !== initialValue, false altrimenti */
export function useDirtyState<T>(initialValue: T, currentValue: T): { isDirty: boolean } {
  const isDirty = useMemo(() => {
    return !isValueEqual(initialValue, currentValue);
  }, [initialValue, currentValue]);

  return { isDirty };
}
