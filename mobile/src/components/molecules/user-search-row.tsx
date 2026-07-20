import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accent, Colors } from '@/constants/theme';
import { UserAvatar } from '@/components/atoms/user-avatar';

interface UserSearchRowProps {
  username: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  /** Se presente, mostra lo stato al posto del bottone di aggiunta. */
  statusLabel?: string | null;
  addLabel: string;
  onAdd: () => void;
  disabled?: boolean;
}

/** Riga di un risultato di ricerca utenti: avatar, username e aggiunta amico. */
export function UserSearchRow({
  username,
  avatarUrl,
  colorScheme,
  statusLabel,
  addLabel,
  onAdd,
  disabled = false,
}: UserSearchRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <UserAvatar username={username} avatarUrl={avatarUrl} size={40} />
      <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
        {username}
      </Text>
      {statusLabel ? (
        <Text style={[styles.status, { color: colors.textSecondary }]}>{statusLabel}</Text>
      ) : (
        <Pressable
          onPress={onAdd}
          disabled={disabled}
          hitSlop={8}
          style={[styles.addButton, disabled && styles.addDisabled]}>
          <Text style={styles.addLabel}>{addLabel}</Text>
        </Pressable>
      )}
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
  status: {
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Accent.primary,
  },
  addDisabled: {
    opacity: 0.6,
  },
  addLabel: {
    fontSize: 14,
    color: '#fff',
  },
});
