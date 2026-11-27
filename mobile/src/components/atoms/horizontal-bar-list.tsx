import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

export interface BarDatum {
  key: string;
  label: string;
  value: number;
  color: string;
  /** Icona opzionale a sinistra della riga: senza, la barra occupa tutta la larghezza. */
  icon?: ComponentType<{ size?: number; color?: string }>;
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
      {data.map((d) => {
        const Icon = d.icon;
        return (
          <View key={d.key} style={styles.row}>
            {Icon && <Icon size={24} color={d.color} />}
            <View style={styles.barColumn}>
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
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barColumn: { flex: 1, gap: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  label: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  value: { fontSize: 13, fontWeight: '700' },
  // Stessa geometria di ProgressBar: altezza 6 e raggio 3, traccia border al 30%
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
