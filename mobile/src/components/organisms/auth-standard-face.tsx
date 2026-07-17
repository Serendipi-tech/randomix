import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Accent, AuthCardSurface, AuthTileSurface } from '@/constants/theme';
import { AuthButton } from '@/components/atoms/auth-button';
import { HighlightChip } from '@/components/atoms/highlight-chip';

type AuthStandardFaceProps = {
  colorScheme: 'light' | 'dark';
  onSignIn: () => void;
};

/** Griglia uniforme: la tile è sempre neutra, solo il badge dell'icona porta colore. */
const TILES = [
  { icon: '📋', badge: Accent.coral },
  { icon: '⭐', badge: Accent.yellow },
  { icon: '👥', badge: Accent.primary },
  { icon: '🎯', badge: Accent.violet },
];

/** Faccia "standard" della card: griglia 2x2 con le funzioni principali + accesso al login. */
export function AuthStandardFace({ colorScheme, onSignIn }: AuthStandardFaceProps) {
  const { t } = useTranslation('auth');
  const textColor = AuthCardSurface[colorScheme].text;
  const labels = t('standard.banners', { returnObjects: true }) as string[];

  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={[styles.headline, { color: textColor }]}>{t('standard.headline')}</Text>
        <HighlightChip label={t('standard.brand')} color={Accent.mint} fontSize={26} />
      </View>

      <View style={styles.grid}>
        {TILES.map((tile, i) => (
          <Tile key={i} icon={tile.icon} badge={tile.badge} label={labels[i]} colorScheme={colorScheme} delay={i * 60} />
        ))}
      </View>

      <AuthButton colorScheme={colorScheme} label={t('standard.cta')} onPress={onSignIn} />
    </View>
  );
}

type TileProps = {
  icon: string;
  badge: string;
  label: string;
  colorScheme: 'light' | 'dark';
  delay: number;
};

function Tile({ icon, badge, label, colorScheme, delay }: TileProps) {
  const textColor = AuthCardSurface[colorScheme].text;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
  }, [progress, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 10 }],
  }));

  return (
    <Animated.View style={[styles.tile, { backgroundColor: AuthTileSurface[colorScheme].fill }, animatedStyle]}>
      <View style={[styles.badge, { backgroundColor: badge }]}>
        <Text style={styles.badgeIcon}>{icon}</Text>
      </View>
      <Text style={[styles.tileLabel, { color: textColor }]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  headerText: { alignItems: 'center', gap: 6 },
  headline: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Fredoka_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '47%',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: 16 },
  tileLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Nunito_500Medium',
  },
});
