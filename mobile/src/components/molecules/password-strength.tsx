import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, ShieldAlert, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Tooltip } from '@/components/molecules/tooltip';
import { getPasswordStrength, type PasswordRules } from '@/utils/passwordStrength';

type PasswordStrengthIndicatorProps = {
  password: string;
  colorScheme: 'light' | 'dark';
};

const LEVEL_COLOR = {
  weak: Colors.light.error,
  medium: Colors.light.warning,
  strong: Colors.light.success,
} as const;

const RULE_KEYS: (keyof PasswordRules)[] = ['length', 'letter', 'number', 'special'];

/** Icona di forza password (rosso/giallo/verde): al tap apre una Tooltip col dettaglio delle 4 regole. */
export function PasswordStrengthIndicator({ password, colorScheme }: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation('auth');
  const [open, setOpen] = useState(false);
  const { rules, level } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6}>
        <ShieldAlert size={20} color={LEVEL_COLOR[level]} />
      </Pressable>

      <Tooltip visible={open} placement="top">
        <Text style={styles.title}>{t(`passwordRules.level.${level}`)}</Text>
        {RULE_KEYS.map((key) => (
          <View key={key} style={styles.ruleRow}>
            {rules[key] ? (
              <Check size={15} color={LEVEL_COLOR.strong} />
            ) : (
              <X size={15} color={LEVEL_COLOR.weak} />
            )}
            <Text style={styles.ruleText}>{t(`passwordRules.${key}`)}</Text>
          </View>
        ))}
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: Colors.light.border },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleText: { fontSize: 14, color: Colors.light.border },
});
