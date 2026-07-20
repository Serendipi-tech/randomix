import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GroupCardProps {
  name: string;
  description: string | null;
  memberCount: number;
  myRole: string;
  membersLabel: string;
  roleLabel: string;
  colorScheme: 'light' | 'dark';
  onPress: () => void;
}

export function GroupCard({
  name,
  description,
  memberCount,
  membersLabel,
  roleLabel,
  colorScheme,
  onPress,
}: GroupCardProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>{roleLabel}</Text>
      </View>
      {description ? (
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        {memberCount} {membersLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.75,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Fredoka_600SemiBold',
  },
  role: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  meta: {
    fontSize: 12,
    fontFamily: 'Nunito_500Medium',
    marginTop: Spacing.one,
  },
});
