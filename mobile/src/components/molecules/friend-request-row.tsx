import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { UserAvatar } from '@/components/atoms/user-avatar';

interface FriendRequestRowProps {
  username: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  acceptLabel: string;
  rejectLabel: string;
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
}

/** Riga di una richiesta di amicizia in arrivo: avatar, username, accetta/rifiuta. */
export function FriendRequestRow({
  username,
  avatarUrl,
  colorScheme,
  acceptLabel,
  rejectLabel,
  onAccept,
  onReject,
  disabled = false,
}: FriendRequestRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <UserAvatar username={username} avatarUrl={avatarUrl} size={40} />
      <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
        {username}
      </Text>
      <Pressable
        onPress={onAccept}
        disabled={disabled}
        hitSlop={8}
        accessibilityLabel={acceptLabel}
        style={[styles.actionButton, { backgroundColor: colors.success }]}>
        <Text style={styles.acceptGlyph}>✓</Text>
      </Pressable>
      <Pressable
        onPress={onReject}
        disabled={disabled}
        hitSlop={8}
        accessibilityLabel={rejectLabel}
        style={[styles.actionButton, { backgroundColor: colors.backgroundSelected }]}>
        <Text style={[styles.rejectGlyph, { color: colors.textSecondary }]}>✕</Text>
      </Pressable>
    </View>
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
  username: {
    flex: 1,
    fontSize: 16,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptGlyph: {
    fontSize: 16,
    color: Colors.light.border,
  },
  rejectGlyph: {
    fontSize: 14,
  },
});
