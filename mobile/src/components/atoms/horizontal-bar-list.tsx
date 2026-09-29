import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export interface BarDatum {
  key: string;
  label: string;
  value: number;
  color: string;
}

type HorizontalBarListProps = {
  data: BarDatum[];
};

/** Lista di barre orizzontali generica: etichetta, traccia proporzionale al massimo, valore.
 *  Nessuna logica di dominio — i dati (già ordinati/limitati) arrivano dall'esterno. */
export function HorizontalBarList({ data }: HorizontalBarListProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {data.map((d) => (
        <View key={d.key} style={styles.row}>
          <View style={styles.labelRow}>
            <Text numberOfLines={1} style={[styles.label, { color: colors.textColor }]}>
              {d.label}
            </Text>
            <Text style={[styles.value, { color: colors.disabled }]}>{d.value}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: hexToRgba(colors.border, 0.3) }]}>
            <View
              style={[
                styles.fill,
                { width: `${Math.max((d.value / max) * 100, 4)}%`, backgroundColor: d.color },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { gap: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  label: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  value: { fontSize: 13, fontWeight: '700' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
