import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type OptionRowProps = {
  title: string;
  /** Riga secondaria opzionale sotto al titolo. */
  subtitle?: string;
  /** Icona opzionale a sinistra, dentro un riquadro tintato. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  /** Stato selezionato: sfondo tintato + spunta a destra. */
  active?: boolean;
  onPress?: () => void;
};

/** Riga riutilizzabile "icona a sinistra + testo": titolo (+ sottotitolo), con stato `active`
 *  (evidenziazione + ✓). Puro render da props, nessuna logica. */
export function OptionRow({ title, subtitle, icon: Icon, active = false, onPress }: OptionRowProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress} style={[styles.row, active && { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
      {Icon && (
        <View style={[styles.iconWrap, { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
          <Icon size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.texts}>
        <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.disabled }]}>{subtitle}</Text> : null}
      </View>
      {active && <Check size={18} color={colors.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
});
