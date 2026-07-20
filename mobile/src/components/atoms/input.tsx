import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { CardSurface, InputSurface } from '@/constants/theme';

type InputProps = TextInputProps & {
  colorScheme: 'light' | 'dark';
};

/** Campo di testo dell'app: nessuna evidenziazione al focus, di proposito. */
export function Input({ colorScheme, style, ...props }: InputProps) {
  const surface = InputSurface[colorScheme];
  const textColor = CardSurface[colorScheme].text;

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: surface.fill,
          color: textColor,
        },
        style,
      ]}
      placeholderTextColor={surface.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    // rimuove l'outline nativo del browser su web (RN Web-only)
    outlineWidth: 0,
  },
});
