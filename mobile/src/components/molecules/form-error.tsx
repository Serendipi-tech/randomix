import { StyleSheet, Text } from 'react-native';
import { StatusColor } from '@/constants/theme';

type FormErrorProps = {
  message: string;
};

/** Messaggio d'errore generico per una form (più campi insieme): testo più grande e in bold, il rosso sottile su vetro non si leggeva. */
export function FormError({ message }: FormErrorProps) {
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: StatusColor.danger,
    textAlign: 'center',
  },
});
