import { useContext } from 'react';
import { AppThemeContext } from '@/utils/useAppTheme';
import { useSystemColorScheme } from '@/hooks/use-system-color-scheme';

/** Scheme effettivo dell'app: usa l'override manuale (AppThemeProvider) quando disponibile,
 *  così il toggle tema in-app si riflette ovunque; fuori dal provider ricade sullo scheme di sistema. */
export function useColorScheme(): 'light' | 'dark' {
  const ctx = useContext(AppThemeContext);
  const system = useSystemColorScheme() === 'dark' ? 'dark' : 'light';
  return ctx ? ctx.colorScheme : system;
}
