import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Shuffle, Star, Users } from 'lucide-react-native';
import { Accent, CardSurface } from '@/constants/theme';
import { Button } from '@/components/atoms/button';
import { FeatureRow } from '@/components/molecules/feature-row';

type AuthStandardFaceProps = {
  colorScheme: 'light' | 'dark';
  onSignIn: () => void;
};

type Feature = { title: string; subtitle: string };

/** Gradiente "X → violet": stessa coppia di colori già usata per la card CTA in Home e il draw. */
const FEATURE_ROWS = [
  { Icon: ClipboardList, tint: Accent.coral, gradient: [Accent.coral, Accent.violet] as const },
  { Icon: Star, tint: Accent.yellow, gradient: [Accent.yellow, Accent.violet] as const },
  { Icon: Users, tint: Accent.primary, gradient: [Accent.primary, Accent.violet] as const },
  { Icon: Shuffle, tint: Accent.violet, gradient: [Accent.violet, Accent.primary] as const },
];

export function AuthStandardFace({ colorScheme, onSignIn }: AuthStandardFaceProps) {
  const { t } = useTranslation('auth');
  const textColor = CardSurface[colorScheme].text;
  const features = t('standard.features', { returnObjects: true }) as Feature[];

  return (
    <View style={styles.container}>
      <Text style={styles.motto}>
        <Text style={[styles.mottoLead, { color: textColor }]}>{t('standard.motto')}{'\n'}</Text>
        <Text style={styles.mottoAccent}>{t('standard.mottoAccent')}</Text>
      </Text>

      <View style={styles.rows}>
        {FEATURE_ROWS.map((row, i) => (
          <FeatureRow
            key={i}
            Icon={row.Icon}
            tint={row.tint}
            gradient={row.gradient}
            title={features[i].title}
            subtitle={features[i].subtitle}
            colorScheme={colorScheme}
          />
        ))}
      </View>

      <Button colorScheme={colorScheme} label={t('standard.cta')} onPress={onSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 22 },
  motto: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: -0.3,
    fontWeight: 'bold',
  },
  mottoLead: {
    fontSize: 17,
    lineHeight: 12,
  },
  mottoAccent: {
    fontSize: 26,
    lineHeight: 20,
    color: Accent.coral,
  },
  rows: { gap: 10 },
});
