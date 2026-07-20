import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GroupInviteRowProps {
  groupName: string;
  senderUsername: string;
  fromLabel: string;
  acceptLabel: string;
  rejectLabel: string;
  colorScheme: 'light' | 'dark';
  disabled?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function GroupInviteRow({
  groupName,
  senderUsername,
  fromLabel,
  acceptLabel,
  rejectLabel,
  colorScheme,
  disabled,
  onAccept,
  onReject,
}: GroupInviteRowProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.info}>
        <Text style={[styles.groupName, { color: colors.text }]} numberOfLines={1}>
          {groupName}
        </Text>
        <Text style={[styles.sender, { color: colors.textSecondary }]}>
          {fromLabel.replace('{{sender}}', senderUsername)}
        </Text>
      </View>
      <View style={styles.actions}>
        {disabled ? (
          <ActivityIndicator size="small" color={colors.textSecondary} />
        ) : (
          <>
            <Pressable
              onPress={onAccept}
              style={[styles.btn, styles.acceptBtn]}
              hitSlop={6}>
              <Text style={styles.acceptLabel}>{acceptLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onReject}
              style={[styles.btn, { backgroundColor: colors.backgroundSelected }]}
              hitSlop={6}>
              <Text style={[styles.rejectLabel, { color: colors.textSecondary }]}>
                {rejectLabel}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  groupName: {
    fontSize: 15,
    fontFamily: 'Fredoka_600SemiBold',
  },
  sender: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 20,
  },
  acceptBtn: {
    backgroundColor: '#6C63FF',
  },
  acceptLabel: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  rejectLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
});
