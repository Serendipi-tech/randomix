import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type ChallengeCardProps = {
  title: string;
  groupName?: string;
  timeframe?: string;
  progress: number;
  goal: number;
  favorite: boolean;
  onFavoriteToggle: () => void;
  status: string;
};

/** Card sfida: bordo a gradiente secondary -> secondaryGradient, avanzamento con ProgressBar
 *  e stella preferiti con rimbalzo animato al toggle. */
export function ChallengeCard({
  title,
  groupName,
  timeframe,
  progress,
  goal,
  favorite,
  onFavoriteToggle,
  status,
}: ChallengeCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const pct = Math.round((progress / (goal || 1)) * 100);

  const starScale = useSharedValue(1);
  const starStyle = useAnimatedStyle(() => ({ transform: [{ scale: starScale.value }] }));

  const handleToggle = () => {
    // Rimbalzo della stella al toggle del preferito
    starScale.value = withSequence(withSpring(1.4, { damping: 6 }), withSpring(1, { damping: 8 }));
    onFavoriteToggle();
  };

  return (
    <CardShell borderColor="transparent" backgroundColor="transparent" borderWidth={0}>
      {/* Margine negativo per annullare il padding del guscio: il bordo gradiente riempie l'intera card */}
      <View style={styles.fullBleed}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.inner, { backgroundColor: colors.foreground }]}>
            {groupName && <Text style={[styles.groupName, { color: colors.secondary }]}>{groupName}</Text>}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
                <StatusBadge label={status} color={colors.info} />
              </View>
              <View style={styles.headerBottom}>
                {timeframe && <Text style={[styles.meta, { color: colors.textColor }]}>{timeframe}</Text>}
                <Text style={[styles.meta, { color: colors.textColor }]}>
                  {progress} / {goal} completati
                </Text>
              </View>
            </View>
            <ProgressBar value={pct} />
          </View>
        </LinearGradient>
        <Pressable onPress={handleToggle} hitSlop={8} style={styles.star}>
          <Animated.View style={starStyle}>
            <Star size={28} color={colors.warning} fill={favorite ? colors.warning : colors.background} strokeWidth={2} />
          </Animated.View>
        </Pressable>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  fullBleed: { margin: -16 },
  gradientBorder: { borderRadius: 12, padding: 2 },
  inner: { borderRadius: 10, padding: 16 },
  groupName: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  header: { marginBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 2 },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 12, opacity: 0.7 },
  star: { position: 'absolute', top: 8, right: 8 },
});
