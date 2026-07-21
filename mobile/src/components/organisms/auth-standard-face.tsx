import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Shuffle, Star, Users } from 'lucide-react-native';
import { Accent } from '@/constants/theme';
import { Button } from '@/components/atoms/button';
import { FeatureRow } from '@/components/molecules/feature-row';
import { Title } from '@/components/molecules/title';
import { darkenColor } from '@/utils/color';

type AuthStandardFaceProps = {
  colorScheme: 'light' | 'dark';
  onSignIn: () => void;
};

type Feature = { title: string; subtitle: string };

/** Gradiente mono-tono (colore base → stessa tinta più scura), un accent diverso per riga. */
const FEATURE_ROWS = [
  { Icon: ClipboardList, tint: Accent.coral, gradient: [Accent.coral, darkenColor(Accent.coral, 0.25)] as const },
  { Icon: Star, tint: Accent.yellow, gradient: [Accent.yellow, darkenColor(Accent.yellow, 0.25)] as const },
  { Icon: Users, tint: Accent.primary, gradient: [Accent.primary, darkenColor(Accent.primary, 0.25)] as const },
  { Icon: Shuffle, tint: Accent.mint, gradient: [Accent.mint, darkenColor(Accent.mint, 0.25)] as const },
];

export function AuthStandardFace({ colorScheme, onSignIn }: AuthStandardFaceProps) {
  const { t } = useTranslation('auth');
  const features = t('standard.features', { returnObjects: true }) as Feature[];

  return (
    <View style={styles.container}>
      <Title variant="lead-accent" lead={t('standard.motto')} accent={t('standard.mottoAccent')} colorScheme={colorScheme} />

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
  rows: { gap: 10 },
});
