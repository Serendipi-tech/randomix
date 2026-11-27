import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Calendar, Pencil } from 'lucide-react-native';
import { Colors, DisplayFonts } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { Avatar } from '@/components/atoms/Avatar';

const AVATAR_SIZE = 96;
// Doppio bordo: anello interno nel colore dello sfondo, anello esterno a gradiente.
// Spessori interi: con valori frazionari i diametri diventano dispari e la centratura distribuisce
// mezzi pixel, che il device arrotonda diversamente sui due lati — l'anello esce non concentrico
const INNER_RING_WIDTH = 3;
const OUTER_RING_WIDTH = 4;
const INNER_RING_SIZE = AVATAR_SIZE + INNER_RING_WIDTH * 2;
const RING_SIZE = INNER_RING_SIZE + OUTER_RING_WIDTH * 2;
// Alone dietro l'anello: molto più largo del ring, così la sfumatura ha spazio per spegnersi
const GLOW_SIZE = RING_SIZE + 130;

interface ProfileHeaderProps {
  username: string;
  email: string;
  avatarUrl: string | null;
  colorScheme: 'light' | 'dark';
  editLabel: string;
  onEditPress: () => void;
  /** Riga opzionale sotto l'email, es. "Member since March 2025" — già formattata dal chiamante. */
  memberSinceLabel?: string;
}

/** Hero del profilo: avatar grande con anello a gradiente e alone, che sfonda il bordo superiore
 *  della card, username/email centrati sotto e il periodo di iscrizione come chip.
 *  Il trigger di modifica è la matita in overlay sull'avatar, non un bottone testuale. */
export function ProfileHeader({
  username,
  email,
  avatarUrl,
  colorScheme,
  editLabel,
  onEditPress,
  memberSinceLabel,
}: ProfileHeaderProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.avatarSpacer} />
        <Text style={[styles.username, { color: colors.textColor }]} numberOfLines={1}>
          {username}
        </Text>
        <Text style={[styles.email, { color: colors.disabled }]} numberOfLines={1}>
          {email}
        </Text>
        {memberSinceLabel && (
          <View style={[styles.memberChip, { backgroundColor: hexToRgba(colors.primary, 0.25) }]}>
            <Calendar size={12} color={colors.textColor} />
            <Text style={[styles.memberSince, { color: colors.textColor }]} numberOfLines={1}>
              {memberSinceLabel}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.avatarOverlay} pointerEvents="box-none">
        <View>
          {/* Alone: stesso trattamento radiale usato altrove, nei colori dell'anello */}
          <Svg width={GLOW_SIZE} height={GLOW_SIZE} style={styles.glow} pointerEvents="none">
            <Defs>
              {/* Molti stop e opacità basse: l'alone deve spegnersi gradualmente, non chiudersi a macchia */}
              <RadialGradient id="profileAvatarGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="30%" stopColor={colors.secondaryGradient} stopOpacity={0.22} />
                <Stop offset="45%" stopColor={colors.secondaryGradient} stopOpacity={0.14} />
                <Stop offset="60%" stopColor={colors.secondaryGradient} stopOpacity={0.08} />
                <Stop offset="75%" stopColor={colors.secondaryGradient} stopOpacity={0.04} />
                <Stop offset="88%" stopColor={colors.secondaryGradient} stopOpacity={0.015} />
                <Stop offset="100%" stopColor={colors.secondaryGradient} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={GLOW_SIZE / 2} cy={GLOW_SIZE / 2} r={GLOW_SIZE / 2} fill="url(#profileAvatarGlow)" />
          </Svg>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.outerRing}
          >
            <View style={[styles.innerRing, { backgroundColor: colors.background }]}>
              {/* ring={false}: gli anelli sono questi due, non quello dell'Avatar */}
              <Avatar uri={avatarUrl ?? undefined} fallbackColor={colors.primary} size={AVATAR_SIZE} ring={false} inset={0} />
            </View>
          </LinearGradient>
          <Pressable
            onPress={onEditPress}
            hitSlop={8}
            accessibilityLabel={editLabel}
            style={[styles.editBadge, { backgroundColor: colors.primary }]}
          >
            <Pencil size={18} color={colors.textColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    // ancora di posizionamento per l'avatar assoluto sotto
    position: 'relative',
  },
  // Nessuno sfondo: il blocco vive direttamente sullo sfondo della pagina
  card: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    alignItems: 'center',
    gap: 0,
  },
  avatarSpacer: {
    height: RING_SIZE / 2,
  },
  avatarOverlay: {
    position: 'absolute',
    top: -(RING_SIZE / 2),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    left: (RING_SIZE - GLOW_SIZE) / 2,
    top: (RING_SIZE - GLOW_SIZE) / 2,
  },
  // overflow: senza, il gradiente non viene ritagliato sul raggio e gli angoli del rettangolo
  // spuntano attorno al cerchio scuro
  outerRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: OUTER_RING_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerRing: {
    width: INNER_RING_SIZE,
    height: INNER_RING_SIZE,
    borderRadius: INNER_RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontFamily: DisplayFonts.semiBold,
    marginTop: 2,
  },
  email: {
    fontSize: 14,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  memberSince: {
    fontSize: 12,
    lineHeight: 15,
  },
});
