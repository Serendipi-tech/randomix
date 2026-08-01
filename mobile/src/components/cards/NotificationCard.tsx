import { StyleSheet, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';

type NotificationCardProps = {
  title: string;
  body?: string;
  time?: string;
  unread?: boolean;
};

/** Card notifica: icona a sinistra, titolo con pallino `unread` opzionale, corpo e orario. */
export function NotificationCard({ title, body, time, unread = false }: NotificationCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: hexToRgba(colors.primary, 0.15) }]}>
          <Bell size={18} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
            {unread && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>
          {body && <Text style={[styles.body, { color: colors.textColor }]}>{body}</Text>}
          {time && <Text style={[styles.time, { color: colors.textColor }]}>{time}</Text>}
        </View>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  body: {
    fontSize: 14,
    opacity: 0.8,
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 2,
  },
});
