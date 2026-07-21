import { useState } from 'react';
import { Pressable, StyleSheet, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Input } from '@/components/atoms/input';
import { InputSurface } from '@/constants/theme';
import { PasswordStrengthIndicator } from '@/components/molecules/password-strength';

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  colorScheme: 'light' | 'dark';
  /** Mostra l'icona di forza (rosso/giallo/verde) a sinistra dell'occhio, con tooltip al tap. */
  showStrength?: boolean;
};

/** Campo password: come Input ma con occhio per mostrare/nascondere il testo digitato. */
export function PasswordInput({ colorScheme, style, showStrength, value, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const iconColor = InputSurface[colorScheme].placeholder;

  return (
    <View style={styles.wrap}>
      <Input
        colorScheme={colorScheme}
        secureTextEntry={!visible}
        value={value}
        style={[styles.input, showStrength && styles.inputWithStrength, style]}
        {...props}
      />
      <View style={styles.icons}>
        {showStrength && (
          <PasswordStrengthIndicator password={typeof value === 'string' ? value : ''} colorScheme={colorScheme} />
        )}
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          {visible ? <EyeOff size={20} color={iconColor} /> : <Eye size={20} color={iconColor} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  input: { paddingRight: 46 },
  inputWithStrength: { paddingRight: 80 },
  icons: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
