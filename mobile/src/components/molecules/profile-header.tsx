import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { UserAvatar } from '@/components/atoms/user-avatar';

interface ProfileHeaderProps {
  username: string;
  email: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  editLabel: string;
  onEditPress: () => void;
}

/** Intestazione profilo: avatar, username, email e pulsante di modifica. */
export function ProfileHeader({
  username,
  email,
  avatarUrl,
  colorScheme,
  editLabel,
  onEditPress,
}: ProfileHeaderProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
      <UserAvatar username={username} avatarUrl={avatarUrl} size={64} />
      <View style={styles.textZone}>
        <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
          {username}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
          {email}
        </Text>
      </View>
      <Pressable onPress={onEditPress} style={styles.editButton}>
        <Text style={styles.editLabel}>{editLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
  },
  textZone: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 18,
  },
  email: {
    fontSize: 14,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: hexToRgba(Colors.light.primary, 0.14),
  },
  editLabel: {
    fontSize: 14,
    color: Colors.light.primary,
  },
});
