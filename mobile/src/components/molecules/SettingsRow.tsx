import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type SettingsRowProps = {
  label: string;
  /** Valore corrente a destra dell'etichetta (es. l'email in uso): solo lettura. */
  value?: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
  /** Azione distruttiva (logout, eliminazione): riga in rosso e senza freccia. */
  destructive?: boolean;
};

const ICON_SIZE = 18;
const CHEVRON_SIZE = 18;

/** Riga di una lista di impostazioni: riquadro icona, etichetta, valore corrente e freccia di
 *  navigazione. Puro render da props. */
export function SettingsRow({ label, value, icon: Icon, onPress, destructive = false }: SettingsRowProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const tint = destructive ? colors.error : colors.textColor;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: hexToRgba(destructive ? colors.error : colors.primary, 0.18) },
        ]}
      >
        <Icon size={ICON_SIZE} color={tint} />
      </View>
      <Text
        style={[styles.label, value ? styles.labelShrink : styles.labelGrow, { color: tint }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {value ? (
        <Text style={[styles.value, { color: colors.disabled }]} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {!destructive && <ChevronRight size={CHEVRON_SIZE} color={colors.disabled} strokeWidth={2.5} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 56,
    paddingHorizontal: Spacing.three,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Senza valore l'etichetta occupa la riga e spinge la freccia a destra
  labelGrow: {
    flex: 1,
  },
  labelShrink: {
    flexShrink: 1,
  },
  // Il valore si restringe prima dell'etichetta: con un'email lunga tronca il valore, non il label
  value: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});
