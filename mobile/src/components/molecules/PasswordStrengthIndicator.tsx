import { StyleSheet, Text, View } from 'react-native';
import { Check, ShieldAlert, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { Tooltip } from '@/components/molecules/Tooltip';

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

type PasswordStrengthRule = { label: string; met: boolean };

type PasswordStrengthIndicatorProps = {
  rules: PasswordStrengthRule[];
  level: PasswordStrengthLevel;
};

/** Set di regole d'esempio riutilizzabile dal chiamante. */
export const PASSWORD_STRENGTH_RULES: PasswordStrengthRule[] = [
  { label: 'At least 8 characters', met: true },
  { label: 'Contains a letter', met: true },
  { label: 'Contains a number', met: false },
  { label: 'Contains a special character', met: false },
];

/** Icona scudo colorata per livello che, al tap, mostra via `Tooltip` il pannello con le regole
 *  soddisfatte/mancanti. Animazione e posizionamento del pannello delegati a `Tooltip`. */
export function PasswordStrengthIndicator({ rules, level }: PasswordStrengthIndicatorProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const levelColor = { weak: colors.error, medium: colors.warning, strong: colors.success }[level];

  const trigger = <ShieldAlert size={20} color={levelColor} />;

  const content = (
    <>
      <Text style={[styles.title, { color: colors.textColor }]}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
      {rules.map((rule) => (
        <View key={rule.label} style={styles.ruleRow}>
          {rule.met ? <Check size={15} color={colors.success} /> : <X size={15} color={colors.error} />}
          <Text style={[styles.ruleLabel, { color: colors.textColor }]}>{rule.label}</Text>
        </View>
      ))}
    </>
  );

  return <Tooltip trigger={trigger} content={content} />;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleLabel: {
    fontSize: 14,
  },
});
