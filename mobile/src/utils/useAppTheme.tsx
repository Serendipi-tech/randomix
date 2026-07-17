import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

type Scheme = 'light' | 'dark';

type AppThemeContextValue = {
  colorScheme: Scheme;
  toggleColorScheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

/** Override manuale del tema, applicato a monte di tutta l'app: parte dal tema di sistema finché l'utente non lo cambia col toggle. */
export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme: Scheme = useSystemColorScheme() === 'dark' ? 'dark' : 'light';
  const [override, setOverride] = useState<Scheme | null>(null);
  const colorScheme = override ?? systemScheme;

  const toggleColorScheme = useCallback(() => {
    setOverride(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme]);

  const value = useMemo(() => ({ colorScheme, toggleColorScheme }), [colorScheme, toggleColorScheme]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error('useAppTheme deve essere usato dentro AppThemeProvider');
  return ctx;
}
