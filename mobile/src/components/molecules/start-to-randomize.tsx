import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

const ROTATION_DURATION = 1400;
const BOUNCE_DURATION = 900;

type StartToRandomizeProps = {
  colorScheme: 'light' | 'dark';
};

/** Etichetta sotto il logo, in stile "badge" giocoso: pillola colorata, icona cerchiata che gira, micro-bounce in loop. */
export function StartToRandomize({ colorScheme }: StartToRandomizeProps) {
  const { t } = useTranslation('auth');
  const colors = Colors[colorScheme];
  const rotate = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: ROTATION_DURATION, easing: Easing.linear }), -1);
    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: BOUNCE_DURATION / 2, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: BOUNCE_DURATION / 2, easing: Easing.in(Easing.quad) })
      ),
      -1
    );
  }, [rotate, bounce]);

  const arrowsStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotate.value}deg` }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bounce.value * 3 }, { scale: 1 + bounce.value * 0.03 }],
  }));

  return (
    <Animated.View
      style={[
        styles.pill,
        pillStyle,
        { backgroundColor: hexToRgba(colors.secondary, 0.18), borderColor: hexToRgba(colors.secondary, 0.5) },
      ]}
    >
      <Animated.View style={[styles.iconBadge, arrowsStyle, { backgroundColor: colors.secondary }]}>
        <RefreshCw size={13} color={colors.textColor} strokeWidth={2.75} />
      </Animated.View>
      <Text style={[styles.label, { color: colors.secondary }]}>{t('standard.intro')}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontFamily: Fonts?.rounded,
  },
});
