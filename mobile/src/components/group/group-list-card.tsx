import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GroupListCardProps {
  name: string;
  icon: string;
  color: string;
  description: string | null;
  memberListCount: number;
  memberListCountLabel: string;
  colorScheme: 'light' | 'dark';
  onPress: () => void;
}

export function GroupListCard({
  name,
  icon,
  color,
  description,
  memberListCount,
  memberListCountLabel,
  colorScheme,
  onPress,
}: GroupListCardProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconBadge, { backgroundColor: color + '33' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        {description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{memberListCountLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.75,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Fredoka_600SemiBold',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  meta: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
  },
});
