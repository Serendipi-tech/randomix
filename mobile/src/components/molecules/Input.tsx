import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { getPasswordStrength } from '@/utils/passwordStrength';
import { useAppTheme } from '@/utils/useAppTheme';
import { PasswordStrengthIndicator } from '@/components/molecules/PasswordStrengthIndicator';

export type InputVariant = 'text' | 'password' | 'textarea';

// Prop che il componente gestisce internamente: non vanno inoltrate/duplicate dal chiamante
type ControlledTextInputProps =
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'editable'
  | 'secureTextEntry'
  | 'multiline'
  | 'numberOfLines'
  | 'style'
  | 'placeholderTextColor'
  | 'onFocus'
  | 'onBlur';

type InputProps = {
  variant?: InputVariant;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Solo per variant `password`: mostra l'indicatore di forza (default true). */
  showStrength?: boolean;
  /** Stile del contenitore esterno (layout: margini, larghezza...). */
  style?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, ControlledTextInputProps>;

/** Campo di input a tre varianti. Il focus (bordo `primary`) è gestito internamente; la variante
 *  `password` include toggle mostra/nascondi e indicatore di forza. Le altre prop di TextInput
 *  (keyboardType, autoCapitalize, returnKeyType...) vengono inoltrate al campo. */
export function Input({
  variant = 'text',
  value,
  onChangeText,
  placeholder,
  disabled = false,
  showStrength = true,
  style,
  ...textInputProps
}: InputProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation('auth');

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isTextarea = variant === 'textarea';
  const isPassword = variant === 'password';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.foreground,
          borderColor: isFocused ? colors.primary : colors.border,
          alignItems: isTextarea ? 'flex-start' : 'center',
        },
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <TextInput
        {...textInputProps}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
        secureTextEntry={isPassword && !showPassword}
        multiline={isTextarea}
        numberOfLines={isTextarea ? 4 : undefined}
        style={[
          styles.field,
          { color: colors.textColor },
          isTextarea ? styles.textarea : null,
          // Rimuove il contorno di focus del browser su web (non tipizzato in RNWeb)
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
        ]}
      />
      {isPassword && (
        <View style={styles.passwordControls}>
          {showStrength && <PasswordIndicator value={value} t={t} />}
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={13} disabled={disabled}>
            {showPassword ? <EyeOff size={18} color={colors.disabled} /> : <Eye size={18} color={colors.disabled} />}
          </Pressable>
        </View>
      )}
    </View>
  );
}

/** Deriva regole e livello dal valore e li passa all'indicatore (label tradotte via namespace `auth`). */
function PasswordIndicator({ value, t }: { value: string; t: (key: string) => string }) {
  const { rules, level } = getPasswordStrength(value);
  const strengthRules = [
    { label: t('passwordRules.length'), met: rules.length },
    { label: t('passwordRules.letter'), met: rules.letter },
    { label: t('passwordRules.number'), met: rules.number },
    { label: t('passwordRules.special'), met: rules.special },
  ];
  return <PasswordStrengthIndicator rules={strengthRules} level={level} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    gap: 12,
  },
  field: {
    flex: 1,
    fontSize: 14,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  passwordControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
