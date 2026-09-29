import { StyleSheet, View } from 'react-native';

export interface SplitBarSegment {
  value: number;
  color: string;
}

type SplitBarProps = {
  segments: [SplitBarSegment, SplitBarSegment];
  trackColor: string;
};

const SEGMENT_GAP = 2;

/** Barra orizzontale a due segmenti proporzionali (es. accettati/rigenerati), nessuna logica di dominio. */
export function SplitBar({ segments, trackColor }: SplitBarProps) {
  const total = segments[0].value + segments[1].value || 1;
  const [first, second] = segments;

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <View style={[styles.segment, styles.first, { flex: first.value / total, backgroundColor: first.color }]} />
      <View style={{ width: SEGMENT_GAP }} />
      <View style={[styles.segment, styles.last, { flex: second.value / total, backgroundColor: second.color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' },
  segment: { height: '100%' },
  first: { borderTopLeftRadius: 7, borderBottomLeftRadius: 7 },
  last: { borderTopRightRadius: 7, borderBottomRightRadius: 7 },
});
