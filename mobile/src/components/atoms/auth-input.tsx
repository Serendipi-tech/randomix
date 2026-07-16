import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { Accent, AuthCardSurface, AuthInputSurface } from '@/constants/theme';

type AuthInputProps = TextInputProps & {
  colorScheme: 'light' | 'dark';
};

/** Campo di testo per le schermate di autenticazione, con bordo colorato animato al focus. */
export function AuthInput({ colorScheme, style, onFocus, onBlur, ...props }: AuthInputProps) {
  const surface = AuthInputSurface[colorScheme];
  const textColor = AuthCardSurface[colorScheme].text;
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: surface.fill,
          color: textColor,
          borderColor: focused ? Accent.primary : 'transparent',
        },
        style,
      ]}
      placeholderTextColor={surface.placeholder}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
  },
});
