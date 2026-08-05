import { resolveListIcon } from '@/constants/list-icons';
import { getLucideIcon } from '@/utils/lucideIconRegistry';

/** Risolve il valore salvato in `list.icon` sul componente icona: prova prima come nome export
 *  Lucide (nuovo picker, es. "BookSearch"), poi come chiave legacy del set fisso (`ListIconKey`). */
export function resolvePreviewIcon(value: string) {
  return getLucideIcon(value) ?? resolveListIcon(value);
}
