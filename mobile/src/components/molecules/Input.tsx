import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Check, Eye, EyeOff, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { isPasswordValid } from '@/utils/passwordStrength';
import { useAppTheme } from '@/utils/useAppTheme';

type ThemeColors = typeof Colors.light | typeof Colors.dark;

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
  /** Etichetta sopra il campo; con `required` mostra un asterisco rosso accanto. */
  label?: string;
  required?: boolean;
  /** Solo per variant `textarea`: altezza minima personalizzata (default 80). */
  textareaMinHeight?: number;
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
  label,
  required = false,
  textareaMinHeight,
  style,
  maxLength,
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
    <View style={style}>
      {(label || maxLength) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={[styles.label, { color: colors.textColor }]}>
              {label}
              {required && <Text style={{ color: colors.error }}> *</Text>}
            </Text>
          )}
          {maxLength && (
            <Text style={[styles.counter, { color: colors.disabled }]}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.foreground,
            borderColor: isFocused ? colors.primary : colors.border,
            alignItems: isTextarea ? 'flex-start' : 'center',
          },
          disabled ? styles.disabled : null,
        ]}
      >
        <TextInput
          {...textInputProps}
          maxLength={maxLength}
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
            isTextarea ? [styles.textarea, textareaMinHeight != null ? { minHeight: textareaMinHeight } : null] : null,
            // Rimuove il contorno di focus del browser su web (non tipizzato in RNWeb)
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
          ]}
        />
        {isPassword && (
          <View style={styles.passwordControls}>
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={13} disabled={disabled}>
              {showPassword ? <EyeOff size={18} color={colors.disabled} /> : <Eye size={18} color={colors.disabled} />}
            </Pressable>
          </View>
        )}
      </View>
      {isPassword && showStrength && <PasswordChecklist value={value} t={t} colors={colors} />}
    </View>
  );
}

/** Spunta live il vincolo reale (8 caratteri) mentre l'utente scrive, sempre visibile sotto il
 *  campo (niente tap su un'icona): niente da scoprire solo dopo aver provato a inviare. */
function PasswordChecklist({ value, t, colors }: { value: string; t: (key: string) => string; colors: ThemeColors }) {
  if (!value) return null;
  const valid = isPasswordValid(value);
  const tickColor = valid ? colors.success : colors.error;

  return (
    <View style={styles.checklistRow}>
      {valid ? <Check size={14} color={tickColor} /> : <X size={14} color={tickColor} />}
      <Text style={[styles.checklistText, { color: tickColor }]}>{t('passwordRules.length')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  counter: {
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    gap: 12,
  },
  field: {
    flex: 1,
    fontSize: 16,
    // Su web il TextInput è un <input> reale: senza questo eredita lo sfondo bianco di
    // default del browser invece di lasciar vedere il container tintato sotto (su nativo
    // è già trasparente di default, nessun impatto lì).
    backgroundColor: 'transparent',
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
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  checklistText: {
    fontSize: 13,
  },
  disabled: {
    opacity: 0.5,
  },
});
