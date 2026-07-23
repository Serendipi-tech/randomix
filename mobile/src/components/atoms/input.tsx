import { StyleSheet, TextInput, type TextInputProps, type TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type InputProps = TextInputProps & {
  colorScheme: 'light' | 'dark';
};

// "none" è valido per outlineStyle su RN Web ma manca dal type TextStyle (limitato a solid/dotted/dashed): cast mirato.
const noWebOutline = { outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as unknown as TextStyle;

/** Campo di testo dell'app: nessuna evidenziazione al focus, di proposito. */
export function Input({ colorScheme, style, ...props }: InputProps) {
  const colors = Colors[colorScheme];
  const fill = hexToRgba(colorScheme === 'light' ? colors.titleColor : colors.border, colorScheme === 'light' ? 0.06 : 0.08);

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: fill,
          color: colors.titleColor,
        },
        noWebOutline,
        style,
      ]}
      placeholderTextColor={colors.placeholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 0,
  },
});
