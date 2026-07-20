import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { UserAvatar } from '@/components/atoms/user-avatar';

interface FriendRowProps {
  username: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  onPress?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
}

/** Riga di un amico: avatar, username e azioni opzionali di apertura/rimozione. */
export function FriendRow({
  username,
  avatarUrl,
  colorScheme,
  onPress,
  onRemove,
  removeLabel,
}: FriendRowProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <UserAvatar username={username} avatarUrl={avatarUrl} size={40} />
      <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
        {username}
      </Text>
      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityLabel={removeLabel}
          style={[styles.removeButton, { backgroundColor: colors.backgroundSelected }]}>
          <Text style={[styles.removeLabel, { color: colors.textSecondary }]}>✕</Text>
        </Pressable>
      )}
      {onPress && <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 12,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 22,
  },
});
