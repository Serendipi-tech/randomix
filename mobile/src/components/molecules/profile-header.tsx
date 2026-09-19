import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Avatar } from '@/components/atoms/Avatar';

const AVATAR_SIZE = 96;

interface ProfileHeaderProps {
  username: string;
  email: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  editLabel: string;
  onEditPress: () => void;
}

/** Hero del profilo: avatar grande che sfonda il bordo superiore della card, username/email
 *  centrati sotto. Il trigger di modifica è la matita in overlay sull'avatar, non un bottone testuale. */
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
    <View style={styles.wrap}>
      <View style={[styles.card, { backgroundColor: colors.foreground }]}>
        <View style={styles.avatarSpacer} />
        <Text style={[styles.username, { color: colors.textColor }]} numberOfLines={1}>
          {username}
        </Text>
        <Text style={[styles.email, { color: colors.disabled }]} numberOfLines={1}>
          {email}
        </Text>
      </View>

      <View style={styles.avatarOverlay} pointerEvents="box-none">
        <View>
          <Avatar uri={avatarUrl ?? undefined} fallbackColor={colors.primary} size={AVATAR_SIZE} />
          <Pressable
            onPress={onEditPress}
            hitSlop={8}
            accessibilityLabel={editLabel}
            style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}
          >
            <Pencil size={14} color={colors.textColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    // ancora di posizionamento per l'avatar assoluto sotto
    position: 'relative',
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 2,
  },
  avatarSpacer: {
    height: AVATAR_SIZE / 2,
  },
  avatarOverlay: {
    position: 'absolute',
    top: -(AVATAR_SIZE / 2),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  email: {
    fontSize: 14,
  },
});
