import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';

type TitleProps = { colorScheme: 'light' | 'dark' } & (
  | { variant?: 'plain'; text: string }
  | { variant: 'lead-accent'; lead: string; accent: string }
);

/** Titolo riusabile: variante "plain" (una riga) o "lead-accent" (due righe, con parola finale in evidenza). */
export function Title(props: TitleProps) {
  const textColor = Colors[props.colorScheme].titleColor;

  if (props.variant === 'lead-accent') {
    return (
      <Text style={styles.title}>
        <Text style={[styles.lead, { color: textColor }]}>
          {props.lead}
          {'\n'}
        </Text>
        <Text style={styles.accent}>{props.accent}</Text>
      </Text>
    );
  }

  return <Text style={[styles.title, styles.plain, { color: textColor }]}>{props.text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    fontWeight: 'bold',
  },
  plain: {
    fontSize: 20,
  },
  lead: {
    fontSize: 17,
    lineHeight: 12,
  },
  accent: {
    fontSize: 26,
    lineHeight: 20,
    color: Colors.light.secondary,
  },
});
