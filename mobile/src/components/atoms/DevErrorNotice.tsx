import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type DevErrorNoticeProps = {
  /** Errore della query/mutation da mostrare; `null` non rende nulla. */
  error: Error | null;
  /** Nome della query, per capire al volo quale chiamata è fallita. */
  source?: string;
};

/** Dettaglio tecnico di un errore, visibile SOLO in sviluppo: in build di produzione non rende mai
 *  nulla, così l'utente finale vede solo il messaggio generico della schermata. */
export function DevErrorNotice({ error, source }: DevErrorNoticeProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  if (!__DEV__ || !error) return null;

  return (
    <View style={[styles.box, { backgroundColor: hexToRgba(colors.error, 0.12), borderColor: hexToRgba(colors.error, 0.45) }]}>
      <Text style={[styles.label, { color: colors.error }]}>DEV{source ? ` · ${source}` : ''}</Text>
      <Text style={[styles.message, { color: colors.textColor }]}>{error.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    lineHeight: 19,
  },
});
