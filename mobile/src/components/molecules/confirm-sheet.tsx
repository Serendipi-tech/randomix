import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Accent, Colors } from '@/constants/theme';

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

/** Bottom sheet di conferma per azioni distruttive: backdrop + pulsanti conferma/annulla. */
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

        <Pressable onPress={onConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmLabel}>{confirmLabel}</Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          style={[styles.cancelButton, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.cancelLabel, { color: colors.text }]}>{cancelLabel}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    gap: 12,
  },
  title: {
    fontSize: 20,
  },
  message: {
    fontSize: 15,
    marginBottom: 8,
  },
  confirmButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: Accent.coral,
  },
  confirmLabel: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelLabel: {
    fontSize: 16,
  },
});
