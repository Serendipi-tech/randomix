import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Button } from '@/components/atoms/Button';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  colorScheme: 'light' | 'dark';
  onConfirm: () => void;
  onCancel: () => void;
}

/** Bottom sheet di conferma per azioni distruttive: usa la shell BottomSheet condivisa + i Button custom
 *  (annulla secondary, conferma destructive). */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  colorScheme,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const colors = Colors[colorScheme];

  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.disabled }]}>{message}</Text>
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button variant="secondary" label={cancelLabel} onPress={onCancel} />
          </View>
          <View style={styles.action}>
            <Button variant="destructive" label={confirmLabel} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 15,
    marginBottom: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  action: {
    flex: 1,
  },
});
