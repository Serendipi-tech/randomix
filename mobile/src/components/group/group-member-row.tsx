import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GroupMemberRowProps {
  username: string;
  roleLabel: string;
  removeLabel: string;
  colorScheme: 'light' | 'dark';
  canRemove?: boolean;
  onRemove?: () => void;
}

export function GroupMemberRow({
  username,
  roleLabel,
  removeLabel,
  colorScheme,
  canRemove,
  onRemove,
}: GroupMemberRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.info}>
        <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
          {username}
        </Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>{roleLabel}</Text>
      </View>
      {canRemove && onRemove ? (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
          <Text style={styles.removeLabel}>{removeLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
  role: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  removeBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    backgroundColor: '#E53E3E22',
  },
  removeLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: '#E53E3E',
  },
});
