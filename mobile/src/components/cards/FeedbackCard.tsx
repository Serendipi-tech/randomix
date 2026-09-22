import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bug, Lightbulb, MessageCircle, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import type { FeedbackItem } from '@/utils/useFeedbacks';

const TYPE_ICON = { BUG: Bug, SUGGESTION: Lightbulb, COMMENT: MessageCircle } as const;

type FeedbackCardProps = {
  item: FeedbackItem;
  deletable: boolean;
  onDelete: () => void;
};

/** Card di un feedback personale: icona per tipo, titolo (o inizio testo se manca), testo,
 *  badge di stato e data. Il cestino è visibile solo se `deletable` (regola lato dominio, non qui). */
export function FeedbackCard({ item, deletable, onDelete }: FeedbackCardProps) {
  const { t } = useTranslation('feedback');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const Icon = TYPE_ICON[item.type];
  const tint = item.type === 'BUG' ? colors.error : item.type === 'SUGGESTION' ? colors.warning : colors.primary;
  const statusColor =
    item.status === 'SENT' ? colors.info : item.status === 'PROGRESS' ? colors.warning : colors.success;
  const displayTitle = item.title ?? item.text;

  return (
    <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: hexToRgba(tint, 0.15) }]}>
          <Icon size={18} color={tint} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
            {displayTitle}
          </Text>
          <Text style={[styles.text, { color: colors.textColor }]} numberOfLines={2}>
            {item.text}
          </Text>
          <View style={styles.metaRow}>
            <StatusBadge label={t(`status.${item.status.toLowerCase()}`)} color={statusColor} />
            <Text style={[styles.date, { color: colors.disabled }]}>{item.dateLabel}</Text>
          </View>
        </View>
        {deletable && (
          <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
            <Trash2 size={18} color={colors.error} />
          </Pressable>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
  },
  text: {
    fontSize: 14,
    opacity: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
});
