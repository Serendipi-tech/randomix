import { StyleSheet, Text } from 'react-native';
import { Colors, DisplayFonts } from '@/constants/theme';

type TitleProps = { colorScheme: 'light' | 'dark' } & (
  | { variant?: 'plain'; text: string }
  | { variant: 'lead-accent'; lead: string; accent: string }
  | { variant: 'display'; lead: string; accent: string }
);

/** Titolo riusabile: "plain" (una riga), "lead-accent" (due righe, parola finale in evidenza)
 *  o "display" (due righe grandi e inclinate, usato da onboarding e schermate auth). */
export function Title(props: TitleProps) {
  const textColor = Colors[props.colorScheme].textColor;

  if (props.variant === 'display') {
    return (
      <Text style={styles.display}>
        <Text style={{ color: textColor }}>
          {props.lead}
          {'\n'}
        </Text>
        <Text style={{ color: Colors[props.colorScheme].secondary }}>{props.accent}</Text>
      </Text>
    );
  }

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
  // Righe ravvicinate e titolo appena inclinato: stessa identità visiva dell'onboarding
  display: {
    fontSize: 38,
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: -0.4,
    fontFamily: DisplayFonts.extraBold,
    transform: [{ rotate: '-2deg' }],
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
