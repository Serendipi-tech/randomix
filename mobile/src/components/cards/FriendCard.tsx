import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, User, X } from 'lucide-react-native';
import { Avatar } from '@/components/atoms/Avatar';
import { CardShell } from '@/components/cards/CardShell';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { useDominantColor } from '@/utils/useDominantColor';

type FriendCardProps = {
  username: string;
  imageUri?: string;
  groupsInCommon?: number;
  /** Riga secondaria libera (es. ruolo del membro nel gruppo). */
  subtitle?: string;
  /** Se presente, la card è cliccabile e mostra la freccia; altrimenti è statica (es. membro non navigabile). */
  onPress?: () => void;
  /** Se presente, mostra la ✕ di rimozione a destra (prima della freccia). */
  onRemove?: () => void;
};

/** Card utente: avatar + username + riga secondaria (gruppi in comune o sottotitolo), freccia a destra se navigabile.
 *  Con immagine bordo e freccia riflettono il colore dominante; senza, fallback al tema con icona generica. */
export function FriendCard({ username, imageUri, groupsInCommon, subtitle, onPress, onRemove }: FriendCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  // Hook sempre chiamato (regole degli hook): stringa vuota quando manca l'uri.
  const dominantColor = useDominantColor(imageUri ?? '', colors.primary);
  const accentColor = imageUri ? dominantColor : colors.primary;
  const borderColor = imageUri ? dominantColor : colors.border;

  return (
    <CardShell borderColor={borderColor} onPress={onPress}>
      <View style={styles.row}>
        {imageUri ? (
          <Avatar uri={imageUri} fallbackColor={colors.primary} />
        ) : (
          <View style={[styles.fallbackAvatar, { backgroundColor: colors.primary }]}>
            <User size={24} color={colors.textColor} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={[styles.username, { color: colors.textColor }]}>{username}</Text>
          {groupsInCommon !== undefined && (
            <Text style={[styles.groups, { color: colors.textColor }]}>
              {groupsInCommon} grupp{groupsInCommon === 1 ? 'o' : 'i'} in comune
            </Text>
          )}
          {subtitle && <Text style={[styles.groups, { color: colors.textColor }]}>{subtitle}</Text>}
        </View>
        {onRemove && (
          <Pressable onPress={onRemove} hitSlop={8} style={styles.remove}>
            <X size={18} color={colors.disabled} />
          </Pressable>
        )}
        {onPress && (
          <View style={[styles.arrow, { backgroundColor: hexToRgba(accentColor, 0.12) }]}>
            <ChevronRight size={18} color={accentColor} />
          </View>
        )}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fallbackAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  remove: { padding: 4 },
  username: { fontWeight: '700', fontSize: 14 },
  groups: { fontSize: 12, opacity: 0.7 },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
