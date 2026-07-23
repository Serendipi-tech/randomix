import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Shuffle, Star, Users } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
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
  { Icon: ClipboardList, tint: Colors.light.secondary, gradient: [Colors.light.secondary, darkenColor(Colors.light.secondary, 0.25)] as const },
  { Icon: Star, tint: Colors.light.warning, gradient: [Colors.light.warning, darkenColor(Colors.light.warning, 0.25)] as const },
  { Icon: Users, tint: Colors.light.accent, gradient: [Colors.light.accent, darkenColor(Colors.light.accent, 0.25)] as const },
  { Icon: Shuffle, tint: Colors.light.success, gradient: [Colors.light.success, darkenColor(Colors.light.success, 0.25)] as const },
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
