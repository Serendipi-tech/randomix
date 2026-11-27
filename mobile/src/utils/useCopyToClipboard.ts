import * as Clipboard from 'expo-clipboard';
import { useToast } from '@/utils/useToast';

/** Copia un testo negli appunti e conferma con un toast: il messaggio lo decide il chiamante,
 *  cosi' l'hook resta indipendente dai namespace di traduzione. */
export function useCopyToClipboard() {
  const toast = useToast();

  const copy = async (value: string, successMessage: string) => {
    await Clipboard.setStringAsync(value);
    toast.success(successMessage);
  };

  return { copy };
}
