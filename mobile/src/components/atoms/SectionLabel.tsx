import { StyleSheet, Text } from 'react-native';
import { Colors, DisplayFonts } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type SectionLabelProps = {
  children: string;
  /** `heading`: titolo di card, pieno e leggibile. Default `label`: uppercase secondaria. */
  variant?: 'label' | 'heading';
};

/** Label uppercase secondaria (filtri, sezioni della bottomsheet di dettaglio) o titolo di card
 *  con `variant="heading"`: puro wrapper di stile. */
export function SectionLabel({ children, variant = 'label' }: SectionLabelProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Text style={[variant === 'heading' ? styles.heading : styles.label, { color: colors.textColor }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  // lineHeight = fontSize e niente font padding: senza, il leading del font aggiunge qualche px
  // sopra le maiuscole e il titolo risulta piu' distante dal bordo alto che da quello sinistro
  heading: {
    fontSize: 18,
    lineHeight: 18,
    includeFontPadding: false,
    // Compensazione ottica: sopra le maiuscole resta lo spazio dell'ascender, che nel glifo non
    // e' inchiostro — senza questo recupero il titolo appare piu' lontano dal bordo alto
    marginTop: -3,
    fontFamily: DisplayFonts.semiBold,
  },
  label: {
    opacity: 0.55,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
