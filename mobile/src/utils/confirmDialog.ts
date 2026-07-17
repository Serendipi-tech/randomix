import { Alert, Platform } from 'react-native';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
}

// Alert.alert non è implementato su react-native-web: su web uso window.confirm
export function confirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: ConfirmDialogOptions) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
