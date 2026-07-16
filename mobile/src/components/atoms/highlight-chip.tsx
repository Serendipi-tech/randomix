import { StyleSheet, Text } from 'react-native';

type HighlightChipProps = {
  label: string;
  color: string;
  textColor?: string;
  fontSize?: number;
};

/** Parola evidenziata dentro un titolo, con sfondo colorato leggermente ruotato. */
export function HighlightChip({ label, color, textColor = '#1F1B2E', fontSize = 34 }: HighlightChipProps) {
  return (
    <Text
      style={[
        styles.chip,
        { backgroundColor: color, color: textColor, fontSize, lineHeight: fontSize * 1.15 },
      ]}
    >
      {' '}
      {label}{' '}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    fontFamily: 'Fredoka_700Bold',
    borderRadius: 12,
    overflow: 'hidden',
    transform: [{ rotateZ: '-2deg' }],
  },
});
