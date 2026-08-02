import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/atoms/Button';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type GroupInviteRowProps = {
  groupName: string;
  senderUsername: string;
  /** Testo "da {{sender}}": il placeholder viene sostituito con lo username. */
  fromLabel: string;
  acceptLabel: string;
  rejectLabel: string;
  disabled?: boolean;
  onAccept: () => void;
  onReject: () => void;
};

/** Riga invito gruppo (showcase): nome gruppo + mittente, con Button conferma/rifiuta a tutta larghezza. */
export function GroupInviteRow({
  groupName,
  senderUsername,
  fromLabel,
  acceptLabel,
  rejectLabel,
  disabled,
  onAccept,
  onReject,
}: GroupInviteRowProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell>
      <Text style={[styles.groupName, { color: colors.textColor }]} numberOfLines={1}>
        {groupName}
      </Text>
      <Text style={[styles.sender, { color: colors.textColor }]}>
        {fromLabel.replace('{{sender}}', senderUsername)}
      </Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button variant="confirm" label={acceptLabel} onPress={onAccept} loading={disabled} />
        </View>
        <View style={styles.action}>
          <Button variant="ghost" label={rejectLabel} onPress={onReject} disabled={disabled} />
        </View>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  groupName: { fontWeight: '700', fontSize: 15 },
  sender: { fontSize: 13, opacity: 0.7, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  action: { flex: 1 },
});
