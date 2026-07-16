import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthCardSurface } from '@/constants/theme';

type AuthCardProps = PropsWithChildren<{
  colorScheme: 'light' | 'dark';
}>;

/** Card opaca ad alto contrasto sopra l'AuthBackground, senza blur/trasparenza. */
export function AuthCard({ colorScheme, children }: AuthCardProps) {
  const surface = AuthCardSurface[colorScheme];

  return <View style={[styles.card, { backgroundColor: surface.fill }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 10,
  },
});
