import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { UserAvatar } from '@/components/atoms/user-avatar';

interface FriendRowProps {
  username: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
}

/** Riga di un amico: avatar e username. */
export function FriendRow({ username, avatarUrl, colorScheme }: FriendRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <UserAvatar username={username} avatarUrl={avatarUrl} size={40} />
      <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
        {username}
      </Text>
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
    fontFamily: 'Nunito_500Medium',
  },
});
