import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type FormErrorProps = {
  message: string;
};

/** Messaggio d'errore generico per una form (più campi insieme): testo più grande e in bold, il rosso sottile su vetro non si leggeva. */
export function FormError({ message }: FormErrorProps) {
  const { colorScheme } = useAppTheme();
  return <Text style={[styles.text, { color: Colors[colorScheme].error }]}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
