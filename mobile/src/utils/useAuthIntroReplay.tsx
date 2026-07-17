import { createContext, useContext, useMemo, useRef, type PropsWithChildren } from 'react';

type AuthIntroReplayContextValue = {
  /** La schermata auth registra qui la sua funzione di replay quando è montata. */
  register: (replay: (() => void) | null) => void;
  replay: () => void;
};

const AuthIntroReplayContext = createContext<AuthIntroReplayContextValue | null>(null);

/** Ponte fra il bottone globale di refresh (root layout) e l'animazione d'ingresso, che vive solo nella schermata auth. */
export function AuthIntroReplayProvider({ children }: PropsWithChildren) {
  const handlerRef = useRef<(() => void) | null>(null);

  const value = useMemo<AuthIntroReplayContextValue>(
    () => ({
      register: (replay) => {
        handlerRef.current = replay;
      },
      replay: () => handlerRef.current?.(),
    }),
    []
  );

  return <AuthIntroReplayContext.Provider value={value}>{children}</AuthIntroReplayContext.Provider>;
}

export function useAuthIntroReplay() {
  const ctx = useContext(AuthIntroReplayContext);
  if (!ctx) throw new Error('useAuthIntroReplay deve essere usato dentro AuthIntroReplayProvider');
  return ctx;
}
