import { StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Users } from 'lucide-react-native';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

type GroupCardProps = {
  name: string;
  description: string | null;
  memberCount: number;
  membersLabel: string;
  roleLabel: string;
  onPress: () => void;
};

/** Card gruppo: badge icona tinto primary, nome + ruolo, descrizione e conteggio membri, freccia a destra.
 *  Card interamente cliccabile via CardShell. */
export function GroupCard({ name, description, memberCount, membersLabel, roleLabel, onPress }: GroupCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.iconBadge, { backgroundColor: hexToRgba(colors.primary, 0.15) }]}>
          <Users size={22} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.role, { color: colors.textColor }]}>{roleLabel}</Text>
          </View>
          {description ? (
            <Text style={[styles.description, { color: colors.textColor }]} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
          <Text style={[styles.meta, { color: colors.textColor }]}>
            {memberCount} {membersLabel}
          </Text>
        </View>
        <View style={[styles.arrow, { backgroundColor: hexToRgba(colors.primary, 0.12) }]}>
          <ChevronRight size={18} color={colors.primary} />
        </View>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontWeight: '700', fontSize: 15 },
  role: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.55 },
  description: { fontSize: 13, opacity: 0.7 },
  meta: { fontSize: 12, opacity: 0.6 },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
